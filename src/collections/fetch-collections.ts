import { SourceObject } from "../../sources/news/articles/types";
import { FetchArticles } from "../articles/fetch-articles";
import { fetchRss } from "../rss/fetch-rss";
import { Service, ServiceState } from "../service";
import { GetCollection } from "./get-collection";

type FetchCollectionsProps<T, G> = {
	sources?: SourceObject[];
	itemsCallback: ({}: FetchArticles) => Promise<T>;
	feedCallback: ({}: GetCollection) => Promise<G>;
	customFields?: Record<string, unknown>;
};

// Pass in the collections object
export const fetchCollections =
	<T, G>({
		sources = [],
		itemsCallback,
		feedCallback,
		customFields,
	}: FetchCollectionsProps<T, G>) =>
	async () => {
		const service = Service.getInstance();
		const state = service.getState();

		const promises: Promise<void>[] = [];

		if (state === ServiceState.ready) {
			service.setState(ServiceState.running);

			sources.forEach((source) => {
				const { sources, ...rest } = source;
				const prom = fetchRss<T, G>({
					urls: [],
					sources,
					callback: () => {
						service.setState(ServiceState.ready);
					},
					itemsCallback,
					feedCallback,
					customFields,
					extraData: rest,
				});
				promises.push(prom);
			});
		}

		await Promise.all(promises);
	};
