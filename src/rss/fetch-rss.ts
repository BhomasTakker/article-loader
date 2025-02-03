import Parser from "rss-parser";
import { RSSItem, UnknownObject } from "../types/article/item";
import { fetchArticles } from "../articles/fetch-articles";

type DataResponse = {
	items: RSSItem[];
} & UnknownObject;

// This could probably be better but it works for now
// and only resets state when all are loaded or otherwise completed
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
			prom.then(async (data) => {
				// console.log(data);
				// stript items from data
				const items = data?.items || [];
				if (items.length === 0) {
					console.log("No items for this feed", { url, data });
				}

				// here
				// We want to convert the response to a collection
				// and save it to the db under it's path
				// That way we can easily fetch it from the front end

				await fetchArticles(items);
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
