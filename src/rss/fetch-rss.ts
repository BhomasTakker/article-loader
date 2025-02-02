import Parser from "rss-parser";
import { UnknownObject } from "../types/article/item";

type DataResponse = {
	items: object[];
} & UnknownObject;

export const RSSFetch = async (endpoint: string) => {
	const parser = new Parser({
		// Todo:- Config
		timeout: 2000,
	});
	// if error do something!
	try {
		return await parser.parseURL(endpoint.toString());
	} catch (error) {
		console.error("Error fetching rss");
		return null;
	}
};

type Callback = () => void;

export const fetchRss = async (urls: string[], callback: Callback) => {
	const fetches: Promise<DataResponse>[] = [];

	urls.forEach(async (url) => {
		try {
			const prom = RSSFetch(url) as Promise<DataResponse>;
			prom.then((data) => {
				// console.log(data);
			});
			prom.catch((error: Error) => {
				// This should stop the crash but we need to remove null from promise list
				console.error("Error fetching rss");
			});
			////////////////////////////////////
			// add redis data fetch and cache //
			////////////////////////////////////
			if (prom) {
				fetches.push(prom);
			}
		} catch (error) {
			console.error("Error fetching rss");
		}
	});

	Promise.all(fetches)
		.then((data) => {
			console.log("We havve completed all loads!");
		})
		.catch((error) => {
			console.error("Error fetching rss log me!");
		})
		.finally(() => {
			console.log("Error or successful completion. Reset fetch");
			callback();
		});
};
