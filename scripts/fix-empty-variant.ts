import { connectToMongoDB } from "../src/lib/mongo/db";
import Article from "../src/models/Article";

const preScript = async () => {
	await connectToMongoDB();

	console.log("Connected to MongoDB");
};

let count = 0;

const runScript = async () => {
	await preScript();

	const articles = await Article.find({
		variant: "",
	});
	if (articles.length === 0) {
		console.log("No empty variants found");
		return;
	}
	console.log(`Found ${articles.length} empty variant articles`);

	for (const article of articles) {
		count++;
		const variant = (article.variant = "article");

		await article.updateOne({ variant: variant });
		// console.log(`Updated article ${article._id} to new src: ${newSrc}`);
		if (count === 2500) {
			console.log("Processed 2500 articles, exiting script");
			break; // Exit after processing 10 articles
		}
	}
	console.log(`Total articles updated: ${count}`);
};

runScript();
