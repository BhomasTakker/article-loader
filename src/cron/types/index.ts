import {
	CachePageQueriesArgs,
	PingRoutesArgs,
} from "../api/search/page-queries";
import { FetchRadioStationsArgs } from "../radio/radio-cron";
import { FetchCollectionsArgs } from "../rss/utils";

export type Cron = {
	day: number;
	hour?: number;
	minute?: number;
	second?: number;
};

export type CronJob = {
	time: string;
	fetchFn: () => void;
	onComplete?: () => void;
};

export type CronJobConfig = {
	time: string;
	fetchFn: () => Promise<void>;
	onComplete: () => void;
};

export enum SourceVariant {
	ARTICLE = "article",
	AUDIO = "audio",
	VIDEO = "video",
}

export type CronConfig = {
	id: string;
	cron: CronJobConfig[];
};

export enum TimeFunction {
	StaggerMinutes = "staggerMinutes",
	StaggerSeconds = "staggerSeconds",
	EveryNthHour = "everyNthHour",
	EveryNDays = "everyNDays",
}

export enum FetchFunction {
	RSS = "fetchRSS",
	YoutubeRSS = "fetchYoutubeRSS",
	Podcasts = "fetchPodcasts",
	RadioScripts = "fetchRadioScripts",
	PageQueries = "fetchPageQueries",
	PingRoutes = "pingRoutes",
}

export enum CronType {
	RSS = "rss",
	API = "api",
}

export type FetchFunctionProps =
	| FetchCollectionsArgs
	| FetchRadioStationsArgs
	| PingRoutesArgs
	| CachePageQueriesArgs;

// RSS Cron Job Configuration
export type RSSCronJobConfig = {
	// titles is really fetchFunctionProps
	titles: string[];
	variant: SourceVariant;
	timeFunction: TimeFunction;
	timeParams: number[];
	fetchFunction: FetchFunction;
	onComplete: () => void;
};

// API Cron Job Configuration
export type APICronJobConfig = {
	fetchFunctionData: FetchFunctionProps;
	timeFunction: TimeFunction;
	timeParams: number[];
	fetchFunction: FetchFunction;
	onComplete: () => void;
};

// Union type for all cron job configurations
export type GenericCronJobConfig = RSSCronJobConfig | APICronJobConfig;

// Config structure for RSS-based crons
export type RSSCronConfig = {
	id: string;
	type: CronType.RSS;
	cron: RSSCronJobConfig[];
};

// Config structure for API-based crons
export type APICronConfig = {
	id: string;
	type: CronType.API;
	cron: APICronJobConfig[];
};

// Union type for all cron configurations
export type GenericCronConfig = {
	id: string;
	type: CronType;
	cron: (RSSCronJobConfig | APICronJobConfig)[];
};
