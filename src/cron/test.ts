import {
	BITES_UK,
	NEWS_UK_1,
	NEWS_UK_2,
} from "../../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1,
	NEWS_US_2,
	NEWS_US_3,
	NEWS_US_4,
} from "../../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD_1,
	NEWS_WORLD_2,
} from "../../sources/audio/podbean/news/world";
import { staggerSeconds } from "./cron-times";
import { fetchPodcasts } from "./loaders/fetchPodcasts";

const fetchPodcastsTest = () => {
	return fetchPodcasts([BITES_UK]);
};

const testFunction = () => {
	console.log("TEST FUNCTION TRIGGERED");
	return Promise.resolve();
};

export const testConfig = {
	id: "Test Function",
	anyCommandsRequired: {},
	cron: [
		{
			time: staggerSeconds(30, 0),
			fetchFn: testFunction,
			onComplete: () => {},
		},
	],
};
