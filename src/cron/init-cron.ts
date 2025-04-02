import { searchCronConfig } from "./api/search/search-queries";
import { createApiCron, createCron } from "./create-cron";
import { podcastRssCronConfig } from "./podcasts/podcast.config";

type CronJob = {
	time: string;
	fetchFn: () => void;
	onComplete?: () => void;
};

// pass in config to use for cron
export const initCronJobs = () => {
	podcastRssCronConfig.cron.forEach((job: CronJob) => {
		createCron({
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
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
