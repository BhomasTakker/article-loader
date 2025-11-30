"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initCronJobs } from "./src/cron/init-cron";
import { createPodcastRssCronConfigData } from "./src/cron/podcasts/podcast.config";
import { createRssCronConfigData } from "./src/cron/rss/rss-cron";
import { createUkRssCronConfigData } from "./src/cron/rss/uk-rss-cron";
import { initialiseExpress, startServer } from "./src/services/express";
import { getEnv } from "./src/services/env";
import { pageQueriesCronConfig } from "./src/cron/api/search/config";
import { createRadioCronConfigData } from "./src/cron/radio/config";

require("dotenv").config();

export const initialiseServer = async () => {
	const app = initialiseExpress();
	startServer(app);

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	isApiRoute && initApiRoutes(app);

	if (isRSSCron) {
		initCronJobs(await createRssCronConfigData());
		initCronJobs(await createUkRssCronConfigData());
		initCronJobs(await createPodcastRssCronConfigData());
	}

	if (isApiCron) {
		// Create API Cron Jobs
		initCronJobs(pageQueriesCronConfig);
		// Create Radio Cron Jobs
		initCronJobs(await createRadioCronConfigData());
	}
};

initialiseServer();
