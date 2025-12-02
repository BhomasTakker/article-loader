import { createCron } from "./create-cron";
import { loadSourceList } from "./rss/utils";
import {
	APICronJobConfig,
	CronConfig,
	CronJob,
	CronType,
	GenericCronConfig,
	RSSCronJobConfig,
} from "./types";
import { createCronJobData } from "./create-cron-data";
import { RSSCronQueriesConfig } from "./temp/rss_config";
import { UKRSSCronQueriesConfig } from "./temp/uk_rss_configs";
import { podcastRSSCronQueriesConfig } from "./temp/podcast_rss_config";
import { pageQueriesCronConfig } from "./temp/page_queries_config";
import { radioCronConfig } from "./temp/radio_cron_config";

// pass in config to use for cron
export const initCronJobs = (config: CronConfig) => {
	config.cron.forEach((job: CronJob) => {
		createCron({
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
		});
	});
};

// Assuming you get a list from the db
const CRON_IDS = [
	"RSS Cron Queries",
	// "UK RSS Cron Queries",
	// "Podcast RSS Cron Queries",
	// "Page Queries Cron",
	// "Radio Cron Queries",
];

const createRssCronJob = async (configData: RSSCronJobConfig) => {
	const { titles, variant, timeFunction, timeParams, fetchFunction } =
		configData;
	const data = await loadSourceList(titles, variant);

	// basic cron job
	return {
		fetchFunctionData: data,
		timeFunction,
		timeParams,
		fetchFunction,
		onComplete: () => {},
	};
};

const createApiCronJob = async (configData: APICronJobConfig) => {
	const { timeFunction, timeParams, fetchFunction, fetchFunctionData } =
		configData;

	return {
		fetchFunctionData,
		timeFunction,
		timeParams,
		fetchFunction,
		onComplete: () => {},
	};
};

type CronTypeMapType = typeof createRssCronJob | typeof createApiCronJob;

const CronTypeMap = new Map<CronType, CronTypeMapType>([
	[CronType.RSS, createRssCronJob],
	[CronType.API, createApiCronJob], // Example for other types
]);

const createCronJobsFromConfig = async (config: GenericCronConfig) => {
	const { cron, type } = config;
	const jobs = [];
	const createCronJob = CronTypeMap.get(type);

	for (const jobConfig of cron) {
		// perhaps get different job creators based on type
		// Or pass in data fetcher by type etc

		if (!createCronJob) {
			// should log warning
			// should return just data?
			// i.e. jobs.push await createCronJobData(jobConfig)
			continue;
		}

		const job = await createCronJob(jobConfig as any);
		jobs.push(await createCronJobData(job));
	}

	return {
		id: config.id,
		cron: jobs,
	};
};

export const initialiseCronJobs = async () => {
	// initCronJobs(await createRssCronConfigData());
	// Something like this for each config
	initCronJobs(await createCronJobsFromConfig(RSSCronQueriesConfig));
	// initCronJobs(await createUkRssCronConfigData());
	initCronJobs(await createCronJobsFromConfig(UKRSSCronQueriesConfig));

	initCronJobs(await createCronJobsFromConfig(podcastRSSCronQueriesConfig));

	initCronJobs(await createCronJobsFromConfig(pageQueriesCronConfig));

	initCronJobs(await createCronJobsFromConfig(radioCronConfig));

	CRON_IDS.forEach(async (id) => {
		console.log(`Initialized cron job with ID: ${id}`);
	});
};
