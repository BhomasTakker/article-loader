import { ExtraData } from "../../sources/news/articles/types";
import { saveOrCreateArticleCollectionByFeed } from "../lib/mongo/actions/articleCollection";
import { DataResponse } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { RSSArticleCollection } from "../types/rss";

// i.e. then add anything we need?
// So i.e. we could effectively - if we stored under unique time
// have a record of what was on the homepage at any given time
// except not quite because it is rss
const convertRssToCollection = (rssData: DataResponse) => {
	const {
		items = [],
		link,
		title,
		feed,
		description,
		lastBuildDate,
		image,
	} = rssData || {};
	const strippedItems = items.map((item) => ({ link: item.link }));

	return {
		items: strippedItems,
		link,
		title,
		feed,
		description,
		lastBuildDate,
		image,
	};
};

export type GetCollection = {
	url: string;
	rssFeed: DataResponse;
	extraData?: ExtraData;
	provider?: ProviderItem;
};

export const getCollection = async ({
	url,
	rssFeed,
	extraData,
	provider,
}: GetCollection): Promise<RSSArticleCollection> => {
	const { feed, ...rest } = convertRssToCollection(rssFeed);

	// Need mush categories etc together

	const { message, result } = await saveOrCreateArticleCollectionByFeed({
		...rest,
		...extraData,
		provider,
		feed: url,
	});

	return Promise.resolve(result);
};

// simple fix - should be set at the 'url' data level
export const getYoutubeCollection = async ({
	url,
	rssFeed,
	extraData,
	provider,
}: GetCollection): Promise<RSSArticleCollection> => {
	const { message, result } = await saveOrCreateArticleCollectionByFeed({
		...rssFeed,
		...extraData,
		provider,
		feed: url,
	});

	return Promise.resolve(result);
};
