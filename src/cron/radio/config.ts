import { everyNDays } from "../cron-times";
import { CronConfig } from "../types";
import { runScripts } from "./radio-cron";

export const RADIO_CRON_CONFIG: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		// {
		// 	// TEST DO NOT KEEP!!!!!!!!!!!!!!!!!!!!
		// 	time: CRON_TIMES.seconds_30,
		// 	fetchFn: () => runScripts({ limit: 100, offset: 400 }),
		// 	onComplete: () => {},
		// },
		{
			time: everyNDays({ day: 7, hour: 0, minute: 14 }),
			fetchFn: () => runScripts({ limit: 100, offset: 0 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 28 }),
			fetchFn: () => runScripts({ limit: 100, offset: 100 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 42 }),
			fetchFn: () => runScripts({ limit: 100, offset: 200 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 56 }),
			fetchFn: () => runScripts({ limit: 100, offset: 300 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 1, minute: 14 }),
			fetchFn: () => runScripts({ limit: 100, offset: 400 }),
			onComplete: () => {},
		},
	],
};
