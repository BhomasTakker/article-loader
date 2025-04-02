"use strict";

import { connectToMongoDB } from "./src/lib/mongo/db";
import express from "express";
import { updateArticleProviders } from "./src/article-providers/update-article-providers";
import { logMemoryUsage } from "./src/lib/mem";
import { initApiRoutes } from "./routes/api-routes";
import { initCronJobs } from "./src/cron/init-cron";
import { initRssRoutes } from "./routes/rss-routes";
import { podcastRssCronConfig } from "./src/cron/podcasts/podcast.config";
import { searchCronConfig } from "./src/cron/api/search/search-queries";
const app = express();
const port = process.env.PORT || 4000;

const isRssRoute = process.env.RSS_ROUTE === "true" || false;
const isApiRoute = process.env.API_ROUTE === "true" || false;
const isCron = process.env.CRON === "true" || false;
const isApiCron = process.env.API_CRON === "true" || false;

require("dotenv").config();

logMemoryUsage();

app.get("/", async (req, res) => {
	logMemoryUsage();
	// we want a ui for management and triggering etc
	res.send("I guess manual trigger? - Add sources, etc.");
});

// should probably be a cron - once per day or something
// At the moment wewill just do this manually when we update the sources
// But ultimately we want to be able to update and add sources from 'cms'
app.get("/update-providers", async (req, res) => {
	try {
		await connectToMongoDB();
		// get data to respond with
		await updateArticleProviders();
		res.send("Success");
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
});

// setup crtain routes / jobs etc depending on settings etc
isRssRoute && initRssRoutes(app);
isApiRoute && initApiRoutes(app);
isCron && initCronJobs(podcastRssCronConfig);

// isApiCron
isApiCron && initCronJobs(searchCronConfig);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
