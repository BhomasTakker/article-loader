// By regions North East, West, Midlands, etc
// This doesn't correlate to being able to spread sources etc

import {
	BIRMINGHAM_ARTICLE_SOURCES,
	BIRMINGHAM_VIDEO_SOURCES,
} from "./birmingham";
import {
	LIVERPOOL_ARTICLE_SOURCES,
	LIVERPOOL_VIDEO_SOURCES,
} from "./liverpool";
import { MANCHESTER_SOURCES } from "./manchester/article-list";
import { MANCHESTER_VIDEO_SOURCES } from "./manchester/video-list";

// unless you create a function to mush them together etc
export const ENGLAND_ARTICLE_SOURCES = {
	categories: ["news"],
	region: ["UK", "England"],
	coverage: ["regional"],
	language: "en",
	sources: [],
};

export const ENGLAND_VIDEO_SOURCES = {
	categories: ["news"],
	region: ["UK", "England"],
	coverage: ["regional"],
	language: "en",
	sources: [],
};

// something like this
export const englandNorthWestArticlesSourceList = [
	MANCHESTER_SOURCES,
	LIVERPOOL_ARTICLE_SOURCES,
];
export const englandNorthWestVideoSourceList = [
	MANCHESTER_VIDEO_SOURCES,
	LIVERPOOL_VIDEO_SOURCES,
];

export const englandMidlandsArticlesSourceList = [BIRMINGHAM_ARTICLE_SOURCES];
export const englandMidlandsVideoSourceList = [BIRMINGHAM_VIDEO_SOURCES];
