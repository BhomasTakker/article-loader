// better name then utils!

import { GetLatestArticlesProps } from "../search";

const HARD_LIMIT = 100;

export const getLimit = (queryParams: GetLatestArticlesProps) => {
	const { limit = HARD_LIMIT } = queryParams;
	let limitToUse = +limit <= HARD_LIMIT ? +limit : HARD_LIMIT;

	if (isNaN(+limit) || !limit) {
		limitToUse = HARD_LIMIT;
	}
	return limitToUse;
};

export const addFilter = (
	filter: any[],
	query: string | number | boolean | object | unknown[],
	path: string,
	type: string = "text"
) => {
	if (query) {
		filter.push({
			[type]: {
				query,
				path,
			},
		});
	}
	return filter;
};

export const addDurationRange = (
	filter: any[],
	queryParams: GetLatestArticlesProps
) => {
	const { durationHigher, durationLower } = queryParams;
	if (durationHigher || durationLower) {
		filter.push({
			range: {
				path: "media.duration",
				gt: durationHigher ? +durationHigher : undefined,
				lt: durationLower ? +durationLower : undefined,
			},
		});
	}
};

export const addDateRange = (
	filter: any[],
	queryParams: GetLatestArticlesProps
) => {
	const { before, after } = queryParams;
	if (before || after) {
		filter.push({
			range: {
				path: "details.published",
				gt: after ? new Date(after) : undefined,
				lt: before ? new Date(before) : undefined,
			},
		});
	}
	return filter;
};

const HOUR_MILLI = 3600000;
const DAY_MILLI = 86400000;
const WEEK_MILLI = 604800000;
const MONTH_MILLI = 2592000000;
const YEAR_MILLI = 31536000000;

const withinTimeMap = new Map([
	["1 hour", HOUR_MILLI],
	["2 hours", HOUR_MILLI * 2],
	["3 hours", HOUR_MILLI * 3],
	["6 hours", HOUR_MILLI * 6],
	["12 hours", HOUR_MILLI * 12],
	["1 day", DAY_MILLI],
	["2 days", DAY_MILLI * 2],
	["3 days", DAY_MILLI * 3],
	["1 week", WEEK_MILLI],
	["2 weeks", WEEK_MILLI * 2],
	["1 month", MONTH_MILLI],
	["3 months", MONTH_MILLI * 3],
	["6 months", MONTH_MILLI * 6],
	["1 year", YEAR_MILLI],
	["2 years", YEAR_MILLI * 2],
]);

export const addWithinTimeFrame = (
	filter: any[],
	queryParams: GetLatestArticlesProps
) => {
	const { within } = queryParams;
	if (within) {
		const withinTime = withinTimeMap.get(within);
		if (!withinTime) {
			// warning invalid time
			return;
		}
		const date = new Date(Date.now() - withinTime);

		filter.push({
			range: {
				path: "details.published",
				gt: date,
			},
		});
	}
};

// A little ugly / do better
export const addMinimumShouldMatch = (queryParams: GetLatestArticlesProps) => {
	const { minimumShouldMatch, shouldContain = [] } = queryParams;

	if (minimumShouldMatch) {
		const isValid = +minimumShouldMatch >= 0 && +minimumShouldMatch <= 100;
		if (isValid && shouldContain.length >= +minimumShouldMatch) {
			return +minimumShouldMatch;
		}
		return 0;
	}
	return 0;
};

const AvailableSort = {
	NONE: "none",
	RELEVANCE: "relevance",
	DATE_ASCENDING: "date-ascending",
	DATE_DESCENDING: "date-descending",
} as const;

export const addSort = (queryParams: GetLatestArticlesProps) => {
	const { sort } = queryParams;

	switch (sort) {
		case AvailableSort.RELEVANCE:
			// check a query!
			return {
				score: {
					$meta: "searchScore",
					order: 1,
				},
			};
		case AvailableSort.DATE_ASCENDING:
			return { "details.published": 1 };
		case AvailableSort.DATE_DESCENDING:
			return { "details.published": -1 };
		default:
			return undefined;
	}
};
