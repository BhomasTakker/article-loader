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

const audioSourceLists = [
	BITES_UK,
	AUDIO_NEWS_UK_1,
	AUDIO_NEWS_UK_2,
	BITES_US,
	AUDIO_NEWS_US_1,
	AUDIO_NEWS_US_2,
	AUDIO_NEWS_US_3,
	AUDIO_NEWS_US_4,
	BITES_WORLD,
	AUDIO_NEWS_WORLD_1,
	AUDIO_NEWS_WORLD_2,
];

const videoSourceLists = [
	UK_LIVE,
	UK_VIDEO,
	UK_VIDEO_2,
	US_LIVE,
	US_VIDEO,
	US_VIDEO_2,
	WORLD_LIVE,
	WORLD_VIDEO,
	WORLD_VIDEO_2,
	FLORIDA_VIDEOS,
	NEW_YORK_VIDEOS,
	WASHINGTON_VIDEOS,
	BIRMINGHAM_VIDEO_SOURCES,
	LIVERPOOL_VIDEO_SOURCES,
	MANCHESTER_VIDEO_SOURCES,
	northernIrelandVideoSources,
	SCOTLAND_VIDEO_SOURCES,
	WALES_VIDEO_SOURCES,
];

const articleSourceLists = [
	// UK National
	...ukNationalArticles1,
	...ukNationalArticles2,
	// UK Regional - Nations
	NORTHERN_IRELAND_ARTICLE_SOURCES,
	SCOTLAND_ARTICLE_SOURCES,
	WALES_ARTICLE_SOURCES,
	// UK Regional - England
	ENGLAND_ARTICLE_SOURCES,
	...ukRegionalArticles,
	...ukRegionalArticles2,
	...englandNorthWestArticlesSourceList,
	...englandMidlandsArticlesSourceList,
	BIRMINGHAM_ARTICLE_SOURCES,
	LIVERPOOL_ARTICLE_SOURCES,
	MANCHESTER_SOURCES,
	YORKSHIRE_ARTICLE_SOURCES,
	// Scotland Cities
	EDINBURGH_SOURCES,
	GLASGOW_SOURCES,
	// US National
	US_1,
	US_2,
	US_3,
	US_4,
	US_5,
	// US States
	COLORADO_ARTICLES,
	FLORIDA_ARTICLES,
	NEW_YORK_ARTICLES,
	WASHINGTON_ARTICLES,
	// World
	WORLD_1,
	WORLD_2,
	WORLD_3,
	WORLD_4,
	WORLD_5,
	WORLD_6,
	WORLD_7,
];
