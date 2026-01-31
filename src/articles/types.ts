import { RSSItem } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { ArticleSource } from "../types/cms/ArticleSource";
import { ExtraData } from "../types/types";

export type GetArticle = {
	item: RSSItem;
	extraData?: ExtraData;
	provider?: ProviderItem;
	feed?: ArticleSource;
};

export type ConvertYouTubeRssItemToArticle = {
	item: YouTubeRSSItem;
	extraData?: ExtraData;
	provider?: ProviderItem;
	feed?: ArticleSource;
};

export type PodcastRSSCollection = {
	items: PodcastRSSItem[];
	link?: string;
	title?: string;
	description?: string;
	lastBuildDate?: string;
	language?: string;
	copyright?: string;
	generator?: string;
	author?: string;
	image?: {
		url: string;
		title: string;
		link: string;
	};
	itunes: {
		owner: {
			name: string;
			email: string;
		};
		image: string;
		categories: string[];
		explicit: string;
		author: string;
		summary: string;
	};
};

// Curren
export type PodcastRSSItem = {
	title: string;
	description: string;
	link: string;
	pubDate: string;

	itunes: {
		duration: string;
		episodeType: string;
		author: string;
		subtitle: string;
		summary: string;
		block: string;
		explicit: string;
	};
	content: {
		encoded: string;
	};

	guid: string;
	enclosure: {
		url: string;
		type?: string;
	};
};

export type PodcastExtraData = ExtraData & { collectionTitle: string };

export type ConvertPodcastRssItemToArticle = {
	item: PodcastRSSItem;
	extraData?: PodcastExtraData;
	provider?: ProviderItem;
	collectionData?: PodcastRSSCollection;
	feed?: ArticleSource;
};

// extend and add youtube specific fields
export type YouTubeRSSItem = {
	title: string;
	link: string;
	pubDate: string;
	author: string;
	id: string;
	isoDate: string;
	description: string;
	["media:group"]: {
		["media:title"]: string[];
		["media:thumbnail"]: { $: { url: string } }[];
		["media:description"]: string[];
		["media:community"]: {
			["media:starRating"]: { $: { average: string } }[];
			["media:statistics"]: { $: { views: string } }[];
		}[];
	};
	["yt:videoId"]?: string;
	["yt:channelId"]?: string;
};
