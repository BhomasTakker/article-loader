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
import { CRON_TIMES } from "./create-cron";
import { fetchPodcasts } from "./loaders/fetchPodcasts";

export const testConfig = {
	id: "News Bites",
	anyCommandsRequired: {},
	cron: [
		{
			time: CRON_TIMES.seconds_30,
			fetchFn: fetchPodcasts([NEWS_US_1]),
			onComplete: () => {},
		},
	],
};
