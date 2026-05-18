// linked to 0227-provider-page
import { connectToMongoDB } from "../src/lib/mongo/db";
import ArticleProvider from "../src/models/ArticleProvider";

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

const runScript = async () => {
	await preScript();

	const providers = await ArticleProvider.find({});

	if (providers.length === 0) {
		console.log("No providers found");
		return;
	}

	console.log(`Found ${providers.length} providers:`);
	providers.forEach((provider) => {
		console.log(`  - ${provider.name} (${provider.url})`);
	});
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
