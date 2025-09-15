"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initCronJobs } from "./src/cron/init-cron";
import { podcastRssCronConfig } from "./src/cron/podcasts/podcast.config";
import { pageQueriesCronConfig } from "./src/cron/api/search/page-queries";
import { rssCronConfig } from "./src/cron/rss/rss-cron";
import { RADIO_CRON_CONFIG } from "./src/cron/radio/radio-cron";
import { ukRssCronConfig } from "./src/cron/rss/uk-rss-cron";
import { initialiseExpress } from "./src/services/express";
import { getEnv } from "./src/services/env";

require("dotenv").config();

export const initialiseServer = () => {
	const app = initialiseExpress();

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	isApiRoute && initApiRoutes(app);
	isCron && initCronJobs(podcastRssCronConfig);

	isApiCron && initCronJobs(pageQueriesCronConfig);

	isRSSCron && initCronJobs(rssCronConfig);
	isRSSCron && initCronJobs(ukRssCronConfig);

	isApiCron && initCronJobs(RADIO_CRON_CONFIG);
};

initialiseServer();
