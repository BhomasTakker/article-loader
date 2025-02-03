import { CronJob } from "cron";

export const CRON_TIMES = {
	seconds_10: "*/10 * * * * *",
	minutes_15: "*/15 * * * *",
	minutes_5: "*/5 * * * *",
	minutes_1: "*/1 * * * *",
	hours_1: "* * */1 * * *",
} as const;

type CRON_TIMES = (typeof CRON_TIMES)[keyof typeof CRON_TIMES];

type CreatCron = {
	time: CRON_TIMES;
	fetchFn: () => void;
	onComplete?: () => void;
};
export const createCron = ({ time, fetchFn, onComplete }: CreatCron) => {
	new CronJob(
		time, // cronTime
		fetchFn, // onTick
		onComplete, // onComplete
		true // start
		// We should use the object notation and pass in a options
		// "America/Los_Angeles" // timeZone
	);
};
