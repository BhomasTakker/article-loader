import { Express } from "express";
import { fetchAPI } from "../src/api/fetch-api";
import { gNewsSearch, gNewsHeadlines } from "../src/api/gnews";
import { GNewsResult, gNewsCallback } from "../src/api/gnews/callback";
import { newsAPISearch, newsAPIHeadlines } from "../src/api/news-api";
import { newsAPICallback } from "../src/api/news-api/callback";
import { newsDataHubSearch } from "../src/api/newsdatahub";
import { newsDataHubCallback } from "../src/api/newsdatahub/callback";
import { fetchNewsRadioStations } from "../src/api/radio-browser";
import { Station } from "radio-browser-api";
import { radioBrowserApiCallback } from "../src/api/radio-browser/callback";
import { connectToMongoDB } from "../src/lib/mongo/db";
import { updateArticleProviders } from "../src/article-providers/update-article-providers";
import { logMemoryUsage } from "../src/lib/mem";

export const initApiRoutes = (app: Express) => {
	app.get("/", async (req, res) => {
		logMemoryUsage();
		// we want a ui for management and triggering etc
		res.send("I guess manual trigger? - Add sources, etc.");
	});

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

	app.get("/radio-browser-api/search", async (req, res) => {
		const params = req.query;
		const result = await fetchAPI<Station[]>({
			fetchFn: () => fetchNewsRadioStations(params),
			itemsCallback: radioBrowserApiCallback(params),
		});
		res.send(result);
	});
};
