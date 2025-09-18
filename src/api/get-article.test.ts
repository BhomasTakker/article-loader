import { getArticle } from "./get-article";
import { getMeta } from "../html/get-meta";
import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

// Mock the dependencies
jest.mock("../html/get-meta");
jest.mock("../lib/mongo/actions/article");

// Mock console.log to test error logging
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

describe("getArticle", () => {
	// Cast the mocks for proper typing
	const mockGetMeta = getMeta as jest.MockedFunction<typeof getMeta>;
	const mockGetArticleExists = getArticleExists as jest.MockedFunction<
		typeof getArticleExists
	>;
	const mockSaveOrCreateArticleBySrc =
		saveOrCreateArticleBySrc as jest.MockedFunction<
			typeof saveOrCreateArticleBySrc
		>;

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		mockConsoleLog.mockClear();
	});

	afterAll(() => {
		// Restore console.log
		mockConsoleLog.mockRestore();
	});

	// Helper function to create a test CollectionItem
	const createTestArticle = (
		overrides: Partial<CollectionItem> = {}
	): CollectionItem => ({
		title: "Test Article",
		src: "https://example.com/article",
		description: "Test description",
		guid: "test-guid",
		variant: "article",
		...overrides,
	});

	describe("successful execution", () => {
		it("should process new article with complete metadata", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/new-article",
				title: "Original Title",
				description: "Original Description",
			});

			const mockMetadata = {
				title: "Extracted Title",
				description: "Extracted Description",
				image: "https://example.com/image.jpg",
				imageAlt: "Image Alt Text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/new-article"
			);
			expect(mockGetMeta).toHaveBeenCalledWith(
				"https://example.com/new-article"
			);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith({
				...inputArticle,
				title: "Extracted Title",
				src: "https://example.com/new-article",
				description: "Extracted Description",
				guid: "",
				variant: "article",
				avatar: {
					src: "https://example.com/image.jpg",
					alt: "Image Alt Text",
				},
			});

			expect(result).toEqual({
				...inputArticle,
				title: "Extracted Title",
				src: "https://example.com/new-article",
				description: "Extracted Description",
				guid: "",
				variant: "article",
				avatar: {
					src: "https://example.com/image.jpg",
					alt: "Image Alt Text",
				},
			});
		});

		it("should handle metadata with missing description", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/article-no-desc",
			});

			const mockMetadata = {
				title: "Article Title",
				description: null,
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: "blog",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.description).toBe("");
			expect(result?.variant).toBe("blog");
		});

		it("should handle metadata with missing imageAlt", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/article-no-alt",
			});

			const mockMetadata = {
				title: "Article Title",
				description: "Article description",
				image: "https://example.com/image.jpg",
				imageAlt: null,
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.avatar?.alt).toBe("");
		});

		it("should handle metadata with missing type", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/article-no-type",
			});

			const mockMetadata = {
				title: "Article Title",
				description: "Article description",
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: null,
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.variant).toBe("");
		});
	});

	describe("early returns", () => {
		it("should return null if article already exists", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/existing-article",
			});

			mockGetArticleExists.mockResolvedValue({ _id: "existing-id" }); // Article exists

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/existing-article"
			);
			expect(mockGetMeta).not.toHaveBeenCalled();
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if getMeta returns null", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/no-meta",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(null);

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/no-meta"
			);
			expect(mockGetMeta).toHaveBeenCalledWith("https://example.com/no-meta");
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if title is missing", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/no-title",
			});

			const mockMetadata = {
				title: null,
				description: "Description",
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if image is missing", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/no-image",
			});

			const mockMetadata = {
				title: "Article Title",
				description: "Description",
				image: null,
				imageAlt: "Alt text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if both title and image are missing", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/no-title-image",
			});

			const mockMetadata = {
				title: null,
				description: "Description",
				image: null,
				imageAlt: "Alt text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe("error handling", () => {
		it("should handle getArticleExists throwing an error", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/exists-error",
			});

			const existsError = new Error("Database connection failed");
			mockGetArticleExists.mockRejectedValue(existsError);

			// Act & Assert
			await expect(getArticle(inputArticle)).rejects.toThrow(
				"Database connection failed"
			);
			expect(mockGetMeta).not.toHaveBeenCalled();
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
		});

		it("should handle getMeta throwing an error", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/meta-error",
			});

			const metaError = new Error("Failed to fetch metadata");
			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockRejectedValue(metaError);

			// Act & Assert
			await expect(getArticle(inputArticle)).rejects.toThrow(
				"Failed to fetch metadata"
			);
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
		});
	});

	describe("edge cases", () => {
		it("should handle empty string values in metadata", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/empty-strings",
			});

			const mockMetadata = {
				title: "Valid Title",
				description: "",
				image: "https://example.com/image.jpg",
				imageAlt: "",
				type: "",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.description).toBe("");
			expect(result?.avatar?.alt).toBe("");
			expect(result?.variant).toBe("");
		});

		it("should handle undefined values in metadata", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/undefined-values",
			});

			const mockMetadata = {
				title: "Valid Title",
				description: undefined,
				image: "https://example.com/image.jpg",
				imageAlt: undefined,
				type: undefined,
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.description).toBe("");
			expect(result?.avatar?.alt).toBe("");
			expect(result?.variant).toBe("");
		});

		it("should preserve original article properties not overridden by metadata", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/preserve-props",
				title: "Original Title",
				description: "Original Description",
				details: {
					categories: ["tech"],
					language: "en",
				},
				provider: {
					name: "Test Provider",
					description: "Test Provider Description",
					url: "https://provider.com",
					rating: 5,
					leaning: 0,
					origin: "test",
				},
			});

			const mockMetadata = {
				title: "Extracted Title",
				description: "Extracted Description",
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.details).toEqual({
				categories: ["tech"],
				language: "en",
			});
			expect(result?.provider).toEqual({
				name: "Test Provider",
				description: "Test Provider Description",
				url: "https://provider.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			});
		});

		it("should handle very long URLs", async () => {
			// Arrange
			const longUrl = "https://example.com/" + "a".repeat(1000);
			const inputArticle = createTestArticle({
				src: longUrl,
			});

			const mockMetadata = {
				title: "Article Title",
				description: "Description",
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await getArticle(inputArticle);

			// Assert
			expect(result?.src).toBe(longUrl);
			expect(mockGetArticleExists).toHaveBeenCalledWith(longUrl);
			expect(mockGetMeta).toHaveBeenCalledWith(longUrl);
		});
	});

	describe("async behavior", () => {
		it("should not wait for save operation to complete before returning", async () => {
			// Arrange
			const inputArticle = createTestArticle({
				src: "https://example.com/async-save",
			});

			const mockMetadata = {
				title: "Article Title",
				description: "Description",
				image: "https://example.com/image.jpg",
				imageAlt: "Alt text",
				type: "article",
			};

			let saveResolve: (value: any) => void;
			const savePromise = new Promise((resolve) => {
				saveResolve = resolve;
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockGetMeta.mockResolvedValue(mockMetadata);
			mockSaveOrCreateArticleBySrc.mockReturnValue(savePromise as any);

			// Act
			const resultPromise = getArticle(inputArticle);

			// The function should return before save completes
			const result = await resultPromise;

			// Assert
			expect(result).toBeDefined();
			expect(result?.title).toBe("Article Title");

			// Now resolve the save operation
			saveResolve!({ message: "Saved Article!" });
			await savePromise;
		});
	});
});
