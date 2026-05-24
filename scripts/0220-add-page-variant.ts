// npx ts-node scripts/0220-add-page-variant.ts --env=prod
// npx ts-node scripts/0220-add-page-variant.ts --env=local
//
// Thin CLI wrapper around syncPageArticles().
// For full field documentation see src/articles/sync-page-articles.ts.

import { connectToMongoDB } from "../src/lib/mongo/db";
import {
	PAGE_ARTICLE_BASE_URLS,
	syncPageArticles,
} from "../src/articles/sync-page-articles";

const envArg = process.argv.find((a) => a.startsWith("--env="));
const env = envArg ? envArg.split("=")[1] : "prod";

if (!PAGE_ARTICLE_BASE_URLS[env]) {
	console.error(
		`Unknown --env value "${env}". Valid options: ${Object.keys(PAGE_ARTICLE_BASE_URLS).join(", ")}`,
	);
	process.exit(1);
}

const baseUrl = PAGE_ARTICLE_BASE_URLS[env];
console.log(`Target environment: ${env} (${baseUrl})`);

const runScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");

	const result = await syncPageArticles(baseUrl);

	console.log(
		`\nDone. Created: ${result.created}, Updated: ${result.updated}, Unchanged: ${result.unchanged}, Errors: ${result.errors}`,
	);
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
