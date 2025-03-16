import { addParams } from "../utils";

require("dotenv").config();

const API_KEY = process.env.NEWSDATAHUB_API_KEY;
const BASE_URL = "https://api.newsdatahub.com/v1/news";

const headers = {
	"X-Api-Key": `${API_KEY}`,
	"User-Agent": "Test/Testerson",
};

export type NewsDataSearchParams = {
	q?: string;
	topic?: string;
	language?: string;
	start_date?: string;
	end_date?: string;
};

export const newsDataHubSearch = async (params: NewsDataSearchParams) => {
	const url = addParams(BASE_URL, { ...params, apiKey: API_KEY });
	const res = await fetch(url, {
		headers,
	});
	return await res.json();
};
