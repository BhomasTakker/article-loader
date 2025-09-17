import {
	getQueriesFromPage,
	executeQuery,
	getPageRoutes,
	executeAndCacheQueriesFromPage,
	pingApp,
} from "./page-queries";
import { API_PROVIDERS, apiMap } from ".";
import { logMemoryUsage } from "../../../lib/mem";
import {
	getPageByRoute,
	getPagesByUser,
} from "../../../lib/mongo/actions/page/get-page";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { IPage, WithQuery } from "../../../types/page/page";
import { Types } from "mongoose";

// Mock all dependencies
jest.mock(".", () => ({
	API_PROVIDERS: {
		ARTICLES_SEARCH_API: "articles-search-api",
		YOUTUBE_API: "youtube-api",
	},
	apiMap: new Map([
		["articles-search-api", jest.fn()],
		["youtube-api", jest.fn()],
	]),
}));

jest.mock("../../../lib/mem");
jest.mock("../../../lib/mongo/actions/page/get-page");
jest.mock("../../../lib/mongo/db");
jest.mock("dotenv", () => ({
	config: jest.fn(),
}));

// Global fetch mock
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const mockLogMemoryUsage = logMemoryUsage as jest.MockedFunction<
	typeof logMemoryUsage
>;
const mockGetPageByRoute = getPageByRoute as jest.MockedFunction<
	typeof getPageByRoute
>;
const mockGetPagesByUser = getPagesByUser as jest.MockedFunction<
	typeof getPagesByUser
>;
const mockConnectToMongoDB = connectToMongoDB as jest.MockedFunction<
	typeof connectToMongoDB
>;

describe("Page Queries", () => {
	// Helper function to create a complete mock page
	const createMockPage = (components: any[] = []): IPage =>
		({
			meta: {
				pageTitle: "Test Page",
				pageDescription: "Test Description",
				pageKeywords: "test,keywords",
				pageImage: "test-image.jpg",
				favIcons: [],
				showCardData: false,
				cardData: {
					title: "Test",
					description: "Test",
					image: "test.jpg",
					"image:alt": "Test Alt",
					locale: "en",
					site_name: "Test Site",
					url: "https://test.com",
				},
			},
			style: {},
			profile: {
				pageTitle: "Test Page",
				showPageTitle: true,
			},
			route: "/test",
			creator: new Types.ObjectId(),
			createdAt: new Date(),
			updatedAt: new Date(),
			content: {
				containerType: "Stack",
				props: {},
				components,
			},
		} as unknown as IPage);

	beforeEach(() => {
		jest.clearAllMocks();
		// Reset environment variables
		delete process.env.ADMIN_USER;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("getQueriesFromPage", () => {
		it("should extract queries from page components with _with property", () => {
			const mockPage = createMockPage([
				{
					componentType: "test-component",
					componentProps: {},
					_with: {
						type: "api",
						query: {
							provider: "articles-search-api",
							params: { search: "test" },
							queryId: "test-query-1",
						},
					},
				},
				{
					componentType: "another-component",
					componentProps: {},
					_with: {
						type: "api",
						query: {
							provider: "youtube-api",
							params: { q: "test video" },
							queryId: "test-query-2",
						},
					},
				},
			]);

			const result = getQueriesFromPage(mockPage);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				provider: "articles-search-api",
				params: { search: "test" },
				queryId: "test-query-1",
			});
			expect(result[1]).toEqual({
				provider: "youtube-api",
				params: { q: "test video" },
				queryId: "test-query-2",
			});
			expect(mockLogMemoryUsage).toHaveBeenCalled();
		});

		it("should extract queries from componentProps._with when _with is not present", () => {
			const mockPage = createMockPage([
				{
					componentType: "legacy-component",
					componentProps: {
						_with: {
							type: "api",
							query: {
								provider: "articles-search-api",
								params: { category: "tech" },
								queryId: "legacy-query",
							},
						},
					},
					_with: undefined as any,
				},
			]);

			const result = getQueriesFromPage(mockPage);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				provider: "articles-search-api",
				params: { category: "tech" },
				queryId: "legacy-query",
			});
		});

		it("should return null for components without queries and log warnings", () => {
			const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
			const mockPage = createMockPage([
				{
					componentType: "no-query-component",
					componentProps: {},
					_with: undefined as any,
				},
				{
					componentType: "empty-with-component",
					componentProps: {},
					_with: {
						type: "api",
						query: undefined as any,
					},
				},
			]);

			const result = getQueriesFromPage(mockPage);

			expect(result).toHaveLength(2);
			expect(result[0]).toBeNull();
			expect(result[1]).toBeNull();
			expect(consoleSpy).toHaveBeenCalledTimes(2);
			expect(consoleSpy).toHaveBeenCalledWith(
				"No query found in component:",
				expect.any(Object)
			);

			consoleSpy.mockRestore();
		});

		it("should handle empty components array", () => {
			const mockPage = createMockPage([]);

			const result = getQueriesFromPage(mockPage);

			expect(result).toHaveLength(0);
			expect(mockLogMemoryUsage).toHaveBeenCalled();
		});
	});

	describe("executeQuery", () => {
		it("should execute query with valid provider", async () => {
			const mockApi = jest.fn().mockResolvedValue({ data: "test result" });
			(apiMap.get as jest.Mock) = jest.fn().mockReturnValue(mockApi);

			const query: WithQuery = {
				provider: "articles-search-api",
				params: { search: "test" },
				queryId: "test-query",
			};

			const result = await executeQuery(query);

			expect(apiMap.get).toHaveBeenCalledWith("articles-search-api");
			expect(mockApi).toHaveBeenCalledWith({ search: "test" });
			expect(result).toEqual({ data: "test result" });
			expect(mockLogMemoryUsage).toHaveBeenCalled();
		});

		it("should handle invalid provider and log error", async () => {
			const consoleSpy = jest.spyOn(console, "error").mockImplementation();
			(apiMap.get as jest.Mock) = jest.fn().mockReturnValue(undefined);

			const query: WithQuery = {
				provider: "invalid-provider",
				params: { search: "test" },
				queryId: "test-query",
			};

			const result = await executeQuery(query);

			expect(apiMap.get).toHaveBeenCalledWith("invalid-provider");
			expect(consoleSpy).toHaveBeenCalledWith(
				"No API found for provider:",
				"invalid-provider"
			);
			expect(result).toBeNull();

			consoleSpy.mockRestore();
		});

		it("should handle API errors gracefully", async () => {
			const mockApi = jest.fn().mockRejectedValue(new Error("API Error"));
			(apiMap.get as jest.Mock) = jest.fn().mockReturnValue(mockApi);

			const query: WithQuery = {
				provider: "articles-search-api",
				params: { search: "test" },
				queryId: "test-query",
			};

			await expect(executeQuery(query)).rejects.toThrow("API Error");
			expect(mockLogMemoryUsage).toHaveBeenCalled();
		});
	});

	describe("getPageRoutes", () => {
		it("should return page routes for valid user", async () => {
			process.env.ADMIN_USER = "test-user-id";
			const mockPages = [
				{ route: "/home" },
				{ route: "/about" },
				{ route: "/contact" },
			];

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(mockPages as any);

			const result = await getPageRoutes();

			expect(mockConnectToMongoDB).toHaveBeenCalled();
			expect(mockGetPagesByUser).toHaveBeenCalledWith("test-user-id");
			expect(result).toEqual(["/home", "/about", "/contact"]);
		});

		it("should handle missing USER_ID environment variable", async () => {
			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			const result = await getPageRoutes();

			expect(consoleSpy).toHaveBeenCalledWith(
				"No USER_ID found in environment variables."
			);
			expect(result).toEqual([]);
			expect(mockConnectToMongoDB).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});

		it("should handle null pages response", async () => {
			process.env.ADMIN_USER = "test-user-id";

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(null);

			const result = await getPageRoutes();

			expect(result).toEqual([]);
		});

		it("should handle empty pages array", async () => {
			process.env.ADMIN_USER = "test-user-id";

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue([]);

			const result = await getPageRoutes();

			expect(result).toEqual([]);
		});
	});

	describe("executeAndCacheQueriesFromPage", () => {
		beforeEach(() => {
			process.env.ADMIN_USER = "test-user-id";
		});

		it("should execute queries for filtered routes and providers", async () => {
			const mockPages = [
				{ route: "/test-route" },
				{ route: "/another-test" },
				{ route: "/excluded" },
			];
			const mockPage = createMockPage([
				{
					componentType: "test-component",
					componentProps: {},
					_with: {
						type: "api",
						query: {
							provider: "articles-search-api",
							params: { search: "test" },
							queryId: "test-query",
						},
					},
				},
			]);

			const mockApi = jest.fn().mockResolvedValue({ data: "test result" });

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			mockGetPageByRoute.mockResolvedValue(mockPage as any);
			(apiMap.get as jest.Mock) = jest.fn().mockReturnValue(mockApi);

			await executeAndCacheQueriesFromPage(
				["articles-search-api" as API_PROVIDERS],
				["test"]
			);

			expect(mockConnectToMongoDB).toHaveBeenCalled();
			expect(mockGetPageByRoute).toHaveBeenCalledWith("/test-route");
			expect(mockGetPageByRoute).toHaveBeenCalledWith("/another-test");
			expect(mockGetPageByRoute).not.toHaveBeenCalledWith("/excluded");
		});

		it("should skip routes that don't match filter", async () => {
			const mockPages = [{ route: "/unmatched-route" }];

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(mockPages as any);

			await executeAndCacheQueriesFromPage(
				["articles-search-api" as API_PROVIDERS],
				["test"]
			);

			expect(mockGetPageByRoute).not.toHaveBeenCalled();
		});

		it("should skip queries with providers not in the allowed list", async () => {
			const mockPages = [{ route: "/test-route" }];
			const mockPage = createMockPage([
				{
					componentType: "test-component",
					componentProps: {},
					_with: {
						type: "api",
						query: {
							provider: "youtube-api",
							params: { q: "test" },
							queryId: "test-query",
						},
					},
				},
			]);

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			mockGetPageByRoute.mockResolvedValue(mockPage as any);

			await executeAndCacheQueriesFromPage(
				["articles-search-api" as API_PROVIDERS],
				["test"]
			);

			expect(apiMap.get).not.toHaveBeenCalled();
		});

		it("should handle null page response", async () => {
			const mockPages = [{ route: "/test-route" }];

			mockConnectToMongoDB.mockResolvedValue(undefined);
			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			mockGetPageByRoute.mockResolvedValue(null);

			await executeAndCacheQueriesFromPage(
				["articles-search-api" as API_PROVIDERS],
				["test"]
			);

			// Should not throw an error
			expect(mockGetPageByRoute).toHaveBeenCalledWith("/test-route");
		});
	});

	describe("pingApp", () => {
		beforeEach(() => {
			process.env.ADMIN_USER = "test-user-id";
		});

		it("should ping filtered routes successfully", async () => {
			const mockPages = [
				{ route: "/" },
				{ route: "/test-page" },
				{ route: "/excluded" },
			];

			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				status: 200,
			});

			const consoleSpy = jest.spyOn(console, "log").mockImplementation();

			await pingApp(["test"]);

			expect(global.fetch).toHaveBeenCalledWith("https://datatattat.com/", {
				method: "GET",
			});
			expect(global.fetch).toHaveBeenCalledWith(
				"https://datatattat.com/test-page",
				{ method: "GET" }
			);
			expect(global.fetch).not.toHaveBeenCalledWith(
				"https://datatattat.com/excluded",
				{ method: "GET" }
			);
			expect(consoleSpy).toHaveBeenCalledWith(
				"All routes pinged successfully:",
				["/", "/test-page", "/excluded"]
			);

			consoleSpy.mockRestore();
		});

		it("should always ping root route", async () => {
			const mockPages = [{ route: "/" }, { route: "/other" }];

			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				status: 200,
			});

			await pingApp(["nonexistent"]);

			expect(global.fetch).toHaveBeenCalledWith("https://datatattat.com/", {
				method: "GET",
			});
			expect(global.fetch).not.toHaveBeenCalledWith(
				"https://datatattat.com/other",
				{ method: "GET" }
			);
		});

		it("should handle fetch errors and log them", async () => {
			const mockPages = [{ route: "/test-page" }];
			const fetchError = new Error("Network error");

			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			(global.fetch as jest.Mock).mockRejectedValue(fetchError);

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			await expect(pingApp(["test"])).rejects.toThrow("Network error");

			expect(consoleSpy).toHaveBeenCalledWith(
				"Error pinging route:",
				"/test-page",
				fetchError
			);

			consoleSpy.mockRestore();
		});

		it("should handle empty includes array", async () => {
			const mockPages = [{ route: "/" }, { route: "/other" }];

			mockGetPagesByUser.mockResolvedValue(mockPages as any);
			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				status: 200,
			});

			await pingApp([]);

			// Should only ping root route
			expect(global.fetch).toHaveBeenCalledTimes(1);
			expect(global.fetch).toHaveBeenCalledWith("https://datatattat.com/", {
				method: "GET",
			});
		});

		it("should call logMemoryUsage", async () => {
			mockGetPagesByUser.mockResolvedValue([]);

			await pingApp(["test"]);

			expect(mockLogMemoryUsage).toHaveBeenCalled();
		});
	});
});
