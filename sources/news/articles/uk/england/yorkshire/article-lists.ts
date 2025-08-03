import { yorkshireSources } from "./sources";

export const YORKSHIRE_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "England", "Yorkshire"],
	coverage: ["regional", "local"],
	language: "en",
	sources: [
		{
			name: yorkshireSources.LEEDS_LIVE,
			src: "https://www.leeds-live.co.uk/news/?service=rss",
			region: ["West Yorkshire", "Leeds"],
		},
		{
			name: yorkshireSources.YORKSHIRE_EVENING_POST,
			src: "https://www.yorkshireeveningpost.co.uk/news/rss",
			region: ["West Yorkshire", "Leeds"],
		},
		{
			name: yorkshireSources.YORK_PRESS,
			src: "https://www.yorkpress.co.uk/news/rss/",
			region: ["North Yorkshire", "York"],
		},
		{
			name: yorkshireSources.EXAMINER_LIVE,
			src: "https://www.examinerlive.co.uk/news/?service=rss",
			region: ["Huddersfield", "West Yorkshire"],
		},
		{
			name: yorkshireSources.KEIGHLY_NEWS,
			src: "https://www.keighleynews.co.uk/news/rss/",
			region: ["West Yorkshire", "Bradford", "Keighley"],
		},
		{
			name: yorkshireSources.ILKEY_GAZETTE,
			src: "https://www.ilkleygazette.co.uk/news/rss/",
			region: ["West Yorkshire", "Ilkley"],
		},
		{
			name: yorkshireSources.CRAVEN_HERALD,
			src: "https://www.cravenherald.co.uk/news/rss/",
			region: ["North Yorkshire", "Craven"],
		},
		{
			name: yorkshireSources.WHARFEDALE_OBSERVER,
			src: "https://www.wharfedaleobserver.co.uk/news/rss/",
			region: ["West Yorkshire", "Wharfedale"],
		},
		{
			name: yorkshireSources.BRADFORD_TELEGRAPH_AND_ARGUS,
			src: "https://www.thetelegraphandargus.co.uk/news/rss/",
			region: ["West Yorkshire", "Bradford"],
		},
		{
			name: yorkshireSources.YORKSHIRE_POST,
			src: "https://www.yorkshirepost.co.uk/news/rss",
		},
		{
			name: yorkshireSources.BBC,
			src: "https://feeds.bbci.co.uk/news/england/west_yorkshire/rss.xml",
			region: ["West Yorkshire"],
		},
		{
			name: yorkshireSources.BBC,
			src: "https://feeds.bbci.co.uk/news/england/bradford/rss.xml",
			region: ["West Yorkshire", "Bradford"],
		},
		{
			name: yorkshireSources.BBC,
			src: "https://www.bbc.co.uk/news/england/hull_and_east_yorkshire/rss.xml",
			region: ["East Yorkshire", "Hull"],
		},
		{
			name: yorkshireSources.BBC,
			src: "https://www.bbc.co.uk/news/england/north_yorkshire/rss.xml",
			region: ["North Yorkshire"],
		},
		{
			name: yorkshireSources.BBC,
			src: "https://www.bbc.co.uk/news/england/south_yorkshire/rss.xml",
			region: ["South Yorkshire"],
		},
		{
			name: yorkshireSources.HULL_LIVE,
			src: "https://www.hulldailymail.co.uk/news/?service=rss",
			region: ["East Yorkshire", "Hull"],
		},
		{
			name: yorkshireSources.WHERE_IN_HULL,
			src: "https://www.whereinhull.com/feed/",
			region: ["East Yorkshire", "Hull"],
		},
	],
};
