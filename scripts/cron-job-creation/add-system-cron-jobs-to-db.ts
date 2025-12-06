// "script": "npx ts-node scripts/add-system-cron-jobs-to-db.ts",

import { connectToMongoDB } from "../../src/lib/mongo/db";
import CronJobModel from "../../src/models/CronJob";
import { RSSCronQueriesConfig } from "./resources/rss_config";
import { UKRSSCronQueriesConfig } from "./resources/uk_rss_configs";
import { podcastRSSCronQueriesConfig } from "./resources/podcast_rss_config";
import { pageQueriesCronConfig } from "./resources/page_queries_config";
import { radioCronConfig } from "./resources/radio_cron_config";

const cronConfigs = [
	RSSCronQueriesConfig,
	UKRSSCronQueriesConfig,
	podcastRSSCronQueriesConfig,
	pageQueriesCronConfig,
	radioCronConfig,
];

const processCronConfig = async (
	config: any,
	stats: {
		created: number;
		updated: number;
		errors: number;
		errorList: Array<{ id: string; error: string }>;
	}
) => {
	try {
		const existing = await CronJobModel.findOne({ id: config.id });

		if (existing) {
			// Update existing cron job
			await CronJobModel.updateOne(
				{ id: config.id },
				{
					$set: {
						type: config.type,
						cron: config.cron,
						isActive: true,
					},
				}
			);
			console.log(`  [UPDATED] ${config.id}`);
			stats.updated++;
		} else {
			// Create new cron job
			await CronJobModel.create({
				id: config.id,
				type: config.type,
				cron: config.cron,
				isActive: true,
			});
			console.log(`  [CREATED] ${config.id}`);
			stats.created++;
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(
			`  [ERROR] Failed to process cron job: ${config.id}`,
			errorMessage
		);
		stats.errors++;
		stats.errorList.push({
			id: config.id,
			error: errorMessage,
		});
	}
};

const preScript = async () => {
	await connectToMongoDB();
	console.log("Connected to MongoDB");
};

const runScript = async () => {
	await preScript();

	const stats = {
		created: 0,
		updated: 0,
		errors: 0,
		errorList: [] as Array<{ id: string; error: string }>,
	};

	console.log("\n=== Processing Cron Job Configurations ===");

	for (let i = 0; i < cronConfigs.length; i++) {
		const config = cronConfigs[i];
		await processCronConfig(config, stats);
		console.log(
			`Cron Config ${i + 1}/${cronConfigs.length} (${config.id}): processed`
		);
	}

	console.log("\n=== Summary ===");
	console.log(`Created: ${stats.created}`);
	console.log(`Updated: ${stats.updated}`);
	console.log(`Errors: ${stats.errors}`);
	console.log(`Total Processed: ${stats.created + stats.updated}`);

	// Log error details
	if (stats.errorList.length > 0) {
		console.log("\n=== Failed Cron Jobs ===");
		stats.errorList.forEach((err, index) => {
			console.log(`${index + 1}. ${err.id}`);
			console.log(`   Error: ${err.error}`);
		});
	}

	process.exit(0);
};

runScript();
