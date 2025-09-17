import { fetchArticles, FetchArticles } from "./fetch-articles";
import { getArticle } from "./get-article";
import { RSSItem } from "../types/article/item";
import { ExtraData } from "../../sources/news/articles/types";
import { ProviderItem } from "../types/article/provider";

// Mock the getArticle dependency
jest.mock("./get-article");

const mockGetArticle = getArticle as jest.MockedFunction<typeof getArticle>;

describe("fetchArticles", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Set up default mock implementation
		mockGetArticle.mockResolvedValue(null);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe("with empty items array", () => {
		it("should resolve without calling getArticle", async () => {
			const params: FetchArticles = {
				items: [],
			};

			const result = await fetchArticles(params);

			expect(mockGetArticle).not.toHaveBeenCalled();
			expect(result).toBeUndefined();
		});
	});

	describe("with single item", () => {
		it("should call getArticle once with correct parameters", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
				author: "Test Author",
				category: "test",
			};

			const params: FetchArticles = {
				items: [mockItem],
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: undefined,
				provider: undefined,
			});
		});

		it("should call getArticle with extraData when provided", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
			};

			const mockExtraData: ExtraData = {
				region: "US",
				language: "en",
				categories: ["news", "politics"],
				coverage: ["national"],
			};

			const params: FetchArticles = {
				items: [mockItem],
				extraData: mockExtraData,
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: mockExtraData,
				provider: undefined,
			});
		});

		it("should call getArticle with provider when provided", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
			};

			const mockProvider: ProviderItem = {
				name: "Test Provider",
				description: "A test news provider",
				url: "https://test-provider.com",
				rating: 5,
				leaning: 0,
				origin: "US",
			};

			const params: FetchArticles = {
				items: [mockItem],
				provider: mockProvider,
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: undefined,
				provider: mockProvider,
			});
		});

		it("should call getArticle with all parameters when provided", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
			};

			const mockExtraData: ExtraData = {
				region: "US",
				language: "en",
				categories: ["news"],
			};

			const mockProvider: ProviderItem = {
				name: "Test Provider",
				description: "A test news provider",
				url: "https://test-provider.com",
				rating: 5,
				leaning: 0,
				origin: "US",
			};

			const params: FetchArticles = {
				items: [mockItem],
				extraData: mockExtraData,
				provider: mockProvider,
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: mockExtraData,
				provider: mockProvider,
			});
		});
	});

	describe("with multiple items", () => {
		it("should call getArticle for each item in the array", async () => {
			const mockItems: RSSItem[] = [
				{
					title: "Article 1",
					description: "Description 1",
					link: "https://example.com/article1",
					pubDate: "2023-01-01T00:00:00Z",
				},
				{
					title: "Article 2",
					description: "Description 2",
					link: "https://example.com/article2",
					pubDate: "2023-01-02T00:00:00Z",
					author: "Author 2",
				},
				{
					title: "Article 3",
					description: "Description 3",
					link: "https://example.com/article3",
					pubDate: "2023-01-03T00:00:00Z",
					category: "tech",
				},
			];

			const mockExtraData: ExtraData = {
				region: "UK",
				language: "en",
			};

			const mockProvider: ProviderItem = {
				name: "Multi Provider",
				description: "A multi-article provider",
				url: "https://multi-provider.com",
				rating: 4,
				leaning: 1,
				origin: "UK",
			};

			const params: FetchArticles = {
				items: mockItems,
				extraData: mockExtraData,
				provider: mockProvider,
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(3);

			// Verify each call was made with the correct item
			expect(mockGetArticle).toHaveBeenNthCalledWith(1, {
				item: mockItems[0],
				extraData: mockExtraData,
				provider: mockProvider,
			});

			expect(mockGetArticle).toHaveBeenNthCalledWith(2, {
				item: mockItems[1],
				extraData: mockExtraData,
				provider: mockProvider,
			});

			expect(mockGetArticle).toHaveBeenNthCalledWith(3, {
				item: mockItems[2],
				extraData: mockExtraData,
				provider: mockProvider,
			});
		});

		it("should handle large arrays efficiently", async () => {
			const mockItems: RSSItem[] = Array.from({ length: 100 }, (_, i) => ({
				title: `Article ${i + 1}`,
				description: `Description ${i + 1}`,
				link: `https://example.com/article${i + 1}`,
				pubDate: `2023-01-${String(i + 1).padStart(2, "0")}T00:00:00Z`,
			}));

			const params: FetchArticles = {
				items: mockItems,
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(100);
		});
	});

	describe("return value", () => {
		it("should return a resolved Promise with undefined value", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
			};

			const params: FetchArticles = {
				items: [mockItem],
			};

			const result = await fetchArticles(params);

			expect(result).toBeUndefined();
		});
	});

	describe("edge cases", () => {
		it("should handle items with minimal required fields", async () => {
			const mockItem: RSSItem = {
				title: "",
				description: "",
				link: "",
				pubDate: "",
			};

			const params: FetchArticles = {
				items: [mockItem],
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: undefined,
				provider: undefined,
			});
		});

		it("should handle items with all optional fields", async () => {
			const mockItem: RSSItem = {
				title: "Complete Article",
				description: "Complete description",
				link: "https://example.com/complete",
				pubDate: "2023-01-01T00:00:00Z",
				author: "Complete Author",
				category: "complete",
				content: "Complete content",
				contentSnippet: "Complete snippet",
				"content:encoded": "<p>Encoded content</p>",
				guid: "unique-guid-123",
				isoDate: "2023-01-01T00:00:00.000Z",
				enclosure: {
					type: "audio/mpeg",
					length: "1234567",
					url: "https://example.com/audio.mp3",
				},
			};

			const params: FetchArticles = {
				items: [mockItem],
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: undefined,
				provider: undefined,
			});
		});

		it("should handle collectionData parameter (not passed to getArticle)", async () => {
			const mockItem: RSSItem = {
				title: "Test Article",
				description: "Test description",
				link: "https://example.com/article",
				pubDate: "2023-01-01T00:00:00Z",
			};

			const params: FetchArticles = {
				items: [mockItem],
				collectionData: {
					collectionId: "test-collection",
					metadata: "some metadata",
				},
			};

			await fetchArticles(params);

			expect(mockGetArticle).toHaveBeenCalledTimes(1);
			expect(mockGetArticle).toHaveBeenCalledWith({
				item: mockItem,
				extraData: undefined,
				provider: undefined,
			});
		});
	});
});
