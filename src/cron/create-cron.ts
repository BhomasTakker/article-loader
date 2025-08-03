import { CronJob } from "cron";

// https://crontab.cronhub.io/

// every 15 minutes staggered by a minute
// There will be a formula for this somewhere
// 1,16,31,46 * * * *

export const staggerMinutes = (
	minutes: number,
	stagger: number,
	onSecond: number = 0
) => {
	const times = [];
	for (let i = stagger; i < 60; i += minutes) {
		times.push(i);
	}
	return `${onSecond} ${times.join(",")} * * * *`;
};

export const staggerSeconds = (seconds: number, stagger: number) => {
	const times = [];
	for (let i = stagger; i < 60; i += seconds) {
		times.push(i);
	}
	return `${times.join(",")} * * * * *`;
};

type Cron = {
	day: number;
	hour?: number;
	minute?: number;
	second?: number;
};

export const everyNDays = ({ day, hour = 0, minute = 0, second = 0 }: Cron) => {
	return `${second} ${minute} ${hour} */${day} * *`;
};

// convert all to object inputs
export const everyNthHour = (
	n: number,
	minutesOffset: number = 0,
	onSecond: number = 0
) => {
	return `${onSecond} ${minutesOffset} */${n} * * *`;
};

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
