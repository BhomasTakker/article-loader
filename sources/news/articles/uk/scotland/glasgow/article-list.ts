import { NewsSources } from "../../../../sources";
import { glasgowUKSources } from "./sources";

export const GLASGOW_SOURCES = {
	categories: ["news"],
	region: ["UK", "Scotland", "West", "Glasgow"],
	coverage: ["local"],
	sources: [
		{
			name: glasgowUKSources.GLASGOW_LIVE,
			src: "https://www.glasgowlive.co.uk/news/?service=rss",
		},
		{
			name: glasgowUKSources.GLASGOW_TIMES,
			src: "https://www.glasgowtimes.co.uk/news/rss/",
		},
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/scotland/glasgow_and_west/rss.xml",
		},
		{
			name: NewsSources.STV,
			src: "https://news.stv.tv/section/west-central/feed",
		},
	],
};
