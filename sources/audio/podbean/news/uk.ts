import { NewsSources } from "../../../news/sources";

export const BITES_UK = {
	categories: ["news"],
	region: ["UK"],
	coverage: ["international", "national"],
	language: "en",
	sources: [
		{
			// upto 5 per day - 5 minutes
			collectionTitle: "SKY News Bulletins",
			name: NewsSources.SKY,
			src: "http://a.365dm.com/api/apple/v1/audio/news-bulletin",
		},
		{
			collectionTitle: "Times News Briefing",
			name: NewsSources.TIMES,
			// src: "http://a.365dm.com/api/apple/v1/audio/news-bulletin",
			src: "https://feeds.acast.com/public/shows/c5cdab6e-7ef4-4562-b081-71f44a5b9533",
		},
		{
			collectionTitle: "The Daily Briefing",
			name: NewsSources.TLDR,
			src: "https://rss.art19.com/the-daily-briefing",
		},
	],
};

export const NEWS_UK_1 = {
	categories: ["news"],
	region: ["UK"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			// 10 minutes
			name: "UK News Daily",
			collectionTitle: "UK News Daily",
			src: "https://feeds.transistor.fm/uk-news",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Newshour",
			coverage: ["international", "national"],
			src: "https://podcasts.files.bbci.co.uk/p002vsnk.rss",
		},
		{
			name: NewsSources.SKY,
			collectionTitle: "Sky News Daily",
			coverage: ["international", "national"],
			src: "https://podcast.global.com/show/3287246/episodes/feed",
		},
		{
			name: "The News Agents",
			collectionTitle: "The News Agents",
			src: "https://feeds.captivate.fm/the-news-agents/",
		},
		{
			name: NewsSources.GUARDIAN,
			collectionTitle: "Today In Focus",
			coverage: ["international", "national"],
			src: "https://www.theguardian.com/news/series/todayinfocus/podcast.xml",
		},
		{
			name: NewsSources.COUNCIL_ESTATE_MEDIA,
			collectionTitle: "Socialist Voices",
			src: "https://api.substack.com/feed/podcast/1336368/s/172019.rss",
		},
	],
};

export const NEWS_UK_2 = {
	categories: ["news"],
	region: ["UK"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: "The Rest is Politics",
			collectionTitle: "The Rest is Politics",
			src: "https://feeds.megaphone.fm/GLT9190936013",
		},
		{
			name: NewsSources.FT,
			collectionTitle: "FT News Briefing",
			coverage: ["international", "national"],
			src: "https://feeds.acast.com/public/shows/73fe3ede-5c5c-4850-96a8-30db8dbae8bf",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Six O'Clock News",
			coverage: ["international", "national"],
			src: "https://podcasts.files.bbci.co.uk/b006qjxt.rss",
		},
		{
			name: NewsSources.METRO,
			collectionTitle: "The Smart 7",
			coverage: ["international", "national"],
			src: "https://feeds.acast.com/public/shows/35d3734f-1e29-4d0b-a646-15776be08249",
		},
		{
			name: NewsSources.NOVARA,
			collectionTitle: "Novara Media",
			src: "https://feeds.podcastmirror.com/novara-media",
		},
		{
			name: NewsSources.CHANNEL_4,
			collectionTitle: "The Fourcast",
			coverage: ["international", "national"],
			src: "https://thefourcast.libsyn.com/rss",
		},
		{
			name: NewsSources.OWEN_JONES,
			collectionTitle: "The Owen Jones Podcast",
			src: "https://feeds.acast.com/public/shows/c94a5041-3d43-419a-9d17-a557fb51e056",
		},
	],
};
