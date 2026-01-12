// We have been setting the variant as website via og:type
// We have fixed the bug but we have 9000 articles already ingested with the wrong variant
import { connectToMongoDB } from "../src/lib/mongo/db";
import Article from "../src/models/Article";

const VARIANT = "article";

const preScript = async () => {
	await connectToMongoDB();

	console.log("Connected to MongoDB");
};

let count = 0;

const runScript = async () => {
	await preScript();

	const articles = await Article.find({
		variant: "website",
	});
	if (articles.length === 0) {
		console.log("No articles of variant website found");
		return;
	}
	console.log(`Found ${articles.length} website articles`);

	for (const article of articles) {
		count++;

		await article.updateOne({ variant: VARIANT });
		// console.log(`Updated article ${article._id} to new src: ${newSrc}`);
		if (count === 2500) {
			console.log("Processed 2500 articles, exiting script");
			break; // Exit after processing 10 articles
		}
	}
	console.log(`Total articles updated: ${count}`);
};

runScript();
