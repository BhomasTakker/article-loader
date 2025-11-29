"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initCronJobs } from "./src/cron/init-cron";
import {
	createPodcastRssCronConfig,
	initializePodcastSources,
} from "./src/cron/podcasts/podcast.config";
import { createRssCronConfigData } from "./src/cron/rss/rss-cron";
import { createUkRssCronConfigData } from "./src/cron/rss/uk-rss-cron";
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

	// Initialize podcast sources from DB before starting podcast cron jobs
	if (isCron) {
		await initializePodcastSources();
		initCronJobs(createPodcastRssCronConfig());
	}

	isApiCron && initCronJobs(pageQueriesCronConfig);

	if (isRSSCron) {
		const cronConfig = await createRssCronConfigData();
		initCronJobs(cronConfig);
	}

	if (isRSSCron) {
		const cronConfig = await createUkRssCronConfigData();
		initCronJobs(cronConfig);
	}

	isApiCron && initCronJobs(RADIO_CRON_CONFIG);
};

initialiseServer();
