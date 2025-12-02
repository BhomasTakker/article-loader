import { API_PROVIDERS } from "../api/search";
import { ROUTES_1 } from "../api/search/routes";
import { TimeFunction, FetchFunction } from "../types";

export const pageQueriesCronConfig = {
	id: "Cache Page Queries",
	type: "api",
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
