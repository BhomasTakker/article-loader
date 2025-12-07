"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initialiseCronJobs } from "./src/cron/init-cron";
import { initialiseExpress, startServer } from "./src/services/express";
import { getEnv } from "./src/services/env";
import { initCMSRoutes } from "./routes/cms";

require("dotenv").config();

export const initialiseServer = async () => {
	const app = initialiseExpress();
	startServer(app);

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	// We can maybe do away with this?
	// We aren't using it for anything
	isApiRoute && initApiRoutes(app);

	initCMSRoutes(app);

	await initialiseCronJobs();
};

initialiseServer();
