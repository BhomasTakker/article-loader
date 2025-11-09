import { createSearchAggregate } from "./searchAggregate";
import { Aggregator } from ".";
import { GetLatestArticlesProps } from "../search";
import {
	addFilter,
	addDateRange,
	addDurationRange,
	addSort,
	addMinimumShouldMatch,
	getLimit,
	addWithinTimeFrame,
} from "./search-query-functions";
import {
	addFields,
	addProviderLookup,
	addProviderMatchBeforeLookup,
	matchLeaning,
	matchOrigin,
	matchTrust,
} from "./aggregator-functions";

// Mock all the imported functions
jest.mock("./search-query-functions", () => ({
	addFilter: jest.fn(),
	addDateRange: jest.fn(),
	addDurationRange: jest.fn(),
	addSort: jest.fn(),
	addMinimumShouldMatch: jest.fn(),
	getLimit: jest.fn(),
	addWithinTimeFrame: jest.fn(),
}));

jest.mock("./aggregator-functions", () => ({
	addFields: jest.fn(),
	addProviderLookup: jest.fn(),
	addProviderMatchBeforeLookup: jest.fn(),
	matchLeaning: jest.fn(),
	matchOrigin: jest.fn(),
	matchTrust: jest.fn(),
}));

describe("createSearchAggregate", () => {
	let mockAddFilter: jest.MockedFunction<typeof addFilter>;
	let mockAddDateRange: jest.MockedFunction<typeof addDateRange>;
	let mockAddDurationRange: jest.MockedFunction<typeof addDurationRange>;
	let mockAddSort: jest.MockedFunction<typeof addSort>;
	let mockAddMinimumShouldMatch: jest.MockedFunction<
		typeof addMinimumShouldMatch
	>;
	let mockGetLimit: jest.MockedFunction<typeof getLimit>;
	let mockAddWithinTimeFrame: jest.MockedFunction<typeof addWithinTimeFrame>;
	let mockAddFields: jest.MockedFunction<typeof addFields>;
	let mockAddProviderLookup: jest.MockedFunction<typeof addProviderLookup>;
	let mockAddProviderMatchBeforeLookup: jest.MockedFunction<
		typeof addProviderMatchBeforeLookup
	>;
	let mockMatchLeaning: jest.MockedFunction<typeof matchLeaning>;
	let mockMatchOrigin: jest.MockedFunction<typeof matchOrigin>;
	let mockMatchTrust: jest.MockedFunction<typeof matchTrust>;

	beforeEach(() => {
		mockAddFilter = addFilter as jest.MockedFunction<typeof addFilter>;
		mockAddDateRange = addDateRange as jest.MockedFunction<typeof addDateRange>;
		mockAddDurationRange = addDurationRange as jest.MockedFunction<
			typeof addDurationRange
		>;
		mockAddSort = addSort as jest.MockedFunction<typeof addSort>;
		mockAddMinimumShouldMatch = addMinimumShouldMatch as jest.MockedFunction<
			typeof addMinimumShouldMatch
		>;
		mockGetLimit = getLimit as jest.MockedFunction<typeof getLimit>;
		mockAddWithinTimeFrame = addWithinTimeFrame as jest.MockedFunction<
			typeof addWithinTimeFrame
		>;
		mockAddFields = addFields as jest.MockedFunction<typeof addFields>;
		mockAddProviderLookup = addProviderLookup as jest.MockedFunction<
			typeof addProviderLookup
		>;
		mockAddProviderMatchBeforeLookup =
			addProviderMatchBeforeLookup as jest.MockedFunction<
				typeof addProviderMatchBeforeLookup
			>;
		mockMatchLeaning = matchLeaning as jest.MockedFunction<typeof matchLeaning>;
		mockMatchOrigin = matchOrigin as jest.MockedFunction<typeof matchOrigin>;
		mockMatchTrust = matchTrust as jest.MockedFunction<typeof matchTrust>;

		// Reset all mocks
		jest.clearAllMocks();

		// Set default return values
		mockAddSort.mockReturnValue(undefined);
		mockAddMinimumShouldMatch.mockReturnValue(0);
		mockGetLimit.mockReturnValue(100);

		// Mock the pipeline stage functions to actually add stages
		mockAddProviderMatchBeforeLookup.mockImplementation(
			(aggregator, providerObjectIds) => {
				// Mock implementation - do nothing for most tests
				// Tests can override this if needed
			}
		);

		mockAddProviderLookup.mockImplementation((aggregator) => {
			aggregator.push({
				$lookup: {
					from: "articleproviders",
					localField: "provider",
					foreignField: "_id",
					as: "provider",
				},
			});
		});

		mockAddFields.mockImplementation((aggregator) => {
			aggregator.push({
				$addFields: {
					score: { $meta: "searchScore" },
					scoreDetails: { $meta: "searchScoreDetails" },
					provider: { $arrayElemAt: ["$provider", 0] },
				},
			});
		});

		mockMatchTrust.mockImplementation((aggregator, trustHigher, trustLower) => {
			if (trustHigher || trustLower) {
				aggregator.push({
					$match: {
						$expr: {
							$and: [
								{ $gte: ["$provider.rating", trustHigher ? +trustHigher : 0] },
								{ $lte: ["$provider.rating", trustLower ? +trustLower : 100] },
							],
						},
					},
				});
			}
		});
	});

	describe("Basic functionality", () => {
		it("should return aggregator with basic $search stage for empty parameters", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			expect(result).toHaveLength(4); // $search, addProviderLookup, addFields, $limit
			expect(result[0]).toEqual({
				$search: {
					index: "title",
					scoreDetails: true,
					sort: undefined,
					compound: {
						must: [],
						mustNot: [],
						filter: [],
						should: [],
						minimumShouldMatch: 0,
					},
					count: {
						type: "lowerBound",
					},
				},
			});
			expect(result[3]).toEqual({ $limit: 100 });
		});

		it("should preserve existing aggregator stages", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const existingStage = { $match: { test: "value" } };
			const aggregator: Aggregator = [existingStage];

			const result = await createSearchAggregate(queryParams, aggregator);

			expect(result[0]).toEqual(existingStage);
			expect(result[1]).toHaveProperty("$search");
		});

		it("should call required functions with correct parameters", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddDateRange).toHaveBeenCalledWith([], queryParams);
			expect(mockAddWithinTimeFrame).toHaveBeenCalledWith([], queryParams);
			expect(mockAddDurationRange).toHaveBeenCalledWith([], queryParams);
			expect(mockAddSort).toHaveBeenCalledWith(queryParams);
			expect(mockAddMinimumShouldMatch).toHaveBeenCalledWith(queryParams);
			expect(mockGetLimit).toHaveBeenCalledWith(queryParams);
			expect(mockAddProviderLookup).toHaveBeenCalledWith(expect.any(Array));
			expect(mockAddFields).toHaveBeenCalledWith(expect.any(Array));
		});
	});

	describe("Filter construction", () => {
		it("should add variant filter when variant is provided", async () => {
			const queryParams: GetLatestArticlesProps = { variant: "news" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith([], "news", "variant");
		});

		it("should add language filter when language is provided", async () => {
			const queryParams: GetLatestArticlesProps = { language: "en" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith([], "en", "details.languge");
		});

		it("should add mediaType filter when mediaType is provided", async () => {
			const queryParams: GetLatestArticlesProps = { mediaType: "video" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"video",
				"media.mediaType"
			);
		});

		it("should add geographic filters when provided", async () => {
			const queryParams: GetLatestArticlesProps = {
				region: "North America",
				continent: "North America",
				country: "United States",
				state: "California",
				city: "San Francisco",
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"North America",
				"details.region"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"North America",
				"details.region"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"United States",
				"details.region"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"California",
				"details.region"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"San Francisco",
				"details.region"
			);
		});

		it("should add coverage filter when coverage is provided", async () => {
			const queryParams: GetLatestArticlesProps = { coverage: "national" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"national",
				"details.coverage"
			);
		});

		it("should not add filters when parameters are not provided", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			// Should only be called for range filters, not for the optional filters
			expect(mockAddFilter).not.toHaveBeenCalledWith(
				[],
				expect.any(String),
				"variant"
			);
			expect(mockAddFilter).not.toHaveBeenCalledWith(
				[],
				expect.any(String),
				"details.languge"
			);
			expect(mockAddFilter).not.toHaveBeenCalledWith(
				[],
				expect.any(String),
				"media.mediaType"
			);
		});
	});

	describe("Categories handling", () => {
		it("should parse categories string and add filter", async () => {
			const queryParams: GetLatestArticlesProps = {
				categories: "technology,science,innovation",
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				["technology", "science", "innovation"],
				"details.categories"
			);
		});

		it("should trim whitespace from categories", async () => {
			const queryParams: GetLatestArticlesProps = {
				categories: "  technology  ,  science  ,  innovation  ",
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				["technology", "science", "innovation"],
				"details.categories"
			);
		});

		it("should handle single category", async () => {
			const queryParams: GetLatestArticlesProps = { categories: "technology" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				["technology"],
				"details.categories"
			);
		});

		it("should not add filter when categories is empty", async () => {
			const queryParams: GetLatestArticlesProps = { categories: "" };
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).not.toHaveBeenCalledWith(
				[],
				expect.any(Array),
				"details.categories"
			);
		});

		it("should not add filter when categories is undefined", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).not.toHaveBeenCalledWith(
				[],
				expect.any(Array),
				"details.categories"
			);
		});
	});

	describe("Text search arrays", () => {
		it("should process mustContain array", async () => {
			const queryParams: GetLatestArticlesProps = {
				mustContain: ["technology", "AI"],
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith([], "technology", "title");
			expect(mockAddFilter).toHaveBeenCalledWith([], "AI", "title");
		});

		it("should process mustNotContain array", async () => {
			const queryParams: GetLatestArticlesProps = {
				mustNotContain: ["spam", "fake"],
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith([], "spam", "title");
			expect(mockAddFilter).toHaveBeenCalledWith([], "fake", "title");
		});

		it("should process shouldContain array", async () => {
			const queryParams: GetLatestArticlesProps = {
				shouldContain: ["machine learning", "neural networks"],
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"machine learning",
				"title"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"neural networks",
				"title"
			);
		});

		it("should process filterContain array with text type", async () => {
			const queryParams: GetLatestArticlesProps = {
				filterContain: ["innovation", "research"],
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"innovation",
				"title",
				"text"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				[],
				"research",
				"title",
				"text"
			);
		});

		it("should handle empty arrays gracefully", async () => {
			const queryParams: GetLatestArticlesProps = {
				mustContain: [],
				mustNotContain: [],
				shouldContain: [],
				filterContain: [],
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			// Should not call addFilter for empty arrays
			const filterCalls = mockAddFilter.mock.calls.filter(
				(call) => call[2] === "title"
			);
			expect(filterCalls).toHaveLength(0);
		});

		it("should use default empty arrays when not provided", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			// Should not throw errors and should not call addFilter for title path
			const filterCalls = mockAddFilter.mock.calls.filter(
				(call) => call[2] === "title"
			);
			expect(filterCalls).toHaveLength(0);
		});
	});

	describe("$search stage construction", () => {
		it("should create $search stage with filters when filters are present", async () => {
			// Mock addFilter to simulate adding filters
			mockAddFilter.mockImplementation((filterArray, query, path) => {
				filterArray.push({ text: { query, path } });
				return filterArray;
			});

			const queryParams: GetLatestArticlesProps = {
				variant: "news",
				mustContain: ["technology"],
			};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			const searchStage = result.find((stage) => (stage as any).$search);
			expect(searchStage).toBeDefined();
			expect((searchStage as any).$search).toEqual({
				index: "title",
				scoreDetails: true,
				sort: undefined,
				compound: {
					must: [{ text: { query: "technology", path: "title" } }],
					mustNot: [],
					filter: [{ text: { query: "news", path: "variant" } }],
					should: [],
					minimumShouldMatch: 0,
				},
				count: {
					type: "lowerBound",
				},
			});
		});

		it("should create $search stage with all compound query types", async () => {
			// Mock addFilter to simulate different filter types
			mockAddFilter.mockImplementation((filterArray, query, path) => {
				filterArray.push({ text: { query, path } });
				return filterArray;
			});

			const queryParams: GetLatestArticlesProps = {
				mustContain: ["required"],
				mustNotContain: ["excluded"],
				shouldContain: ["optional"],
				filterContain: ["filtered"],
				variant: "news",
			};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			const searchStage = result.find((stage) => (stage as any).$search);
			expect((searchStage as any)?.$search.compound).toEqual({
				must: [{ text: { query: "required", path: "title" } }],
				mustNot: [{ text: { query: "excluded", path: "title" } }],
				filter: [
					{ text: { query: "news", path: "variant" } },
					{ text: { query: "filtered", path: "title" } },
				],
				should: [{ text: { query: "optional", path: "title" } }],
				minimumShouldMatch: 0,
			});
		});

		it("should handle sort parameter", async () => {
			const mockSortObject = { "details.published": -1 };
			mockAddSort.mockReturnValue(mockSortObject);

			const queryParams: GetLatestArticlesProps = { sort: "date-descending" };
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			const searchStage = result.find((stage) => (stage as any).$search);
			expect((searchStage as any)?.$search.sort).toEqual(mockSortObject);
		});

		it("should handle minimumShouldMatch parameter", async () => {
			mockAddMinimumShouldMatch.mockReturnValue(2);

			const queryParams: GetLatestArticlesProps = {
				minimumShouldMatch: 2,
				shouldContain: ["term1", "term2", "term3"],
			};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			const searchStage = result.find((stage) => (stage as any).$search);
			expect((searchStage as any)?.$search.compound.minimumShouldMatch).toBe(2);
		});
	});

	describe("Post-search pipeline stages", () => {
		it("should call addProviderLookup with aggregator", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddProviderLookup).toHaveBeenCalledWith(aggregator);
		});

		it("should call addFields with aggregator", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddFields).toHaveBeenCalledWith(aggregator);
		});

		it("should call matchTrust with trust parameters", async () => {
			const queryParams: GetLatestArticlesProps = {
				trustHigher: "70",
				trustLower: "90",
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockMatchTrust).toHaveBeenCalledWith(aggregator, "70", "90");
		});

		it("should call matchTrust with undefined parameters when not provided", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockMatchTrust).toHaveBeenCalledWith(
				aggregator,
				undefined,
				undefined
			);
		});

		it("should add limit stage at the end", async () => {
			mockGetLimit.mockReturnValue(50);

			const queryParams: GetLatestArticlesProps = { limit: "50" };
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			expect(result[result.length - 1]).toEqual({ $limit: 50 });
		});

		it("should call range filter functions", async () => {
			const queryParams: GetLatestArticlesProps = {
				before: new Date("2023-12-31"),
				after: new Date("2023-01-01"),
				within: "1 month",
				durationHigher: "60",
				durationLower: "300",
			};
			const aggregator: Aggregator = [];

			await createSearchAggregate(queryParams, aggregator);

			expect(mockAddDateRange).toHaveBeenCalledWith(
				expect.any(Array),
				queryParams
			);
			expect(mockAddWithinTimeFrame).toHaveBeenCalledWith(
				expect.any(Array),
				queryParams
			);
			expect(mockAddDurationRange).toHaveBeenCalledWith(
				expect.any(Array),
				queryParams
			);
		});
	});

	describe("Integration scenarios", () => {
		it("should handle comprehensive query with all parameters", async () => {
			// Mock functions to simulate real behavior
			mockAddFilter.mockImplementation(
				(filterArray, query, path, type = "text") => {
					filterArray.push({ [type]: { query, path } });
					return filterArray;
				}
			);
			mockAddSort.mockReturnValue({ "details.published": -1 });
			mockAddMinimumShouldMatch.mockReturnValue(1);
			mockGetLimit.mockReturnValue(25);

			const queryParams: GetLatestArticlesProps = {
				variant: "article",
				language: "en",
				mediaType: "text",
				region: "North America",
				country: "United States",
				coverage: "national",
				categories: "technology,science",
				mustContain: ["AI", "technology"],
				mustNotContain: ["spam"],
				shouldContain: ["innovation"],
				filterContain: ["research"],
				trustHigher: "70",
				trustLower: "95",
				sort: "date-descending",
				limit: "25",
				minimumShouldMatch: 1,
			};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			// Verify the structure
			expect(result).toHaveLength(5); // $search, provider lookup, add fields, trust match, limit

			// Verify $search stage
			const searchStage = result.find((stage) => (stage as any).$search);
			expect(searchStage).toBeDefined();
			expect((searchStage as any)?.$search.index).toBe("title");
			expect((searchStage as any)?.$search.scoreDetails).toBe(true);
			expect((searchStage as any)?.$search.sort).toEqual({
				"details.published": -1,
			});
			expect((searchStage as any)?.$search.compound.minimumShouldMatch).toBe(1);

			// Verify all mock calls
			expect(mockAddFilter).toHaveBeenCalledWith(
				expect.any(Array),
				"article",
				"variant"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				expect.any(Array),
				"en",
				"details.languge"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				expect.any(Array),
				"text",
				"media.mediaType"
			);
			expect(mockAddFilter).toHaveBeenCalledWith(
				expect.any(Array),
				["technology", "science"],
				"details.categories"
			);
			expect(mockAddProviderLookup).toHaveBeenCalled();
			expect(mockAddFields).toHaveBeenCalled();
			expect(mockMatchTrust).toHaveBeenCalledWith(
				expect.any(Array),
				"70",
				"95"
			);
			expect(result[result.length - 1]).toEqual({ $limit: 25 });
		});

		it("should maintain correct pipeline order", async () => {
			const queryParams: GetLatestArticlesProps = { variant: "news" };
			const existingStage = { $match: { existing: true } };
			const aggregator: Aggregator = [existingStage];

			const result = await createSearchAggregate(queryParams, aggregator);

			// Order should be: existing stages, $search, provider lookup, add fields, trust match, limit
			expect(result[0]).toEqual(existingStage);
			expect(result[1]).toHaveProperty("$search");
			expect(result[result.length - 1]).toHaveProperty("$limit");
		});

		it("should handle minimal parameters gracefully", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const aggregator: Aggregator = [];

			const result = await createSearchAggregate(queryParams, aggregator);

			expect(result).toHaveLength(4); // Basic pipeline: $search, provider lookup, add fields, limit
			expect(result[0]).toHaveProperty("$search");
			expect(result[result.length - 1]).toHaveProperty("$limit");

			// Should not call optional filter functions
			expect(mockAddFilter).not.toHaveBeenCalledWith(
				expect.any(Array),
				expect.any(String),
				"variant"
			);
		});
	});
});
