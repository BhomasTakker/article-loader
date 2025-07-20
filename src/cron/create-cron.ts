import { CronJob } from "cron";

// https://crontab.cronhub.io/

// every 15 minutes staggered by a minute
// There will be a formula for this somewhere
// 1,16,31,46 * * * *

export const CRON_TIMES = {
	// could just be function...
	fifthteen: "0,15,30,45 * * * *",
	fifthteen_1: "1,16,31,46 * * * *",
	fifthteen_2: "2,17,32,47 * * * *",
	fifthteen_3: "3,18,33,48 * * * *",
	fifthteen_4: "4,19,34,49 * * * *",
	fifthteen_5: "5,20,35,50 * * * *",
	fifthteen_6: "6,21,36,51 * * * *",
	fifthteen_7: "7,22,37,52 * * * *",
	fifthteen_8: "8,23,38,53 * * * *",
	fifthteen_9: "9,24,39,54 * * * *",
	fifthteen_10: "10,25,40,55 * * * *",
	fifthteen_11: "11,26,41,56 * * * *",
	fifthteen_12: "12,27,42,57 * * * *",
	fifthteen_13: "13,28,43,58 * * * *",
	fifthteen_14: "14,29,44,59 * * * *",

	days_7: "0 0 * * 0", // every 7 days
	days_7_1: "1 0 * * 0", // every 7 days + 1 minute
	days_7_2: "2 0 * * 0", // every 7 days + 2 minutes
	days_7_3: "3 0 * * 0", // every 7 days + 3 minutes
	days_7_4: "4 0 * * 0", // every 7 days + 4 minutes

	hours_6: "0 */6 * * *",
	hours_6_1: "1 */6 * * *",
	hours_6_2: "2 */6 * * *",
	hours_6_3: "3 */6 * * *",
	hours_6_4: "4 */6 * * *",
	hours_6_5: "5 */6 * * *",
	hours_6_6: "6 */6 * * *",
	hours_6_7: "7 */6 * * *",
	hours_6_8: "8 */6 * * *",
	hours_6_9: "9 */6 * * *",
	hours_6_10: "10 */6 * * *",
	hours_6_11: "11 */6 * * *",
	hours_6_12: "12 */6 * * *",
	hours_6_13: "13 */6 * * *",
	hours_6_14: "14 */6 * * *",
	hours_6_15: "15 */6 * * *",

	seconds_10: "*/10 * * * * *",
	seconds_30: "*/30 * * * * *",

	minutes_15: "*/15 * * * *",
	minutes_5: "*/5 * * * *",
	minutes_1: "*/1 * * * *",
	hours_1: "0 */1 * * *",
	// hours_1: "* * */1 * * *", // every second!!
} as const;

type CRON_TIMES = (typeof CRON_TIMES)[keyof typeof CRON_TIMES];

type CreatCron = {
	time: string;
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

type CreatApiCron = {
	time: string;
	fetchFn: () => void;
	onComplete?: () => void;
};

export const createApiCron = ({ time, fetchFn, onComplete }: CreatApiCron) => {
	new CronJob(
		time, // cronTime
		fetchFn, // onTick
		onComplete, // onComplete
		true // start
	);
};
