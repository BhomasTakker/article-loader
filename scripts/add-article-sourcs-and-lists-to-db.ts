import { connectToMongoDB } from "../src/lib/mongo/db";
import ArticleSourceModel from "../src/models/ArticleSource";
import ArticleSourceListModel from "../src/models/ArticleSourceList";
import { ArticleSource } from "../src/types/cms/ArticleSource";
import {
	audioSourceLists,
	videoSourceLists,
	articleSourceLists,
} from "./sources-list";

// Helper function to determine source type from URL
const getSourceType = (src: string): string => {
	if (src.includes("youtube.com")) return "youtube";
	if (
		src.includes("feeds.") ||
		src.includes("/rss") ||
		src.includes(".rss") ||
		src.includes("/feed")
	)
		return "rss";
	if (src.includes("substack.com")) return "substack";
	if (src.includes("podcasts.") || src.includes("podcast.")) return "podcast";
	return "";
};

// Helper function to determine variant
const getVariant = (src: string, articleType: string): string => {
	if (articleType === "video") {
		if (src.includes("playlist_id")) return "live";
		return "";
	}
	return "";
};

// Process a single source list
const processSourceList = async (
	sourceList: any,
	articleType: "article" | "audio" | "video",
	listTitle: string,
	stats: { created: number; duplicates: number; errors: number }
) => {
	const {
		categories = [],
		region = [],
		coverage = [],
		language = "en",
		sources = [],
	} = sourceList;

	const createdSourceIds: string[] = [];

	for (const source of sources) {
		try {
			// Merge base metadata with source-specific overrides
			const articleSource: Partial<ArticleSource> = {
				name: source.name,
				src: source.src,
				articleType,
				variant: source.variant || getVariant(source.src, articleType),
				categories: source.categories || categories,
				region: source.region || region,
				coverage: source.coverage || coverage,
				language: source.language || language,
				source: getSourceType(source.src),
			};

			// Add optional fields if present
			if (source.collectionTitle) {
				articleSource.collectionTitle = source.collectionTitle;
			}

			// Check for duplicates
			const existing = await ArticleSourceModel.findOne({
				src: articleSource.src,
			});

			if (existing) {
				console.log(
					`  [DUPLICATE] ${articleSource.name} - ${articleSource.src}`
				);
				stats.duplicates++;
				createdSourceIds.push(existing._id.toString());
				continue;
			}

			// Create new ArticleSource
			const created = await ArticleSourceModel.create(articleSource);
			createdSourceIds.push(created._id.toString());
			stats.created++;
		} catch (error) {
			console.error(
				`  [ERROR] Failed to process source: ${source.name}`,
				error
			);
			stats.errors++;
		}
	}

	// Create ArticleSourceList if we have sources
	if (createdSourceIds.length > 0) {
		try {
			await ArticleSourceListModel.create({
				title: listTitle,
				articleType,
				categories,
				region,
				coverage,
				language,
				sources: createdSourceIds,
			});
		} catch (error) {
			console.error(`  [ERROR] Failed to create ArticleSourceList`, error);
			stats.errors++;
		}
	}

	return createdSourceIds.length;
};

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

const runScript = async () => {
	await preScript();

	const totalStats = {
		created: 0,
		duplicates: 0,
		errors: 0,
	};

	console.log("\n=== Processing Audio Sources ===");
	for (let i = 0; i < audioSourceLists.length; i++) {
		const { list, title } = audioSourceLists[i];
		const count = await processSourceList(list, "audio", title, totalStats);
		console.log(
			`Audio List ${i + 1}/${
				audioSourceLists.length
			} (${title}): ${count} sources processed`
		);
	}

	console.log("\n=== Processing Video Sources ===");
	for (let i = 0; i < videoSourceLists.length; i++) {
		const { list, title } = videoSourceLists[i];
		const count = await processSourceList(list, "video", title, totalStats);
		console.log(
			`Video List ${i + 1}/${
				videoSourceLists.length
			} (${title}): ${count} sources processed`
		);
	}

	console.log("\n=== Processing Article Sources ===");
	for (let i = 0; i < articleSourceLists.length; i++) {
		const { list, title } = articleSourceLists[i];
		const count = await processSourceList(list, "article", title, totalStats);
		console.log(
			`Article List ${i + 1}/${
				articleSourceLists.length
			} (${title}): ${count} sources processed`
		);
	}

	console.log("\n=== Summary ===");
	console.log(`Created: ${totalStats.created}`);
	console.log(`Duplicates: ${totalStats.duplicates}`);
	console.log(`Errors: ${totalStats.errors}`);
	console.log(`Total Processed: ${totalStats.created + totalStats.duplicates}`);

	process.exit(0);
};

runScript();
