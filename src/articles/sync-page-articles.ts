import { Types } from "mongoose";
import ArticleProvider from "../models/ArticleProvider";
import Page from "../models/Page";
import Article from "../models/Article";
import { Avatar, CollectionItem, Details } from "../types/article/item";

// Valid deployment environments and their base URLs
export const PAGE_ARTICLE_BASE_URLS: Record<string, string> = {
	prod: "https://datatattat.com",
	local: "http://localhost:3000",
};

export const FALLBACK_IMAGE =
	"https://live.staticflickr.com/65535/55290129248_76da609fb9_b.jpg";

export type SyncPageArticlesResult = {
	created: number;
	updated: number;
	unchanged: number;
	errors: number;
};

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
	media: object;
};

// Converts a page route to a readable title, used when pageTitle is absent.
// e.g. /news/sport  →  "News Sport"
const normalizeRouteToTitle = (route: string): string =>
	route
		.replace(/^\//, "")
		.replace(/[-/]+/g, " ")
		.trim()
		.replace(/\b\w/g, (c) => c.toUpperCase());

// Finds the "Datatattat" system provider, creating it if it doesn't exist.
// This provider acts as the owner for all page-variant articles.
const getOrCreateSystemProvider = async (
	baseUrl: string,
): Promise<Types.ObjectId> => {
	const existing = await ArticleProvider.findOne({ name: "Datatattat" });

	if (existing) {
		return existing._id;
	}

	const created = await ArticleProvider.create({
		name: "Datatattat",
		description: "Datatattat — official site pages",
		url: baseUrl,
		rating: 80,
		leaning: 0,
		origin: "UK",
		logo: FALLBACK_IMAGE,
	});

	return created._id;
};

// Syncs a page-variant Article for every live Page in the DB.
// Articles are upserted keyed on src, so this is safe to call repeatedly.
export const syncPageArticles = async (
	baseUrl: string,
): Promise<SyncPageArticlesResult> => {
	const systemProviderId = await getOrCreateSystemProvider(baseUrl);

	const pages = await Page.find({ live: true }).lean();

	let created = 0;
	let updated = 0;
	let errors = 0;

	for (const page of pages) {
		const title = page.meta?.pageTitle || normalizeRouteToTitle(page.route);
		const description = page.meta?.pageDescription || "";

		const src = `${baseUrl}${page.route}`;

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
			disabled: !page.live,
			avatar: {
				src: page.meta?.pageImage || FALLBACK_IMAGE,
				alt: title,
			},
			media: {
				type: page.pageType || "Content",
				views: page.totalViewCount || 0,
			},
			details: {
				published: page.createdAt,
				modified: page.updatedAt,
				categories,
				publishers: ["Datatattat"],
			},
		};

		try {
			const result = await Article.updateOne(
				{ src },
				{ $set: articleData },
				{ upsert: true },
			);

			if (result.upsertedCount > 0) {
				created++;
			} else if (result.modifiedCount > 0) {
				updated++;
			}
		} catch {
			errors++;
		}
	}

	const unchanged = pages.length - created - updated - errors;
	return { created, updated, unchanged, errors };
};
