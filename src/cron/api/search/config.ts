import { API_PROVIDERS } from ".";
import { staggerMinutes } from "../../cron-times";
import { CronConfig } from "../../types";
import { executeAndCacheQueriesFromPage, pingApp } from "./page-queries";
import { ROUTES_1 } from "./routes";

// remove routes from this - we should do all
export const pageQueriesCronConfig: CronConfig = {
	id: "Search Queries",
	cron: [
		{
			time: staggerMinutes(15, 14, 0),
			fetchFn: () =>
				executeAndCacheQueriesFromPage(
					[API_PROVIDERS.ARTICLES_SEARCH_API],
					ROUTES_1
				),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 14, 30),
			fetchFn: () => pingApp(ROUTES_1),
			onComplete: () => {},
		},
	],
};
