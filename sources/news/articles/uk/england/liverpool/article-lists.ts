import { liverpoolUKSources } from "./sources";

export const LIVERPOOL_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "England", "North West", "Merseyside", "Liverpool"],
	coverage: ["local"],
	language: "en",
	sources: [
		{
			name: liverpoolUKSources.LIVERPOOL_ECHO,
			src: "https://www.liverpoolecho.co.uk/news/?service=rss",
		},
		{
			name: liverpoolUKSources.LIVERPOOL_EXPRESS,
			src: "https://liverpoolexpress.co.uk/feed/",
		},
		{
			name: liverpoolUKSources.LIVERPOOL_WORLD,
			src: "https://www.liverpoolworld.uk/rss",
		},
		{
			name: liverpoolUKSources.LIVERPOOL_POST,
			src: "https://www.livpost.co.uk/rss/",
		},
		{
			name: liverpoolUKSources.MERSEYSIDE_POLICE,
			src: "https://www.merseyside.police.uk/news/merseyside/news/GetNewsRss/",
		},
		{
			name: liverpoolUKSources.BBC,
			coverage: ["regional", "local"],
			src: "https://feeds.bbci.co.uk/news/england/merseyside/rss.xml",
		},
	],
};

export const LIVERPOOL_VIDEO_SOURCES = {
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
			name: liverpoolUKSources.LIVERPOOL_ECHO,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCoNQiV6DYBWMP2kggpzc87A",
		},
	],
};
