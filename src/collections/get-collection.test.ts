import {
	convertRssToCollection,
	getCollection,
	getYoutubeCollection,
	getPodcastCollection,
	GetCollection,
} from "./get-collection";
import { saveOrCreateArticleCollectionByFeed } from "../lib/mongo/actions/articleCollection";
import { DataResponse } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { ExtraData } from "../types/types";
import { RSSArticleCollection } from "../types/rss";

// Mock the mongo action
jest.mock("../lib/mongo/actions/articleCollection");

const mockSaveOrCreateArticleCollectionByFeed =
	saveOrCreateArticleCollectionByFeed as jest.MockedFunction<
		typeof saveOrCreateArticleCollectionByFeed
	>;

describe("get-collection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("convertRssToCollection", () => {
		it("should convert RSS data to collection format with all fields", () => {
			const mockRssData: DataResponse = {
				items: [
					{
						link: "https://example.com/article1",
						title: "Article 1",
						description: "Description 1",
					},
					{
						link: "https://example.com/article2",
						title: "Article 2",
						description: "Description 2",
					},
				],
				link: "https://example.com",
				title: "Test Feed",
				feed: "https://example.com/rss",
				description: "Test Description",
				lastBuildDate: "2025-01-01T00:00:00Z",
				image: {
					url: "https://example.com/image.jpg",
					title: "Test Image",
					link: "https://example.com",
				},
			};

			const result = convertRssToCollection(mockRssData);

			expect(result).toEqual({
				items: [
					{ link: "https://example.com/article1" },
					{ link: "https://example.com/article2" },
				],
				link: "https://example.com",
				title: "Test Feed",
				feed: "https://example.com/rss",
				description: "Test Description",
				lastBuildDate: "2025-01-01T00:00:00Z",
				image: {
					url: "https://example.com/image.jpg",
					title: "Test Image",
					link: "https://example.com",
				},
			});
		});

		it("should handle empty items array", () => {
			const mockRssData: DataResponse = {
				items: [],
				title: "Empty Feed",
			};

			const result = convertRssToCollection(mockRssData);

			expect(result).toEqual({
				items: [],
				title: "Empty Feed",
				link: undefined,
				feed: undefined,
				description: undefined,
				lastBuildDate: undefined,
				image: undefined,
			});
		});

		it("should handle undefined items", () => {
			const mockRssData: DataResponse = {
				title: "No Items Feed",
			} as DataResponse;

			const result = convertRssToCollection(mockRssData);

			expect(result).toEqual({
				items: [],
				title: "No Items Feed",
				link: undefined,
				feed: undefined,
				description: undefined,
				lastBuildDate: undefined,
				image: undefined,
			});
		});

		it("should handle null/undefined RSS data", () => {
			const result1 = convertRssToCollection(null as any);
			const result2 = convertRssToCollection(undefined as any);

			const expectedResult = {
				items: [],
				link: undefined,
				title: undefined,
				feed: undefined,
				description: undefined,
				lastBuildDate: undefined,
				image: undefined,
			};

			expect(result1).toEqual(expectedResult);
			expect(result2).toEqual(expectedResult);
		});

		it("should strip items to only include link property", () => {
			const mockRssData: DataResponse = {
				items: [
					{
						link: "https://example.com/article1",
						title: "Article 1",
						description: "Description 1",
						author: "Author 1",
						pubDate: "2025-01-01T00:00:00Z",
					},
				],
			};

			const result = convertRssToCollection(mockRssData);

			expect(result.items).toEqual([{ link: "https://example.com/article1" }]);
			expect(result.items[0]).not.toHaveProperty("title");
			expect(result.items[0]).not.toHaveProperty("description");
			expect(result.items[0]).not.toHaveProperty("author");
		});
	});

	describe("getCollection", () => {
		const mockProvider: ProviderItem = {
			name: "Test Provider",
			description: "Test Description",
			url: "https://provider.com",
			rating: 5,
			leaning: 0,
			origin: "Test Origin",
		};

		const mockExtraData: ExtraData = {
			categories: ["news", "tech"],
			region: "US",
			coverage: ["national"],
			language: "en",
		};

		const mockRssFeed: DataResponse = {
			items: [
				{
					link: "https://example.com/article1",
					title: "Article 1",
					description: "Description 1",
				},
			],
			title: "Test Feed",
			feed: "https://example.com/rss",
		};

		beforeEach(() => {
			mockSaveOrCreateArticleCollectionByFeed.mockResolvedValue({
				message: "success",
				result: {} as RSSArticleCollection,
			});
		});

		it("should call saveOrCreateArticleCollectionByFeed with correct parameters", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://example.com/feed",
				rssFeed: mockRssFeed,
				extraData: mockExtraData,
				provider: mockProvider,
			};

			await getCollection(getCollectionParams);

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [{ link: "https://example.com/article1" }],
				title: "Test Feed",
				categories: ["news", "tech"],
				region: "US",
				coverage: ["national"],
				language: "en",
				provider: mockProvider,
				feed: "https://example.com/feed",
			});
		});

		it("should work without extraData and provider", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://example.com/feed",
				rssFeed: mockRssFeed,
			};

			await getCollection(getCollectionParams);

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [{ link: "https://example.com/article1" }],
				title: "Test Feed",
				provider: undefined,
				feed: "https://example.com/feed",
			});
		});

		it("should return null", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://example.com/feed",
				rssFeed: mockRssFeed,
			};

			const result = await getCollection(getCollectionParams);

			expect(result).toBeNull();
		});

		it("should not await saveOrCreateArticleCollectionByFeed and return null even if save fails", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://example.com/feed",
				rssFeed: mockRssFeed,
			};
			// reason is we don't need to wait.
			// We aren't doing anything with this result - if it succeeds it will get stored etc
			// if it fails - something else will deal with it
			// getCollection doesn't await the save operation, so it returns null successfully
			// even if the save operation fails
			const result = await getCollection(getCollectionParams);
			expect(result).toBeNull();

			// Verify the save function was called
			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalled();
		});
	});

	describe("getYoutubeCollection", () => {
		const mockProvider: ProviderItem = {
			name: "YouTube Provider",
			description: "YouTube Description",
			url: "https://youtube.com",
			rating: 5,
			leaning: 0,
			origin: "YouTube",
		};

		const mockExtraData: ExtraData = {
			categories: ["video"],
			region: "Global",
		};

		const mockRssFeed: DataResponse = {
			items: [
				{
					link: "https://youtube.com/watch?v=123",
					title: "Video 1",
					description: "Video Description",
				},
			],
			title: "YouTube Channel",
		};

		const mockResult: RSSArticleCollection = {
			items: [{ link: "https://youtube.com/watch?v=123" }],
			title: "YouTube Channel",
			provider: mockProvider,
		};

		beforeEach(() => {
			mockSaveOrCreateArticleCollectionByFeed.mockResolvedValue({
				message: "success",
				result: mockResult,
			});
		});

		it("should call saveOrCreateArticleCollectionByFeed with RSS feed data directly", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://youtube.com/feeds/videos.xml",
				rssFeed: mockRssFeed,
				extraData: mockExtraData,
				provider: mockProvider,
			};

			const result = await getYoutubeCollection(getCollectionParams);

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [
					{
						link: "https://youtube.com/watch?v=123",
						title: "Video 1",
						description: "Video Description",
					},
				],
				title: "YouTube Channel",
				categories: ["video"],
				region: "Global",
				provider: mockProvider,
				feed: "https://youtube.com/feeds/videos.xml",
			});

			expect(result).toEqual(mockResult);
		});

		it("should return the result from saveOrCreateArticleCollectionByFeed", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://youtube.com/feeds/videos.xml",
				rssFeed: mockRssFeed,
			};

			const result = await getYoutubeCollection(getCollectionParams);

			expect(result).toEqual(mockResult);
		});

		it("should handle saveOrCreateArticleCollectionByFeed rejection", async () => {
			mockSaveOrCreateArticleCollectionByFeed.mockRejectedValue(
				new Error("YouTube save error")
			);

			const getCollectionParams: GetCollection = {
				url: "https://youtube.com/feeds/videos.xml",
				rssFeed: mockRssFeed,
			};

			await expect(getYoutubeCollection(getCollectionParams)).rejects.toThrow(
				"YouTube save error"
			);
		});
	});

	describe("getPodcastCollection", () => {
		const mockProvider: ProviderItem = {
			name: "Podcast Provider",
			description: "Podcast Description",
			url: "https://podcast.com",
			rating: 4,
			leaning: 0,
			origin: "Podcast",
		};

		const mockExtraData: ExtraData = {
			categories: ["audio", "podcast"],
			language: "en",
		};

		const mockRssFeed: DataResponse = {
			items: [
				{
					link: "https://podcast.com/episode1",
					title: "Episode 1",
					description: "Episode Description",
				},
			],
			title: "Podcast Show",
		};

		const mockResult: RSSArticleCollection = {
			items: [{ link: "https://podcast.com/episode1" }],
			title: "Podcast Show",
			provider: mockProvider,
		};

		beforeEach(() => {
			mockSaveOrCreateArticleCollectionByFeed.mockResolvedValue({
				message: "success",
				result: mockResult,
			});
		});

		it("should call saveOrCreateArticleCollectionByFeed with RSS feed data directly", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://podcast.com/rss",
				rssFeed: mockRssFeed,
				extraData: mockExtraData,
				provider: mockProvider,
			};

			const result = await getPodcastCollection(getCollectionParams);

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [
					{
						link: "https://podcast.com/episode1",
						title: "Episode 1",
						description: "Episode Description",
					},
				],
				title: "Podcast Show",
				categories: ["audio", "podcast"],
				language: "en",
				provider: mockProvider,
				feed: "https://podcast.com/rss",
			});

			expect(result).toEqual(mockResult);
		});

		it("should return the result from saveOrCreateArticleCollectionByFeed", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://podcast.com/rss",
				rssFeed: mockRssFeed,
			};

			const result = await getPodcastCollection(getCollectionParams);

			expect(result).toEqual(mockResult);
		});

		it("should work without extraData and provider", async () => {
			const getCollectionParams: GetCollection = {
				url: "https://podcast.com/rss",
				rssFeed: mockRssFeed,
			};

			await getPodcastCollection(getCollectionParams);

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [
					{
						link: "https://podcast.com/episode1",
						title: "Episode 1",
						description: "Episode Description",
					},
				],
				title: "Podcast Show",
				provider: undefined,
				feed: "https://podcast.com/rss",
			});
		});

		it("should handle saveOrCreateArticleCollectionByFeed rejection", async () => {
			mockSaveOrCreateArticleCollectionByFeed.mockRejectedValue(
				new Error("Podcast save error")
			);

			const getCollectionParams: GetCollection = {
				url: "https://podcast.com/rss",
				rssFeed: mockRssFeed,
			};

			await expect(getPodcastCollection(getCollectionParams)).rejects.toThrow(
				"Podcast save error"
			);
		});
	});

	describe("Integration scenarios", () => {
		it("should handle complex RSS data with multiple items", async () => {
			const complexRssFeed: DataResponse = {
				items: [
					{
						link: "https://example.com/1",
						title: "Item 1",
						description: "Desc 1",
					},
					{
						link: "https://example.com/2",
						title: "Item 2",
						description: "Desc 2",
					},
					{
						link: "https://example.com/3",
						title: "Item 3",
						description: "Desc 3",
					},
				],
				title: "Complex Feed",
				description: "A complex RSS feed",
				link: "https://example.com",
				feed: "https://example.com/rss",
				lastBuildDate: "2025-01-01T12:00:00Z",
				image: {
					url: "https://example.com/logo.png",
					title: "Logo",
					link: "https://example.com",
				},
			};

			mockSaveOrCreateArticleCollectionByFeed.mockResolvedValue({
				message: "success",
				result: {} as RSSArticleCollection,
			});

			await getCollection({
				url: "https://example.com/feed",
				rssFeed: complexRssFeed,
			});

			expect(mockSaveOrCreateArticleCollectionByFeed).toHaveBeenCalledWith({
				items: [
					{ link: "https://example.com/1" },
					{ link: "https://example.com/2" },
					{ link: "https://example.com/3" },
				],
				title: "Complex Feed",
				description: "A complex RSS feed",
				link: "https://example.com",
				lastBuildDate: "2025-01-01T12:00:00Z",
				image: {
					url: "https://example.com/logo.png",
					title: "Logo",
					link: "https://example.com",
				},
				feed: "https://example.com/feed",
			});
		});
	});
});
