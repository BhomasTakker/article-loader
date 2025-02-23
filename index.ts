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
import { UK } from "./sources/news/articles/uk";
import { US } from "./sources/news/articles/us";
import { WORLD } from "./sources/news/articles/world";
import { UK_VIDEO } from "./sources/news/videos/uk";
import { US_VIDEO } from "./sources/news/videos/us";
import { WORLD_VIDEO } from "./sources/news/videos/world";
const app = express();
const port = process.env.PORT || 4000;

require("dotenv").config();

const fetchMainNewsCollectionsFn = fetchCollections({
	sources: [UK, US, WORLD],
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
