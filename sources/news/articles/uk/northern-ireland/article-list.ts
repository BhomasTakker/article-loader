import { northernIrelandSources } from "./sources";

export const NORTHERN_IRELAND_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "NI"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: northernIrelandSources.NORTHERN_IRELAND_WORLD,
			src: "https://www.northernirelandworld.com/rss",
			region: ["UK", "NI"],
			coverage: ["regional"],
		},
		{
			name: northernIrelandSources.THE_IRISH_NEWS,
			src: "https://www.irishnews.com/arc/outboundfeeds/rss/",
			region: ["UK", "NI"],
			coverage: ["regional"],
		},
		{
			name: northernIrelandSources.BELFAST_LIVE,
			src: "https://www.belfastlive.co.uk/news/?service=rss",
			region: ["UK", "NI"],
			coverage: ["national", "regional"],
		},
		{
			name: northernIrelandSources.BELFAST_LIVE,
			src: "https://www.belfastlive.co.uk/news/belfast-news/?service=rss",
			region: ["UK", "NI", "Belfast"],
			coverage: ["regional", "local"],
		},
		{
			name: northernIrelandSources.BBC,
			src: "https://feeds.bbci.co.uk/news/northern_ireland/rss.xml",
		},
	],
};

export const northernIrelandVideoSources = {
	categories: ["news"],
	region: ["UK", "NI"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: northernIrelandSources.BELFAST_LIVE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPi8u-XgLfuD52rT2m85sUw",
			coverage: ["national", "regional", "local"],
		},
		{
			name: northernIrelandSources.UTV,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCBM06gTNsYKeyuAXIhIUW9Q",
			coverage: ["national", "regional"],
		},
	],
};
