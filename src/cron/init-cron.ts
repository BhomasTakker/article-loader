import {
	BITES_UK,
	NEWS_UK_1,
	NEWS_UK_2,
} from "../../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1,
	NEWS_US_2,
	NEWS_US_3,
	NEWS_US_4,
} from "../../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD_1,
	NEWS_WORLD_2,
} from "../../sources/audio/podbean/news/world";
import { SourceObject } from "../../sources/news/articles/types";
import { logMemoryUsage } from "../lib/mem";
import { createCron, CRON_TIMES } from "./create-cron";
import { fetchPodcasts } from "./loaders/fetchPodcasts";

type CronJob = {
	time: string;
	fetchFn: (sources: SourceObject[]) => () => Promise<void>;
	onComplete?: () => void;
	sources?: SourceObject[];
};

const config = {
	id: "News Bites",
	anyCommandsRequired: {},
	cron: [
		{
			time: CRON_TIMES.seconds_30,
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_US_1],
		},
		{
			time: "0,15,30,45 * * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [BITES_UK],
		},
		{
			time: "1,16,31,46 * * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [BITES_US],
		},
		{
			time: "2,17,32,47 * * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [BITES_WORLD],
		},
		{
			time: "3 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_UK_1],
		},
		{
			time: "4 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_UK_2],
		},
		{
			time: "5 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_US_1],
		},
		{
			time: "6 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_US_2],
		},
		{
			time: "7 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_US_3],
		},
		{
			time: "8 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_US_4],
		},
		{
			time: "9 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_WORLD_1],
		},
		{
			time: "10 */6 * * *",
			fetchFn: fetchPodcasts,
			onComplete: () => {},
			sources: [NEWS_WORLD_1],
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
			sources: job.sources,
		});
	});
};
