import { DIDDY_TRIAL } from "../../../sources/audio/podbean/news/features";
import { UK_3 } from "../../../sources/news/articles/uk";
import { US_5 } from "../../../sources/news/articles/us";
import { WORLD_7 } from "../../../sources/news/articles/world";
import { UK_VIDEO_2 } from "../../../sources/news/videos/uk";
import { US_VIDEO_2 } from "../../../sources/news/videos/us";
import { WORLD_VIDEO_2 } from "../../../sources/news/videos/world";
import { fetchArticles } from "../../articles/fetch-articles";
import { fetchYoutubeArticles } from "../../articles/fetch-youtube-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import {
	getCollection,
	getYoutubeCollection,
} from "../../collections/get-collection";
import { CRON_TIMES } from "../create-cron";
import { fetchPodcasts } from "../loaders/fetchPodcasts";
import { CronConfig } from "../types";

const fetchRSS = (src: any) =>
	fetchCollections({
		sources: [src], //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

const fetchMainYoutubeNewsCollectionsFn = fetchCollections({
	sources: [UK_VIDEO_2, US_VIDEO_2, WORLD_VIDEO_2],
	feedCallback: getYoutubeCollection,
	itemsCallback: fetchYoutubeArticles,
	customFields: {
		// item: [["media:group", "media", { keepArray: false }]],
		item: ["media:group"],
	},
});

export const rssCronConfig: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		{
			time: CRON_TIMES.fifthteen,
			fetchFn: fetchRSS(UK_3),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_1,
			fetchFn: fetchRSS(US_5),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_2,
			fetchFn: fetchRSS(WORLD_7),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_3,
			fetchFn: fetchMainYoutubeNewsCollectionsFn,
			onComplete: () => {},
		},
	],
};
