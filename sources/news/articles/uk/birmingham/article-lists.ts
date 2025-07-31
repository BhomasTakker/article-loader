import { NewsSources } from "../../../sources";
import { birminghamUKSources } from "./sources";

export const BIRMINGHAM_ARTICLE_SOURCES = {
	categories: ["news"],
	region: [
		"Europe",
		"UK",
		"England",
		"West Midlands",
		"Black Country",
		"Birmingham",
	],
	coverage: ["local"],
	language: "en",
	sources: [
		{
			name: birminghamUKSources.BIRMINGHAM_LIVE,
			src: "https://www.birminghammail.co.uk/news/?service=rss",
		},
		{
			name: birminghamUKSources.BIRMINGHAM_WORLD,
			src: "https://www.birminghamworld.uk/news/rss",
		},
		{
			name: birminghamUKSources.BIRMINGHAM_MAGAZINE,
			src: "https://birminghammagazine.co.uk/feed/",
		},
		{
			name: birminghamUKSources.BIRMINGHAM_TIMES,
			src: "https://birminghamtimes.co.uk/feed/",
		},
		{
			name: birminghamUKSources.I_AM_BIRMINGHAM,
			src: "https://www.iambirmingham.co.uk/feed/",
		},
		{
			name: NewsSources.BBC,
			coverage: ["regional", "local"],
			src: "https://feeds.bbci.co.uk/news/england/birmingham_and_black_country/rss.xml",
		},
	],
};

export const BIRMINGHAM_VIDEO_SOURCES = {
	categories: ["news"],
	region: [
		"Europe",
		"UK",
		"England",
		"West Midlands",
		"Black Country",
		"Birmingham",
	],
	coverage: ["local"],
	sources: [
		{
			name: birminghamUKSources.BIRMINGHAM_TV,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCqsc6KiXiYwVvqeSETkENmg",
		},
		{
			name: birminghamUKSources.BIRMINGHAM_LIVE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXtdkietOoj4BrTOGQfXp6g",
		},
	],
};
