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
import { fetchPodcasts } from "../loaders/fetchPodcasts";

export const podcastRssCronConfig = {
	id: "News",
	anyCommandsRequired: {},
	cron: [
		{
			time: "0,15,30,45 * * * *",
			fetchFn: fetchPodcasts([BITES_UK]),
			onComplete: () => {},
		},
		{
			time: "1,16,31,46 * * * *",
			fetchFn: fetchPodcasts([BITES_US]),
			onComplete: () => {},
		},
		{
			time: "2,17,32,47 * * * *",
			fetchFn: fetchPodcasts([BITES_WORLD]),
			onComplete: () => {},
		},
		{
			time: "3 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_UK_1]),
			onComplete: () => {},
		},
		{
			time: "4 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_UK_2]),
			onComplete: () => {},
		},
		{
			time: "5 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_1]),
			onComplete: () => {},
		},
		{
			time: "6 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_2]),
			onComplete: () => {},
		},
		{
			time: "7 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_3]),
			onComplete: () => {},
		},
		{
			time: "8 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_US_4]),
			onComplete: () => {},
		},
		{
			time: "9 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_WORLD_1]),
			onComplete: () => {},
		},
		{
			time: "10 */6 * * *",
			fetchFn: fetchPodcasts([NEWS_WORLD_2]),
			onComplete: () => {},
		},
	],
};
