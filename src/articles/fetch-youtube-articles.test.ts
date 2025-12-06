import {
	fetchYoutubeArticles,
	convertYouTubeRssItemToArticle,
	YouTubeRSSItem,
} from "./fetch-youtube-articles";
import { saveArticle } from "./save";
import { filterLimit, deepMerge } from "../utils";
import Article from "../models/Article";
import { ExtraData } from "../types/types";
import { ProviderItem } from "../types/article/provider";
import { FetchArticles } from "./fetch-articles";

// Mock the dependencies
jest.mock("./save");
jest.mock("../utils");
jest.mock("../models/Article");

const mockSaveArticle = saveArticle as jest.MockedFunction<typeof saveArticle>;
const mockFilterLimit = filterLimit as jest.MockedFunction<typeof filterLimit>;
const mockDeepMerge = deepMerge as jest.MockedFunction<typeof deepMerge>;
const mockArticle = Article as jest.Mocked<typeof Article>;

describe("fetch-youtube-articles", () => {
	const mockYouTubeItems: YouTubeRSSItem[] = [
		{
			title: "Video 1",
			link: "https://youtube.com/video1",
			pubDate: "2023-01-01T00:00:00Z",
			author: "Channel 1",
			id: "yt:video:video1Id",
			isoDate: "2023-01-01T00:00:00.000Z",
			description: "First video",
			["media:group"]: {
				["media:title"]: ["Video 1 Title"],
				["media:thumbnail"]: [{ $: { url: "thumb1.jpg" } }],
				["media:description"]: ["Video 1 media description"],
				["media:community"]: [
					{
						["media:starRating"]: [{ $: { average: "4.0" } }],
						["media:statistics"]: [{ $: { views: "1000" } }],
					},
				],
			},
		},
		{
			title: "Video 2",
			link: "https://youtube.com/video2",
			pubDate: "2023-01-02T00:00:00Z",
			author: "Channel 2",
			id: "yt:video:video2Id",
			isoDate: "2023-01-02T00:00:00.000Z",
			description: "Second video",
			["media:group"]: {
				["media:title"]: ["Video 2 Title"],
				["media:thumbnail"]: [{ $: { url: "thumb2.jpg" } }],
				["media:description"]: ["Video 2 media description"],
				["media:community"]: [
					{
						["media:starRating"]: [{ $: { average: "5.0" } }],
						["media:statistics"]: [{ $: { views: "2000" } }],
					},
				],
			},
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		// Set up default mock implementations
		mockFilterLimit.mockImplementation((items) => items);
		mockDeepMerge.mockImplementation((existing, newItem) => ({
			...existing,
			...newItem,
		}));
		mockSaveArticle.mockResolvedValue({
			title: "Test Video",
			src: "https://www.youtube.com/watch?v=test123",
			description: "Test description",
			guid: "test-guid",
			variant: "video",
			avatar: { src: "", alt: "" },
			details: {},
		});
		// Mock Article.findOne to return null by default (no existing article)
		mockArticle.findOne.mockReturnValue({
			lean: jest.fn().mockResolvedValue(null),
		} as any);
	});

	describe("convertYouTubeRssItemToArticle", () => {
		const mockYouTubeItem: YouTubeRSSItem = {
			title: "Test YouTube Video",
			link: "https://www.youtube.com/watch?v=originalId",
			pubDate: "2023-01-01T00:00:00Z",
			author: "Test Channel",
			id: "yt:video:testVideoId123",
			isoDate: "2023-01-01T00:00:00.000Z",
			description: "Test video description",
			["media:group"]: {
				["media:title"]: ["Test Media Title"],
				["media:thumbnail"]: [
					{
						$: {
							url: "https://i.ytimg.com/vi/testVideoId123/hqdefault.jpg",
						},
					},
				],
				["media:description"]: ["Test media description"],
				["media:community"]: [
					{
						["media:starRating"]: [{ $: { average: "4.5" } }],
						["media:statistics"]: [{ $: { views: "12345" } }],
					},
				],
			},
			["yt:videoId"]: "testVideoId123",
			["yt:channelId"]: "testChannelId",
		};

		it("should convert YouTube RSS item with complete data", () => {
			const result = convertYouTubeRssItemToArticle({
				item: mockYouTubeItem,
			});

			expect(result).toEqual({
				title: "Test YouTube Video",
				src: "https://www.youtube.com/watch?v=testVideoId123", // Generated from video ID
				description: "Test video description",
				guid: "yt:video:testVideoId123",
				variant: "video",
				format: "video/youtube",
				avatar: {
					src: "https://i.ytimg.com/vi/testVideoId123/hqdefault.jpg",
					alt: "Test Media Title",
				},
				details: {
					published: "2023-01-01T00:00:00Z",
					publishers: ["Test Channel"],
					categories: [],
					region: undefined,
					coverage: [],
					language: undefined,
				},
				media: {
					format: "video/youtube",
					rating: "4.5",
					views: "12345",
				},
				provider: undefined,
			});
		});

		it("should generate YouTube URL from video ID in item.id", () => {
			const itemWithVideoId: YouTubeRSSItem = {
				...mockYouTubeItem,
				id: "yt:video:customVideoId456",
				link: "https://original-link.com/different",
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithVideoId,
			});

			expect(result.src).toBe(
				"https://www.youtube.com/watch?v=customVideoId456"
			);
		});

		it("should fall back to original link if video ID extraction fails", () => {
			const itemWithoutVideoId: YouTubeRSSItem = {
				...mockYouTubeItem,
				id: "", // Empty string results in empty video ID
				link: "https://fallback-link.com/video",
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithoutVideoId,
			});

			expect(result.src).toBe("https://fallback-link.com/video");
		});

		it("should use invalid format as video ID when prefix is missing", () => {
			const itemWithInvalidFormat: YouTubeRSSItem = {
				...mockYouTubeItem,
				id: "invalid-format", // No yt:video: prefix - will be used as video ID
				link: "https://fallback-link.com/video",
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithInvalidFormat,
			});

			// The function will use "invalid-format" as the video ID
			expect(result.src).toBe("https://www.youtube.com/watch?v=invalid-format");
		});

		it("should handle extraData with categories, region, and media properties", () => {
			const extraData: ExtraData = {
				region: "US",
				coverage: ["national"],
				language: "en",
				categories: ["Technology", "Education"],
				media: {
					quality: "HD",
					duration: 300,
				},
			};

			const result = convertYouTubeRssItemToArticle({
				item: mockYouTubeItem,
				extraData,
			});

			expect(result.details.region).toBe("US");
			expect(result.details.coverage).toEqual(["national"]);
			expect(result.details.language).toBe("en");
			expect(result.details.categories).toEqual(["Technology", "Education"]);
			expect(result.media).toEqual({
				quality: "HD",
				duration: 300,
				format: "video/youtube",
				rating: "4.5",
				views: "12345",
			});
		});

		it("should handle provider information", () => {
			const provider: ProviderItem = {
				name: "YouTube Provider",
				description: "YouTube content provider",
				url: "https://youtube-provider.com",
				rating: 5,
				leaning: 0,
				origin: "US",
			};

			const result = convertYouTubeRssItemToArticle({
				item: mockYouTubeItem,
				provider,
			});

			expect(result.provider).toBe(provider);
		});

		it("should fall back to media description when item description is empty", () => {
			const itemWithoutDescription: YouTubeRSSItem = {
				...mockYouTubeItem,
				description: "", // Empty description
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithoutDescription,
			});

			expect(result.description).toBe("Test media description");
		});

		it("should prioritize item description over media description", () => {
			const itemWithBothDescriptions: YouTubeRSSItem = {
				...mockYouTubeItem,
				description: "Item description",
				["media:group"]: {
					...mockYouTubeItem["media:group"],
					["media:description"]: ["Media description"],
				},
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithBothDescriptions,
			});

			expect(result.description).toBe("Item description");
		});

		it("should handle empty or missing media data gracefully", () => {
			const itemWithMinimalMedia: YouTubeRSSItem = {
				...mockYouTubeItem,
				["media:group"]: {
					["media:title"]: [""],
					["media:thumbnail"]: [{ $: { url: "" } }],
					["media:description"]: [""],
					["media:community"]: [
						{
							["media:starRating"]: [{ $: { average: "0" } }],
							["media:statistics"]: [{ $: { views: "0" } }],
						},
					],
				},
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithMinimalMedia,
			});

			expect(result.avatar.src).toBe("");
			expect(result.avatar.alt).toBe("");
			expect(result.media.rating).toBe("0");
			expect(result.media.views).toBe("0");
		});
	});

	describe("fetchYoutubeArticles", () => {
		it("should process all YouTube items without existing articles", async () => {
			const fetchParams: FetchArticles = {
				items: mockYouTubeItems as any,
			};

			const results = await fetchYoutubeArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith(mockYouTubeItems);
			expect(mockArticle.findOne).toHaveBeenCalledTimes(2);
			expect(mockSaveArticle).toHaveBeenCalledTimes(2);
			expect(mockDeepMerge).not.toHaveBeenCalled(); // No existing articles
			expect(results).toHaveLength(2);
		});

		it("should merge with existing articles when found", async () => {
			const existingArticle = {
				title: "Existing Video",
				src: "https://www.youtube.com/watch?v=video1Id",
				someExistingField: "existing data",
			};

			mockArticle.findOne.mockReturnValueOnce({
				lean: jest.fn().mockResolvedValue(existingArticle),
			} as any);

			mockArticle.findOne.mockReturnValueOnce({
				lean: jest.fn().mockResolvedValue(null),
			} as any);

			const fetchParams: FetchArticles = {
				items: mockYouTubeItems as any,
			};

			await fetchYoutubeArticles(fetchParams);

			expect(mockDeepMerge).toHaveBeenCalledTimes(1);
			expect(mockDeepMerge).toHaveBeenCalledWith(
				existingArticle,
				expect.objectContaining({
					title: "Video 1",
					variant: "video",
				})
			);
		});

		it("should handle empty items array", async () => {
			const fetchParams: FetchArticles = {
				items: [],
			};

			const results = await fetchYoutubeArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith([]);
			expect(mockArticle.findOne).not.toHaveBeenCalled();
			expect(mockSaveArticle).not.toHaveBeenCalled();
			expect(results).toHaveLength(0);
		});

		it("should pass extraData and provider to convertYouTubeRssItemToArticle", async () => {
			const extraData: ExtraData = {
				region: "UK",
				language: "en",
				categories: ["Entertainment"],
				media: { quality: "4K" },
			};

			const provider: ProviderItem = {
				name: "YouTube Provider",
				description: "Provider description",
				url: "https://provider.com",
				rating: 4,
				leaning: 1,
				origin: "UK",
			};

			const fetchParams: FetchArticles = {
				items: [mockYouTubeItems[0]] as any,
				extraData,
				provider,
			};

			await fetchYoutubeArticles(fetchParams);

			expect(mockSaveArticle).toHaveBeenCalledWith(
				expect.objectContaining({
					provider,
					details: expect.objectContaining({
						region: "UK",
						language: "en",
						categories: ["Entertainment"],
					}),
					media: expect.objectContaining({
						quality: "4K",
						format: "video/youtube",
					}),
				})
			);
		});

		it("should handle filterLimit reducing items", async () => {
			const manyItems = Array(100).fill(mockYouTubeItems[0]);
			mockFilterLimit.mockReturnValue(manyItems.slice(0, 50));

			const fetchParams: FetchArticles = {
				items: manyItems as any,
			};

			await fetchYoutubeArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith(manyItems);
			expect(mockSaveArticle).toHaveBeenCalledTimes(50);
		});

		it("should handle saveArticle failures gracefully", async () => {
			mockSaveArticle
				.mockResolvedValueOnce(null) // First call fails
				.mockResolvedValueOnce({
					// Second call succeeds
					title: "Success",
					src: "test",
					description: "",
					guid: "",
					variant: "video",
					avatar: { src: "", alt: "" },
					details: {},
				});

			const fetchParams: FetchArticles = {
				items: mockYouTubeItems as any,
			};

			const results = await fetchYoutubeArticles(fetchParams);

			expect(results).toHaveLength(2);
			expect(results[0]).toBeNull();
			expect(results[1]).not.toBeNull();
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle malformed YouTube items with missing media:group", () => {
			const malformedItem = {
				title: "Malformed Video",
				link: "https://youtube.com/malformed",
				pubDate: "2023-01-01T00:00:00Z",
				author: "Test Channel",
				id: "yt:video:malformed123",
				isoDate: "2023-01-01T00:00:00.000Z",
				description: "Malformed description",
				// Missing media:group entirely
			} as any;

			// This should throw an error since the function tries to access media:group properties
			expect(() => {
				convertYouTubeRssItemToArticle({
					item: malformedItem,
				});
			}).toThrow();
		});

		it("should handle items with malformed media:group structure", () => {
			const itemWithBadMediaGroup = {
				title: "Bad Media Group",
				link: "https://youtube.com/bad",
				pubDate: "2023-01-01T00:00:00Z",
				author: "Test Channel",
				id: "yt:video:bad123",
				isoDate: "2023-01-01T00:00:00.000Z",
				description: "Bad media group",
				["media:group"]: {
					// Missing required arrays or malformed structure
					["media:title"]: [], // Empty array
					["media:thumbnail"]: [], // Empty array
					["media:description"]: [],
					["media:community"]: [],
				},
			} as YouTubeRSSItem;

			// This should throw when trying to access array[0] on empty arrays
			expect(() => {
				convertYouTubeRssItemToArticle({
					item: itemWithBadMediaGroup,
				});
			}).toThrow();
		});

		it("should handle database errors in fetchYoutubeArticles", async () => {
			mockArticle.findOne.mockReturnValue({
				lean: jest.fn().mockRejectedValue(new Error("Database error")),
			} as any);

			const fetchParams: FetchArticles = {
				items: [mockYouTubeItems[0]] as any,
			};

			// Should reject due to database error
			await expect(fetchYoutubeArticles(fetchParams)).rejects.toThrow(
				"Database error"
			);
		});

		it("should handle empty video ID extraction", () => {
			const itemWithEmptyId: YouTubeRSSItem = {
				...mockYouTubeItems[0],
				id: "yt:video:", // Empty video ID after prefix
				link: "https://fallback-link.com",
			};

			const result = convertYouTubeRssItemToArticle({
				item: itemWithEmptyId,
			});

			expect(result.src).toBe("https://fallback-link.com");
		});
	});
});
