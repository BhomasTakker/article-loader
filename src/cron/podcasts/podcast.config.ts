import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";
import { loadSourceList } from "../rss/utils";

export const createPodcastRssCronConfigData = async () => {
	return {
		id: "Podcast RSS Cron Config",
		// test_cron: [
		// 	await createCronJobData({
		// 		titles: ["UK News Bites"],
		// 		sourceVariant: SourceVariant.AUDIO,
		// 		timeFunction: TimeFunction.StaggerSeconds,
		// 		timeParams: [30, 0, 0],
		// 		fetchFunction: FetchFunction.Podcasts,
		// 		onComplete: () => {},
		// 	}),
		// ],
		cron: [
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["UK News Bites"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 8, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US News Bites"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 8, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World News Bites"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 9, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["UK News Audio 1"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 9, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["UK News Audio 2"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 10, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US News Audio 1"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 10, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US News Audio 2"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 11, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US News Audio 3"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 11, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["US News Audio 4"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 12, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World News Audio 1"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 12, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: await loadSourceList(
					["World News Audio 2"],
					SourceVariant.AUDIO
				),
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 13, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
		],
	};
};
