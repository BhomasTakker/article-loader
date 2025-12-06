import {
	stripQueryStringFromUrl,
	convertRssItem,
	getArticle,
	GetArticle,
} from "./get-article";
import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { getMeta } from "../html/get-meta";
import { mergeStringOrArray } from "../utils";
import { RSSItem } from "../types/article/item";
import { ExtraData } from "../types/types";
import { ProviderItem } from "../types/article/provider";

// Mock the dependencies
jest.mock("../lib/mongo/actions/article");
jest.mock("../html/get-meta");
jest.mock("../utils");

const mockGetArticleExists = getArticleExists as jest.MockedFunction<
	typeof getArticleExists
>;
const mockSaveOrCreateArticleBySrc =
	saveOrCreateArticleBySrc as jest.MockedFunction<
		typeof saveOrCreateArticleBySrc
	>;
const mockGetMeta = getMeta as jest.MockedFunction<typeof getMeta>;
const mockMergeStringOrArray = mergeStringOrArray as jest.MockedFunction<
	typeof mergeStringOrArray
>;

describe("Get Article", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set up default mock implementations
		mockMergeStringOrArray.mockImplementation(
			(val1: string | string[] = [], val2: string | string[] = []) => {
				const arrayVal1 = typeof val1 === "string" ? [val1] : val1;
				const arrayVal2 = typeof val2 === "string" ? [val2] : val2;
				return [...new Set([...arrayVal1, ...arrayVal2])];
			}
		);
		// Set up default successful mock for saveOrCreateArticleBySrc
		mockSaveOrCreateArticleBySrc.mockResolvedValue({
			message: "Saved Article!",
		});
	});

	// Helper function to create mock RSSItem
	const createMockRSSItem = (overrides: Partial<RSSItem> = {}): RSSItem => ({
		title: "Test Article Title",
		description: "Test article description",
		link: "https://example.com/article/test?param=value#section",
		pubDate: "2023-01-01T00:00:00Z",
		author: "Test Author",
		category: "Technology",
		content: "Test content",
		contentSnippet: "Test content snippet",
		guid: "test-guid",
		enclosure: {
			url: "https://example.com/image.jpg",
			type: "image/jpeg",
			length: "12345",
		},
		"content:encoded": "<p>Encoded content</p>",
		...overrides,
	});

	// Helper function to create mock ExtraData
	const createMockExtraData = (
		overrides: Partial<ExtraData> = {}
	): ExtraData => ({
		categories: ["News"],
		region: "US",
		coverage: ["National"],
		language: "en",
		...overrides,
	});

	// Helper function to create mock ProviderItem
	const createMockProvider = (
		overrides: Partial<ProviderItem> = {}
	): ProviderItem => ({
		name: "Test Provider",
		description: "Test provider description",
		url: "https://testprovider.com",
		rating: 4,
		leaning: 0,
		origin: "test",
		...overrides,
	});

	describe("stripQueryStringFromUrl", () => {
		it("should remove query string from URL", () => {
			const url = new URL("https://example.com/path?param=value");
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com/path");
		});

		it("should remove hash fragment from URL", () => {
			const url = new URL("https://example.com/path#section");
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com/path");
		});

		it("should remove both query string and hash fragment", () => {
			const url = new URL(
				"https://example.com/path?param=value&other=test#section"
			);
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com/path");
		});

		it("should handle URL with no query string or hash", () => {
			const url = new URL("https://example.com/path");
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com/path");
		});

		it("should handle root URL", () => {
			const url = new URL("https://example.com/");
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com/");
		});

		it("should handle complex nested paths", () => {
			const url = new URL(
				"https://subdomain.example.com/path/to/article?id=123&category=tech#comments"
			);
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://subdomain.example.com/path/to/article");
		});

		it("should preserve port numbers", () => {
			const url = new URL("https://example.com:8080/path?param=value");
			const result = stripQueryStringFromUrl(url);

			expect(result).toBe("https://example.com:8080/path");
		});
	});

	describe("convertRssItem", () => {
		it("should convert basic RSS item to CollectionItem", () => {
			const rssItem = createMockRSSItem();
			const result = convertRssItem(rssItem);

			expect(result).toEqual({
				title: "Test Article Title",
				src: "https://example.com/article/test",
				description: "Test article description",
				contentEncoded: "<p>Encoded content</p>",
				guid: "",
				variant: "article",
				details: {
					published: "2023-01-01T00:00:00Z",
					categories: ["Technology"],
					publishers: ["Test Author"],
				},
				avatar: {
					src: "https://example.com/image.jpg",
					alt: "Test Article Title",
				},
			});
		});

		it("should use content:encoded when description is not available", () => {
			const rssItem = createMockRSSItem({
				description: "",
				"content:encoded": "<p>Encoded content only</p>",
			});
			const result = convertRssItem(rssItem);

			expect(result.description).toBe("<p>Encoded content only</p>");
		});

		it("should handle missing optional fields", () => {
			const rssItem = createMockRSSItem({
				author: undefined,
				category: undefined,
				enclosure: undefined,
			});
			const result = convertRssItem(rssItem);

			expect(result.details?.categories).toEqual([]);
			expect(result.details?.publishers).toEqual([]);
			expect(result.avatar?.src).toBe("");
		});

		it("should handle missing enclosure URL", () => {
			const rssItem = createMockRSSItem({
				enclosure: {
					type: "image/jpeg",
					length: "12345",
					url: "",
				},
			});
			const result = convertRssItem(rssItem);

			expect(result.avatar?.src).toBe("");
		});

		it("should strip query parameters from link", () => {
			const rssItem = createMockRSSItem({
				link: "https://example.com/article?utm_source=rss&utm_medium=feed",
			});
			const result = convertRssItem(rssItem);

			expect(result.src).toBe("https://example.com/article");
		});

		it("should handle content vs contentSnippet vs description priority", () => {
			const rssItem = createMockRSSItem({
				description: "Description text",
				content: "Content text",
				contentSnippet: "Content snippet text",
				"content:encoded": "<p>Encoded content</p>",
			});
			const result = convertRssItem(rssItem);

			// Should use description over content:encoded based on the code
			expect(result.description).toBe("Description text");
		});
	});

	describe("getArticle", () => {
		describe("Article Exists Check", () => {
			it("should return null when article already exists", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetArticleExists.mockResolvedValue({ _id: "some-id" });

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockGetArticleExists).toHaveBeenCalledWith(
					"https://example.com/article/test"
				);
				expect(mockGetMeta).not.toHaveBeenCalled();
			});

			it("should continue processing when article does not exist", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetArticleExists.mockResolvedValue(null);
				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: "article",
				});

				await getArticle(mockRequest);

				expect(mockGetArticleExists).toHaveBeenCalledWith(
					"https://example.com/article/test"
				);
				expect(mockGetMeta).toHaveBeenCalledWith(
					"https://example.com/article/test"
				);
			});
		});

		describe("Meta Extraction", () => {
			beforeEach(() => {
				mockGetArticleExists.mockResolvedValue(null);
			});

			it("should return null when getMeta returns null", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue(null);

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			});

			it("should return null when title is missing", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "",
					description: "Meta Description",
					image: "https://example.com/image.jpg",
					imageAlt: "Alt text",
					type: "article",
				});

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			});

			it("should return null when image is missing", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "",
					imageAlt: "Alt text",
					type: "article",
				});

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			});

			it("should return null when both title and image are missing", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "",
					description: "Meta Description",
					image: "",
					imageAlt: "Alt text",
					type: "article",
				});

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			});
		});

		describe("Successful Article Processing", () => {
			beforeEach(() => {
				mockGetArticleExists.mockResolvedValue(null);
				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: "article",
				});
			});

			it("should process article with basic data", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				const result = await getArticle(mockRequest);

				expect(result).toBeNull(); // Function always returns null
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith({
					title: "Meta Title",
					src: "https://example.com/article/test",
					description: "Meta Description",
					guid: "",
					variant: "article",
					details: {
						published: "2023-01-01T00:00:00Z",
						categories: ["Technology"],
						publishers: ["Test Author"],
						region: [],
						coverage: [],
						language: undefined,
					},
					avatar: {
						src: "https://example.com/meta-image.jpg",
						alt: "Meta Image Alt",
					},
					provider: undefined,
				});
			});

			it("should merge extra data with RSS item data", async () => {
				const mockItem = createMockRSSItem();
				const mockExtraData = createMockExtraData({
					categories: ["Politics", "Breaking"],
					region: ["US", "Global"],
					coverage: ["National", "International"],
					language: "en-US",
				});
				const mockRequest: GetArticle = {
					item: mockItem,
					extraData: mockExtraData,
				};

				mockMergeStringOrArray
					.mockReturnValueOnce(["US", "Global"]) // region merge
					.mockReturnValueOnce(["National", "International"]); // coverage merge

				await getArticle(mockRequest);

				expect(mockMergeStringOrArray).toHaveBeenCalledWith(
					[],
					["US", "Global"]
				);
				expect(mockMergeStringOrArray).toHaveBeenCalledWith(
					[],
					["National", "International"]
				);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						details: expect.objectContaining({
							region: ["US", "Global"],
							coverage: ["National", "International"],
							language: "en-US",
							categories: ["Technology", "Politics", "Breaking"],
						}),
						categories: ["Politics", "Breaking"],
						region: ["US", "Global"],
						coverage: ["National", "International"],
						language: "en-US",
					})
				);
			});

			it("should include provider data when provided", async () => {
				const mockItem = createMockRSSItem();
				const mockProvider = createMockProvider();
				const mockRequest: GetArticle = {
					item: mockItem,
					provider: mockProvider,
				};

				await getArticle(mockRequest);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						provider: mockProvider,
					})
				);
			});

			it("should handle missing meta description", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: undefined,
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: "article",
				});

				await getArticle(mockRequest);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						description: "",
					})
				);
			});

			it("should handle missing meta imageAlt", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: undefined,
					type: "article",
				});

				await getArticle(mockRequest);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						avatar: {
							src: "https://example.com/meta-image.jpg",
							alt: "",
						},
					})
				);
			});

			it("should handle missing meta type", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: undefined,
				});

				await getArticle(mockRequest);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						variant: "",
					})
				);
			});
		});

		describe("Error Handling", () => {
			beforeEach(() => {
				mockGetArticleExists.mockResolvedValue(null);
			});

			it("should handle getMeta errors", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetMeta.mockRejectedValue(new Error("Network error"));

				await expect(getArticle(mockRequest)).rejects.toThrow("Network error");
			});

			it("should handle getArticleExists errors", async () => {
				const mockItem = createMockRSSItem();
				const mockRequest: GetArticle = { item: mockItem };

				mockGetArticleExists.mockRejectedValue(
					new Error("Database connection error")
				);

				await expect(getArticle(mockRequest)).rejects.toThrow(
					"Database connection error"
				);
			});
		});

		describe("Data Merging", () => {
			beforeEach(() => {
				mockGetArticleExists.mockResolvedValue(null);
				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: "article",
				});
			});

			it("should merge categories correctly", async () => {
				const mockItem = createMockRSSItem({
					category: "Technology",
				});
				const mockExtraData = createMockExtraData({
					categories: ["Politics", "Technology", "Breaking"],
				});
				const mockRequest: GetArticle = {
					item: mockItem,
					extraData: mockExtraData,
				};

				await getArticle(mockRequest);

				const savedArticle = mockSaveOrCreateArticleBySrc.mock.calls[0][0];
				// Should deduplicate categories using Set
				expect(savedArticle.details?.categories).toEqual([
					"Technology",
					"Politics",
					"Breaking",
				]);
			});

			it("should handle empty categories arrays", async () => {
				const mockItem = createMockRSSItem({
					category: undefined,
				});
				const mockExtraData = createMockExtraData({
					categories: [],
				});
				const mockRequest: GetArticle = {
					item: mockItem,
					extraData: mockExtraData,
				};

				await getArticle(mockRequest);

				const savedArticle = mockSaveOrCreateArticleBySrc.mock.calls[0][0];
				expect(savedArticle.details?.categories).toEqual([]);
			});

			it("should call mergeStringOrArray with correct parameters", async () => {
				const mockItem = createMockRSSItem();
				const mockExtraData = createMockExtraData({
					region: "US",
					coverage: ["National"],
				});
				const mockRequest: GetArticle = {
					item: mockItem,
					extraData: mockExtraData,
				};

				await getArticle(mockRequest);

				expect(mockMergeStringOrArray).toHaveBeenCalledWith([], "US");
				expect(mockMergeStringOrArray).toHaveBeenCalledWith([], ["National"]);
			});
		});

		describe("Edge Cases", () => {
			beforeEach(() => {
				mockGetArticleExists.mockResolvedValue(null);
				mockGetMeta.mockResolvedValue({
					title: "Meta Title",
					description: "Meta Description",
					image: "https://example.com/meta-image.jpg",
					imageAlt: "Meta Image Alt",
					type: "article",
				});
			});

			it("should handle malformed URLs in RSS item", async () => {
				const mockItem = createMockRSSItem({
					link: "not-a-valid-url",
				});
				const mockRequest: GetArticle = { item: mockItem };

				// This should throw an error when trying to create URL
				await expect(getArticle(mockRequest)).rejects.toThrow();
			});

			it("should handle all undefined optional fields", async () => {
				const mockItem = createMockRSSItem({
					author: undefined,
					category: undefined,
					pubDate: undefined,
					enclosure: undefined,
					"content:encoded": undefined,
				});
				const mockRequest: GetArticle = { item: mockItem };

				const result = await getArticle(mockRequest);

				expect(result).toBeNull();
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(
					expect.objectContaining({
						details: expect.objectContaining({
							published: undefined,
							categories: [],
							publishers: [],
						}),
					})
				);
			});
		});
	});
});
