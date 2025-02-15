import { saveOrCreateArticleCollectionByFeed } from "../lib/mongo/actions/articleCollection";
import { DataResponse } from "../types/article/item";
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
	const strippedItems = items.map((item) => item.link);
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

export const getCollection = async (
	url: string,
	rssFeed: DataResponse
): Promise<RSSArticleCollection> => {
	// above is convert rss to collection
	const { feed, ...rest } = convertRssToCollection(rssFeed);

	const { message, result } = await saveOrCreateArticleCollectionByFeed({
		...rest,
		feed: url,
	});

	return Promise.resolve(result);
};

// simple fix - should be set at the 'url' data level
export const getYoutubeCollection = async (
	url: string,
	rssFeed: DataResponse
): Promise<RSSArticleCollection> => {
	const { message, result } = await saveOrCreateArticleCollectionByFeed({
		...rssFeed,
		feed: url,
	});

	return Promise.resolve(result);
};
