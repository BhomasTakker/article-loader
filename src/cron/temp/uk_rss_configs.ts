import { SourceVariant, TimeFunction, FetchFunction } from "../types";

export const UKRSSCronQueriesConfig = {
	id: "UK RSS Cron Queries",
	type: "rss",
	cron: [
		{
			titles: [
				"UK National Articles 1",
				"UK National Articles 2",
				"UK National Articles 3",
			],
			variant: SourceVariant.ARTICLE,
			timeFunction: TimeFunction.StaggerMinutes,
			timeParams: [15, 0, 0],
			fetchFunction: FetchFunction.RSS,
			onComplete: () => {},
		},
		{
			titles: [
				"Scotland Articles",
				"Wales Articles",
				"Northern Ireland Articles",
			],
			variant: SourceVariant.ARTICLE,
			timeFunction: TimeFunction.StaggerMinutes,
			timeParams: [15, 0, 30],
			fetchFunction: FetchFunction.RSS,
			onComplete: () => {},
		},
		{
			titles: ["UK Video News", "UK Video News 2"],
			variant: SourceVariant.VIDEO,
			timeFunction: TimeFunction.StaggerMinutes,
			timeParams: [15, 1, 0],
			fetchFunction: FetchFunction.YoutubeRSS,
			onComplete: () => {},
		},
		{
			titles: ["UK Live Video"],
			variant: SourceVariant.VIDEO,
			timeFunction: TimeFunction.EveryNthHour,
			timeParams: [24, 1, 0],
			fetchFunction: FetchFunction.YoutubeRSS,
			onComplete: () => {},
		},
		{
			titles: [
				"Manchester Video News",
				"Liverpool Video News",
				"Birmingham Video News",
			],
			variant: SourceVariant.VIDEO,
			timeFunction: TimeFunction.EveryNthHour,
			timeParams: [1, 1, 30],
			fetchFunction: FetchFunction.YoutubeRSS,
			onComplete: () => {},
		},
		{
			titles: [
				"Manchester Articles",
				"Liverpool Articles",
				"Birmingham Articles",
			],
			variant: SourceVariant.ARTICLE,
			timeFunction: TimeFunction.EveryNthHour,
			timeParams: [1, 2, 0],
			fetchFunction: FetchFunction.RSS,
			onComplete: () => {},
		},
		{
			titles: ["Yorkshire Articles"],
			variant: SourceVariant.ARTICLE,
			timeFunction: TimeFunction.EveryNthHour,
			timeParams: [1, 2, 30],
			fetchFunction: FetchFunction.RSS,
			onComplete: () => {},
		},
	],
};
