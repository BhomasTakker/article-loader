// For add-article-loader-sources-list-to-db.ts
import {
	BITES_UK,
	NEWS_UK_1 as AUDIO_NEWS_UK_1,
	NEWS_UK_2 as AUDIO_NEWS_UK_2,
} from "../sources/audio/podbean/news/uk";
import {
	BITES_US,
	NEWS_US_1 as AUDIO_NEWS_US_1,
	NEWS_US_2 as AUDIO_NEWS_US_2,
	NEWS_US_3 as AUDIO_NEWS_US_3,
	NEWS_US_4 as AUDIO_NEWS_US_4,
} from "../sources/audio/podbean/news/us";
import {
	BITES_WORLD,
	NEWS_WORLD_1 as AUDIO_NEWS_WORLD_1,
	NEWS_WORLD_2 as AUDIO_NEWS_WORLD_2,
} from "../sources/audio/podbean/news/world";
import { UK_LIVE, UK_VIDEO, UK_VIDEO_2 } from "../sources/news/videos/uk";
import { US_LIVE, US_VIDEO, US_VIDEO_2 } from "../sources/news/videos/us";
import {
	WORLD_LIVE,
	WORLD_VIDEO,
	WORLD_VIDEO_2,
} from "../sources/news/videos/world";
import { FLORIDA_VIDEOS } from "../sources/news/articles/united-states/florida";
import { NEW_YORK_VIDEOS } from "../sources/news/articles/united-states/new-york";
import { WASHINGTON_VIDEOS } from "../sources/news/articles/united-states/washington";
import { BIRMINGHAM_VIDEO_SOURCES } from "../sources/news/articles/uk/england/birmingham";
import { LIVERPOOL_VIDEO_SOURCES } from "../sources/news/articles/uk/england/liverpool";
import { MANCHESTER_VIDEO_SOURCES } from "../sources/news/articles/uk/england/manchester/video-list";
import { northernIrelandVideoSources } from "../sources/news/articles/uk/northern-ireland/article-list";
import { SCOTLAND_VIDEO_SOURCES } from "../sources/news/articles/uk/scotland/articles-list";
import { WALES_VIDEO_SOURCES } from "../sources/news/articles/uk/wales/articles-list";
import { COLORADO_ARTICLES } from "../sources/news/articles/united-states/colorado";
import { FLORIDA_ARTICLES } from "../sources/news/articles/united-states/florida";
import { NEW_YORK_ARTICLES } from "../sources/news/articles/united-states/new-york";
import { WASHINGTON_ARTICLES } from "../sources/news/articles/united-states/washington";
import {
	ukNationalArticles1,
	ukNationalArticles2,
	ukRegionalArticles,
	ukRegionalArticles2,
} from "../sources/news/articles/uk/national/article-lists";
import { NORTHERN_IRELAND_ARTICLE_SOURCES } from "../sources/news/articles/uk/northern-ireland/article-list";
import { SCOTLAND_ARTICLE_SOURCES } from "../sources/news/articles/uk/scotland/articles-list";
import { EDINBURGH_SOURCES } from "../sources/news/articles/uk/scotland/edinburgh/article-lists";
import { GLASGOW_SOURCES } from "../sources/news/articles/uk/scotland/glasgow/article-list";
import { WALES_ARTICLE_SOURCES } from "../sources/news/articles/uk/wales/articles-list";
import {
	ENGLAND_ARTICLE_SOURCES,
	englandNorthWestArticlesSourceList,
	englandMidlandsArticlesSourceList,
} from "../sources/news/articles/uk/england/articles-list";
import { BIRMINGHAM_ARTICLE_SOURCES } from "../sources/news/articles/uk/england/birmingham/article-lists";
import { LIVERPOOL_ARTICLE_SOURCES } from "../sources/news/articles/uk/england/liverpool/article-lists";
import { MANCHESTER_SOURCES } from "../sources/news/articles/uk/england/manchester/article-list";
import { YORKSHIRE_ARTICLE_SOURCES } from "../sources/news/articles/uk/england/yorkshire/article-lists";
import {
	US_1,
	US_2,
	US_3,
	US_4,
	US_5,
} from "../sources/news/articles/source-lists/us";
import {
	WORLD_1,
	WORLD_2,
	WORLD_3,
	WORLD_4,
	WORLD_5,
	WORLD_6,
	WORLD_7,
} from "../sources/news/articles/source-lists/world";

export const audioSourceLists = [
	{ list: BITES_UK, title: "UK News Bites" },
	{ list: AUDIO_NEWS_UK_1, title: "UK News Audio 1" },
	{ list: AUDIO_NEWS_UK_2, title: "UK News Audio 2" },
	{ list: BITES_US, title: "US News Bites" },
	{ list: AUDIO_NEWS_US_1, title: "US News Audio 1" },
	{ list: AUDIO_NEWS_US_2, title: "US News Audio 2" },
	{ list: AUDIO_NEWS_US_3, title: "US News Audio 3" },
	{ list: AUDIO_NEWS_US_4, title: "US News Audio 4" },
	{ list: BITES_WORLD, title: "World News Bites" },
	{ list: AUDIO_NEWS_WORLD_1, title: "World News Audio 1" },
	{ list: AUDIO_NEWS_WORLD_2, title: "World News Audio 2" },
];

export const videoSourceLists = [
	{ list: UK_LIVE, title: "UK Live Video" },
	{ list: UK_VIDEO, title: "UK Video News" },
	{ list: UK_VIDEO_2, title: "UK Video News 2" },
	{ list: US_LIVE, title: "US Live Video" },
	{ list: US_VIDEO, title: "US Video News" },
	{ list: US_VIDEO_2, title: "US Video News 2" },
	{ list: WORLD_LIVE, title: "World Live Video" },
	{ list: WORLD_VIDEO, title: "World Video News" },
	{ list: WORLD_VIDEO_2, title: "World Video News 2" },
	{ list: FLORIDA_VIDEOS, title: "Florida Video News" },
	{ list: NEW_YORK_VIDEOS, title: "New York Video News" },
	{ list: WASHINGTON_VIDEOS, title: "Washington Video News" },
	{ list: BIRMINGHAM_VIDEO_SOURCES, title: "Birmingham Video News" },
	{ list: LIVERPOOL_VIDEO_SOURCES, title: "Liverpool Video News" },
	{ list: MANCHESTER_VIDEO_SOURCES, title: "Manchester Video News" },
	{ list: northernIrelandVideoSources, title: "Northern Ireland Video News" },
	{ list: SCOTLAND_VIDEO_SOURCES, title: "Scotland Video News" },
	{ list: WALES_VIDEO_SOURCES, title: "Wales Video News" },
];

export const articleSourceLists = [
	// UK National
	...ukNationalArticles1.map((list, i) => ({
		list,
		title: `UK National Articles ${i + 1}`,
	})),
	// UK Regional - Nations
	{
		list: NORTHERN_IRELAND_ARTICLE_SOURCES,
		title: "Northern Ireland Articles",
	},
	{ list: SCOTLAND_ARTICLE_SOURCES, title: "Scotland Articles" },
	{ list: WALES_ARTICLE_SOURCES, title: "Wales Articles" },
	// UK Regional - England
	{ list: ENGLAND_ARTICLE_SOURCES, title: "England Articles" },
	{ list: BIRMINGHAM_ARTICLE_SOURCES, title: "Birmingham Articles" },
	{ list: LIVERPOOL_ARTICLE_SOURCES, title: "Liverpool Articles" },
	{ list: MANCHESTER_SOURCES, title: "Manchester Articles" },
	{ list: YORKSHIRE_ARTICLE_SOURCES, title: "Yorkshire Articles" },
	// Scotland Cities
	{ list: EDINBURGH_SOURCES, title: "Edinburgh Articles" },
	{ list: GLASGOW_SOURCES, title: "Glasgow Articles" },
	// US National
	{ list: US_1, title: "US National Articles 1" },
	{ list: US_2, title: "US National Articles 2" },
	{ list: US_3, title: "US National Articles 3" },
	{ list: US_4, title: "US National Articles 4" },
	{ list: US_5, title: "US National Articles 5" },
	// US States
	{ list: COLORADO_ARTICLES, title: "Colorado Articles" },
	{ list: FLORIDA_ARTICLES, title: "Florida Articles" },
	{ list: NEW_YORK_ARTICLES, title: "New York Articles" },
	{ list: WASHINGTON_ARTICLES, title: "Washington Articles" },
	// World
	{ list: WORLD_1, title: "World Articles 1" },
	{ list: WORLD_2, title: "World Articles 2" },
	{ list: WORLD_3, title: "World Articles 3" },
	{ list: WORLD_4, title: "World Articles 4" },
	{ list: WORLD_5, title: "World Articles 5" },
	{ list: WORLD_6, title: "World Articles 6" },
	{ list: WORLD_7, title: "World Articles 7" },
];
