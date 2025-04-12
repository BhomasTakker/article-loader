import { CollectionItem } from "../../../types/article/item";
import { YouTubeItem } from "../../../types/youtube/youtube";
import { setCache } from "../../redis/redis-fetch";

// https://developers.google.com/youtube/v3/docs/search/list
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const ENDPOINT = "/search";
const YOUTUBE_URL = BASE_URL + ENDPOINT;
const PART = "snippet";
// Search only for videos ant the moment / channel | playlist
const TYPE = "video";
// Restrict to videos allowed to be played outside of youtube
const VIDEO_SYNDICATED = "true";

const API_KEY = process.env.YOUTUBE_API_KEY;

const CACHE_TIME = 60 * 60;

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

const convertYouTubeItems = (items: YouTubeItem[]): CollectionItem[] => {
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
			collectionType: "",
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

export const youtubeApiFetch = async (
	params: YouTubeSearchParams,
	cacheTime: number = CACHE_TIME
) => {
	const { ...rest } = params;

	if (!API_KEY) {
		throw new Error("No API Key found");
	}

	const fetchUrl = new URL(YOUTUBE_URL);

	fetchUrl.searchParams.append("key", API_KEY);
	fetchUrl.searchParams.append("part", PART);
	fetchUrl.searchParams.append("type", TYPE);
	fetchUrl.searchParams.append("videoSyndicated", VIDEO_SYNDICATED);

	for (const [key, value] of Object.entries(rest)) {
		if (value) fetchUrl.searchParams.append(key, `${value}`);
	}

	const clonedUrl = fetchUrl.toString().replace(API_KEY, "***REDACTED***");

	try {
		const items = await setCache<CollectionItem[]>(
			async () => {
				const response = await fetch(fetchUrl);
				const data = await response.json();
				const { items = [] } = data || {};
				const collectionItems = convertYouTubeItems(items);

				// Would we want to return anything from the wider data?
				return collectionItems;
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
