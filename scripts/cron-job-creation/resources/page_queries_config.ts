import { API_PROVIDERS } from "../../../src/cron/api/search";
import { ROUTES_1 } from "./routes";
import { TimeFunction, FetchFunction, CronType } from "../../../src/cron/types";

export const pageQueriesCronConfig = {
	id: "Cache Page Queries",
	type: CronType.API,
	test_cron: [
		{
			fetchFunctionData: [[API_PROVIDERS.ARTICLES_SEARCH_API], ROUTES_1],
			timeFunction: TimeFunction.StaggerSeconds,
			timeParams: [30, 0],
			fetchFunction: FetchFunction.PageQueries,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [ROUTES_1],
			timeFunction: TimeFunction.StaggerSeconds,
			timeParams: [30, 15],
			fetchFunction: FetchFunction.PingRoutes,
			onComplete: () => {},
		},
	],
	cron: [
		{
			fetchFunctionData: [[API_PROVIDERS.ARTICLES_SEARCH_API], ROUTES_1],
			timeFunction: TimeFunction.StaggerMinutes,
			timeParams: [15, 14, 0],
			fetchFunction: FetchFunction.PageQueries,
			onComplete: () => {},
		},
		{
			fetchFunctionData: [ROUTES_1],
			timeFunction: TimeFunction.StaggerMinutes,
			timeParams: [15, 14, 30],
			fetchFunction: FetchFunction.PingRoutes,
			onComplete: () => {},
		},
	],
};
