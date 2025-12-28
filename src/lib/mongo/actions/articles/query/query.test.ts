import { buildArticleSearchQuery, Aggregator } from "./index";
import { GetLatestArticlesProps } from "../search";
import Article from "../../../../../models/Article";
import { createSearchAggregate } from "./searchAggregate";
import { PipelineStage } from "mongoose";

// Mock the Article model
jest.mock("../../../../../models/Article", () => ({
	aggregate: jest.fn(),
}));

// Mock the createSearchAggregate function
jest.mock("./searchAggregate", () => ({
	createSearchAggregate: jest.fn(),
}));

describe("Query Index Functions", () => {
	let mockArticleAggregate: jest.MockedFunction<typeof Article.aggregate>;
	let mockCreateSearchAggregate: jest.MockedFunction<
		typeof createSearchAggregate
	>;

	beforeEach(() => {
		mockArticleAggregate = Article.aggregate as jest.MockedFunction<
			typeof Article.aggregate
		>;
		mockCreateSearchAggregate = createSearchAggregate as jest.MockedFunction<
			typeof createSearchAggregate
		>;
		jest.clearAllMocks();
	});

	describe("Aggregator type", () => {
		it("should be defined as PipelineStage array", () => {
			const aggregator: Aggregator = [];
			expect(Array.isArray(aggregator)).toBe(true);

			// Test that it can hold PipelineStage objects
			const stage: PipelineStage = { $match: { test: "value" } };
			aggregator.push(stage);
			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual(stage);
		});

		it("should work with complex pipeline stages", () => {
			const aggregator: Aggregator = [
				{ $match: { status: "active" } },
				{ $sort: { createdAt: -1 } },
				{ $limit: 10 },
				{
					$lookup: {
						from: "providers",
						localField: "providerId",
						foreignField: "_id",
						as: "provider",
					},
				},
			];

			expect(aggregator).toHaveLength(4);
			expect(aggregator[0]).toHaveProperty("$match");
			expect(aggregator[1]).toHaveProperty("$sort");
			expect(aggregator[2]).toHaveProperty("$limit");
			expect(aggregator[3]).toHaveProperty("$lookup");
		});
	});

	describe("buildArticleSearchQuery", () => {
		it("should call Article.aggregate with createSearchAggregate result", async () => {
			const queryParams: GetLatestArticlesProps = {
				limit: "10",
				mustContain: ["test"],
			};
			const mockPipeline: Aggregator = [
				{ $match: { test: "value" } },
				{ $limit: 10 },
			];
			const mockResult = [{ id: 1, title: "Test Article" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(mockArticleAggregate).toHaveBeenCalledWith(mockPipeline);
			expect(result).toEqual(mockResult);
		});

		it("should handle empty query parameters", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const mockPipeline: Aggregator = [{ $limit: 100 }];
			const mockResult: any[] = [];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(mockArticleAggregate).toHaveBeenCalledWith(mockPipeline);
			expect(result).toEqual(mockResult);
		});

		it("should handle complex query parameters", async () => {
			const queryParams: GetLatestArticlesProps = {
				mustContain: ["technology", "AI"],
				mustNotContain: ["spam"],
				shouldContain: ["machine learning", "neural networks"],
				minimumShouldMatch: 1,
				before: new Date("2023-12-31"),
				after: new Date("2023-01-01"),
				trustHigher: "70",
				trustLower: "90",
				limit: "50",
				sort: "date-descending",
			};
			const mockPipeline: Aggregator = [
				{
					$search: {
						index: "title",
						compound: {
							must: [{ text: { query: "technology", path: "title" } }],
							mustNot: [{ text: { query: "spam", path: "title" } }],
						},
					},
				},
				{ $limit: 50 },
			];
			const mockResult = [
				{ id: 1, title: "AI Technology Article" },
				{ id: 2, title: "Machine Learning Guide" },
			];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(mockArticleAggregate).toHaveBeenCalledWith(mockPipeline);
			expect(result).toEqual(mockResult);
		});

		it("should handle date range queries", async () => {
			const queryParams: GetLatestArticlesProps = {
				before: new Date("2023-06-01"),
				after: new Date("2023-01-01"),
				within: "1 month",
			};
			const mockPipeline: Aggregator = [
				{
					$search: {
						compound: {
							filter: [
								{
									range: {
										path: "details.published",
										gt: new Date("2023-01-01"),
										lt: new Date("2023-06-01"),
									},
								},
							],
						},
					},
				},
			];
			const mockResult = [{ id: 1, title: "Recent Article" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(result).toEqual(mockResult);
		});

		it("should handle media and content filters", async () => {
			const queryParams: GetLatestArticlesProps = {
				mediaType: "video",
				categories: "technology,science",
				language: "en",
				durationHigher: "60",
				durationLower: "300",
			};
			const mockPipeline: Aggregator = [
				{
					$search: {
						compound: {
							filter: [
								{ text: { query: "video", path: "media.mediaType" } },
								{
									text: {
										query: ["technology", "science"],
										path: "details.categories",
									},
								},
							],
						},
					},
				},
			];
			const mockResult = [{ id: 1, title: "Tech Video" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(result).toEqual(mockResult);
		});

		it("should handle provider trust and leaning filters", async () => {
			const queryParams: GetLatestArticlesProps = {
				trustHigher: "60",
				trustLower: "90",
				leaningHigher: "-0.5",
				leaningLower: "0.5",
				origin: "US",
			};
			const mockPipeline: Aggregator = [
				{
					$lookup: {
						from: "providers",
						localField: "provider",
						foreignField: "_id",
						as: "provider",
					},
				},
				{
					$match: {
						$expr: {
							$and: [
								{ $gte: ["$provider.rating", 60] },
								{ $lte: ["$provider.rating", 90] },
							],
						},
					},
				},
			];
			const mockResult = [{ id: 1, title: "Trusted US Article" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(result).toEqual(mockResult);
		});

		it("should handle sorting options", async () => {
			const queryParams: GetLatestArticlesProps = {
				sort: "relevance",
				mustContain: ["search term"],
			};
			const mockPipeline: Aggregator = [
				{
					$search: {
						sort: {
							score: { $meta: "searchScore", order: 1 },
						},
					},
				},
			];
			const mockResult = [{ id: 1, title: "Most Relevant Article" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(result).toEqual(mockResult);
		});

		it("should handle geographic filters", async () => {
			const queryParams: GetLatestArticlesProps = {
				region: "North America",
				coverage: "national",
			};
			const mockPipeline: Aggregator = [
				{
					$search: {
						compound: {
							filter: [
								{ text: { query: "North America", path: "details.region" } },
								{ text: { query: "national", path: "details.coverage" } },
							],
						},
					},
				},
			];
			const mockResult = [{ id: 1, title: "SF Local News" }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(result).toEqual(mockResult);
		});

		it("should pass empty aggregator array to createSearchAggregate", async () => {
			const queryParams: GetLatestArticlesProps = { limit: "5" };
			const mockPipeline: Aggregator = [{ $limit: 5 }];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue([]);

			await buildArticleSearchQuery(queryParams);

			// Verify that createSearchAggregate was called with an empty array as the second parameter
			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
		});
	});

	describe("Error handling", () => {
		it("should propagate errors from Article.aggregate", async () => {
			const queryParams: GetLatestArticlesProps = { limit: "10" };
			const mockError = new Error("Database connection failed");

			mockCreateSearchAggregate.mockResolvedValue([]);
			mockArticleAggregate.mockRejectedValue(mockError);

			await expect(buildArticleSearchQuery(queryParams)).rejects.toThrow(
				"Database connection failed"
			);
		});

		it("should propagate errors from createSearchAggregate", async () => {
			const queryParams: GetLatestArticlesProps = { limit: "10" };
			const mockError = new Error("Invalid aggregation pipeline");

			mockCreateSearchAggregate.mockRejectedValue(mockError);

			await expect(buildArticleSearchQuery(queryParams)).rejects.toThrow(
				"Invalid aggregation pipeline"
			);
		});

		it("should handle undefined query parameters gracefully", async () => {
			const queryParams = undefined as any;
			const mockPipeline: Aggregator = [];
			const mockResult: any[] = [];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(undefined, []);
			expect(result).toEqual(mockResult);
		});

		it("should handle null query parameters gracefully", async () => {
			const queryParams = null as any;
			const mockPipeline: Aggregator = [];
			const mockResult: any[] = [];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(null, []);
			expect(result).toEqual(mockResult);
		});
	});

	describe("Integration scenarios", () => {
		it("should handle a comprehensive search with all filter types", async () => {
			const queryParams: GetLatestArticlesProps = {
				mustContain: ["technology"],
				mustNotContain: ["spam", "fake"],
				shouldContain: ["AI", "machine learning"],
				filterContain: ["innovation"],
				minimumShouldMatch: 1,
				before: new Date("2023-12-31"),
				after: new Date("2023-01-01"),
				within: "1 month",
				durationHigher: "60",
				durationLower: "3600",
				trustHigher: "70",
				trustLower: "95",
				leaningHigher: "-0.2",
				leaningLower: "0.2",
				origin: "US",
				mediaType: "article",
				categories: "technology,science,innovation",
				language: "en",
				region: "North America",
				coverage: "national",
				sort: "date-descending",
				limit: "25",
			};

			const mockPipeline: Aggregator = [
				{
					$search: {
						index: "title",
						scoreDetails: true,
						sort: { "details.published": -1 },
						compound: {
							must: [{ text: { query: "technology", path: "title" } }],
							mustNot: [
								{ text: { query: "spam", path: "title" } },
								{ text: { query: "fake", path: "title" } },
							],
							should: [
								{ text: { query: "AI", path: "title" } },
								{ text: { query: "machine learning", path: "title" } },
							],
							filter: [
								{ text: { query: "innovation", path: "title" } },
								{ text: { query: "article", path: "media.mediaType" } },
								{
									text: {
										query: ["technology", "science", "innovation"],
										path: "details.categories",
									},
								},
								{ text: { query: "en", path: "details.language" } },
								{ text: { query: "North America", path: "details.region" } },
								{ text: { query: "United States", path: "details.region" } },
								{ text: { query: "national", path: "details.coverage" } },
								{
									range: {
										path: "details.published",
										gt: new Date("2023-01-01"),
										lt: new Date("2023-12-31"),
									},
								},
								{
									range: {
										path: "media.duration",
										gt: 60,
										lt: 3600,
									},
								},
							],
							minimumShouldMatch: 1,
						},
						count: { type: "lowerBound" },
					},
				},
				{
					$lookup: {
						from: "articleproviders",
						localField: "provider",
						foreignField: "_id",
						as: "provider",
					},
				},
				{
					$addFields: {
						score: { $meta: "searchScore" },
						scoreDetails: { $meta: "searchScoreDetails" },
						provider: { $arrayElemAt: ["$provider", 0] },
					},
				},
				{
					$match: {
						$expr: {
							$and: [
								{ $gte: ["$provider.rating", 70] },
								{ $lte: ["$provider.rating", 95] },
							],
						},
					},
				},
				{ $limit: 25 },
			];

			const mockResult = [
				{ id: 1, title: "Advanced AI Technology" },
				{ id: 2, title: "Machine Learning Innovation" },
			];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(mockCreateSearchAggregate).toHaveBeenCalledWith(queryParams, []);
			expect(mockArticleAggregate).toHaveBeenCalledWith(mockPipeline);
			expect(result).toEqual(mockResult);
		});

		it("should handle minimal search with only required parameters", async () => {
			const queryParams: GetLatestArticlesProps = {};
			const mockPipeline: Aggregator = [
				{
					$search: {
						index: "title",
						scoreDetails: true,
						compound: {},
						count: { type: "lowerBound" },
					},
				},
				{ $limit: 100 },
			];
			const mockResult: any[] = [];

			mockCreateSearchAggregate.mockResolvedValue(mockPipeline);
			mockArticleAggregate.mockResolvedValue(mockResult);

			const result = await buildArticleSearchQuery(queryParams);

			expect(result).toEqual(mockResult);
		});
	});
});
