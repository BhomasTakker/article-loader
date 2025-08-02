import { NewsSources } from "../../../../sources";
import { edinburghSources } from "./sources";

export const EDINBURGH_SOURCES = {
	categories: ["news"],
	region: ["UK", "Scotland", "East", "Edinburgh"],
	coverage: ["local"],
	sources: [
		{
			name: edinburghSources.EDINBURGH_LIVE,
			src: "https://www.edinburghlive.co.uk/news/edinburgh-news/?service=rss",
		},
		{
			name: NewsSources.THE_SCOTSMAN,
			src: "https://www.edinburghnews.scotsman.com/rss",
		},
		{
			name: edinburghSources.EDINBURGH_REPORTER,
			src: "https://theedinburghreporter.co.uk/feed/",
		},
		{
			name: NewsSources.BBC,
			coverage: ["region", "local"],
			src: "https://feeds.bbci.co.uk/news/scotland/edinburgh_east_and_fife/rss.xml",
		},
	],
};
