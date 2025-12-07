"use strict";

import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initialiseCronJobs } from "./src/cron/init-cron";
import { initialiseExpress, startServer } from "./src/services/express";
import { getEnv } from "./src/services/env";
import { connectToMongoDB } from "./src/lib/mongo/db";
import { initRoutes } from "./routes";

require("dotenv").config();

export const initialiseServer = async () => {
	// Connect to MongoDB once at startup
	await connectToMongoDB();

	const app = initialiseExpress();

	const { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron } = getEnv();
	logMemoryUsage();

	// We can maybe do away with this?
	// We aren't using it for anything
	isApiRoute && initApiRoutes(app);
	isRSSCron && (await initialiseCronJobs());

	initRoutes(app);

	// Start server AFTER routes are initialized
	startServer(app);
};

initialiseServer();
