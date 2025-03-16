import { Express } from "express";
import { fetchAPI } from "../src/api/fetch-api";
import { gNewsSearch, gNewsHeadlines } from "../src/api/gnews";
import { GNewsResult, gNewsCallback } from "../src/api/gnews/callback";
import { newsAPISearch, newsAPIHeadlines } from "../src/api/news-api";
import { newsAPICallback } from "../src/api/news-api/callback";
import { newsDataHubSearch } from "../src/api/newsdatahub";
import { newsDataHubCallback } from "../src/api/newsdatahub/callback";

export const initApiRoutes = (app: Express) => {
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
};
