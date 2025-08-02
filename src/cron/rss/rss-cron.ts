import {
	FLORIDA_ARTICLES,
	FLORIDA_VIDEOS,
} from "../../../sources/news/articles/united-states/florida";
import {
	NEW_YORK_ARTICLES,
	NEW_YORK_VIDEOS,
} from "../../../sources/news/articles/united-states/new-york";
import {
	US_1,
	US_2,
	US_3,
	US_4,
	US_5,
} from "../../../sources/news/articles/source-lists/us";
import {
	WORLD_1,
	WORLD_2,
	WORLD_3,
	WORLD_4,
	WORLD_5,
	WORLD_6,
	WORLD_7,
} from "../../../sources/news/articles/source-lists/world";
import { US_LIVE, US_VIDEO, US_VIDEO_2 } from "../../../sources/news/videos/us";
import {
	WORLD_LIVE,
	WORLD_VIDEO,
	WORLD_VIDEO_2,
} from "../../../sources/news/videos/world";
import { staggerMinutes, staggerSeconds } from "../create-cron";
import { CronConfig } from "../types";
import { fetchRSS, fetchYoutubeRSS } from "./utils";

// live videos - or 24 hour streams don't need to be fetched regularly at all.
const live_videos = [US_LIVE, WORLD_LIVE];
const videos1 = [US_VIDEO, WORLD_VIDEO];
const videos2 = [US_VIDEO_2, WORLD_VIDEO_2];
const videos = [...videos1, ...videos2, ...live_videos];

const us_articles_1 = [US_1, US_2];
const us_articles_2 = [US_3, US_4, US_5];
const world_articles_1 = [WORLD_1, WORLD_2];
const world_articles_2 = [WORLD_3, WORLD_4, WORLD_5];
const world_articles_3 = [WORLD_5, WORLD_6, WORLD_7];

const newYorkArticles = [NEW_YORK_ARTICLES];
const newYorkVideos = [NEW_YORK_VIDEOS];
const floridaArticles = [FLORIDA_ARTICLES];
const floridaVideos = [FLORIDA_VIDEOS];

// you could functionalise
// pass in cron, fetch, and complete
export const rssCronConfig: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		// {
		// 	time: staggerSeconds(30, 0),
		// 	fetchFn: fetchRSS(ukRegionsArticles),
		// 	onComplete: () => {},
		// },
		{
			time: staggerMinutes(15, 1),
			fetchFn: fetchRSS(us_articles_1),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 2),
			fetchFn: fetchRSS(us_articles_2),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 3),
			fetchFn: fetchRSS(world_articles_1),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 4),
			fetchFn: fetchRSS(world_articles_2),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 5),
			fetchFn: fetchRSS(world_articles_3),
			onComplete: () => {},
		},
		// Split
		{
			time: staggerMinutes(30, 10),
			fetchFn: fetchRSS(newYorkArticles),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(30, 11),
			fetchFn: fetchYoutubeRSS(newYorkVideos),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(30, 12),
			fetchFn: fetchRSS(floridaArticles),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(30, 13),
			fetchFn: fetchYoutubeRSS(floridaVideos),
			onComplete: () => {},
		},
		{
			time: staggerMinutes(15, 6),
			fetchFn: fetchYoutubeRSS(videos),
			onComplete: () => {},
		},
	],
};
