import { BITES_UK, NEWS_UK } from "../../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1,
	NEWS_US_2,
} from "../../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD,
} from "../../sources/audio/podbean/news/world";
import { logMemoryUsage } from "../lib/mem";
import { createCron, CRON_TIMES } from "./create-cron";
import { fetchPodcasts } from "./loaders/fetchPodcasts";

type CronJob = {
	time: string;
	fetchFn: () => void;
	onComplete?: () => void;
};

const config = {
	id: "News Bites",
	anyCommandsRequired: {},
	cron: [
		{
			time: CRON_TIMES.seconds_30,
			fetchFn: fetchPodcasts([BITES_UK, BITES_US, BITES_WORLD]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.minutes_15,
			fetchFn: fetchPodcasts([BITES_UK, BITES_US, BITES_WORLD]),
			onComplete: () => {},
		},
		{
			time: "0 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_UK]),
			onComplete: () => {},
		},

		{
			time: "5 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_1]),
			onComplete: () => {},
		},

		{
			time: "10 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_2]),
			onComplete: () => {},
		},

		{
			time: "15 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_WORLD]),
			onComplete: () => {},
		},
	],
};

// pass in config to use for cron
export const initCronJobs = () => {
	// logMemoryUsage();
	config.cron.forEach((job: CronJob) => {
		createCron({
			// @ts-expect-error FIX ME
			time: job.time,
			fetchFn: job.fetchFn,
			onComplete: job.onComplete,
		});
	});
};
