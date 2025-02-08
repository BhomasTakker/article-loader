import { get } from "mongoose";
import { fetchArticles } from "../articles/fetch-articles";
import { fetchRss } from "../rss/fetch-rss";
import { Service, ServiceState } from "../service";
import { CollectionItem, DataResponse } from "../types/article/item";
import { getCollection } from "./get-collection";
import { RSSArticleCollection } from "../types/rss";

// Pass in the collections object
export const fetchCollections = (urls: string[]) => async () => {
	const service = Service.getInstance();
	const state = service.getState();

	if (state === ServiceState.ready) {
		service.setState(ServiceState.running);
		await fetchRss<(CollectionItem | null)[], RSSArticleCollection>({
			urls,
			callback: () => {
				service.setState(ServiceState.ready);
			},
			itemsCallback: fetchArticles,
			feedCallback: getCollection,
		});
	}
};
