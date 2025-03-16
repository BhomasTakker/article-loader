// https://newsapi.org/docs/endpoints/everything

import { addParams } from "../utils";

require("dotenv").config();

const API_KEY = process.env.NEWSAPI_API_KEY;
const SEARCH_URL = "https://newsapi.org/v2/everything";
const HEADLINES_URL = "https://newsapi.org/v2/top-headlines";

export type NewsAPISearchParams = {
	q?: string;
	searchIn?: string;
	sources?: string;
	domains?: string;
	excludeDomains?: string;
	from?: string;
	to?: string;
	language?: string;
	sortBy?: string;
	pageSize?: string;
	page?: string;
};

export const newsAPISearch = async (params: NewsAPISearchParams) => {
	const url = addParams(SEARCH_URL, { ...params, apiKey: API_KEY });
	const res = await fetch(url);

	return await res.json();
};

type NewsAPIHeadlinesParams = {
	country?: string;
	category?: string;
	sources?: string;
	q?: string;
	pageSize?: string;
	page?: string;
};

export const newsAPIHeadlines = async (params: NewsAPIHeadlinesParams) => {
	const url = addParams(HEADLINES_URL, { ...params, apiKey: API_KEY });
	const res = await fetch(url);
	return await res.json();
};
