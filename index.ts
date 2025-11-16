"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initCronJobs } from "./src/cron/init-cron";
import { podcastRssCronConfig } from "./src/cron/podcasts/podcast.config";
import {
	createRssCronConfig,
	initializeRSSSources,
} from "./src/cron/rss/rss-cron";
import {
	createUkRssCronConfig,
	initializeUKSources,
} from "./src/cron/rss/uk-rss-cron";
import { initialiseExpress, startServer } from "./src/services/express";
import { getEnv } from "./src/services/env";
import { pageQueriesCronConfig } from "./src/cron/api/search/config";
import { RADIO_CRON_CONFIG } from "./src/cron/radio/config";

require("dotenv").config();

export const initialiseServer = async () => {
	const app = initialiseExpress();
	startServer(app);

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	isApiRoute && initApiRoutes(app);
	isCron && initCronJobs(podcastRssCronConfig);

	isApiCron && initCronJobs(pageQueriesCronConfig);

	if (isRSSCron) {
		await initializeRSSSources();
		initCronJobs(createRssCronConfig());
	}

	if (isRSSCron) {
		await initializeUKSources();
		initCronJobs(createUkRssCronConfig());
	}

	isApiCron && initCronJobs(RADIO_CRON_CONFIG);
};

initialiseServer();
