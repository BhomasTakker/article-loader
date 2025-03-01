"use strict";

import { connectToMongoDB } from "./src/lib/mongo/db";
import { fetchCollections } from "./src/collections/fetch-collections";

import express from "express";
import {
	getCollection,
	getYoutubeCollection,
} from "./src/collections/get-collection";
import { fetchArticles } from "./src/articles/fetch-articles";
import { fetchYoutubeArticles } from "./src/articles/fetch-youtube-articles";
import { updateArticleProviders } from "./src/article-providers/update-article-providers";
import { TEST, UK_1, UK_2 } from "./sources/news/articles/uk";
import { US_1, US_2, US_3, US_4 } from "./sources/news/articles/us";
import {
	WORLD_1,
	WORLD_2,
	WORLD_3,
	WORLD_4,
	WORLD_5,
	WORLD_6,
} from "./sources/news/articles/world";
import { UK_VIDEO } from "./sources/news/videos/uk";
import { US_VIDEO } from "./sources/news/videos/us";
import { WORLD_VIDEO } from "./sources/news/videos/world";
import { logMemoryUsage } from "./src/lib/mem";
const app = express();
const port = process.env.PORT || 4000;

require("dotenv").config();

logMemoryUsage();

const fetchMainNewsCollectionsFn = (src: any) =>
	fetchCollections({
		sources: [src], //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

const fetchMainYoutubeNewsCollectionsFn = fetchCollections({
	sources: [UK_VIDEO, US_VIDEO, WORLD_VIDEO],
	feedCallback: getYoutubeCollection,
	itemsCallback: fetchYoutubeArticles,
	customFields: {
		// item: [["media:group", "media", { keepArray: false }]],
		item: ["media:group"],
	},
});

app.get("/", async (req, res) => {
	logMemoryUsage();
	res.send("I guess manual trigger? - Add sources, etc.");
});

// app.get("/fetch-news", async (req, res) => {
// 	try {
// 		await connectToMongoDB();
// 		// We shuld load sources lists from a db so we can add
// 		// That way when a user specifies a source we can add it to a list and refetch it periodically
// 		await fetchMainNewsCollectionsFn(UK_1)();
// 		res.send("Success");
// 	} catch (error) {
// 		console.log(error);
// 		res.send("Error");
// 	}
// });

const fetchCollection = async (req: any, res: any, src: any) => {
	try {
		await connectToMongoDB();
		await fetchMainNewsCollectionsFn(src)();
		res.send("Success");
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
};

app.get("/test", async (req, res) => {
	await fetchCollection(req, res, TEST);
});

// Do this by sending some body data or query params
// take id and load sources
// load data
app.get("/fetch-news-uk-1", async (req, res) => {
	await fetchCollection(req, res, UK_1);
});

app.get("/fetch-news-uk-2", async (req, res) => {
	await fetchCollection(req, res, UK_2);
});

app.get("/fetch-news-us-1", async (req, res) => {
	await fetchCollection(req, res, US_1);
});

app.get("/fetch-news-us-2", async (req, res) => {
	await fetchCollection(req, res, US_2);
});

app.get("/fetch-news-us-3", async (req, res) => {
	await fetchCollection(req, res, US_3);
});

app.get("/fetch-news-us-4", async (req, res) => {
	await fetchCollection(req, res, US_4);
});

app.get("/fetch-news-world-1", async (req, res) => {
	await fetchCollection(req, res, WORLD_1);
});

app.get("/fetch-news-world-2", async (req, res) => {
	await fetchCollection(req, res, WORLD_2);
});

app.get("/fetch-news-world-3", async (req, res) => {
	await fetchCollection(req, res, WORLD_3);
});

app.get("/fetch-news-world-4", async (req, res) => {
	await fetchCollection(req, res, WORLD_4);
});

app.get("/fetch-news-world-5", async (req, res) => {
	await fetchCollection(req, res, WORLD_5);
});

app.get("/fetch-news-world-6", async (req, res) => {
	await fetchCollection(req, res, WORLD_6);
});

app.get("/fetch-youtube-news", async (req, res) => {
	try {
		await connectToMongoDB();
		await fetchMainYoutubeNewsCollectionsFn();
		logMemoryUsage();
		res.send("Success");
	} catch (error) {
		console.log(error);
		res.send("Error");
	}
});

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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
