// linked to 0227-provider-page
import { Types } from "mongoose";
import { connectToMongoDB } from "../src/lib/mongo/db";
import ArticleProvider from "../src/models/ArticleProvider";
import Article from "../src/models/Article";
import { Avatar, CollectionItem, Details } from "../src/types/article/item";

type ProviderArticleData = Pick<
	CollectionItem,
	"title" | "src" | "description" | "variant" | "rating"
> & {
	provider: Types.ObjectId;
	avatar?: Avatar;
	details?: Pick<Details, "language" | "region">;
};

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

	let created = 0;
	let updated = 0;

	for (const provider of providers) {
		const normalizedName = provider.name.toLowerCase().replace(/\s+/g, "-");
		const url = `${"https://datatattat.com"}/provider/${normalizedName}`;
		const articleData: ProviderArticleData = {
			title: `Provider: ${provider.name}`,
			src: url,
			description: provider.description,
			variant: "provider",
			provider: provider._id,
			...(provider.logo && {
				avatar: { src: provider.logo, alt: provider.name },
			}),
			rating: String(provider.rating),
			details: {
				...(provider.language && { language: provider.language }),
				...(provider.region && { region: provider.region }),
			},
		};

		const result = await Article.updateOne(
			{ src: url },
			{ $set: articleData },
			{ upsert: true },
		);

		if (result.upsertedCount > 0) {
			created++;
			console.log(`  [created] ${provider.name}`);
		} else if (result.modifiedCount > 0) {
			updated++;
			console.log(`  [updated] ${provider.name}`);
		} else {
			console.log(`  [unchanged] ${provider.name}`);
		}
	}

	console.log(
		`\nDone. Created: ${created}, Updated: ${updated}, Unchanged: ${providers.length - created - updated}`,
	);
};

runScript()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
