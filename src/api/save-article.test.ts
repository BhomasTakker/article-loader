import { saveArticle } from "./save-article";
import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

// Mock the dependencies
jest.mock("../lib/mongo/actions/article");

// Mock console.log to test error logging
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

describe("saveArticle", () => {
	// Cast the mocks for proper typing
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
		it("should save new article when it doesn't exist", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/new-article",
				title: "New Article",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/new-article"
			);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});

		it("should save new article with overwrite false (default)", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/default-overwrite",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article); // No overwrite parameter

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/default-overwrite"
			);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});

		it("should return existing article when it exists and overwrite is false", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/existing-article",
				title: "Existing Article",
			});

			mockGetArticleExists.mockResolvedValue({ _id: "existing-id" }); // Article exists

			// Act
			const result = await saveArticle(article, false);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/existing-article"
			);
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toEqual(article);
		});

		it("should save existing article when overwrite is true", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/overwrite-article",
				title: "Updated Article",
			});

			mockGetArticleExists.mockResolvedValue({ _id: "existing-id" }); // Article exists
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Updated Article!",
			});

			// Act
			const result = await saveArticle(article, true);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/overwrite-article"
			);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});

		it("should handle articles with all required fields", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/complete-article",
				title: "Complete Article",
				description: "Complete description",
				guid: "complete-guid",
				variant: "blog",
				details: {
					categories: ["tech", "programming"],
					language: "en",
					published: "2023-09-18T10:00:00Z",
				},
				avatar: {
					src: "https://example.com/avatar.jpg",
					alt: "Avatar alt text",
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

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});
	});

	describe("early returns", () => {
		it("should return null if article has no src", async () => {
			// Arrange
			const article = createTestArticle({
				src: "", // Empty src
				title: "Article without src",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).not.toHaveBeenCalled();
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if article has undefined src", async () => {
			// Arrange
			const article = createTestArticle({
				title: "Article without src",
			});
			// Remove the src property
			delete (article as any).src;

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).not.toHaveBeenCalled();
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it("should return null if article has null src", async () => {
			// Arrange
			const article = createTestArticle({
				src: null as any, // Null src
				title: "Article with null src",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).not.toHaveBeenCalled();
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});
	});

	describe("overwrite behavior", () => {
		it("should respect overwrite=false with existing article", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/no-overwrite",
			});

			mockGetArticleExists.mockResolvedValue({ _id: "existing-id" }); // Article exists

			// Act
			const result = await saveArticle(article, false);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/no-overwrite"
			);
			expect(mockSaveOrCreateArticleBySrc).not.toHaveBeenCalled();
			expect(result).toEqual(article);
		});

		it("should respect overwrite=true with existing article", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/force-overwrite",
			});

			mockGetArticleExists.mockResolvedValue({ _id: "existing-id" }); // Article exists
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Overwritten Article!",
			});

			// Act
			const result = await saveArticle(article, true);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/force-overwrite"
			);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});

		it("should save new article regardless of overwrite parameter", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/new-with-overwrite",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act - test both overwrite values
			const resultFalse = await saveArticle(article, false);
			jest.clearAllMocks();
			mockGetArticleExists.mockResolvedValue(null);
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});
			const resultTrue = await saveArticle(article, true);

			// Assert
			expect(resultFalse).toEqual(article);
			expect(resultTrue).toEqual(article);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledTimes(1); // Called once in second test
		});
	});

	describe("edge cases", () => {
		it("should handle articles with special characters in src", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/article-with-特殊字符?query=测试&param=值",
				title: "Article with special characters",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(
				"https://example.com/article-with-特殊字符?query=测试&param=值"
			);
			expect(result).toEqual(article);
		});

		it("should handle very long URLs", async () => {
			// Arrange
			const longUrl = "https://example.com/" + "a".repeat(2000);
			const article = createTestArticle({
				src: longUrl,
				title: "Article with very long URL",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			expect(mockGetArticleExists).toHaveBeenCalledWith(longUrl);
			expect(result).toEqual(article);
		});

		it("should handle articles with minimal required fields", async () => {
			// Arrange
			const minimalArticle: CollectionItem = {
				title: "Minimal Article",
				src: "https://example.com/minimal",
				description: "Minimal description",
				guid: "minimal-guid",
				variant: "article",
			};

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(minimalArticle);

			// Assert
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(minimalArticle);
			expect(result).toEqual(minimalArticle);
		});

		it("should handle whitespace-only src", async () => {
			// Arrange
			const article = createTestArticle({
				src: "   ", // Whitespace-only src
				title: "Article with whitespace src",
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const result = await saveArticle(article);

			// Assert
			// Note: The function treats whitespace-only strings as valid src
			// since it only checks for falsy values (!src)
			expect(mockGetArticleExists).toHaveBeenCalledWith("   ");
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article);
			expect(result).toEqual(article);
		});
	});

	describe("async behavior", () => {
		it("should not wait for save operation to complete before returning", async () => {
			// Arrange
			const article = createTestArticle({
				src: "https://example.com/async-save",
			});

			let saveResolve: (value: any) => void;
			const savePromise = new Promise((resolve) => {
				saveResolve = resolve;
			});

			mockGetArticleExists.mockResolvedValue(null); // Article doesn't exist
			mockSaveOrCreateArticleBySrc.mockReturnValue(savePromise as any);

			// Act
			const resultPromise = saveArticle(article);

			// The function should return before save completes
			const result = await resultPromise;

			// Assert
			expect(result).toEqual(article);

			// Now resolve the save operation
			saveResolve!({ message: "Saved Article!" });
			await savePromise;
		});

		it("should handle concurrent saves of different articles", async () => {
			// Arrange
			const article1 = createTestArticle({
				src: "https://example.com/concurrent-1",
				title: "Concurrent Article 1",
			});
			const article2 = createTestArticle({
				src: "https://example.com/concurrent-2",
				title: "Concurrent Article 2",
			});

			mockGetArticleExists.mockResolvedValue(null); // Articles don't exist
			mockSaveOrCreateArticleBySrc.mockResolvedValue({
				message: "Saved Article!",
			});

			// Act
			const [result1, result2] = await Promise.all([
				saveArticle(article1),
				saveArticle(article2),
			]);

			// Assert
			expect(result1).toEqual(article1);
			expect(result2).toEqual(article2);
			expect(mockGetArticleExists).toHaveBeenCalledTimes(2);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledTimes(2);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article1);
			expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(article2);
		});
	});
});
