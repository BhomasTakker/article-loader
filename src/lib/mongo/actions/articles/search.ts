import { CollectionItem } from "../../../../types/article/item";
import { setCache } from "../../../redis/redis-fetch";
import { buildArticleSearchQuery } from "./query";

const CACHE_TIME = 60 * 60;

export type GetLatestArticlesProps = {
	mustContain?: string[];
	mustNotContain?: string[];
	shouldContain?: string[];
	filterContain?: string[];

	minimumShouldMatch?: number;

	// remove
	textScore?: string;
	contentType?: string;

	// details
	categories?: string;

	// media
	mediaType?: string;

	// can't at the moment
	provider?: string;
	origin?: string;

	variant?: string;

	// time based
	before?: Date;
	after?: Date;
	within?: string;

	// cannot query provider at the moment
	// search index etc required
	trustHigher?: string;
	trustLower?: string;
	leaningHigher?: string;
	leaningLower?: string;

	durationHigher?: string;
	durationLower?: string;

	region?: string | string[];
	// coverage used for scoping articles.
	// i.e. local news is IN US
	// but I want US && national news - maybe add sub-local
	coverage?: "international" | "national" | "regional" | "local";
	// should be temp - we want region to be a  multi select
	// with region - this and this
	// this or this
	// not this and not this
	// i.e. filter for Birmingham filter NOT Alabama i.e.
	// with live search to select continent, country, state, city, etc
	// all as a 'region'
	continent?: string;
	country?: string;
	state?: string;
	city?: string;

	language?: string;

	sort?: string;
	limit?: string;
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
