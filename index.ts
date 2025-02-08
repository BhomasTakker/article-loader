import { connectToMongoDB } from "./src/lib/mongo/db";
import { fetchCollections } from "./src/collections/fetch-collections";
import { createCron, CRON_TIMES } from "./src/cron/create-cron";
import {
	NEWS_ARTICLES_COLLECTION,
	TEST_COLLECTION,
} from "./sources/news/articles_collections";
import { NEWS_VIDEOS_COLLECTION } from "./sources/news/video_collections";
import { fetchNoSave } from "./src/rss/fetch-dont-save";
import { TEST_BSKY } from "./sources/bluesky/profiles";

import express from "express";
const app = express();
const port = 3000;

require("dotenv").config();

// There are ways to create a cron job using github actions
////////////////////////////////////////////////////////////
// You could create a nextjs api route that triggers the action
// We can then use a service like cron-job.org to cll the endpoint every 5 minutes
///////////////////////////////////////////////////////////////////////
// We need to take data from the rss feeditself and save to Articles?
// We need to specify the type of data we are saving i.e. news
// Also categories
// World, UK, US, etc
// language, locale if possible
// Otherwise we cannot search by category
const startServer = async () => {
	await connectToMongoDB();

	// createCron({
	// 	time: CRON_TIMES.seconds_10,
	// 	fetchFn: fetchCollections([
	// 		...NEWS_VIDEOS_COLLECTION,
	// 		...NEWS_ARTICLES_COLLECTION,
	// 	]),
	// });

	createCron({
		time: CRON_TIMES.minutes_15,
		fetchFn: fetchCollections([
			...NEWS_ARTICLES_COLLECTION,
			...NEWS_VIDEOS_COLLECTION,
		]),
	});
};

startServer();

app.get("/", (req, res) => {
	fetchCollections([...NEWS_VIDEOS_COLLECTION, ...NEWS_ARTICLES_COLLECTION])();
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
