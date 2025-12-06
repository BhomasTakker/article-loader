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

	return Promise.resolve({
		fetchFunctionData,
		timeFunction,
		timeParams,
		fetchFunction,
		onComplete: () => {},
	});
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
// Assuming you get a list from the db
const CRON_IDS = [
	RSSCronQueriesConfig.id,
	UKRSSCronQueriesConfig.id,
	podcastRSSCronQueriesConfig.id,
	pageQueriesCronConfig.id,
	radioCronConfig.id,
];
// Would be a get from db in reality
const tempConfigMap = new Map<string, GenericCronConfig>([
	[RSSCronQueriesConfig.id, RSSCronQueriesConfig],
	[UKRSSCronQueriesConfig.id, UKRSSCronQueriesConfig],
	[podcastRSSCronQueriesConfig.id, podcastRSSCronQueriesConfig],
	[pageQueriesCronConfig.id, pageQueriesCronConfig],
	[radioCronConfig.id, radioCronConfig],
]);

export const initialiseCronJobs = async () => {
	CRON_IDS.forEach(async (id) => {
		const config = tempConfigMap.get(id);
		if (!config) return;
		initCronJobs(await createCronJobsFromConfig(config));
	});
};
