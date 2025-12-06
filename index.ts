"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initialiseCronJobs } from "./src/cron/init-cron";
import { initialiseExpress, startServer } from "./src/services/express";
import { getEnv } from "./src/services/env";

require("dotenv").config();

export const initialiseServer = async () => {
	const app = initialiseExpress();
	startServer(app);

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	isApiRoute && initApiRoutes(app);

	await initialiseCronJobs();
};

initialiseServer();
