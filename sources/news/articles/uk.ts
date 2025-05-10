import { NewsSources } from "../sources";

export const TEST = {
	categories: [],
	collectionType: "news",
	region: "UK",
	language: "en",
	sources: [
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
		},
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/topics/cmj34zmwm1zt/rss.xml",
		},
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/world/australia/rss.xml",
		},
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
		},
	],
};

export const UK_1 = {
	categories: [],
	collectionType: "news",
	region: "UK",
	language: "en",
	sources: [
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/uk/rss.xml",
		},
		{
			name: NewsSources.GUARDIAN,
			src: "https://www.theguardian.com/uk/rss",
		},
		{
			name: NewsSources.TELEGRAPH,
			src: "https://www.telegraph.co.uk/rss.xml",
		},
		{
			name: NewsSources.MIRROR,
			src: "https://www.mirror.co.uk/news/?service=rss",
		},
		{
			name: NewsSources.DAILY_MAIL,
			src: "https://www.dailymail.co.uk/news/index.rss",
		},
		{
			name: NewsSources.METRO,
			src: "https://metro.co.uk/news/uk/feed/",
		},
		{
			name: NewsSources.EVENING_STANDARD,
			src: "https://www.standard.co.uk/news/rss",
		},
		{
			name: NewsSources.SUN,
			src: "https://www.thesun.co.uk/news/uknews/feed/",
		},
		{
			name: NewsSources.SKY,
			src: "https://feeds.skynews.com/feeds/rss/uk.xml",
		},
		{
			name: NewsSources.INDEPENDENT,
			src: "https://www.independent.co.uk/news/uk/rss",
		},
		{
			name: NewsSources.HUFFPOST,
			src: "https://www.huffingtonpost.co.uk/feeds/index.xml",
		},
	],
};

export const UK_2 = {
	categories: [],
	collectionType: "news",
	region: "UK",
	language: "en",
	sources: [
		{
			name: NewsSources.DAILY_RECORD,
			src: "https://www.dailyrecord.co.uk/news/?service=rss",
		},
		{
			name: NewsSources.POLITICS_CO_UK,
			src: "https://www.politics.co.uk/feed/",
		},
		{
			name: NewsSources.THE_CONVERSATION,
			src: "https://theconversation.com/uk/articles.atom",
		},
		{
			name: NewsSources.MANCHESTER_EVENING_NEWS,
			src: "https://www.manchestereveningnews.co.uk/news/?service=rss",
		},
		{
			name: NewsSources.BIRMINGHAME_LIVE,
			// src: 'https://www.birminghammail.co.uk/news/?service=rss',
			src: "https://www.birminghammail.co.uk/news/uk-news/?service=rss",
		},
		{
			name: NewsSources.THE_PINK_NEWS,
			src: "https://www.thepinknews.com/news/uk/feed/",
		},
		{
			name: NewsSources.NORTHERN_IRELAND_WORLD,
			src: "https://www.northernirelandworld.com/news/rss",
		},
		{
			name: NewsSources.WALES_ONLINE,
			src: "https://www.walesonline.co.uk/news/?service=rss",
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/national-news/rss/",
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/rss/",
		},
		{
			name: NewsSources.GB_NEWS,
			src: "https://www.gbnews.com/feeds/news/uk.rss",
		},
	],
};

export const UK_3 = {
	categories: [],
	collectionType: "news",
	region: "UK",
	language: "en",
	sources: [
		{
			name: NewsSources.DECLASSIFIED,
			src: "https://www.declassifieduk.org/feed/",
		},
		{
			name: NewsSources.NOVARA,
			src: "https://novaramedia.com/feed/",
		},
		{
			name: NewsSources.BYLINE_TIMES,
			src: "https://bylinetimes.com/feed/",
		},
		{
			name: NewsSources.COUNCIL_ESTATE_MEDIA,
			src: "https://www.councilestatemedia.uk/feed",
		},
		{
			name: NewsSources.OWEN_JONES,
			src: "https://www.owenjones.news/feed",
		},
	],
};
