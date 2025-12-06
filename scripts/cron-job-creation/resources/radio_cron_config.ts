import { TimeFunction, FetchFunction, CronType } from "../../../src/cron/types";

export const radioCronConfig = {
	id: "Radio Cron Config",
	type: CronType.API,
	test_cron: [
		{
			fetchFunctionData: [{ limit: 100, offset: 0 }],
			timeFunction: TimeFunction.StaggerSeconds,
			timeParams: [30],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
	],
	cron: [
		{
			fetchFunctionData: [{ limit: 100, offset: 0 }],
			timeFunction: TimeFunction.EveryNDays,
			timeParams: [7, 0, 14],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [{ limit: 100, offset: 100 }],
			timeFunction: TimeFunction.EveryNDays,
			timeParams: [7, 0, 28],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [{ limit: 100, offset: 200 }],
			timeFunction: TimeFunction.EveryNDays,
			timeParams: [7, 0, 42],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [{ limit: 100, offset: 300 }],
			timeFunction: TimeFunction.EveryNDays,
			timeParams: [7, 0, 56],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [{ limit: 100, offset: 400 }],
			timeFunction: TimeFunction.EveryNDays,
			timeParams: [7, 1, 14],
			fetchFunction: FetchFunction.RadioScripts,
			onComplete: () => {},
		},
	],
};
