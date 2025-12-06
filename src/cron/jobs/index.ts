import { loadSourceList } from "../rss/utils";
import { APICronJobConfig, CronType, RSSCronJobConfig } from "../types";

export const createRssCronJob = async (configData: RSSCronJobConfig) => {
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

export const createApiCronJob = async (configData: APICronJobConfig) => {
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

export const CronTypeMap = new Map<CronType, CronTypeMapType>([
	[CronType.RSS, createRssCronJob],
	[CronType.API, createApiCronJob], // Example for other types
]);
