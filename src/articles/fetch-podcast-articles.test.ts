import {
	fetchPodcastArticles,
	convertPodcastRssItemToArticle,
	PodcastRSSItem,
	PodcastRSSCollection,
} from "./fetch-podcast-articles";
import { saveArticle } from "./save";
import { filterLimit } from "../utils";
import { logMemoryUsage } from "../lib/mem";
import { convertDurationToSeconds } from "./utils";
import { ExtraData } from "../../sources/news/articles/types";
import { ProviderItem } from "../types/article/provider";
import { FetchArticles } from "./fetch-articles";

// Mock the dependencies
jest.mock("./save");
jest.mock("../utils");
jest.mock("../lib/mem");
jest.mock("./utils");

const mockSaveArticle = saveArticle as jest.MockedFunction<typeof saveArticle>;
const mockFilterLimit = filterLimit as jest.MockedFunction<typeof filterLimit>;
const mockLogMemoryUsage = logMemoryUsage as jest.MockedFunction<
	typeof logMemoryUsage
>;
const mockConvertDurationToSeconds =
	convertDurationToSeconds as jest.MockedFunction<
		typeof convertDurationToSeconds
	>;

describe("fetch-podcast-articles", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set up default mock implementations
		mockFilterLimit.mockImplementation((items) => items);
		mockLogMemoryUsage.mockImplementation(() => {});
		mockConvertDurationToSeconds.mockImplementation((duration) => {
			if (duration === "01:30:45") return 5445;
			if (duration === "45:30") return 2730;
			return parseInt(duration) || 0;
		});
		mockSaveArticle.mockResolvedValue({
			title: "Test Episode",
			src: "https://example.com/audio.mp3",
			description: "Test description",
			guid: "test-guid",
			variant: "audio",
			avatar: { src: "", alt: "" },
			details: {},
		});
	});

	describe("convertPodcastRssItemToArticle", () => {
		const mockPodcastItem: PodcastRSSItem = {
			title: "Test Episode",
			description: "Test episode description",
			link: "https://example.com/episode",
			pubDate: "2023-01-01T00:00:00Z",
			itunes: {
				duration: "01:30:45",
				episodeType: "full",
				author: "Episode Author",
				subtitle: "Episode subtitle",
				summary: "Episode summary",
				block: "no",
				explicit: "false",
			},
			content: {
				encoded: "<p>Encoded content</p>",
			},
			guid: "episode-123",
			enclosure: {
				url: "https://example.com/audio.mp3",
				type: "audio/mpeg",
			},
		};

		const mockCollectionData: PodcastRSSCollection = {
			items: [],
			title: "Test Podcast",
			description: "Test podcast description",
			itunes: {
				owner: {
					name: "Podcast Owner",
					email: "owner@example.com",
				},
				image: "https://example.com/podcast-image.jpg",
				categories: ["Technology", "Education"],
				explicit: "false",
				author: "Podcast Author",
				summary: "Podcast summary",
			},
		};

		it("should convert podcast RSS item with complete data", () => {
			const result = convertPodcastRssItemToArticle({
				item: mockPodcastItem,
				collectionData: mockCollectionData,
			});

			expect(result).toEqual({
				title: "Test Episode",
				src: "https://example.com/audio.mp3",
				description: "Test episode description",
				guid: "episode-123",
				variant: "audio",
				avatar: {
					src: "https://example.com/podcast-image.jpg",
					alt: "Test Podcast",
				},
				media: {
					duration: 5445,
					mediaType: "podcast",
					type: "audio/mpeg",
					collectionTitle: undefined,
				},
				details: {
					published: "2023-01-01T00:00:00Z",
					publishers: ["Episode Author"],
					categories: ["Technology", "Education"],
					authors: ["Podcast Author"],
					region: undefined,
					coverage: [],
					language: undefined,
				},
				provider: undefined,
			});

			expect(mockConvertDurationToSeconds).toHaveBeenCalledWith("01:30:45");
		});

		it("should handle minimal required data", () => {
			const minimalItem: PodcastRSSItem = {
				title: "Minimal Episode",
				description: "",
				link: "https://example.com/minimal",
				pubDate: "2023-01-01T00:00:00Z",
				itunes: {
					duration: "30",
					episodeType: "full",
					author: "",
					subtitle: "",
					summary: "Fallback summary",
					block: "no",
					explicit: "false",
				},
				content: {
					encoded: "",
				},
				guid: "minimal-123",
				enclosure: {
					url: "https://example.com/minimal.mp3",
				},
			};

			const result = convertPodcastRssItemToArticle({
				item: minimalItem,
			});

			expect(result).toEqual({
				title: "Minimal Episode",
				src: "https://example.com/minimal.mp3",
				description: "Fallback summary", // Falls back to itunes.summary
				guid: "minimal-123",
				variant: "audio",
				avatar: {
					src: "",
					alt: "",
				},
				media: {
					duration: 30,
					mediaType: "podcast",
					type: "audio/mpeg", // Default type
					collectionTitle: undefined,
				},
				details: {
					published: "2023-01-01T00:00:00Z",
					publishers: [""],
					categories: [],
					authors: [""],
					region: undefined,
					coverage: [],
					language: undefined,
				},
				provider: undefined,
			});
		});

		it("should handle extraData and provider", () => {
			const extraData: ExtraData & { collectionTitle: string } = {
				region: "US",
				coverage: ["national"],
				language: "en",
				categories: ["News", "Politics"],
				collectionTitle: "My Series",
			};

			const provider: ProviderItem = {
				name: "Test Provider",
				description: "Test provider description",
				url: "https://test-provider.com",
				rating: 5,
				leaning: 0,
				origin: "US",
			};

			const result = convertPodcastRssItemToArticle({
				item: mockPodcastItem,
				extraData,
				provider,
				collectionData: mockCollectionData,
			});

			expect(result.details?.region).toBe("US");
			expect(result.details?.coverage).toEqual(["national"]);
			expect(result.details?.language).toBe("en");
			expect(result.details?.categories).toEqual([
				"News",
				"Politics",
				"Technology",
				"Education",
			]);
			expect(result.media?.collectionTitle).toBe("My Series");
			expect(result.provider).toBe(provider);
		});

		it("should handle missing collection data gracefully", () => {
			const result = convertPodcastRssItemToArticle({
				item: mockPodcastItem,
			});

			expect(result.avatar?.src).toBe("");
			expect(result.avatar?.alt).toBe("");
			expect(result.details?.categories).toEqual([]);
			expect(result.details?.authors).toEqual(["Episode Author"]); // Falls back to episode author
		});

		it("should prioritize description over summary", () => {
			const itemWithBoth: PodcastRSSItem = {
				...mockPodcastItem,
				description: "Main description",
				itunes: {
					...mockPodcastItem.itunes,
					summary: "Summary description",
				},
			};

			const result = convertPodcastRssItemToArticle({
				item: itemWithBoth,
			});

			expect(result.description).toBe("Main description");
		});

		it("should fall back to summary when description is empty", () => {
			const itemWithoutDescription: PodcastRSSItem = {
				...mockPodcastItem,
				description: "",
				itunes: {
					...mockPodcastItem.itunes,
					summary: "Summary description",
				},
			};

			const result = convertPodcastRssItemToArticle({
				item: itemWithoutDescription,
			});

			expect(result.description).toBe("Summary description");
		});
	});

	describe("fetchPodcastArticles", () => {
		const mockPodcastItems: PodcastRSSItem[] = [
			{
				title: "Episode 1",
				description: "First episode",
				link: "https://example.com/ep1",
				pubDate: "2023-01-01T00:00:00Z",
				itunes: {
					duration: "45:30",
					episodeType: "full",
					author: "Author 1",
					subtitle: "Subtitle 1",
					summary: "Summary 1",
					block: "no",
					explicit: "false",
				},
				content: { encoded: "" },
				guid: "ep1-123",
				enclosure: {
					url: "https://example.com/ep1.mp3",
					type: "audio/mpeg",
				},
			},
			{
				title: "Episode 2",
				description: "Second episode",
				link: "https://example.com/ep2",
				pubDate: "2023-01-02T00:00:00Z",
				itunes: {
					duration: "30:15",
					episodeType: "full",
					author: "Author 2",
					subtitle: "Subtitle 2",
					summary: "Summary 2",
					block: "no",
					explicit: "false",
				},
				content: { encoded: "" },
				guid: "ep2-123",
				enclosure: {
					url: "https://example.com/ep2.mp3",
					type: "audio/mpeg",
				},
			},
		];

		const mockCollectionData: PodcastRSSCollection = {
			items: [],
			title: "Test Podcast Series",
			description: "Test series description",
			itunes: {
				owner: { name: "Owner", email: "owner@test.com" },
				image: "https://example.com/series.jpg",
				categories: ["Technology"],
				explicit: "false",
				author: "Series Author",
				summary: "Series summary",
			},
		};

		it("should process all podcast items and return results", async () => {
			const fetchParams: FetchArticles = {
				items: mockPodcastItems as any,
				collectionData: mockCollectionData,
			};

			const results = await fetchPodcastArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith(mockPodcastItems);
			expect(mockSaveArticle).toHaveBeenCalledTimes(2);
			expect(mockLogMemoryUsage).toHaveBeenCalledTimes(2);
			expect(results).toHaveLength(2);
		});

		it("should handle empty items array", async () => {
			const fetchParams: FetchArticles = {
				items: [],
			};

			const results = await fetchPodcastArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith([]);
			expect(mockSaveArticle).not.toHaveBeenCalled();
			expect(results).toHaveLength(0);
		});

		it("should handle null/undefined items", async () => {
			const fetchParams: FetchArticles = {
				items: null as any,
			};

			const results = await fetchPodcastArticles(fetchParams);

			expect(mockFilterLimit).toHaveBeenCalledWith([]);
			expect(mockSaveArticle).not.toHaveBeenCalled();
			expect(results).toHaveLength(0);
		});

		it("should pass extraData and provider to convertPodcastRssItemToArticle", async () => {
			const extraData: ExtraData & { collectionTitle: string } = {
				region: "UK",
				language: "en",
				categories: ["Education"],
				collectionTitle: "Test Series",
			};

			const provider: ProviderItem = {
				name: "Test Provider",
				description: "Provider description",
				url: "https://provider.com",
				rating: 4,
				leaning: 1,
				origin: "UK",
			};

			const fetchParams: FetchArticles = {
				items: [mockPodcastItems[0]] as any,
				extraData,
				provider,
				collectionData: mockCollectionData,
			};

			await fetchPodcastArticles(fetchParams);

			expect(mockSaveArticle).toHaveBeenCalledWith(
				expect.objectContaining({
					provider,
					details: expect.objectContaining({
						region: "UK",
						language: "en",
						categories: expect.arrayContaining(["Education"]),
					}),
					media: expect.objectContaining({
						collectionTitle: "Test Series",
					}),
				})
			);
		});

		it("should handle filterLimit reducing items", async () => {
			const manyItems = Array(100).fill(mockPodcastItems[0]);
			mockFilterLimit.mockReturnValue(manyItems.slice(0, 50));

			const fetchParams: FetchArticles = {
				items: manyItems as any,
			};

			await fetchPodcastArticles(fetchParams);

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
					variant: "audio",
					avatar: { src: "", alt: "" },
					details: {},
				});

			const fetchParams: FetchArticles = {
				items: mockPodcastItems as any,
			};

			const results = await fetchPodcastArticles(fetchParams);

			expect(results).toHaveLength(2);
			expect(results[0]).toBeNull();
			expect(results[1]).not.toBeNull();
		});

		it("should log memory usage before and after processing", async () => {
			const fetchParams: FetchArticles = {
				items: [mockPodcastItems[0]] as any,
			};

			await fetchPodcastArticles(fetchParams);

			expect(mockLogMemoryUsage).toHaveBeenCalledTimes(2);
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle malformed podcast items", async () => {
			const malformedItem = {
				title: "Malformed",
				description: "",
				link: "",
				pubDate: "",
				guid: "",
				enclosure: {
					url: "",
				},
				// Provide minimal itunes object to prevent destructuring error
				itunes: {
					duration: "",
					episodeType: "",
					author: "",
					subtitle: "",
					summary: "",
					block: "",
					explicit: "",
				},
				content: {
					encoded: "",
				},
			} as PodcastRSSItem;

			const result = convertPodcastRssItemToArticle({
				item: malformedItem,
			});

			expect(result).toBeDefined();
			expect(result.title).toBe("Malformed");
			expect(result.src).toBe(""); // Empty enclosure URL
			expect(result.variant).toBe("audio");
		});

		it("should handle missing enclosure URL", () => {
			const itemWithoutEnclosure: PodcastRSSItem = {
				title: "No Enclosure",
				description: "Description",
				link: "https://example.com",
				pubDate: "2023-01-01T00:00:00Z",
				itunes: {
					duration: "30",
					episodeType: "full",
					author: "Author",
					subtitle: "",
					summary: "",
					block: "no",
					explicit: "false",
				},
				content: { encoded: "" },
				guid: "no-enclosure",
				enclosure: {
					url: "", // Empty URL
				},
			};

			const result = convertPodcastRssItemToArticle({
				item: itemWithoutEnclosure,
			});

			expect(result.src).toBe("");
		});

		it("should handle duration conversion errors", () => {
			mockConvertDurationToSeconds.mockReturnValue(0);

			const item: PodcastRSSItem = {
				title: "Invalid Duration",
				description: "Description",
				link: "https://example.com",
				pubDate: "2023-01-01T00:00:00Z",
				itunes: {
					duration: "invalid-duration",
					episodeType: "full",
					author: "Author",
					subtitle: "",
					summary: "",
					block: "no",
					explicit: "false",
				},
				content: { encoded: "" },
				guid: "invalid-duration",
				enclosure: {
					url: "https://example.com/audio.mp3",
				},
			};

			const result = convertPodcastRssItemToArticle({ item });

			expect(result.media?.duration).toBe(0);
			expect(mockConvertDurationToSeconds).toHaveBeenCalledWith(
				"invalid-duration"
			);
		});
	});
});
