import { NewsSources } from "../../../sources";
import { walesSources } from "./sources";

export const WALES_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "Wales"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: walesSources.WALES_ONLINE,
			src: "https://www.walesonline.co.uk/news/?service=rss",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.HERALD_WALES,
			src: "https://herald.wales/feed/",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.POWYS_COUNTY_TIMES,
			coverage: ["local"],
			src: "https://www.countytimes.co.uk/news/rss/",
			region: ["Central", "Powys"],
		},
		{
			name: walesSources.WALES_247,
			src: "https://www.wales247.co.uk/feed",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.NATION_CYMRU,
			src: "https://nation.cymru/category/news/feed/",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.NORTH_WALES_LIVE,
			src: "https://www.dailypost.co.uk/news/?service=rss",
			region: ["North"],
			coverage: ["local"],
		},
		{
			name: walesSources.SOUTH_WALES_GUARDIAN,
			src: "https://www.southwalesguardian.co.uk/news/rss/",
			region: ["South"],
			coverage: ["local"],
		},
		{
			name: walesSources.SOUTH_WALES_ARGUS,
			src: "https://www.southwalesargus.co.uk/news/crime/rss/",
			region: ["South"],
			coverage: ["local"],
		},
		{
			name: walesSources.BBC,
			src: "https://feeds.bbci.co.uk/news/wales/rss.xml",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.THE_CARDIFF_POST,
			src: "https://www.thecardiffpost.co.uk/newspage?format=rss",
			region: ["Cardiff"],
			coverage: ["local"],
		},
		{
			name: walesSources.THE_PENARTH_TIMES,
			src: "https://www.penarthtimes.co.uk/news/rss/",
			region: ["Cardiff", "Penarth"],
			coverage: ["local"],
		},
		{
			name: walesSources.SWANSEA_BAY_NEWS,
			src: "https://swanseabaynews.com/feed/",
			region: ["Swansea"],
			coverage: ["local"],
		},
	],
};

export const WALES_VIDEO_SOURCES = {
	categories: ["news"],
	region: ["UK", "Wales"],
	coverage: ["regional"],
	language: "en",
	sources: [
		{
			name: walesSources.WALES_ONLINE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8o7N2ieDWJyzsdnF6tAUmg",
			coverage: ["national", "regional"],
		},
		{
			name: walesSources.CARDIFF_TV,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCg1FauJswrbjLs94AtRhffg",
			coverage: ["local"],
			region: ["Cardiff"],
		},
	],
};
