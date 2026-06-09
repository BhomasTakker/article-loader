import { youtubeApiFetch } from "../../../lib/api/youtube/search";
import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import { trendingSearch } from "../../../lib/mongo/actions/articles/trending-search";

export const API_PROVIDERS = {
	ARTICLES_SEARCH_API: "articles-search-api",
	TRENDING_ARTICLES_SEARCH_API: "trending-articles-search-api",
	YOUTUBE_API: "youtube-api",
} as const;

export type API_PROVIDERS = (typeof API_PROVIDERS)[keyof typeof API_PROVIDERS];

export const apiMap = new Map<string, any>([
	[API_PROVIDERS.ARTICLES_SEARCH_API, searchArticles],
	[API_PROVIDERS.TRENDING_ARTICLES_SEARCH_API, trendingSearch],
	[API_PROVIDERS.YOUTUBE_API, youtubeApiFetch],
]);
