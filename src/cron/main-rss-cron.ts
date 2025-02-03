import { fetchRss } from "../rss/fetch-rss";
import { Service, ServiceState } from "../service";

// Pass in the collections object
export const fetchCollections = (urls: string[]) => () => {
	const service = Service.getInstance();
	const state = service.getState();

	if (state === ServiceState.ready) {
		service.setState(ServiceState.running);
		fetchRss(urls, () => service.setState(ServiceState.ready));
	}
};
