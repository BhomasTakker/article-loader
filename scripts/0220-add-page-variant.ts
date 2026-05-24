// npx ts-node scripts/0220-add-page-variant.ts
import { Types } from "mongoose";
import { connectToMongoDB } from "../src/lib/mongo/db";
import ArticleProvider from "../src/models/ArticleProvider";
import Page from "../src/models/Page";
import Article from "../src/models/Article";
import { Avatar, CollectionItem } from "../src/types/article/item";

// ------------------------------------------------------------
// PLAN
// ------------------------------------------------------------
// 1. Connect to MongoDB
// 2. Find-or-create the "Datatattat" system ArticleProvider
//    - Required fields: name, description, url, rating, leaning, origin, logo
//    - This provider is used as the owner for all page-variant articles
// 3. Query all Page documents where live === true
// 4. For each page:
//    a. Skip (and warn) if meta.pageTitle or meta.pageDescription is missing
//    b. Build article data:
//       - src      : BASE_URL + page.route  (unique key used for upsert)
//       - title    : page.meta.pageTitle
//       - description: page.meta.pageDescription
//       - variant  : "page"
//       - provider : system provider _id
//       - avatar   : { src: page.meta.pageImage ?? FALLBACK_IMAGE, alt: page.meta.pageTitle }
//    c. Upsert into Article collection keyed on src
// 5. Report: created / updated / unchanged / skipped / errors
// ------------------------------------------------------------

const BASE_URL = "https://datatattat.com";
const FALLBACK_IMAGE =
	"https://live.staticflickr.com/65535/55290129248_76da609fb9_b.jpg";

type PageArticleData = Pick<
	CollectionItem,
	"title" | "src" | "description" | "variant"
> & {
	provider: Types.ObjectId;
	avatar: Avatar;
};

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

// TODO: Step 2 — find or create the Datatattat system provider
const getOrCreateSystemProvider = async (): Promise<Types.ObjectId> => {
	throw new Error("getOrCreateSystemProvider not yet implemented");
};

const runScript = async () => {
	await preScript();

	// TODO: Step 2 — resolve system provider
	const systemProviderId = await getOrCreateSystemProvider();
	console.log(`System provider ID: ${systemProviderId}`);

	// TODO: Step 3 — fetch live pages
	// const pages = await Page.find({ live: true }).lean();

	// TODO: Step 4 — iterate pages, build article data, upsert
	// let created = 0;
	// let updated = 0;
	// let skipped = 0;
	// let errors = 0;

	// for (const page of pages) {
	//   ...
	// }

	// TODO: Step 5 — summary log
	console.log("\n[placeholder] Script not yet implemented.");
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
