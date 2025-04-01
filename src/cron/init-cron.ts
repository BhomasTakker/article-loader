import { SourceObject } from "../../sources/news/articles/types";
import { searchCronConfig } from "./api/search/search-queries";
import { createApiCron, createCron } from "./create-cron";
import { podcastRssCronConfig } from "./podcasts/podcast.config";
import { testConfig } from "./test";

type CronJob = {
	time: string;
	fetchFn: (sources: SourceObject[]) => () => Promise<void>;
	onComplete?: () => void;
	sources?: SourceObject[];
};

// pass in config to use for cron
export const initCronJobs = () => {
	podcastRssCronConfig.cron.forEach((job: CronJob) => {
		createCron({
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
			// ruins the thing
			// you should pass in the sources to the fetch function i.e fetchFn: () => job.fetchFn(sources),
			sources: job.sources,
		});
	});
};

type ApiCronJob = {
	time: string;
	fetchFn: () => void;
	onComplete?: () => void;
};

export const initApiCronJobs = () => {
	searchCronConfig.cron.forEach((job: ApiCronJob) => {
		createApiCron({
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
		});
	});
};
