import { youtubeApiFetch } from "../../../lib/api/youtube/search";
import { searchArticles } from "../../../lib/mongo/actions/articles/search";

export const API_PROVIDERS = {
	ARTICLES_SEARCH_API: "articles-search-api",
	YOUTUBE_API: "youtube-api",
} as const;

export type API_PROVIDERS = (typeof API_PROVIDERS)[keyof typeof API_PROVIDERS];

export const apiMap = new Map<string, any>([
	[API_PROVIDERS.ARTICLES_SEARCH_API, searchArticles],
	[API_PROVIDERS.YOUTUBE_API, youtubeApiFetch],
]);
