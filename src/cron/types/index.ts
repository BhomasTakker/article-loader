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
	anyCommandsRequired: {};
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
}
