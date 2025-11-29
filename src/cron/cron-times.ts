// https://crontab.cronhub.io/

import { Cron, TimeFunction } from "./types";

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

const functionMap = new Map<string, Function>([
	[TimeFunction.StaggerMinutes, staggerMinutes],
	[TimeFunction.StaggerSeconds, staggerSeconds],
	[TimeFunction.EveryNthHour, everyNthHour],
	[TimeFunction.EveryNDays, everyNDays],
]);

export function getTimeFunction(
	funcName: string
): (...args: number[]) => string {
	return functionMap.get(funcName) as (...args: number[]) => string;
}
