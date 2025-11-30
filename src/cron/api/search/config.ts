import { API_PROVIDERS } from ".";
import { createCronJobData } from "../../create-cron-data";
import { staggerMinutes } from "../../cron-times";
import { CronConfig, FetchFunction, TimeFunction } from "../../types";
import { executeAndCacheQueriesFromPage, pingApp } from "./page-queries";
import { ROUTES_1 } from "./routes";

export const createPageQueriesConfigData = async () => {
	return {
		id: "Search Queries",
		cron: [
			await createCronJobData({
				fetchFunctionData: [[API_PROVIDERS.ARTICLES_SEARCH_API], ROUTES_1],
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 14, 0],
				fetchFunction: FetchFunction.PageQueries,
				onComplete: () => {},
			}),
			await createCronJobData({
				fetchFunctionData: [ROUTES_1],
				timeFunction: TimeFunction.StaggerMinutes,
				timeParams: [15, 14, 30],
				fetchFunction: FetchFunction.PingRoutes,
				onComplete: () => {},
			}),
		],
	};
};
