import { ExtraData } from "../../sources/news/articles/types";
import { saveOrCreateArticleBySrc } from "../lib/mongo/actions/article";
import { CollectionItem, RSSItem } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { FetchArticles } from "./fetch-articles";

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
};

type ConvertYouTubeRssItemToArticle = {
	item: YouTubeRSSItem;
	extraData?: ExtraData;
	provider?: ProviderItem;
};
// need update type etc
const convertYouTubeRssItemToArticle = ({
	item,
	extraData,
	provider,
}: ConvertYouTubeRssItemToArticle) => {
	// console.log({ item });
	const media = item["media:group"];
	const mediaTitle = media["media:title"][0];
	const mediaThumbnail = media["media:thumbnail"][0].$.url;
	const mediaDescription = media["media:description"][0];
	const mediaCommunity = media["media:community"][0];
	const rating = mediaCommunity["media:starRating"][0].$.average;
	const views = mediaCommunity["media:statistics"][0].$.views;

	const { region, language, categories = [], collectionType } = extraData || {};

	const { title, description, link, pubDate, author, id, isoDate } = item;
	const newItem = {
		title,
		src: link,
		description: description || mediaDescription,
		guid: id,
		variant: "video",
		type: "youtube",
		avatar: {
			src: mediaThumbnail,
			alt: mediaTitle || "",
		},
		rating,
		views,
		details: {
			published: pubDate,
			publishers: [author],
			categories,
			region,
			language,
		},
		provider,
		collectionType,
	};

	return newItem;
};

const saveArticle = async (item: CollectionItem) => {
	const { src } = item;
	const { message } = await saveOrCreateArticleBySrc(item);
	if (message === "Saved Article!") {
		console.log(`Saved ${src}`);
		return item;
	} else {
		console.log(`Failed to save ${src}`);
		return null;
	}
};

export const fetchYoutubeArticles = async ({
	items,
	extraData,
	provider,
}: FetchArticles) => {
	const data = items.map((item, i) => {
		const newItem: YouTubeRSSItem = item as YouTubeRSSItem;
		return saveArticle(
			convertYouTubeRssItemToArticle({ item: newItem, extraData, provider })
		);
	});

	return Promise.all(data);
};
