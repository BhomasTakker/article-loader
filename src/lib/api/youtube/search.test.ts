// Mock the dependencies before importing the module
jest.doMock("../../../services/env", () => ({
	getYouTubeApiKey: jest.fn().mockReturnValue("test-api-key"),
}));
jest.doMock("../../redis/redis-fetch", () => ({
	setCache: jest.fn(),
}));

import {
	convertYouTubeItems,
	buildYouTubeSearchUrl,
	fetchYouTubeAPIData,
	youtubeApiFetch,
	YouTubeSearchParams,
} from "./search";
import { YouTubeItem } from "../../../types/youtube/youtube";
import { CollectionItem } from "../../../types/article/item";

const mockGetYouTubeApiKey = require("../../../services/env").getYouTubeApiKey;
const mockSetCache = require("../../redis/redis-fetch").setCache;

// Mock fetch globally
global.fetch = jest.fn();

const mockYouTubeItem: YouTubeItem = {
	kind: "youtube#searchResult",
	etag: "test-etag",
	id: {
		kind: "youtube#video",
		videoId: "test-video-id-123",
	},
	snippet: {
		publishedAt: "2023-01-01T12:00:00Z",
		channelId: "test-channel-id",
		title: "Test Video Title",
		description: "This is a test video description with some content.",
		thumbnails: {
			default: {
				url: "https://i.ytimg.com/vi/test-video-id-123/default.jpg",
				width: 120,
				height: 90,
			},
			medium: {
				url: "https://i.ytimg.com/vi/test-video-id-123/mqdefault.jpg",
				width: 320,
				height: 180,
			},
			high: {
				url: "https://i.ytimg.com/vi/test-video-id-123/hqdefault.jpg",
				width: 480,
				height: 360,
			},
		},
		channelTitle: "Test Channel",
		liveBroadcastContent: "none",
		publishTime: "2023-01-01T12:00:00Z",
	},
};

const mockYouTubeAPIResponse = {
	kind: "youtube#searchListResponse",
	etag: "response-etag",
	nextPageToken: "next-page-token",
	regionCode: "US",
	pageInfo: {
		totalResults: 1000,
		resultsPerPage: 5,
	},
	items: [mockYouTubeItem],
};

describe("YouTube Search API", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetYouTubeApiKey.mockReturnValue("test-api-key");
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("convertYouTubeItems", () => {
		it("should convert a single YouTube item to CollectionItem format", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);

			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({
				src: "https://www.youtube.com/watch?v=test-video-id-123",
				avatar: {
					src: "https://i.ytimg.com/vi/test-video-id-123/hqdefault.jpg",
					alt: "Test Video Title",
				},
				title: "Test Video Title",
				description: "This is a test video description with some content.",
				guid: "test-video-id-123",
				provider: undefined,
				variant: "video",
				details: {
					docs: [],
					categories: [],
					authors: [],
					publishers: ["Test Channel"],
					published: "2023-01-01T12:00:00Z",
					region: "",
					language: "",
				},
			});
		});

		it("should convert multiple YouTube items", () => {
			const secondItem: YouTubeItem = {
				...mockYouTubeItem,
				id: {
					kind: "youtube#video",
					videoId: "second-video-id",
				},
				snippet: {
					...mockYouTubeItem.snippet,
					title: "Second Video Title",
					description: "Second video description",
					channelTitle: "Second Channel",
				},
			};

			const result = convertYouTubeItems([mockYouTubeItem, secondItem]);

			expect(result).toHaveLength(2);
			expect(result[0].title).toBe("Test Video Title");
			expect(result[1].title).toBe("Second Video Title");
			expect(result[0].guid).toBe("test-video-id-123");
			expect(result[1].guid).toBe("second-video-id");
		});

		it("should handle empty array", () => {
			const result = convertYouTubeItems([]);
			expect(result).toEqual([]);
		});

		it("should use high quality thumbnail", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);
			expect(result[0].avatar?.src).toBe(
				"https://i.ytimg.com/vi/test-video-id-123/hqdefault.jpg"
			);
		});

		it("should create correct YouTube watch URL", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);
			expect(result[0].src).toBe(
				"https://www.youtube.com/watch?v=test-video-id-123"
			);
		});

		it("should set variant to 'video'", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);
			expect(result[0].variant).toBe("video");
		});

		it("should map channel title to publishers array", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);
			expect(result[0].details?.publishers).toEqual(["Test Channel"]);
		});

		it("should preserve published date", () => {
			const result = convertYouTubeItems([mockYouTubeItem]);
			expect(result[0].details?.published).toBe("2023-01-01T12:00:00Z");
		});
	});

	describe("buildYouTubeSearchUrl", () => {
		const testApiKey = "test-api-key-123";

		it("should build URL with required parameters only", () => {
			const params: YouTubeSearchParams = {};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.origin).toBe("https://www.googleapis.com");
			expect(url.pathname).toBe("/youtube/v3/search");
			expect(url.searchParams.get("key")).toBe(testApiKey);
			expect(url.searchParams.get("part")).toBe("snippet");
			expect(url.searchParams.get("type")).toBe("video");
			expect(url.searchParams.get("videoSyndicated")).toBe("true");
		});

		it("should include search query parameter", () => {
			const params: YouTubeSearchParams = { q: "test search query" };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("q")).toBe("test search query");
		});

		it("should include order parameter", () => {
			const params: YouTubeSearchParams = { order: "date" };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("order")).toBe("date");
		});

		it("should include maxResults parameter", () => {
			const params: YouTubeSearchParams = { maxResults: 25 };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("maxResults")).toBe("25");
		});

		it("should include channelId parameter", () => {
			const params: YouTubeSearchParams = { channelId: "UC123456789" };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("channelId")).toBe("UC123456789");
		});

		it("should include date range parameters", () => {
			const params: YouTubeSearchParams = {
				publishedAfter: "2023-01-01T00:00:00Z",
				publishedBefore: "2023-12-31T23:59:59Z",
			};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("publishedAfter")).toBe(
				"2023-01-01T00:00:00Z"
			);
			expect(url.searchParams.get("publishedBefore")).toBe(
				"2023-12-31T23:59:59Z"
			);
		});

		it("should include location parameters", () => {
			const params: YouTubeSearchParams = {
				location: "37.42307,-122.08427",
				locationRadius: "5km",
			};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("location")).toBe("37.42307,-122.08427");
			expect(url.searchParams.get("locationRadius")).toBe("5km");
		});

		it("should include event type parameter", () => {
			const params: YouTubeSearchParams = { eventType: "live" };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("eventType")).toBe("live");
		});

		it("should include video duration parameter", () => {
			const params: YouTubeSearchParams = { videoDuration: "medium" };
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("videoDuration")).toBe("medium");
		});

		it("should include safety and language parameters", () => {
			const params: YouTubeSearchParams = {
				safeSearch: "moderate",
				relevanceLanguage: "en",
			};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("safeSearch")).toBe("moderate");
			expect(url.searchParams.get("relevanceLanguage")).toBe("en");
		});

		it("should include all parameters when provided", () => {
			const params: YouTubeSearchParams = {
				q: "test query",
				order: "viewCount",
				maxResults: 10,
				channelId: "UC123",
				eventType: "completed",
				videoDuration: "long",
				safeSearch: "strict",
				relevanceLanguage: "es",
				topicId: "/m/04rlf",
				channelType: "show",
			};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("q")).toBe("test query");
			expect(url.searchParams.get("order")).toBe("viewCount");
			expect(url.searchParams.get("maxResults")).toBe("10");
			expect(url.searchParams.get("channelId")).toBe("UC123");
			expect(url.searchParams.get("eventType")).toBe("completed");
			expect(url.searchParams.get("videoDuration")).toBe("long");
			expect(url.searchParams.get("safeSearch")).toBe("strict");
			expect(url.searchParams.get("relevanceLanguage")).toBe("es");
			expect(url.searchParams.get("topicId")).toBe("/m/04rlf");
			expect(url.searchParams.get("channelType")).toBe("show");
		});

		it("should skip undefined and null parameters", () => {
			const params: YouTubeSearchParams = {
				q: "test",
				order: undefined,
				maxResults: null as any,
				channelId: "",
			};
			const url = buildYouTubeSearchUrl(params, testApiKey);

			expect(url.searchParams.get("q")).toBe("test");
			expect(url.searchParams.get("order")).toBeNull();
			expect(url.searchParams.get("maxResults")).toBeNull();
			expect(url.searchParams.get("channelId")).toBe("");
		});
	});

	describe("fetchYouTubeAPIData", () => {
		const testUrl = new URL(
			"https://www.googleapis.com/youtube/v3/search?key=test&part=snippet"
		);

		beforeEach(() => {
			(global.fetch as jest.Mock).mockClear();
		});

		it("should fetch and return converted YouTube data on success", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockYouTubeAPIResponse,
			});

			const result = await fetchYouTubeAPIData(testUrl);

			expect(global.fetch).toHaveBeenCalledWith(testUrl);
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe("Test Video Title");
			expect(result[0].guid).toBe("test-video-id-123");
		});

		it("should handle API response with empty items array", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({ ...mockYouTubeAPIResponse, items: [] }),
			});

			const result = await fetchYouTubeAPIData(testUrl);

			expect(result).toEqual([]);
		});

		it("should handle API response with no items property", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({}),
			});

			const result = await fetchYouTubeAPIData(testUrl);

			expect(result).toEqual([]);
		});

		it("should handle API response with null data", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => null,
			});

			const result = await fetchYouTubeAPIData(testUrl);

			expect(result).toEqual([]);
		});

		it("should throw error when response is not ok", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: "Bad Request",
			});

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"YouTube API error: 400 Bad Request"
			);
		});

		it("should throw error when response is 401 Unauthorized", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 401,
				statusText: "Unauthorized",
			});

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"YouTube API error: 401 Unauthorized"
			);
		});

		it("should throw error when response is 403 Forbidden", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 403,
				statusText: "Forbidden",
			});

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"YouTube API error: 403 Forbidden"
			);
		});

		it("should throw error when response is 429 Too Many Requests", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: false,
				status: 429,
				statusText: "Too Many Requests",
			});

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"YouTube API error: 429 Too Many Requests"
			);
		});

		it("should throw error when fetch throws network error", async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error("Network error")
			);

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"Network error"
			);
		});

		it("should throw error when JSON parsing fails", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => {
					throw new Error("Invalid JSON");
				},
			});

			await expect(fetchYouTubeAPIData(testUrl)).rejects.toThrow(
				"Invalid JSON"
			);
		});
	});

	describe("youtubeApiFetch", () => {
		const consoleSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		beforeEach(() => {
			(global.fetch as jest.Mock).mockClear();
			mockSetCache.mockClear();
			consoleSpy.mockClear();
		});

		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it("should successfully fetch and cache YouTube data", async () => {
			const mockItems = convertYouTubeItems([mockYouTubeItem]);
			mockSetCache.mockResolvedValueOnce(mockItems);

			const params: YouTubeSearchParams = { q: "test query" };
			const result = await youtubeApiFetch(params);

			expect(result).toEqual({ items: mockItems });
			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				expect.stringContaining("https://www.googleapis.com/youtube/v3/search"),
				3600
			);
		});

		it("should use custom cache time when provided", async () => {
			const mockItems = convertYouTubeItems([mockYouTubeItem]);
			mockSetCache.mockResolvedValueOnce(mockItems);

			const params: YouTubeSearchParams = { q: "test query" };
			await youtubeApiFetch(params, 7200);

			expect(mockSetCache).toHaveBeenCalledWith(
				expect.any(Function),
				expect.stringContaining("https://www.googleapis.com/youtube/v3/search"),
				7200
			);
		});

		it("should redact API key in cache key", async () => {
			const mockItems = convertYouTubeItems([mockYouTubeItem]);
			mockSetCache.mockResolvedValueOnce(mockItems);

			const params: YouTubeSearchParams = { q: "test query" };
			await youtubeApiFetch(params);

			const [[, cacheKey]] = mockSetCache.mock.calls;
			expect(cacheKey).toContain("***REDACTED***");
			expect(cacheKey).not.toContain("test-api-key");
		});

		it("should throw error when no API key is found", async () => {
			// Need to mock the module again with null API key
			jest.doMock("../../../services/env", () => ({
				getYouTubeApiKey: jest.fn().mockReturnValue(null),
			}));

			// Re-import the module to get the version with null API key
			jest.resetModules();
			const searchModule = await import("./search");

			const params: YouTubeSearchParams = { q: "test query" };

			await expect(searchModule.youtubeApiFetch(params)).rejects.toThrow(
				"No API Key found"
			);
		});

		it("should throw error when API key is empty string", async () => {
			// Need to mock the module again with empty string API key
			jest.doMock("../../../services/env", () => ({
				getYouTubeApiKey: jest.fn().mockReturnValue(""),
			}));

			// Re-import the module to get the version with empty API key
			jest.resetModules();
			const searchModule = await import("./search");

			const params: YouTubeSearchParams = { q: "test query" };

			await expect(searchModule.youtubeApiFetch(params)).rejects.toThrow(
				"No API Key found"
			);
		});

		it("should handle cache errors and return empty object", async () => {
			mockSetCache.mockRejectedValueOnce(new Error("Cache error"));

			const params: YouTubeSearchParams = { q: "test query" };
			const result = await youtubeApiFetch(params);

			expect(result).toEqual({});
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error fetching youtube data",
				expect.any(Error)
			);
		});

		it("should handle API fetch errors and return empty object", async () => {
			mockSetCache.mockImplementationOnce(
				async (fetchFn: () => Promise<any>) => {
					// Execute the fetch function to trigger the API call
					await fetchFn();
				}
			);
			(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

			const params: YouTubeSearchParams = { q: "test query" };
			const result = await youtubeApiFetch(params);

			expect(result).toEqual({});
			expect(consoleSpy).toHaveBeenCalledWith(
				"Error fetching youtube data",
				expect.any(Error)
			);
		});

		it("should build correct URL with all parameters", async () => {
			const mockItems = convertYouTubeItems([mockYouTubeItem]);
			mockSetCache.mockResolvedValueOnce(mockItems);

			const params: YouTubeSearchParams = {
				q: "javascript tutorial",
				order: "date",
				maxResults: 10,
				channelId: "UC123456789",
				publishedAfter: "2023-01-01T00:00:00Z",
				safeSearch: "moderate",
			};

			await youtubeApiFetch(params);

			const [[, cacheKey]] = mockSetCache.mock.calls;
			expect(cacheKey).toContain("q=javascript+tutorial");
			expect(cacheKey).toContain("order=date");
			expect(cacheKey).toContain("maxResults=10");
			expect(cacheKey).toContain("channelId=UC123456789");
			expect(cacheKey).toContain("publishedAfter=2023-01-01T00%3A00%3A00Z");
			expect(cacheKey).toContain("safeSearch=moderate");
		});

		it("should pass correct fetchUrl to fetchYouTubeAPIData", async () => {
			let capturedUrl: URL;
			mockSetCache.mockImplementationOnce(
				async (fetchFn: () => Promise<CollectionItem[]>) => {
					(global.fetch as jest.Mock).mockResolvedValueOnce({
						ok: true,
						status: 200,
						json: async () => mockYouTubeAPIResponse,
					});
					return await fetchFn();
				}
			);

			const params: YouTubeSearchParams = { q: "test", maxResults: 5 };
			await youtubeApiFetch(params);

			expect(global.fetch).toHaveBeenCalledWith(expect.any(URL));
			const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
			capturedUrl = fetchCall[0];

			expect(capturedUrl.searchParams.get("key")).toBe("test-api-key");
			expect(capturedUrl.searchParams.get("q")).toBe("test");
			expect(capturedUrl.searchParams.get("maxResults")).toBe("5");
			expect(capturedUrl.searchParams.get("part")).toBe("snippet");
			expect(capturedUrl.searchParams.get("type")).toBe("video");
			expect(capturedUrl.searchParams.get("videoSyndicated")).toBe("true");
		});
	});
});
