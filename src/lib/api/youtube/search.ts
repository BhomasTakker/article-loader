import { getYouTubeApiKey } from "../../../services/env";
import { CollectionItem } from "../../../types/article/item";
import { YouTubeItem } from "../../../types/youtube/youtube";
import { setCache } from "../../redis/redis-fetch";

const YOUTUBE_CONFIG = {
	BASE_URL: "https://www.googleapis.com/youtube/v3",
	ENDPOINT: "/search",
	DEFAULTS: {
		PART: "snippet",
		TYPE: "video",
		VIDEO_SYNDICATED: "true",
		CACHE_TIME: 60 * 60,
		MAX_RESULTS_LIMIT: 50,
	},
} as const;

// https://developers.google.com/youtube/v3/docs/search/list
const YOUTUBE_URL = `${YOUTUBE_CONFIG.BASE_URL}${YOUTUBE_CONFIG.ENDPOINT}`;
const PART = YOUTUBE_CONFIG.DEFAULTS.PART;
const TYPE = YOUTUBE_CONFIG.DEFAULTS.TYPE;
const VIDEO_SYNDICATED = YOUTUBE_CONFIG.DEFAULTS.VIDEO_SYNDICATED;

const API_KEY = getYouTubeApiKey();

const CACHE_TIME = YOUTUBE_CONFIG.DEFAULTS.CACHE_TIME;

// 'videoCount' | <-channel sort option
export type YouTubeSearchParams = {
	q?: string;
	order?: "date" | "rating" | "relevance" | "title" | "viewCount"; // default 'relevance'
	eventType?: "completed" | "live" | "upcoming";
	location?: string; // (37.42307,-122.08427).
	locationRadius?: string; //  1500m, 5km, 10000ft, and 0.75mi / max 1000km
	maxResults?: number; // 0 - 50 / default 5

	channelId?: string;
	channelType?: "any" | "show";

	publishedAfter?: string;
	publishedBefore?: string;

	relevanceLanguage?: string; // https://www.loc.gov/standards/iso639-2/php/code_list.php

	safeSearch?: "moderate" | "none" | "strict";

	topicId?: string; // can't find a list...

	videoDuration?: "any" | "long" | "medium" | "short";
};

export const convertYouTubeItems = (items: YouTubeItem[]): CollectionItem[] => {
	return items.map((item) => {
		const { snippet, id } = item;
		const { title, description, thumbnails, channelTitle, publishedAt } =
			snippet;
		const { videoId } = id;
		// medium for cards high for player
		const { high: thumbnail } = thumbnails;

		return {
			src: `https://www.youtube.com/watch?v=${videoId}`,
			avatar: {
				src: thumbnail.url,
				alt: title,
			},
			title,
			description,
			guid: videoId,
			provider: undefined,
			// rating: 0,
			variant: "video",
			// views: 0,
			details: {
				docs: [],
				categories: [],
				authors: [],
				publishers: [channelTitle],
				published: publishedAt,
				region: "",
				language: "",
			},
		} as CollectionItem;
	});
};

export const buildYouTubeSearchUrl = (
	params: YouTubeSearchParams,
	apiKey: string
): URL => {
	const fetchUrl = new URL(YOUTUBE_URL);

	// Add required parameters
	fetchUrl.searchParams.append("key", apiKey);
	fetchUrl.searchParams.append("part", PART);
	fetchUrl.searchParams.append("type", TYPE);
	fetchUrl.searchParams.append("videoSyndicated", VIDEO_SYNDICATED);

	// Add optional parameters
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			fetchUrl.searchParams.append(key, String(value));
		}
	}

	return fetchUrl;
};

export const fetchYouTubeAPIData = async (
	fetchUrl: URL
): Promise<CollectionItem[]> => {
	const response = await fetch(fetchUrl);

	if (!response.ok) {
		throw new Error(
			`YouTube API error: ${response.status} ${response.statusText}`
		);
	}

	const data = await response.json();
	const { items = [] } = data || {};
	return convertYouTubeItems(items);
};

export const youtubeApiFetch = async (
	params: YouTubeSearchParams,
	cacheTime: number = CACHE_TIME
) => {
	const { ...rest } = params;

	if (!API_KEY) {
		throw new Error("No API Key found");
	}

	const fetchUrl = buildYouTubeSearchUrl(rest, API_KEY);
	const clonedUrl = fetchUrl.toString().replace(API_KEY, "***REDACTED***");

	try {
		const items = await setCache<CollectionItem[]>(
			async () => {
				return await fetchYouTubeAPIData(fetchUrl);
			},
			// We are caching with the apikey!!!! REMOVE!!!!
			clonedUrl,
			cacheTime
		);

		return { items };
	} catch (error) {
		console.error("Error fetching youtube data", error);
		return {};
	}
};
