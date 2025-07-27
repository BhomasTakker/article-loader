import { NewsSources } from "../../sources";

export const washingtonSources = {
	KING5: "King 5",
	KOMO: "KOMO",
};

const king5 = {
	origin: "US",
	name: "King5",
	description: "King5 is a local news outlet in Seattle, WA.",
	url: "https://www.king5.com/",
	logo: "https://www.king5.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const komo = {
	origin: "US",
	name: "KOMO",
	description: "KOMO is a local news outlet in Seattle, WA.",
	url: "https://komonews.com/",
	logo: "https://komonews.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const washingtonSourceMap = new Map([
	[washingtonSources.KING5, king5],
	[washingtonSources.KOMO, komo],
]);

export const WASHINGTON_ARTICLES = {
	categories: ["news"],
	collectionType: "news",
	region: ["North America", "US", "Washington"],
	coverage: ["regional", "local"],
	sources: [],
};

export const WASHINGTON_VIDEOS = {
	categories: ["news"],
	collectionType: "news",
	region: ["North America", "US", "Washington"],
	coverage: ["regional"],
	sources: [
		{
			name: washingtonSources.KING5,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCp1KrVaZDZ7BOI_QBuTWWmg",
			coverage: ["regional", "local"],
			region: ["Seattle"],
		},
		{
			name: washingtonSources.KOMO,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC__2_0RJ8XnHt2angfw6S1Q",
			coverage: ["regional", "local"],
			region: ["Seattle"],
		},
	],
};
