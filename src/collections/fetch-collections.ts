import { fetchRss } from "../rss/fetch-rss";
import { Service, ServiceState } from "../service";
import { DataResponse, RSSItem } from "../types/article/item";

type FetchCollectionsProps<T, G> = {
	urls: string[];
	itemsCallback: (items: RSSItem[]) => Promise<T>;
	feedCallback: (url: string, items: DataResponse) => Promise<G>;
	customFields?: Record<string, unknown>;
};

// Pass in the collections object
export const fetchCollections =
	<T, G>({
		urls,
		itemsCallback,
		feedCallback,
		customFields,
	}: FetchCollectionsProps<T, G>) =>
	async () => {
		const service = Service.getInstance();
		const state = service.getState();

		if (state === ServiceState.ready) {
			service.setState(ServiceState.running);
			await fetchRss<T, G>({
				urls,
				callback: () => {
					service.setState(ServiceState.ready);
				},
				itemsCallback,
				feedCallback,
				customFields,
			});
		}
	};
