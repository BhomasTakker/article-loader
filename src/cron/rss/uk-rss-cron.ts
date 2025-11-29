import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";
import { loadSourceList } from "./utils";

export const createUkRssCronConfigData = async () => {
	return {
		id: "RSS Test Cron Queries",
		// test_cron: [
		// 	await createCronJobData({
		// 		titles: ["UK Video News", "UK Video News 2"],
		// 		sourceVariant: SourceVariant.VIDEO,
		// 		timeFunction: TimeFunction.StaggerSeconds,
		// 		timeParams: [30, 0, 0],
		// 		fetchFunction: FetchFunction.YoutubeRSS,
		// 		onComplete: () => {},
		// 	}),
		// ],
		cron: [
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					[
						"UK National Articles 1",
						"UK National Articles 2",
						"UK National Articles 3",
					],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 0, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["Scotland Articles", "Wales Articles", "Northern Ireland Articles"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 0, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["UK Video News", "UK Video News 2"],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 1, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["UK Live Video"],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [24, 1, 0],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					[
						"Manchester Video News",
						"Liverpool Video News",
						"Birmingham Video News",
					],
					SourceVariant.VIDEO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 1, 30],
				fetchFunction: FetchFunction.YoutubeRSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["Manchester Articles", "Liverpool Articles", "Birmingham Articles"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 2, 0],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["Yorkshire Articles"],
					SourceVariant.ARTICLE
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [1, 2, 30],
				fetchFunction: FetchFunction.RSS,
				onComplete: () => {},
			}),
		],
	};
};
