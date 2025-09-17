import { saveArticle } from "./save";
import { saveOrCreateArticleBySrc } from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

// Mock the mongo action
jest.mock("../lib/mongo/actions/article");

const mockSaveOrCreateArticleBySrc =
	saveOrCreateArticleBySrc as jest.MockedFunction<
		typeof saveOrCreateArticleBySrc
	>;

describe("Save Articles", () => {
	let consoleLogSpy: jest.SpyInstance;

	beforeEach(() => {
		jest.clearAllMocks();
		consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleLogSpy.mockRestore();
	});

	// Helper function to create mock CollectionItem
	const createMockCollectionItem = (
		overrides: Partial<CollectionItem> = {}
	): CollectionItem => ({
		title: "Test Article",
		src: "https://example.com/article/123",
		description: "Test article description",
		guid: "test-guid-123",
		variant: "news",
		...overrides,
	});

	describe("saveArticle", () => {
		describe("Successful Save", () => {
			it("should return the item when saveOrCreateArticleBySrc returns success message", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = await saveArticle(mockItem);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
				expect(result).toBe(mockItem);
				expect(consoleLogSpy).not.toHaveBeenCalled();
			});

			it("should handle item with all optional properties", async () => {
				const mockItem = createMockCollectionItem({
					details: {
						authors: ["John Doe"],
						categories: ["Tech"],
						published: new Date("2023-01-01"),
					},
					avatar: {
						src: "https://example.com/avatar.jpg",
						alt: "Avatar",
					},
					provider: {
						name: "Test Provider",
						description: "Test provider description",
						url: "https://testprovider.com",
						rating: 4,
						leaning: 0,
						origin: "test",
					},
					media: {
						thumbnail: "https://example.com/thumb.jpg",
					},
					rating: "5",
					views: "1000",
					duration: 300,
				});
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = await saveArticle(mockItem);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
				expect(result).toBe(mockItem);
			});

			it("should work with minimal CollectionItem properties", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = await saveArticle(mockItem);

				expect(result).toEqual(mockItem);
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledTimes(1);
			});
		});

		describe("Failed Save", () => {
			it("should return null and log error when saveOrCreateArticleBySrc returns error message", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Error saving article",
				});

				const result = await saveArticle(mockItem);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
				expect(result).toBeNull();
				expect(consoleLogSpy).toHaveBeenCalledWith(
					`Failed to save ${mockItem.src}`
				);
			});

			it("should return null and log error for any non-success message", async () => {
				const mockItem = createMockCollectionItem({
					src: "https://example.com/failed-article",
				});
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Database connection failed",
				});

				const result = await saveArticle(mockItem);

				expect(result).toBeNull();
				expect(consoleLogSpy).toHaveBeenCalledWith(
					"Failed to save https://example.com/failed-article"
				);
			});

			it("should handle empty message", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({ message: "" });

				const result = await saveArticle(mockItem);

				expect(result).toBeNull();
				expect(consoleLogSpy).toHaveBeenCalledWith(
					`Failed to save ${mockItem.src}`
				);
			});

			it("should handle undefined message", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: undefined as any,
				});

				const result = await saveArticle(mockItem);

				expect(result).toBeNull();
				expect(consoleLogSpy).toHaveBeenCalledWith(
					`Failed to save ${mockItem.src}`
				);
			});
		});

		describe("Error Handling", () => {
			it("should handle async errors from saveOrCreateArticleBySrc", async () => {
				const mockItem = createMockCollectionItem();
				const error = new Error("Database connection failed");
				mockSaveOrCreateArticleBySrc.mockRejectedValue(error);

				await expect(saveArticle(mockItem)).rejects.toThrow(
					"Database connection failed"
				);
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
			});

			it("should handle network timeout errors", async () => {
				const mockItem = createMockCollectionItem();
				const timeoutError = new Error("TIMEOUT");
				mockSaveOrCreateArticleBySrc.mockRejectedValue(timeoutError);

				await expect(saveArticle(mockItem)).rejects.toThrow("TIMEOUT");
			});
		});

		describe("Input Validation", () => {
			it("should work with different src URL formats", async () => {
				const testUrls = [
					"https://example.com/article",
					"http://example.com/article",
					"https://subdomain.example.com/path/to/article?param=value",
					"https://example.com/article#section",
				];

				for (const url of testUrls) {
					const mockItem = createMockCollectionItem({ src: url });
					mockSaveOrCreateArticleBySrc.mockResolvedValue({
						message: "Saved Article!",
					});

					const result = await saveArticle(mockItem);

					expect(result).toBe(mockItem);
					expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
				}
			});

			it("should handle special characters in src", async () => {
				const mockItem = createMockCollectionItem({
					src: "https://example.com/article-with-special-chars-ñáéíóú",
				});
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = await saveArticle(mockItem);

				expect(result).toBe(mockItem);
			});

			it("should handle different variant types", async () => {
				const variants = ["news", "video", "podcast", "youtube", "rss"];

				for (const variant of variants) {
					const mockItem = createMockCollectionItem({ variant });
					mockSaveOrCreateArticleBySrc.mockResolvedValue({
						message: "Saved Article!",
					});

					const result = await saveArticle(mockItem);

					expect(result).toBe(mockItem);
				}
			});
		});

		describe("Function Behavior", () => {
			it("should be an async function", () => {
				// Check if the function returns a Promise
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = saveArticle(mockItem);
				expect(result).toBeInstanceOf(Promise);
			});

			it("should call saveOrCreateArticleBySrc exactly once per invocation", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				await saveArticle(mockItem);

				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledTimes(1);
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledWith(mockItem);
			});

			it("should pass the exact item reference to saveOrCreateArticleBySrc", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				await saveArticle(mockItem);

				const callArgs = mockSaveOrCreateArticleBySrc.mock.calls[0][0];
				expect(callArgs).toBe(mockItem);
			});

			it("should return the exact same item reference on success", async () => {
				const mockItem = createMockCollectionItem();
				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const result = await saveArticle(mockItem);

				expect(result).toBe(mockItem); // Same reference, not just equal
			});

			it("should always return null on failure, regardless of input", async () => {
				const items = [
					createMockCollectionItem(),
					createMockCollectionItem({ title: "Different Title" }),
					createMockCollectionItem({ src: "https://different.com" }),
				];

				for (const item of items) {
					mockSaveOrCreateArticleBySrc.mockResolvedValue({
						message: "Failed to save",
					});

					const result = await saveArticle(item);

					expect(result).toBeNull();
				}
			});
		});

		describe("Integration Behavior", () => {
			it("should handle concurrent save operations", async () => {
				const items = [
					createMockCollectionItem({ src: "https://example.com/1" }),
					createMockCollectionItem({ src: "https://example.com/2" }),
					createMockCollectionItem({ src: "https://example.com/3" }),
				];

				mockSaveOrCreateArticleBySrc.mockResolvedValue({
					message: "Saved Article!",
				});

				const promises = items.map((item) => saveArticle(item));
				const results = await Promise.all(promises);

				expect(results).toEqual(items);
				expect(mockSaveOrCreateArticleBySrc).toHaveBeenCalledTimes(3);
			});

			it("should handle mixed success and failure scenarios", async () => {
				const successItem = createMockCollectionItem({
					src: "https://example.com/success",
				});
				const failureItem = createMockCollectionItem({
					src: "https://example.com/failure",
				});

				mockSaveOrCreateArticleBySrc
					.mockResolvedValueOnce({ message: "Saved Article!" })
					.mockResolvedValueOnce({ message: "Error saving article" });

				const [successResult, failureResult] = await Promise.all([
					saveArticle(successItem),
					saveArticle(failureItem),
				]);

				expect(successResult).toBe(successItem);
				expect(failureResult).toBeNull();
				expect(consoleLogSpy).toHaveBeenCalledWith(
					"Failed to save https://example.com/failure"
				);
			});
		});
	});
});
