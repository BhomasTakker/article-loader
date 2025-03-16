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
import { newsDataHubSearch } from "./src/api/newsdatahub";
import { gNewsHeadlines, gNewsSearch } from "./src/api/gnews";
import { newsAPIHeadlines, newsAPISearch } from "./src/api/news-api";
import { sourcesMap } from "./sources/news/map";
import { fetchAPI } from "./src/api/fetch-api";
import { gNewsCallback, GNewsResult } from "./src/api/gnews/callback";
import { newsAPICallback } from "./src/api/news-api/callback";
import { newsDataHubCallback } from "./src/api/newsdatahub/callback";
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
	// we want a ui for management and triggering etc
	res.send("I guess manual trigger? - Add sources, etc.");
});

// separate routes into more sensible files
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

app.get("/fetch-news", async (req, res) => {
	const params = req.query;
	const { src = "" } = params || {};
	const srcObject = sourcesMap.get(src.toString());
	if (!srcObject) {
		res.send(`Error:- ${params}`);
		return;
	}
	await fetchCollection(req, res, srcObject);
});

// Do better / with aws we'll be getting silly
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

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// For speed and ease we will create new endpoints for aws
// We will create a better way of doing this later
// for now it is enough that we determine what we trigger and when
// either by endpoing or env file var
////////////////////////////////////////////////////////
app.get("/newsdatahub/search", async (req, res) => {
	const params = req.query;
	const result = await fetchAPI({
		fetchFn: () => newsDataHubSearch(params),
		itemsCallback: newsDataHubCallback(params),
	});
	res.send(result);
});

app.get("/gnews/search", async (req, res) => {
	const params = req.query;
	const result = await fetchAPI<GNewsResult>({
		fetchFn: () => gNewsSearch(params),
		itemsCallback: gNewsCallback(params),
	});
	res.send(result);
});

app.get("/gnews/headlines", async (req, res) => {
	const params = req.query;
	const result = await fetchAPI({
		fetchFn: () => gNewsHeadlines(params),
		itemsCallback: gNewsCallback(params),
	});
	res.send(result);
});

app.get("/newsAPI/search", async (req, res) => {
	const params = req.query;
	const result = await fetchAPI({
		fetchFn: () => newsAPISearch(params),
		itemsCallback: newsAPICallback(params),
	});
	res.send(result);
});

app.get("/newsAPI/headlines", async (req, res) => {
	const params = req.query;
	const result = await fetchAPI({
		fetchFn: () => newsAPIHeadlines(params),
		itemsCallback: newsAPICallback(params),
	});
	res.send(result);
});
////////////////////////////////////////////////////////
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
