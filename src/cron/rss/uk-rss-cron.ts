import {
	ukLiveVideos,
	ukNationalArticles1,
	ukNationalArticles2,
	ukNationalVideos,
	ukRegionalArticles,
	ukRegionalVideos,
} from "../../../sources/news/articles/uk/national";
import { everyNthHour, staggerMinutes, staggerSeconds } from "../create-cron";
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
			time: staggerMinutes(15, 0),
			fetchFn: fetchRSS(ukNationalArticles1),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 1),
			fetchFn: fetchRSS(ukNationalArticles2),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 2),
			fetchFn: fetchYoutubeRSS(ukNationalVideos),
			onComplete: () => {},
		},
		{
			time: everyNthHour(24, 5),
			fetchFn: fetchYoutubeRSS(ukLiveVideos),
			onComplete: () => {},
		},
		{
			time: everyNthHour(1, 0),
			fetchFn: fetchRSS(ukRegionalArticles),
			onComplete: () => {},
		},
		{
			time: everyNthHour(1, 1),
			fetchFn: fetchYoutubeRSS(ukRegionalVideos),
			onComplete: () => {},
		},
	],
};
