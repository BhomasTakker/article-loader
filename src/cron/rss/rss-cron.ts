import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";

export const createRssCronConfigData = async () => {
	return {
		id: "RSS Cron Queries",
		cron: [
			await createCronJobData({
				titles: ["US National Articles 1", "US National Articles 2"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 3, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: [
					"US National Articles 3",
					"US National Articles 4",
					"US National Articles 5",
				],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 3, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World Articles 1", "World Articles 2"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 4, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World Articles 3", "World Articles 4", "World Articles 5"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 4, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World Articles 5", "World Articles 6", "World Articles 7"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 5],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["New York Articles"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 5, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["New York Video News"],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["Florida Articles"],
				sourceVariant: SourceVariant.ARTICLE,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["Florida Video News"],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: [
					"US Video News",
					"US Video News 2",
					"US Live Video",
					"World Video News",
					"World Video News 2",
					"World Live Video",
				],
				sourceVariant: SourceVariant.VIDEO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 7, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
		],
	};
};
