import { fetchArticles } from "../../articles/fetch-articles";
import { fetchYoutubeArticles } from "../../articles/fetch-youtube-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import {
	getCollection,
	getYoutubeCollection,
} from "../../collections/get-collection";

export const fetchRSS = (srcs: any[]) =>
	fetchCollections({
		sources: srcs, //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

export const fetchYoutubeRSS = (srcs: any[]) =>
	fetchCollections({
		sources: [...srcs],
		feedCallback: getYoutubeCollection,
		itemsCallback: fetchYoutubeArticles,
		customFields: {
			// item: [["media:group", "media", { keepArray: false }]],
			item: ["media:group"],
		},
	});
