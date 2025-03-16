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
import { UK_VIDEO } from "./sources/news/videos/uk";
import { US_VIDEO } from "./sources/news/videos/us";
import { WORLD_VIDEO } from "./sources/news/videos/world";
import { logMemoryUsage } from "./src/lib/mem";
import { sourcesMap } from "./sources/news/map";
import { initApiRoutes } from "./routes/api-routes";
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

initApiRoutes(app);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = app;
