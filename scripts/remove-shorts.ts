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
		variant: "video",
		// title:
		// 	"Octopus latches onto child’s arm at aquarium, sparking animal care concerns",
		src: { $regex: /shorts/ },
	});
	if (articles.length === 0) {
		console.log("No shorts found");
		return;
	}
	console.log(`Found ${articles.length} shorts articles`);
	for (const article of articles) {
		count++;
		const newSrc = article.src.replace(/shorts\//, "watch?v=");
		article.src = newSrc;
		await article.updateOne({ src: newSrc });
		// console.log(`Updated article ${article._id} to new src: ${newSrc}`);
		if (count === 2500) {
			console.log("Processed 2500 articles, exiting script");
			break; // Exit after processing 10 articles
		}
	}
	console.log(`Total articles updated: ${count}`);
};

runScript();
