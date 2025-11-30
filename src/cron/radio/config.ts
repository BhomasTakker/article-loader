import { createCronJobData } from "../create-cron-data";
import { FetchFunction, TimeFunction } from "../types";

export const createRadioCronConfigData = async () => {
	return {
		id: "Radio Cron Config",
		cron: [
			await createCronJobData({
				fetchFunctionData: { limit: 100, offset: 0 },
				timeFunction: TimeFunction.EveryNDays,
				timeParams: [7, 0, 14],
				fetchFunction: FetchFunction.RadioScripts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: { limit: 100, offset: 100 },
				timeFunction: TimeFunction.EveryNDays,
				timeParams: [7, 0, 28],
				fetchFunction: FetchFunction.RadioScripts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: { limit: 100, offset: 200 },
				timeFunction: TimeFunction.EveryNDays,
				timeParams: [7, 0, 42],
				fetchFunction: FetchFunction.RadioScripts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: { limit: 100, offset: 300 },
				timeFunction: TimeFunction.EveryNDays,
				timeParams: [7, 0, 56],
				fetchFunction: FetchFunction.RadioScripts,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: { limit: 100, offset: 400 },
				timeFunction: TimeFunction.EveryNDays,
				timeParams: [7, 1, 14],
				fetchFunction: FetchFunction.RadioScripts,
				onComplete: () => {},
			}),
		],
	};
};
