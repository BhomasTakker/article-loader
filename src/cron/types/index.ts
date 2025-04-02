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

export type CronConfig = {
	id: string;
	anyCommandsRequired: {};
	cron: CronJobConfig[];
};
