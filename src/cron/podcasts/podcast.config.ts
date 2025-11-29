import { FetchFunction, SourceVariant, TimeFunction } from "../types";
import { createCronJobData } from "../create-cron-data";

export const createPodcastRssCronConfigData = async () => {
	return {
		id: "Podcast RSS Cron Config",
		anyCommandsRequired: {},
		cron: [
			await createCronJobData({
				titles: ["UK News Bites"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 8, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["US News Bites"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 8, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World News Bites"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 9, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["UK News Audio 1"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 9, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["UK News Audio 2"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 10, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["US News Audio 1"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 10, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["US News Audio 2"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 11, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["US News Audio 3"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 11, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["US News Audio 4"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 12, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World News Audio 1"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 12, 30],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
			await createCronJobData({
				titles: ["World News Audio 2"],
				sourceVariant: SourceVariant.AUDIO,
				timeFunction: TimeFunction.EveryNthHour,
				timeParams: [6, 13, 0],
				fetchFunction: FetchFunction.Podcasts,
				onComplete: () => {},
			}),
		],
	};
};
