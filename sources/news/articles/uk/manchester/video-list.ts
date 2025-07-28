import { manchesterUKSources } from "./sources";

export const MANCHESTER_VIDEO_SOURCES = {
	// better nesting
	categories: ["news"],
	region: ["Europe", "UK", "England", "North West", "Manchester"],
	coverage: ["local"],
	language: "en",
	sources: [
		{
			name: manchesterUKSources.MANCHESTER_EVENING_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPFSLlkwCqpy23jwYDwAPrg",
		},
	],
};
