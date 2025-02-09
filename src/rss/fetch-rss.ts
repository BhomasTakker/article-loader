import { DataResponse, RSSItem, UnknownObject } from "../types/article/item";
import { RSSParse } from "./parse-rss";

type FetchRSS<T, G> = {
	urls: string[];
	callback: Callback;
	itemsCallback: (items: RSSItem[]) => Promise<T>;
	feedCallback: (url: string, items: DataResponse) => Promise<G>;
	customFields?: UnknownObject | undefined;
};

// This could probably be better but it works for now
// and only resets state when all are loaded or otherwise completed

type Callback = () => void;

// pass in fetchArticles as an items callback
export const fetchRss = async <T, G>({
	urls,
	callback,
	feedCallback,
	itemsCallback,
	customFields,
}: FetchRSS<T, G>) => {
	const fetches: Promise<DataResponse>[] = [];

	urls.forEach(async (url) => {
		try {
			const prom = RSSParse(url, customFields) as Promise<DataResponse>;
			// could just pass a single callbck?
			prom.then(async (data) => {
				// console.log(data);
				// stript items from data
				const items = data?.items || [];
				if (items.length === 0) {
					console.log("No items for this feed", { url, data });
				}

				await feedCallback(url, data);
				await itemsCallback(items);
			});
			prom.catch((error: Error) => {
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
