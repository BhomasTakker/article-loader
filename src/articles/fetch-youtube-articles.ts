import { deepMerge, filterLimit } from "../utils";
import Article from "../models/Article";
import { FetchArticles } from "./fetch-articles";
import { saveArticle } from "./save";
import { convertYouTubeRssItemToArticle } from "./transformers/youtube-article";
import { YouTubeRSSItem } from "./types";

export const fetchYoutubeArticles = async ({
	items,
	feed,
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
			feed,
		});

		const existing = await Article.findOne({ src: convertedItem.src }).lean();
		const merged = existing
			? deepMerge(existing, convertedItem)
			: convertedItem;

		return saveArticle(merged);
	});

	return Promise.all(data);
};
