import { searchArticles, GetLatestArticlesProps } from "./search";
import { buildArticleSearchQuery } from "./query";
import { setCache } from "../../../redis/redis-fetch";

// Mock the dependencies
jest.mock("./query", () => ({
	buildArticleSearchQuery: jest.fn(),
}));

jest.mock("../../../redis/redis-fetch", () => ({
	setCache: jest.fn(),
}));

describe("Search Articles", () => {
	let mockBuildArticleSearchQuery: jest.MockedFunction<
		typeof buildArticleSearchQuery
	>;
	let mockSetCache: jest.MockedFunction<typeof setCache>;

	beforeEach(() => {
		mockBuildArticleSearchQuery =
			buildArticleSearchQuery as jest.MockedFunction<
				typeof buildArticleSearchQuery
			>;
		mockSetCache = setCache as jest.MockedFunction<typeof setCache>;
		jest.clearAllMocks();
	});

	describe("searchArticles", () => {
		const mockArticles = [
			{
				title: "Test Article 1",
				src: "https://example.com/1",
				description: "Test description 1",
				guid: "test-1",
				variant: "article",
			},
			{
				title: "Test Article 2",
				src: "https://example.com/2",
				description: "Test description 2",
				guid: "test-2",
				variant: "article",
			},
		];

		it("should call setCache with correct parameters and return articles", async () => {
			const searchParams: GetLatestArticlesProps = {
				mustContain: ["javascript"],
				limit: "10",
			};

			mockSetCache.mockResolvedValue(undefined);

			const result = await searchArticles(searchParams);

			expect(mockSetCache).toHaveBeenCalledTimes(1);
			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				JSON.stringify(searchParams),
				3600
			);
			expect(result).toEqual({
				items: undefined,
			});
		});

		it("should use custom cache time when provided", async () => {
			const searchParams: GetLatestArticlesProps = {
				shouldContain: ["react"],
			};
			const customCacheTime = 1800;

			mockSetCache.mockResolvedValue(undefined);

			await searchArticles(searchParams, customCacheTime);

			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				JSON.stringify(searchParams),
				customCacheTime
			);
		});

		it("should handle empty search parameters", async () => {
			const searchParams: GetLatestArticlesProps = {};

			mockSetCache.mockResolvedValue(undefined);

			const result = await searchArticles(searchParams);

			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				JSON.stringify(searchParams),
				3600
			);
			expect(result).toEqual({
				items: undefined,
			});
		});

		it("should handle search with multiple parameters", async () => {
			const searchParams: GetLatestArticlesProps = {
				mustContain: ["javascript"],
				mustNotContain: ["spam"],
				shouldContain: ["react"],
				contentType: "article",
				language: "en",
				limit: "20",
			};

			mockSetCache.mockResolvedValue(undefined);

			const result = await searchArticles(searchParams);

			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				JSON.stringify(searchParams),
				3600
			);
			expect(result.items).toBeUndefined();
		});

		it("should create proper JSON cache key from parameters", async () => {
			const searchParams: GetLatestArticlesProps = {
				mustContain: ["test"],
				before: new Date("2023-01-01"),
				coverage: "national",
			};

			mockSetCache.mockResolvedValue(undefined);

			await searchArticles(searchParams);

			const expectedCacheKey = JSON.stringify(searchParams);
			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				expectedCacheKey,
				3600
			);
		});
	});
});
