import { ExtraData } from "../../sources/news/articles/types";
import { deepMerge, filterLimit } from "../utils";
import Article from "../models/Article";
import { RSSItem } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { FetchArticles } from "./fetch-articles";
import { saveArticle } from "./save";

type Items = RSSItem[];

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

type ConvertYouTubeRssItemToArticle = {
	item: YouTubeRSSItem;
	extraData?: ExtraData;
	provider?: ProviderItem;
};
// need update type etc
export const convertYouTubeRssItemToArticle = ({
	item,
	extraData,
	provider,
}: ConvertYouTubeRssItemToArticle) => {
	const media = item["media:group"];
	const mediaTitle = media["media:title"][0];
	const mediaThumbnail = media["media:thumbnail"][0].$.url;
	const mediaDescription = media["media:description"][0];
	const mediaCommunity = media["media:community"][0];
	const rating = mediaCommunity["media:starRating"][0].$.average;
	const views = mediaCommunity["media:statistics"][0].$.views;

	/////////////////////////////////////////////////////////
	// Shorts in an rss feed does not return a usable link
	// so if we receive a video id we can use it to create a link
	// /////////////////////////////////////////////////// //
	// Question to be asked
	// do all youtube videos share this format?
	// or is this from a certain date etc
	//////////////////////////////////////////////////////////
	// Add yt:videoId and yt:channelId to the item!!
	// const ytVideoId = item["yt:videoId"]; // item.id is something like yt:video:jDUYuXawP7Q - so could be used as well
	// const channelId = item["yt:channelId"];
	// const link = ytVideoId
	// 	? `https://www.youtube.com/watch?v=${ytVideoId}`
	// 	: item.link;

	const videoIdFromItemId = item.id.replace("yt:video:", "");

	const link = videoIdFromItemId
		? `https://www.youtube.com/watch?v=${videoIdFromItemId}`
		: item.link;

	const {
		region,
		coverage = [],
		language,
		categories = [],
		media: extraDataMedia = {},
	} = extraData || {};

	const { title, description, pubDate, author, id, isoDate } = item;
	const newItem = {
		title,
		src: link,
		description: description || mediaDescription,
		guid: id,
		variant: "video",
		format: "video/youtube",
		avatar: {
			src: mediaThumbnail,
			alt: mediaTitle || "",
		},
		details: {
			published: pubDate,
			publishers: [author],
			categories,
			region,
			coverage,
			language,
		},
		media: {
			...extraDataMedia,
			format: "video/youtube",
			rating,
			views,
		},
		provider,
	};

	return newItem;
};

export const fetchYoutubeArticles = async ({
	items,
	extraData,
	provider,
}: FetchArticles) => {
	const filteredItems = filterLimit(items);
	const data = filteredItems.map(async (item, i) => {
		const newItem: YouTubeRSSItem = item as YouTubeRSSItem;
		const convertedItem = convertYouTubeRssItemToArticle({
			item: newItem,
			extraData,
			provider,
		});

		const existing = await Article.findOne({ src: convertedItem.src }).lean();
		const merged = existing
			? deepMerge(existing, convertedItem)
			: convertedItem;

		return saveArticle(merged);
	});

	return Promise.all(data);
};
