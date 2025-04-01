import { CollectionItem } from "../../../../types/article/item";
import { setCache } from "../../../redis/redis-fetch";
import { buildArticleSearchQuery } from "./query";

const CACHE_TIME = 60 * 60;

export type GetLatestArticlesProps = {
	query?: string;
	textScore?: string;
	//match
	provider?: string;
	origin?: string;
	variant?: string;
	contentType?: string;
	before?: string;
	after?: string;
	trustHigher?: string;
	trustLower?: string;
	durationHigher?: string;
	durationLower?: string;
	leaningHigher?: string;
	leaningLower?: string;
	region?: string;
	language?: string;
	// sort
	sort?: string;
	// limit
	limit?: string;
	// count? reutn count of articles
};

export const searchArticles = async (
	params: GetLatestArticlesProps,
	cacheTime: number = CACHE_TIME
) => {
	const queryCacheKey = JSON.stringify(params);
	const articles = await setCache<CollectionItem[]>(
		async () => {
			return await buildArticleSearchQuery(params);
		},
		queryCacheKey,
		cacheTime
	);

	return {
		// what other data - paginaton etc
		items: articles,
	};
};
