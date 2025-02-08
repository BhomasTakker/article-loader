import Parser from "rss-parser";
import { RSSItem, UnknownObject } from "../types/article/item";
import { fetchArticles } from "../articles/fetch-articles";
import { RSSParse } from "./parse-rss";

type DataResponse = {
	items: RSSItem[];
} & UnknownObject;

type Callback = () => void;

export const fetchNoSave = async (urls: string[], callback: Callback) => {
	const fetches: Promise<DataResponse>[] = [];

	urls.forEach(async (url) => {
		try {
			const prom = RSSParse(url) as Promise<DataResponse>;
			prom.then(async (data) => {
				const items = data?.items || [];
				if (items.length === 0) {
					console.log("No items for this feed", { url, data });
				}

				const { items: items2, ...rest } = data;
				const newData = { ...rest };

				console.log("RSS Data", newData);
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
