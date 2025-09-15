import {
	ukLiveVideos,
	ukNationalArticles1,
	ukNationalArticles2,
	ukNationalVideos,
	ukRegionalArticles,
	ukRegionalArticles2,
	ukRegionalVideos,
} from "../../../sources/news/articles/uk/national";
import { staggerMinutes, everyNthHour } from "../cron-times";
import { CronConfig } from "../types";
import { fetchRSS, fetchYoutubeRSS } from "./utils";

export const ukRssCronConfig: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		// {
		// 	time: staggerSeconds(30, 0),
		// 	fetchFn: fetchRSS(ukNationalArticles1),
		// 	onComplete: () => {},
		// },
		{
			time: staggerMinutes(15, 0, 0),
			fetchFn: fetchRSS(ukNationalArticles1),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 0, 30),
			fetchFn: fetchRSS(ukNationalArticles2),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 1, 0),
			fetchFn: fetchYoutubeRSS(ukNationalVideos),
			onComplete: () => {},
		},
		{
			time: everyNthHour(24, 1, 0),
			fetchFn: fetchYoutubeRSS(ukLiveVideos),
			onComplete: () => {},
		},
		{
			time: everyNthHour(1, 1, 30),
			fetchFn: fetchYoutubeRSS(ukRegionalVideos),
			onComplete: () => {},
		},
		{
			time: everyNthHour(1, 2, 0),
			fetchFn: fetchRSS(ukRegionalArticles),
			onComplete: () => {},
		},

		{
			time: everyNthHour(1, 2, 30),
			fetchFn: fetchRSS(ukRegionalArticles2),
			onComplete: () => {},
		},
	],
};
