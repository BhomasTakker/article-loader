import {
	buildTrendingArticlesQuery,
	GetTrendingArticlesProps,
} from "./query/trending-query";
import { setCache } from "../../../redis/redis-fetch";
import { CollectionItem } from "../../../../types/article/item";

export const trendingSearch = async (params: GetTrendingArticlesProps) => {
	const CACHE_TIME = 60 * 60;
	const queryCacheKey = JSON.stringify(params);
	const articles = await setCache<CollectionItem[]>(
		async () => {
			return await buildTrendingArticlesQuery(params);
		},
		queryCacheKey,
		CACHE_TIME,
	);
	return { items: articles };
};
