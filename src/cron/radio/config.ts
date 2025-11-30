import { createCronJobData } from "../create-cron-data";
import { everyNDays } from "../cron-times";
import { CronConfig, FetchFunction, TimeFunction } from "../types";
import { runScripts } from "./radio-cron";

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
		],
	};
};

export const RADIO_CRON_CONFIG: CronConfig = {
	id: "Radio Cron Queries",
	cron: [
		// {
		// 	// TEST DO NOT KEEP!!!!!!!!!!!!!!!!!!!!
		// 	time: CRON_TIMES.seconds_30,
		// 	fetchFn: () => runScripts({ limit: 100, offset: 400 }),
		// 	onComplete: () => {},
		// },
		{
			time: everyNDays(7, 0, 14),
			fetchFn: () => runScripts({ limit: 100, offset: 0 }),
			onComplete: () => {},
		},
		{
			time: everyNDays(7, 0, 28),
			fetchFn: () => runScripts({ limit: 100, offset: 100 }),
			onComplete: () => {},
		},
		{
			time: everyNDays(7, 0, 42),
			fetchFn: () => runScripts({ limit: 100, offset: 200 }),
			onComplete: () => {},
		},
		{
			time: everyNDays(7, 0, 56),
			fetchFn: () => runScripts({ limit: 100, offset: 300 }),
			onComplete: () => {},
		},
		{
			time: everyNDays(7, 1, 14),
			fetchFn: () => runScripts({ limit: 100, offset: 400 }),
			onComplete: () => {},
		},
	],
};
