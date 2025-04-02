import { createCron } from "./create-cron";
import { CronConfig, CronJob } from "./types";

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
