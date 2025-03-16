import { addParams } from "../utils";

require("dotenv").config();

const API_KEY = process.env.GNEWS_API_KEY;
const SEARCH_URL = "https://gnews.io/api/v4/search";
const HEADLINES_URL = "https://gnews.io/api/v4/top-headlines";

type GNewsSearchParams = {
	q?: string;
	lang?: string;
	country?: string;
	max?: string;
	in?: string;
	nullable?: string;
	from?: string;
	to?: string;
	sortBy?: string;
	page?: string;
	expand?: string;
};

export const gNewsSearch = async (params: GNewsSearchParams) => {
	const url = addParams(SEARCH_URL, { ...params, apikey: API_KEY });
	const res = await fetch(url);
	return await res.json();
};

export type GNewsHeadlinesParams = {
	category?: string;
	lang?: string;
	country?: string;
	max?: string;
	nullable?: string;
	from?: string;
	to?: string;
	q?: string;
	page?: string;
	expand?: string;
};

export const gNewsHeadlines = async (params: GNewsHeadlinesParams) => {
	const url = addParams(HEADLINES_URL, { ...params, apikey: API_KEY });
	const res = await fetch(url);
	return await res.json();
};
