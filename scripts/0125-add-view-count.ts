// npx ts-node scripts/0125-add-view-count.ts

import { connectToMongoDB } from "../src/lib/mongo/db";
import Page from "../src/models/Page";

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

const runScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");

	await preScript();

	const result = await Page.updateMany(
		{ totalViewCount: { $exists: false } },
		{ $set: { totalViewCount: 0 } },
	);

	console.log(`Updated ${result.modifiedCount} pages with totalViewCount`);
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
