import { NewsSources } from "../../../../sources";
import { manchesterUKSources } from "./sources";

export const MANCHESTER_SOURCES = {
	// better nesting
	categories: ["news"],
	region: ["UK", "England", "North West", "Manchester"],
	coverage: ["local"],
	language: "en",
	sources: [
		{
			name: manchesterUKSources.MANCHESTER_EVENING_NEWS,
			src: "https://www.manchestereveningnews.co.uk/news/?service=rss",
		},
		{
			name: manchesterUKSources.MANCHESTER_MILL,
			src: "https://manchestermill.co.uk/rss/",
		},
		{
			name: manchesterUKSources.MANCHESTER_MAGAZINE,
			src: "https://manchestermagazine.co.uk/feed/",
		},
		{
			name: manchesterUKSources.MANCHESTER_WORLD,
			src: "https://www.manchesterworld.uk/news/rss",
		},
		{
			name: manchesterUKSources.MANCHESTER_CITY_COUNCIL,
			src: "https://www.manchester.gov.uk/rss/news",
		},
		{
			name: manchesterUKSources.BBC,
			src: "https://feeds.bbci.co.uk/news/england/manchester/rss.xml",
		},
		{
			name: manchesterUKSources.MANCHESTER_ABOUT,
			src: "https://aboutmanchester.co.uk/feed/",
		},
	],
};
