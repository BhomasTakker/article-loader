import {
	getLimit,
	addFilter,
	addDurationRange,
	addDateRange,
	addWithinTimeFrame,
	addMinimumShouldMatch,
	addSort,
} from "./search-query-functions";
import { GetLatestArticlesProps } from "../search";

describe("Search Query Functions", () => {
	describe("getLimit", () => {
		it("should return default hard limit when no limit is provided", () => {
			const queryParams: GetLatestArticlesProps = {};
			const result = getLimit(queryParams);
			expect(result).toBe(100);
		});

		it("should return provided limit when it's within hard limit", () => {
			const queryParams: GetLatestArticlesProps = { limit: "50" };
			const result = getLimit(queryParams);
			expect(result).toBe(50);
		});

		it("should return hard limit when provided limit exceeds it", () => {
			const queryParams: GetLatestArticlesProps = { limit: "150" };
			const result = getLimit(queryParams);
			expect(result).toBe(100);
		});

		it("should return hard limit when limit is NaN", () => {
			const queryParams: GetLatestArticlesProps = { limit: "invalid" };
			const result = getLimit(queryParams);
			expect(result).toBe(100);
		});

		it("should return hard limit when limit is empty string", () => {
			const queryParams: GetLatestArticlesProps = { limit: "" };
			const result = getLimit(queryParams);
			expect(result).toBe(100);
		});

		it("should handle limit value of 0", () => {
			const queryParams: GetLatestArticlesProps = { limit: "0" };
			const result = getLimit(queryParams);
			expect(result).toBe(0);
		});

		it("should handle limit value of 1", () => {
			const queryParams: GetLatestArticlesProps = { limit: "1" };
			const result = getLimit(queryParams);
			expect(result).toBe(1);
		});

		it("should handle limit exactly at hard limit", () => {
			const queryParams: GetLatestArticlesProps = { limit: "100" };
			const result = getLimit(queryParams);
			expect(result).toBe(100);
		});
	});

	describe("addFilter", () => {
		let filter: any[];

		beforeEach(() => {
			filter = [];
		});

		it("should add text filter when query is provided", () => {
			const result = addFilter(filter, "test query", "title");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				text: {
					query: "test query",
					path: "title",
				},
			});
		});

		it("should add filter with custom type", () => {
			const result = addFilter(filter, "test query", "content", "phrase");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				phrase: {
					query: "test query",
					path: "content",
				},
			});
		});

		it("should handle number query", () => {
			const result = addFilter(filter, 42, "rating", "number");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				number: {
					query: 42,
					path: "rating",
				},
			});
		});

		it("should handle boolean query", () => {
			const result = addFilter(filter, true, "isActive", "boolean");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				boolean: {
					query: true,
					path: "isActive",
				},
			});
		});

		it("should handle object query", () => {
			const queryObj = { field: "value" };
			const result = addFilter(filter, queryObj, "metadata", "object");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				object: {
					query: queryObj,
					path: "metadata",
				},
			});
		});

		it("should handle array query", () => {
			const queryArray = ["item1", "item2"];
			const result = addFilter(filter, queryArray, "tags", "array");

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				array: {
					query: queryArray,
					path: "tags",
				},
			});
		});

		it("should not add filter when query is falsy", () => {
			const result = addFilter(filter, "", "title");
			expect(result).toHaveLength(0);
		});

		it("should not add filter when query is null", () => {
			const result = addFilter(filter, null as any, "title");
			expect(result).toHaveLength(0);
		});

		it("should not add filter when query is undefined", () => {
			const result = addFilter(filter, undefined as any, "title");
			expect(result).toHaveLength(0);
		});

		it("should preserve existing filters", () => {
			filter.push({ existing: "filter" });
			const result = addFilter(filter, "new query", "title");

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ existing: "filter" });
			expect(result[1]).toEqual({
				text: {
					query: "new query",
					path: "title",
				},
			});
		});
	});

	describe("addDurationRange", () => {
		let filter: any[];

		beforeEach(() => {
			filter = [];
		});

		it("should add duration range when both higher and lower are provided", () => {
			const queryParams: GetLatestArticlesProps = {
				durationHigher: "60",
				durationLower: "300",
			};

			addDurationRange(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "media.duration",
					gt: 60,
					lt: 300,
				},
			});
		});

		it("should add duration range when only durationHigher is provided", () => {
			const queryParams: GetLatestArticlesProps = {
				durationHigher: "120",
			};

			addDurationRange(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "media.duration",
					gt: 120,
					lt: undefined,
				},
			});
		});

		it("should add duration range when only durationLower is provided", () => {
			const queryParams: GetLatestArticlesProps = {
				durationLower: "180",
			};

			addDurationRange(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "media.duration",
					gt: undefined,
					lt: 180,
				},
			});
		});

		it("should not add duration range when neither parameter is provided", () => {
			const queryParams: GetLatestArticlesProps = {};

			addDurationRange(filter, queryParams);

			expect(filter).toHaveLength(0);
		});

		it("should handle zero duration values", () => {
			const queryParams: GetLatestArticlesProps = {
				durationHigher: "0",
				durationLower: "0",
			};

			addDurationRange(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "media.duration",
					gt: 0,
					lt: 0,
				},
			});
		});

		it("should handle string numbers correctly", () => {
			const queryParams: GetLatestArticlesProps = {
				durationHigher: "30",
				durationLower: "600",
			};

			addDurationRange(filter, queryParams);

			expect(filter[0].range.gt).toBe(30);
			expect(filter[0].range.lt).toBe(600);
		});
	});

	describe("addDateRange", () => {
		let filter: any[];

		beforeEach(() => {
			filter = [];
		});

		it("should add date range when both before and after are provided", () => {
			const queryParams: GetLatestArticlesProps = {
				before: new Date("2023-12-31"),
				after: new Date("2023-01-01"),
			};

			const result = addDateRange(filter, queryParams);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-01-01"),
					lt: new Date("2023-12-31"),
				},
			});
		});

		it("should add date range when only after is provided", () => {
			const queryParams: GetLatestArticlesProps = {
				after: new Date("2023-06-01"),
			};

			const result = addDateRange(filter, queryParams);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-06-01"),
					lt: undefined,
				},
			});
		});

		it("should add date range when only before is provided", () => {
			const queryParams: GetLatestArticlesProps = {
				before: new Date("2023-06-01"),
			};

			const result = addDateRange(filter, queryParams);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				range: {
					path: "details.published",
					gt: undefined,
					lt: new Date("2023-06-01"),
				},
			});
		});

		it("should not add date range when neither parameter is provided", () => {
			const queryParams: GetLatestArticlesProps = {};

			const result = addDateRange(filter, queryParams);

			expect(result).toHaveLength(0);
		});

		it("should return the filter array", () => {
			const queryParams: GetLatestArticlesProps = {
				before: new Date("2023-12-31"),
			};

			const result = addDateRange(filter, queryParams);

			expect(result).toBe(filter);
		});
	});

	describe("addWithinTimeFrame", () => {
		let filter: any[];
		let originalDateNow: () => number;

		beforeEach(() => {
			filter = [];
			originalDateNow = Date.now;
			// Mock Date.now to return a fixed timestamp
			Date.now = jest.fn(() => new Date("2023-06-15T12:00:00Z").getTime());
		});

		afterEach(() => {
			Date.now = originalDateNow;
		});

		it("should add within time frame for 1 hour", () => {
			const queryParams: GetLatestArticlesProps = { within: "1 hour" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-06-15T11:00:00Z"),
				},
			});
		});

		it("should add within time frame for 1 day", () => {
			const queryParams: GetLatestArticlesProps = { within: "1 day" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-06-14T12:00:00Z"),
				},
			});
		});

		it("should add within time frame for 1 week", () => {
			const queryParams: GetLatestArticlesProps = { within: "1 week" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-06-08T12:00:00Z"),
				},
			});
		});

		it("should add within time frame for 1 month", () => {
			const queryParams: GetLatestArticlesProps = { within: "1 month" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-05-16T12:00:00Z"),
				},
			});
		});

		it("should add within time frame for 1 year", () => {
			const queryParams: GetLatestArticlesProps = { within: "1 year" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2022-06-15T12:00:00Z"),
				},
			});
		});

		it("should handle multiple hours", () => {
			const queryParams: GetLatestArticlesProps = { within: "6 hours" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(1);
			expect(filter[0]).toEqual({
				range: {
					path: "details.published",
					gt: new Date("2023-06-15T06:00:00Z"),
				},
			});
		});

		it("should not add filter for invalid time frame", () => {
			const queryParams: GetLatestArticlesProps = { within: "invalid time" };

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(0);
		});

		it("should not add filter when within is not provided", () => {
			const queryParams: GetLatestArticlesProps = {};

			addWithinTimeFrame(filter, queryParams);

			expect(filter).toHaveLength(0);
		});
	});

	describe("addMinimumShouldMatch", () => {
		it("should return minimum should match when valid and shouldContain has enough items", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 2,
				shouldContain: ["term1", "term2", "term3"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(2);
		});

		it("should return 0 when minimumShouldMatch exceeds shouldContain length", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 5,
				shouldContain: ["term1", "term2"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should return 0 when minimumShouldMatch is 0", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 0,
				shouldContain: ["term1", "term2"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should return 0 when minimumShouldMatch is negative", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: -1,
				shouldContain: ["term1", "term2"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should return 0 when minimumShouldMatch exceeds 100", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 101,
				shouldContain: ["term1", "term2"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should return 0 when minimumShouldMatch is not provided", () => {
			const queryParams: GetLatestArticlesProps = {
				shouldContain: ["term1", "term2"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should handle shouldContain default empty array", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 1,
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(0);
		});

		it("should handle edge case where minimumShouldMatch equals shouldContain length", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 3,
				shouldContain: ["term1", "term2", "term3"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(3);
		});

		it("should handle string numbers in minimumShouldMatch", () => {
			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: "2" as any,
				shouldContain: ["term1", "term2", "term3"],
			};

			const result = addMinimumShouldMatch(queryParams);

			expect(result).toBe(2);
		});
	});

	describe("addSort", () => {
		it("should return relevance sort object for relevance sort", () => {
			const queryParams: GetLatestArticlesProps = { sort: "relevance" };

			const result = addSort(queryParams);

			expect(result).toEqual({
				score: {
					$meta: "searchScore",
					order: 1,
				},
			});
		});

		it("should return date ascending sort for date-ascending", () => {
			const queryParams: GetLatestArticlesProps = { sort: "date-ascending" };

			const result = addSort(queryParams);

			expect(result).toEqual({ "details.published": 1 });
		});

		it("should return date descending sort for date-descending", () => {
			const queryParams: GetLatestArticlesProps = { sort: "date-descending" };

			const result = addSort(queryParams);

			expect(result).toEqual({ "details.published": -1 });
		});

		it("should return undefined for none sort", () => {
			const queryParams: GetLatestArticlesProps = { sort: "none" };

			const result = addSort(queryParams);

			expect(result).toBeUndefined();
		});

		it("should return undefined for invalid sort", () => {
			const queryParams: GetLatestArticlesProps = { sort: "invalid-sort" };

			const result = addSort(queryParams);

			expect(result).toBeUndefined();
		});

		it("should return undefined when sort is not provided", () => {
			const queryParams: GetLatestArticlesProps = {};

			const result = addSort(queryParams);

			expect(result).toBeUndefined();
		});

		it("should return undefined for empty string sort", () => {
			const queryParams: GetLatestArticlesProps = { sort: "" };

			const result = addSort(queryParams);

			expect(result).toBeUndefined();
		});
	});

	describe("Integration tests", () => {
		it("should work correctly when multiple functions are used together", () => {
			const filter: any[] = [];
			const queryParams: GetLatestArticlesProps = {
				limit: "50",
				durationHigher: "60",
				durationLower: "300",
				before: new Date("2023-12-31"),
				after: new Date("2023-01-01"),
				minimumShouldMatch: 2,
				shouldContain: ["term1", "term2", "term3"],
				sort: "date-descending",
			};

			const limit = getLimit(queryParams);
			addFilter(filter, "test query", "title");
			addDurationRange(filter, queryParams);
			addDateRange(filter, queryParams);
			const minimumMatch = addMinimumShouldMatch(queryParams);
			const sort = addSort(queryParams);

			expect(limit).toBe(50);
			expect(filter).toHaveLength(3);
			expect(minimumMatch).toBe(2);
			expect(sort).toEqual({ "details.published": -1 });
		});
	});
});
