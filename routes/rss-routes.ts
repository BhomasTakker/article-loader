import { Express } from "express";
import { UK_VIDEO } from "../sources/news/videos/uk";
import { US_VIDEO } from "../sources/news/videos/us";
import { WORLD_VIDEO } from "../sources/news/videos/world";
import { fetchYoutubeArticles } from "../src/articles/fetch-youtube-articles";
import { fetchCollections } from "../src/collections/fetch-collections";
import {
	getCollection,
	getYoutubeCollection,
} from "../src/collections/get-collection";
import { connectToMongoDB } from "../src/lib/mongo/db";
import { sourcesMap } from "../sources/news/map";
import { fetchArticles } from "../src/articles/fetch-articles";

const fetchMainYoutubeNewsCollectionsFn = fetchCollections({
	sources: [UK_VIDEO, US_VIDEO, WORLD_VIDEO],
	feedCallback: getYoutubeCollection,
	itemsCallback: fetchYoutubeArticles,
	customFields: {
		// item: [["media:group", "media", { keepArray: false }]],
		item: ["media:group"],
	},
});

const fetchMainNewsCollectionsFn = (src: any) =>
	fetchCollections({
		sources: [src], //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

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

export const initRssRoutes = (app: Express) => {
	app.get("/fetch-youtube-news", async (req, res) => {
		try {
			await connectToMongoDB();
			await fetchMainYoutubeNewsCollectionsFn();
			// logMemoryUsage();
			res.send("Success");
		} catch (error) {
			console.log(error);
			res.send("Error");
		}
	});

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
};
