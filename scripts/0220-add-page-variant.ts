// npx ts-node scripts/0220-add-page-variant.ts --env=prod
// npx ts-node scripts/0220-add-page-variant.ts --env=local
//
// Creates or updates an Article (variant: "page") for every live Page in the DB.
//
// For each Page where live === true:
//   - src        : https://datatattat.com{route}
//   - title      : page.meta.pageTitle, falling back to a normalised form of the route
//   - description: page.meta.pageDescription, defaults to empty string if absent
//   - guid       : page._id (stable unique identifier)
//   - avatar     : page.meta.pageImage, falling back to FALLBACK_IMAGE
//   - disabled   : true if the page is taken offline (live === false)
//   - details.published  : page.createdAt
//   - details.modified   : page.updatedAt
//   - details.categories : page.meta.pageKeywords split by comma
//   - details.publishers : ["Datatattat"]
//   - All page articles are owned by the "Datatattat" system ArticleProvider,
//     which is created automatically if it does not yet exist
//
// Articles are upserted (insert or update) keyed on src, so the script is safe to re-run.

import { Types } from "mongoose";
import { connectToMongoDB } from "../src/lib/mongo/db";
import ArticleProvider from "../src/models/ArticleProvider";
import Page from "../src/models/Page";
import Article from "../src/models/Article";
import { Avatar, CollectionItem, Details } from "../src/types/article/item";

const BASE_URLS: Record<string, string> = {
	prod: "https://datatattat.com",
	local: "http://localhost:3000",
};

// Resolve the target environment from the --env flag (defaults to prod)
const envArg = process.argv.find((a) => a.startsWith("--env="));
const env = envArg ? envArg.split("=")[1] : "prod";

if (!BASE_URLS[env]) {
	console.error(
		`Unknown --env value "${env}". Valid options: ${Object.keys(BASE_URLS).join(", ")}`,
	);
	process.exit(1);
}

const BASE_URL = BASE_URLS[env];
console.log(`Target environment: ${env} (${BASE_URL})`);

// Used as the avatar image when a page has no pageImage set
const FALLBACK_IMAGE =
	"https://live.staticflickr.com/65535/55290129248_76da609fb9_b.jpg";

// Shape of the article data written for each page
type PageArticleData = Pick<
	CollectionItem,
	"title" | "src" | "variant" | "guid" | "disabled"
> & {
	description: string;
	provider: Types.ObjectId;
	avatar: Avatar;
	details: Pick<
		Details,
		"published" | "modified" | "categories" | "publishers"
	>;
};

// Converts a page route to a readable title, used when pageTitle is absent.
// e.g. /news/sport  →  "News Sport"
const normalizeRouteToTitle = (route: string): string =>
	route
		.replace(/^\//, "")
		.replace(/[-/]+/g, " ")
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

// Finds the "Datatattat" system provider, creating it if it doesn't exist.
// This provider acts as the owner for all page-variant articles.
const getOrCreateSystemProvider = async (): Promise<Types.ObjectId> => {
	const existing = await ArticleProvider.findOne({ name: "Datatattat" });

	if (existing) {
		console.log(`System provider found: ${existing._id}`);
		return existing._id;
	}

	const created = await ArticleProvider.create({
		name: "Datatattat",
		description: "Datatattat — official site pages",
		url: BASE_URL,
		rating: 80,
		leaning: 0,
		origin: "UK",
		logo: FALLBACK_IMAGE,
	});

	console.log(`System provider created: ${created._id}`);
	return created._id;
};

const runScript = async () => {
	await preScript();

	// Ensure the system provider exists before processing any pages
	const systemProviderId = await getOrCreateSystemProvider();

	// Only process pages that have been marked as live
	const pages = await Page.find({ live: true }).lean();

	if (pages.length === 0) {
		console.log("No live pages found");
		return;
	}

	console.log(`Found ${pages.length} live pages`);

	let created = 0;
	let updated = 0;
	let errors = 0;

	for (const page of pages) {
		// Fall back to a normalised route when pageTitle is absent
		const title = page.meta?.pageTitle || normalizeRouteToTitle(page.route);
		// Description is optional — article is still created without it
		const description = page.meta?.pageDescription || "";

		const src = `${BASE_URL}${page.route}`;

		// Split pageKeywords into a categories array, filtering out empty strings
		const categories = page.meta?.pageKeywords
			? page.meta.pageKeywords
					.split(",")
					.map((k: string) => k.trim())
					.filter(Boolean)
			: [];

		const articleData: PageArticleData = {
			guid: String(page._id),
			title,
			src,
			description,
			variant: "page",
			provider: systemProviderId,
			// Disable the article if the page has been taken offline
			disabled: !page.live,
			avatar: {
				src: page.meta?.pageImage || FALLBACK_IMAGE,
				alt: title,
			},
			details: {
				published: page.createdAt,
				modified: page.updatedAt,
				categories,
				publishers: ["Datatattat"],
			},
		};

		try {
			// Upsert keyed on src — safe to re-run; existing articles are updated in place
			const result = await Article.updateOne(
				{ src },
				{ $set: articleData },
				{ upsert: true },
			);

			if (result.upsertedCount > 0) {
				created++;
				console.log(`  [created] ${page.route}`);
			} else if (result.modifiedCount > 0) {
				updated++;
				console.log(`  [updated] ${page.route}`);
			} else {
				console.log(`  [unchanged] ${page.route}`);
			}
		} catch (err: any) {
			errors++;
			console.error(`  [error] ${page.route} — ${err.message}`);
		}
	}

	const unchanged = pages.length - created - updated - errors;
	console.log(
		`\nDone. Created: ${created}, Updated: ${updated}, Unchanged: ${unchanged}, Errors: ${errors}`,
	);
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
