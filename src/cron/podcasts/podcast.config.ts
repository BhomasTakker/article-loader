import { DIDDY_TRIAL } from "../../../sources/audio/podbean/news/features";
import {
	BITES_UK,
	NEWS_UK_1,
	NEWS_UK_2,
} from "../../../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1,
	NEWS_US_2,
	NEWS_US_3,
	NEWS_US_4,
} from "../../../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD_1,
	NEWS_WORLD_2,
} from "../../../sources/audio/podbean/news/world";
import { CRON_TIMES, staggerMinutes } from "../create-cron";
import { fetchPodcasts } from "../loaders/fetchPodcasts";
import { CronConfig } from "../types";

export const podcastRssCronConfig: CronConfig = {
	id: "News",
	anyCommandsRequired: {},
	cron: [
		{
			time: staggerMinutes(15, 0),
			fetchFn: fetchPodcasts([BITES_UK]),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 1),
			fetchFn: fetchPodcasts([BITES_US]),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 2),
			fetchFn: fetchPodcasts([BITES_WORLD]),
			onComplete: () => {},
		},
		// These are spiking us a little - well to 16%
		{
			time: CRON_TIMES.hours_6,
			fetchFn: fetchPodcasts([NEWS_UK_1]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_1,
			fetchFn: fetchPodcasts([NEWS_UK_2]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_2,
			fetchFn: fetchPodcasts([NEWS_US_1]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_3,
			fetchFn: fetchPodcasts([NEWS_US_2]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_4,
			fetchFn: fetchPodcasts([NEWS_US_3]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_5,
			fetchFn: fetchPodcasts([NEWS_US_4]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_7,
			fetchFn: fetchPodcasts([NEWS_WORLD_1]),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.hours_6_8,
			fetchFn: fetchPodcasts([NEWS_WORLD_2]),
			onComplete: () => {},
		},
		// {
		// 	time: CRON_TIMES.hours_6_9,
		// 	fetchFn: fetchPodcasts([DIDDY_TRIAL]),
		// 	onComplete: () => {},
		// },
	],
};
