import { NewsSources } from "../../../sources";
import {
	BIRMINGHAM_ARTICLE_SOURCES,
	BIRMINGHAM_VIDEO_SOURCES,
} from "../england/birmingham";
import {
	LIVERPOOL_ARTICLE_SOURCES,
	LIVERPOOL_VIDEO_SOURCES,
} from "../england/liverpool";
import { MANCHESTER_SOURCES } from "../england/manchester/article-list";
import { MANCHESTER_VIDEO_SOURCES } from "../england/manchester/video-list";
import { YORKSHIRE_ARTICLE_SOURCES } from "../england/yorkshire";
import { NORTHERN_IRELAND_ARTICLE_SOURCES } from "../northern-ireland/article-list";
import { SCOTLAND_ARTICLE_SOURCES } from "../scotland";
import { WALES_ARTICLE_SOURCES } from "../wales";
import { UK_LIVE, UK_VIDEO, UK_VIDEO_2 } from "./video-lists";

const UK_1 = {
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

const UK_2 = {
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
	language: "en",
	sources: [
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
			name: NewsSources.GB_NEWS,
			src: "https://www.gbnews.com/feeds/news/uk.rss",
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/national-news/rss/",
		},
	],
};

const UK_3 = {
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

export const ukNationalArticles1 = [UK_1, UK_2, UK_3];
export const ukNationalArticles2 = [
	SCOTLAND_ARTICLE_SOURCES,
	WALES_ARTICLE_SOURCES,
	NORTHERN_IRELAND_ARTICLE_SOURCES,
];

export const ukNationalVideos = [UK_VIDEO, UK_VIDEO_2];
export const ukLiveVideos = [UK_LIVE];

export const ukRegionalArticles = [
	MANCHESTER_SOURCES,
	LIVERPOOL_ARTICLE_SOURCES,
	BIRMINGHAM_ARTICLE_SOURCES,
];
export const ukRegionalArticles2 = [YORKSHIRE_ARTICLE_SOURCES];

export const ukRegionalVideos = [
	MANCHESTER_VIDEO_SOURCES,
	LIVERPOOL_VIDEO_SOURCES,
	BIRMINGHAM_VIDEO_SOURCES,
];
