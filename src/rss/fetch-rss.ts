import { ArticleSource, ExtraData } from "../types/types";
import { filterLimit, mergeStringOrArray } from "../utils";
import { FetchArticles } from "../articles/fetch-articles";
import { GetCollection } from "../collections/get-collection";
import { getArticleProviderByName } from "../lib/mongo/actions/article-provider";
import { DataResponse, UnknownObject } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { RSSParse } from "./parse-rss";

type FetchRSS<T, G> = {
	urls: string[];
	extraData?: ExtraData;
	sources?: ArticleSource[];
	callback: Callback;
	itemsCallback: ({
		items,
		extraData,
		provider,
		collectionData,
	}: FetchArticles) => Promise<T>;
	feedCallback: ({
		url,
		rssFeed,
		extraData,
		provider,
	}: GetCollection) => Promise<G>;
	customFields?: UnknownObject | undefined;
};

// This could probably be better but it works for now
// and only resets state when all are loaded or otherwise completed

type Callback = () => void;

const deepMerge = (obj1: ExtraData, obj2: Partial<ExtraData>) => {
	const region1 = obj1?.region || [];
	const region2 = obj2?.region || [];
	const region = mergeStringOrArray(region1, region2);

	const categories1 = obj1?.categories || [];
	const categories2 = obj2?.categories || [];
	const categories = mergeStringOrArray(categories1, categories2);

	const coverage1 = obj1?.coverage || [];
	const coverage2 = obj2?.coverage || [];
	const coverage = mergeStringOrArray(coverage1, coverage2);

	// Create a clean merged object, excluding region/categories/coverage from spreads
	// to prevent them from being overwritten before we set the merged values
	const { region: _, categories: __, coverage: ___, ...rest1 } = obj1;
	const { region: ____, categories: _____, coverage: ______, ...rest2 } = obj2;

	return structuredClone({
		...rest1,
		...rest2,
		region,
		coverage,
		categories,
	});
};

// pass in fetchArticles as an items callback
export const fetchRss = async <T, G>({
	urls,
	sources = [],
	extraData = {},
	callback,
	feedCallback,
	itemsCallback,
	customFields,
}: FetchRSS<T, G>) => {
	const fetches: Promise<DataResponse>[] = [];

	sources.forEach(async ({ name, src, ...rest }) => {
		try {
			const prom = RSSParse(src, customFields) as Promise<DataResponse>;
			// get Provider
			const provider = (await getArticleProviderByName(
				name
			)) as unknown as ProviderItem;
			// could just pass a single callbck?
			prom.then(async (data) => {
				const items = filterLimit(data?.items || []);
				if (items.length === 0) {
					console.log("No items for this feed", { src, data });
					return;
				}

				const updatedRawCollection = { ...data, items };

				// Merge extraData with source-specific data ONCE and use consistently
				const mergedExtraData = deepMerge(extraData, rest);

				await feedCallback({
					url: src,
					rssFeed: updatedRawCollection,
					extraData: mergedExtraData,
					provider,
				});
				const collectionData = { ...updatedRawCollection, items: null };
				// WE could - load ALL items here
				// just don't store them in the collection
				await itemsCallback({
					items,
					// Use the same merged extraData for consistency
					extraData: mergedExtraData,
					provider,
					collectionData,
				});
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
