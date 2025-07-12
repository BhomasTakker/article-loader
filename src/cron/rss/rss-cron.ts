import { DIDDY_TRIAL } from "../../../sources/audio/podbean/news/features";
import {
	BITES_UK,
	NEWS_UK_1,
	NEWS_UK_2,
} from "../../../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1,
	NEWS_US_2,
	NEWS_US_3,
	NEWS_US_4,
} from "../../../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD_1,
	NEWS_WORLD_2,
} from "../../../sources/audio/podbean/news/world";
import { UK_1, UK_2, UK_3 } from "../../../sources/news/articles/uk";
import {
	US_1,
	US_2,
	US_3,
	US_4,
	US_5,
} from "../../../sources/news/articles/us";
import {
	WORLD_1,
	WORLD_2,
	WORLD_3,
	WORLD_4,
	WORLD_5,
	WORLD_6,
	WORLD_7,
} from "../../../sources/news/articles/world";
import { UK_LIVE, UK_VIDEO, UK_VIDEO_2 } from "../../../sources/news/videos/uk";
import { US_LIVE, US_VIDEO, US_VIDEO_2 } from "../../../sources/news/videos/us";
import {
	WORLD_LIVE,
	WORLD_VIDEO,
	WORLD_VIDEO_2,
} from "../../../sources/news/videos/world";
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

const fetchRSS = (srcs: any[]) =>
	fetchCollections({
		sources: srcs, //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

const fetchYoutubeRSS = (srcs: any[]) =>
	fetchCollections({
		sources: [...srcs],
		feedCallback: getYoutubeCollection,
		itemsCallback: fetchYoutubeArticles,
		customFields: {
			// item: [["media:group", "media", { keepArray: false }]],
			item: ["media:group"],
		},
	});

// live videos - or 24 hour streams don't need to be fetched regularly at all.
const live_videos = [UK_LIVE, US_LIVE, WORLD_LIVE];
const videos1 = [UK_VIDEO, US_VIDEO, WORLD_VIDEO];
const videos2 = [UK_VIDEO_2, US_VIDEO_2, WORLD_VIDEO_2];
const videos = [...videos1, ...videos2, ...live_videos];

const podcasts_features = [DIDDY_TRIAL];
const podcasts_uk = [NEWS_UK_1, NEWS_UK_2];
const podcasts_us = [NEWS_US_1, NEWS_US_2, NEWS_US_3, NEWS_US_4];
const podcasts_world = [NEWS_WORLD_1, NEWS_WORLD_2];
const podcast_bites = [BITES_UK, BITES_US, BITES_WORLD];

const uk_articles = [UK_1, UK_2, UK_3];
const us_articles_1 = [US_1, US_2];
const us_articles_2 = [US_3, US_4, US_5];
const world_articles_1 = [WORLD_1, WORLD_2];
const world_articles_2 = [WORLD_3, WORLD_4, WORLD_5];
const world_articles_3 = [WORLD_5, WORLD_6, WORLD_7];
// you could functionalise
// pass in cron, fetch, and complete
export const rssCronConfig: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		{
			time: CRON_TIMES.fifthteen,
			fetchFn: fetchRSS(uk_articles),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_1,
			fetchFn: fetchRSS(us_articles_1),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_2,
			fetchFn: fetchRSS(us_articles_2),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_3,
			fetchFn: fetchRSS(world_articles_1),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_4,
			fetchFn: fetchRSS(world_articles_2),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_5,
			fetchFn: fetchRSS(world_articles_3),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.fifthteen_6,
			fetchFn: fetchYoutubeRSS(videos),
			onComplete: () => {},
		},
	],
};
