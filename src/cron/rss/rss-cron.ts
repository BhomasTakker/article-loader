import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";
import { loadSourceList } from "./utils";

export const createRssCronConfigData = async () => {
	return {
		id: "RSS Cron Queries",
		cron: [
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US National Articles 1", "US National Articles 2"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 3, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					[
						"US National Articles 3",
						"US National Articles 4",
						"US National Articles 5",
					],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 3, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World Articles 1", "World Articles 2"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 4, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World Articles 3", "World Articles 4", "World Articles 5"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 4, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World Articles 5", "World Articles 6", "World Articles 7"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 5],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["New York Articles"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 5, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["New York Video News"],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["Florida Articles"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["Florida Video News"],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [30, 6, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					[
						"US Video News",
						"US Video News 2",
						"US Live Video",
						"World Video News",
						"World Video News 2",
						"World Live Video",
					],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 7, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
		],
	};
};
