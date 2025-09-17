import { fetchRSS, fetchYoutubeRSS } from "./utils";
import { fetchArticles } from "../../articles/fetch-articles";
import { fetchYoutubeArticles } from "../../articles/fetch-youtube-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import {
	getCollection,
	getYoutubeCollection,
} from "../../collections/get-collection";

// Mock all dependencies
jest.mock("../../articles/fetch-articles");
jest.mock("../../articles/fetch-youtube-articles");
jest.mock("../../collections/fetch-collections");
jest.mock("../../collections/get-collection");

const mockFetchArticles = fetchArticles as jest.MockedFunction<
	typeof fetchArticles
>;
const mockFetchYoutubeArticles = fetchYoutubeArticles as jest.MockedFunction<
	typeof fetchYoutubeArticles
>;
const mockFetchCollections = fetchCollections as jest.MockedFunction<
	typeof fetchCollections
>;
const mockGetCollection = getCollection as jest.MockedFunction<
	typeof getCollection
>;
const mockGetYoutubeCollection = getYoutubeCollection as jest.MockedFunction<
	typeof getYoutubeCollection
>;

describe("RSS Utils", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("fetchRSS", () => {
		it("should call fetchCollections with correct parameters for RSS sources", () => {
			const mockSources = [
				{ url: "https://example.com/rss1.xml", name: "Source 1" },
				{ url: "https://example.com/rss2.xml", name: "Source 2" },
			];
			const mockResult = { success: true, data: [] };

			mockFetchCollections.mockReturnValue(mockResult as any);

			const result = fetchRSS(mockSources);

			expect(mockFetchCollections).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: mockSources,
				feedCallback: getCollection,
				itemsCallback: fetchArticles,
			});
			expect(result).toBe(mockResult);
		});

		it("should handle empty sources array", () => {
			const emptyArray: any[] = [];
			const mockResult = { success: true, data: [] };

			mockFetchCollections.mockReturnValue(mockResult as any);

			const result = fetchRSS(emptyArray);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: emptyArray,
				feedCallback: getCollection,
				itemsCallback: fetchArticles,
			});
			expect(result).toBe(mockResult);
		});

		it("should pass through the exact sources array without modification", () => {
			const mockSources = [
				{ id: 1, url: "https://news.example.com/feed" },
				{ id: 2, url: "https://tech.example.com/rss" },
				{ id: 3, url: "https://sports.example.com/feed.xml" },
			];

			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(mockSources);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: mockSources,
				feedCallback: getCollection,
				itemsCallback: fetchArticles,
			});
		});

		it("should use getCollection as feedCallback", () => {
			const mockSources = [{ url: "https://example.com/rss.xml" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.feedCallback).toBe(getCollection);
		});

		it("should use fetchArticles as itemsCallback", () => {
			const mockSources = [{ url: "https://example.com/rss.xml" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.itemsCallback).toBe(fetchArticles);
		});

		it("should handle single source", () => {
			const singleSource = [{ url: "https://single.example.com/feed.xml" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(singleSource);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: singleSource,
				feedCallback: getCollection,
				itemsCallback: fetchArticles,
			});
		});

		it("should return the result from fetchCollections", () => {
			const mockSources = [{ url: "https://example.com/rss.xml" }];
			const expectedResult = {
				success: true,
				items: [{ title: "Test Article", url: "https://example.com/article1" }],
			};

			mockFetchCollections.mockReturnValue(expectedResult as any);

			const result = fetchRSS(mockSources);

			expect(result).toEqual(expectedResult);
		});
	});

	describe("fetchYoutubeRSS", () => {
		it("should call fetchCollections with correct parameters for YouTube sources", () => {
			const mockSources = [
				{ channelId: "UC123456", name: "YouTube Channel 1" },
				{ channelId: "UC789012", name: "YouTube Channel 2" },
			];
			const mockResult = { success: true, data: [] };

			mockFetchCollections.mockReturnValue(mockResult as any);

			const result = fetchYoutubeRSS(mockSources);

			expect(mockFetchCollections).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: [...mockSources],
				feedCallback: getYoutubeCollection,
				itemsCallback: fetchYoutubeArticles,
				customFields: {
					item: ["media:group"],
				},
			});
			expect(result).toBe(mockResult);
		});

		it("should spread the sources array (create a copy)", () => {
			const mockSources = [
				{ channelId: "UC123456", name: "Channel 1" },
				{ channelId: "UC789012", name: "Channel 2" },
			];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.sources).toEqual(mockSources);
			expect(callArgs.sources).not.toBe(mockSources); // Should be a different array reference
		});

		it("should include customFields with media:group", () => {
			const mockSources = [{ channelId: "UC123456" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.customFields).toEqual({
				item: ["media:group"],
			});
		});

		it("should use getYoutubeCollection as feedCallback", () => {
			const mockSources = [{ channelId: "UC123456" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.feedCallback).toBe(getYoutubeCollection);
		});

		it("should use fetchYoutubeArticles as itemsCallback", () => {
			const mockSources = [{ channelId: "UC123456" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(mockSources);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.itemsCallback).toBe(fetchYoutubeArticles);
		});

		it("should handle empty sources array", () => {
			const emptyArray: any[] = [];
			const mockResult = { success: true, data: [] };

			mockFetchCollections.mockReturnValue(mockResult as any);

			const result = fetchYoutubeRSS(emptyArray);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: [...emptyArray],
				feedCallback: getYoutubeCollection,
				itemsCallback: fetchYoutubeArticles,
				customFields: {
					item: ["media:group"],
				},
			});
			expect(result).toBe(mockResult);
		});

		it("should handle single YouTube source", () => {
			const singleSource = [{ channelId: "UC123456", name: "Single Channel" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(singleSource);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: [...singleSource],
				feedCallback: getYoutubeCollection,
				itemsCallback: fetchYoutubeArticles,
				customFields: {
					item: ["media:group"],
				},
			});
		});

		it("should return the result from fetchCollections", () => {
			const mockSources = [{ channelId: "UC123456" }];
			const expectedResult = {
				success: true,
				videos: [
					{ title: "Test Video", videoId: "xyz123", channelId: "UC123456" },
				],
			};

			mockFetchCollections.mockReturnValue(expectedResult as any);

			const result = fetchYoutubeRSS(mockSources);

			expect(result).toEqual(expectedResult);
		});

		it("should maintain source array integrity after spread operation", () => {
			const originalSources = [
				{ channelId: "UC111", name: "Channel 1" },
				{ channelId: "UC222", name: "Channel 2" },
			];
			const sourcesCopy = [...originalSources];

			mockFetchCollections.mockReturnValue({} as any);

			fetchYoutubeRSS(originalSources);

			// Original array should be unchanged
			expect(originalSources).toEqual(sourcesCopy);

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.sources).toEqual(originalSources);
		});
	});

	describe("Error Handling", () => {
		it("should handle fetchCollections errors in fetchRSS", () => {
			const mockSources = [{ url: "https://invalid.example.com/feed.xml" }];
			const error = new Error("Network error");

			mockFetchCollections.mockImplementation(() => {
				throw error;
			});

			expect(() => fetchRSS(mockSources)).toThrow("Network error");
		});

		it("should handle fetchCollections errors in fetchYoutubeRSS", () => {
			const mockSources = [{ channelId: "INVALID_CHANNEL" }];
			const error = new Error("YouTube API error");

			mockFetchCollections.mockImplementation(() => {
				throw error;
			});

			expect(() => fetchYoutubeRSS(mockSources)).toThrow("YouTube API error");
		});

		it("should handle null sources in fetchRSS", () => {
			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(null as any);

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: null,
				feedCallback: getCollection,
				itemsCallback: fetchArticles,
			});
		});

		it("should handle undefined sources in fetchYoutubeRSS", () => {
			mockFetchCollections.mockReturnValue({} as any);

			// This should throw an error because undefined is not iterable
			expect(() => fetchYoutubeRSS(undefined as any)).toThrow(
				"srcs is not iterable"
			);
		});
	});

	describe("Function Contracts", () => {
		it("should verify fetchRSS function signature and behavior", () => {
			expect(typeof fetchRSS).toBe("function");
			expect(fetchRSS.length).toBe(1); // Should accept one parameter
		});

		it("should verify fetchYoutubeRSS function signature and behavior", () => {
			expect(typeof fetchYoutubeRSS).toBe("function");
			expect(fetchYoutubeRSS.length).toBe(1); // Should accept one parameter
		});

		it("should ensure fetchRSS and fetchYoutubeRSS are independent functions", () => {
			const rssSource = [{ url: "https://rss.example.com/feed.xml" }];
			const youtubeSource = [{ channelId: "UC123456" }];

			mockFetchCollections.mockReturnValue({} as any);

			fetchRSS(rssSource);
			fetchYoutubeRSS(youtubeSource);

			expect(mockFetchCollections).toHaveBeenCalledTimes(2);

			// Verify first call (RSS)
			const rssCall = mockFetchCollections.mock.calls[0][0];
			expect(rssCall.sources).toEqual(rssSource);
			expect(rssCall.feedCallback).toBe(getCollection);
			expect(rssCall.itemsCallback).toBe(fetchArticles);
			expect(rssCall.customFields).toBeUndefined();

			// Verify second call (YouTube)
			const youtubeCall = mockFetchCollections.mock.calls[1][0];
			expect(youtubeCall.sources).toEqual(youtubeSource);
			expect(youtubeCall.feedCallback).toBe(getYoutubeCollection);
			expect(youtubeCall.itemsCallback).toBe(fetchYoutubeArticles);
			expect(youtubeCall.customFields).toEqual({
				item: ["media:group"],
			});
		});
	});
});
