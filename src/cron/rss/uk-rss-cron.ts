import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";

export const createUkRssCronConfigData = async () => {
	return {
		id: "RSS Test Cron Queries",
		anyCommandsRequired: {},
		cron: [
			await createCronJobData({
				titles: [
					"UK National Articles 1",
					"UK National Articles 2",
					"UK National Articles 3",
				],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 0, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: [
					"Scotland Articles",
					"Wales Articles",
					"Northern Ireland Articles",
				],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 0, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["UK Video News", "UK Video News 2"],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 1, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["UK Live Video"],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [24, 1, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: [
					"Manchester Video News",
					"Liverpool Video News",
					"Birmingham Video News",
				],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 1, 30],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: [
					"Manchester Articles",
					"Liverpool Articles",
					"Birmingham Articles",
				],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 2, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["Yorkshire Articles"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 2, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
		],
	};
};
