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
const port = process.env.PORT || 4000;

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

	createCron({
		time: CRON_TIMES.minutes_15,
		fetchFn: fetchCollections([
			...NEWS_ARTICLES_COLLECTION,
			...NEWS_VIDEOS_COLLECTION,
		]),
	});
};

// startServer();
const fetchMainNewsCollectionsFn = fetchCollections([
	...NEWS_ARTICLES_COLLECTION,
]);

const fetchMainYoutubeNewsCollectionsFn = fetchCollections([
	...NEWS_ARTICLES_COLLECTION,
]);

app.get("/", async (req, res) => {
	res.send("I guess manual trigger? - Add sources, etc.");
});

app.get("/fetch-news", async (req, res) => {
	try {
		await connectToMongoDB();
		// We shuld load sources lists from a db so we can add
		// That way when a user specifies a source we can add it to a list and refetch it periodically
		await fetchMainNewsCollectionsFn();
		res.send("Success");
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
});

app.get("/fetch-youtube-news", async (req, res) => {
	try {
		await connectToMongoDB();
		await fetchMainYoutubeNewsCollectionsFn();
		res.send("Success");
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
