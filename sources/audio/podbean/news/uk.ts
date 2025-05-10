import { NewsSources } from "../../../news/sources";

export const BITES_UK = {
	categories: [],
	collectionType: "news",
	region: "UK",
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
	categories: [],
	collectionType: "news",
	region: "UK",
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
			src: "https://podcasts.files.bbci.co.uk/p002vsnk.rss",
		},
		{
			name: NewsSources.SKY,
			collectionTitle: "Sky News Daily",
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
			src: "https://www.theguardian.com/news/series/todayinfocus/podcast.xml",
		},
		{
			name: NewsSources.BBC,
			collectinTitle: "Diddy On Trial",
			src: "https://podcasts.files.bbci.co.uk/p0k61syt.rss",
		},
		{
			name: NewsSources.COUNCIL_ESTATE_MEDIA,
			collectionTitle: "Socialist Voices",
			src: "https://api.substack.com/feed/podcast/1336368/s/172019.rss",
		},
	],
};

export const NEWS_UK_2 = {
	categories: [],
	collectionType: "news",
	region: "UK",
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
			src: "https://feeds.acast.com/public/shows/73fe3ede-5c5c-4850-96a8-30db8dbae8bf",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Six O'Clock News",
			src: "https://podcasts.files.bbci.co.uk/b006qjxt.rss",
		},
		{
			name: NewsSources.METRO,
			collectionTitle: "The Smart 7",
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
			src: "https://thefourcast.libsyn.com/rss",
		},
	],
};
