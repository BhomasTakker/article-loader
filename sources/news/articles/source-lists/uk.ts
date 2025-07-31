import { NewsSources } from "../../sources";

// All news needs to be further categorized by international, continental, regional, national, sub-national, local.
// i.e. world news, European news, UK news, English news, London news, etc.
// Else local news will be in the same category as international news, etc.

export const TEST = {
	categories: ["news"],
	region: ["UK"],
	coverage: ["national"],
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
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
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
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
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
			name: NewsSources.THE_PINK_NEWS,
			src: "https://www.thepinknews.com/news/uk/feed/",
		},
		{
			name: NewsSources.NORTHERN_IRELAND_WORLD,
			src: "https://www.northernirelandworld.com/news/rss",
			region: ["UK", "NI"],
			coverage: ["regional"],
		},
		{
			name: NewsSources.WALES_ONLINE,
			src: "https://www.walesonline.co.uk/news/?service=rss",
			region: ["UK", "Wales"],
			coverage: ["regional"],
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/national-news/rss/",
			region: ["UK", "Scotland"],
			coverage: ["regional"],
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/rss/",
			coverage: ["regional"],
		},
		{
			name: NewsSources.GB_NEWS,
			src: "https://www.gbnews.com/feeds/news/uk.rss",
		},
	],
};

export const UK_3 = {
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
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
		{
			name: NewsSources.EXPRESS,
			src: "https://www.express.co.uk/posts/rss/1/uk",
		},
	],
};
