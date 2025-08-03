import { scotlandSources } from "./sources";

export const SCOTLAND_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "Scotland"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: scotlandSources.DAILY_RECORD,
			src: "https://www.dailyrecord.co.uk/news/?service=rss",
		},
		{
			name: scotlandSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/national-news/rss/",
		},
		{
			name: scotlandSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/rss/",
		},
		{
			name: scotlandSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/investigations/rss/",
			categories: ["investigations"],
		},
		{
			name: scotlandSources.STV,
			src: "https://news.stv.tv/section/scotland/feed",
		},
		{
			name: scotlandSources.THE_SCOTSMAN,
			src: "https://www.scotsman.com/news/rss",
		},
		{
			name: scotlandSources.THE_NATIONAL,
			src: "https://www.thenational.scot/news/rss/",
		},
		{
			name: scotlandSources.BBC,
			src: "https://feeds.bbci.co.uk/news/scotland/rss.xml",
		},
		{
			name: scotlandSources.THE_SCOTTISH_SUN,
			src: "https://www.thescottishsun.co.uk/feed/",
		},
	],
};

export const SCOTLAND_VIDEO_SOURCES = {
	categories: ["news"],
	region: ["UK", "Scotland"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: scotlandSources.STV,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCtHWi_Mwj_Bu7TT1SjaI5Gw",
			coverage: ["national", "regional"],
		},
		{
			name: scotlandSources.THE_SCOTTISH_SUN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCGsWuDobZsVhzuotDmyxmYg",
		},
		{
			name: scotlandSources.DAILY_RECORD,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC6B3kmCZJc7YMG-948t6M7w",
			coverage: ["national", "regional"],
		},
	],
};
