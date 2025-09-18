import { fetchAPI } from "./fetch-api";
import { connectToMongoDB } from "../lib/mongo/db";
import { CollectionItem } from "../types/article/item";

// Mock the MongoDB connection
jest.mock("../lib/mongo/db");

// Mock console.log to test error logging
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

describe("fetchAPI", () => {
	// Cast the mock for proper typing
	const mockConnectToMongoDB = connectToMongoDB as jest.MockedFunction<
		typeof connectToMongoDB
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

	describe("successful execution", () => {
		it("should successfully fetch data and process items", async () => {
			// Arrange
			const mockApiData = {
				items: [
					{ id: 1, name: "Item 1" },
					{ id: 2, name: "Item 2" },
				],
				total: 2,
			};

			const mockCollectionItems: CollectionItem[] = [
				{
					title: "Item 1",
					src: "https://example.com/item1",
					description: "Description 1",
					guid: "guid-1",
					variant: "article",
					details: {
						categories: ["news"],
						language: "en",
					},
				},
				{
					title: "Item 2",
					src: "https://example.com/item2",
					description: "Description 2",
					guid: "guid-2",
					variant: "article",
					details: {
						categories: ["tech"],
						language: "en",
					},
				},
			];

			const mockFetchFn = jest.fn().mockResolvedValue(mockApiData);
			const mockItemsCallback = jest
				.fn()
				.mockResolvedValue(mockCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchFn).toHaveBeenCalledTimes(1);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockApiData);
			expect(result).toEqual(mockCollectionItems);
		});

		it("should handle empty results from fetchFn", async () => {
			// Arrange
			const mockApiData = { items: [], total: 0 };
			const mockCollectionItems: CollectionItem[] = [];

			const mockFetchFn = jest.fn().mockResolvedValue(mockApiData);
			const mockItemsCallback = jest
				.fn()
				.mockResolvedValue(mockCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(result).toEqual([]);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockApiData);
		});

		it("should handle items with null values from itemsCallback", async () => {
			// Arrange
			const mockApiData = {
				items: [
					{ id: 1, name: "Valid Item" },
					{ id: 2, name: "Invalid Item" },
					{ id: 3, name: "Another Valid Item" },
				],
			};

			const mockCollectionItems: (CollectionItem | null)[] = [
				{
					title: "Valid Item",
					src: "https://example.com/valid",
					description: "Valid item description",
					guid: "valid-guid",
					variant: "article",
				},
				null, // This represents a filtered/invalid item
				{
					title: "Another Valid Item",
					src: "https://example.com/another-valid",
					description: "Another valid item description",
					guid: "another-valid-guid",
					variant: "article",
				},
			];

			const mockFetchFn = jest.fn().mockResolvedValue(mockApiData);
			const mockItemsCallback = jest
				.fn()
				.mockResolvedValue(mockCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(result).toEqual(mockCollectionItems);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockApiData);
		});

		it("should work with different generic types", async () => {
			// Arrange
			interface CustomApiResponse {
				data: string[];
				metadata: { version: string };
			}

			const mockApiData: CustomApiResponse = {
				data: ["item1", "item2"],
				metadata: { version: "1.0" },
			};

			const mockCollectionItems: CollectionItem[] = [
				{
					title: "Processed item1",
					src: "https://example.com/processed1",
					description: "Processed item 1 description",
					guid: "processed-1-guid",
					variant: "article",
				},
				{
					title: "Processed item2",
					src: "https://example.com/processed2",
					description: "Processed item 2 description",
					guid: "processed-2-guid",
					variant: "article",
				},
			];

			const mockFetchFn = jest
				.fn<Promise<CustomApiResponse>, []>()
				.mockResolvedValue(mockApiData);
			const mockItemsCallback = jest
				.fn<Promise<CollectionItem[]>, [CustomApiResponse]>()
				.mockResolvedValue(mockCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI<CustomApiResponse>({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(result).toEqual(mockCollectionItems);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockApiData);
		});
	});

	describe("error handling", () => {
		it("should handle MongoDB connection errors", async () => {
			// Arrange
			const connectionError = new Error("Failed to connect to MongoDB");
			const mockFetchFn = jest.fn();
			const mockItemsCallback = jest.fn();

			mockConnectToMongoDB.mockRejectedValue(connectionError);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchFn).not.toHaveBeenCalled();
			expect(mockItemsCallback).not.toHaveBeenCalled();
			expect(mockConsoleLog).toHaveBeenCalledWith(connectionError);
			expect(result).toEqual({
				status: "error",
				message: "Error fetching data",
			});
		});

		it("should handle fetchFn errors", async () => {
			// Arrange
			const fetchError = new Error("API fetch failed");
			const mockFetchFn = jest.fn().mockRejectedValue(fetchError);
			const mockItemsCallback = jest.fn();

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchFn).toHaveBeenCalledTimes(1);
			expect(mockItemsCallback).not.toHaveBeenCalled();
			expect(mockConsoleLog).toHaveBeenCalledWith(fetchError);
			expect(result).toEqual({
				status: "error",
				message: "Error fetching data",
			});
		});

		it("should handle itemsCallback errors", async () => {
			// Arrange
			const mockApiData = { items: [{ id: 1, name: "Item 1" }] };
			const callbackError = new Error("Items processing failed");

			const mockFetchFn = jest.fn().mockResolvedValue(mockApiData);
			const mockItemsCallback = jest.fn().mockRejectedValue(callbackError);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchFn).toHaveBeenCalledTimes(1);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockApiData);
			expect(mockConsoleLog).toHaveBeenCalledWith(callbackError);
			expect(result).toEqual({
				status: "error",
				message: "Error fetching data",
			});
		});

		it("should handle network timeout errors", async () => {
			// Arrange
			const timeoutError = new Error("Request timeout");
			const mockFetchFn = jest.fn().mockRejectedValue(timeoutError);
			const mockItemsCallback = jest.fn();

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConsoleLog).toHaveBeenCalledWith(timeoutError);
			expect(result).toEqual({
				status: "error",
				message: "Error fetching data",
			});
		});

		it("should handle JSON parsing errors in fetchFn", async () => {
			// Arrange
			const parseError = new SyntaxError("Unexpected token in JSON");
			const mockFetchFn = jest.fn().mockRejectedValue(parseError);
			const mockItemsCallback = jest.fn();

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockConsoleLog).toHaveBeenCalledWith(parseError);
			expect(result).toEqual({
				status: "error",
				message: "Error fetching data",
			});
		});
	});

	describe("integration scenarios", () => {
		it("should handle the complete flow with realistic data", async () => {
			// Arrange
			const mockRSSData = {
				items: [
					{
						title: "Breaking News",
						link: "https://example.com/news/1",
						description: "Important news update",
						pubDate: "2023-09-18T10:00:00Z",
					},
					{
						title: "Tech Update",
						link: "https://example.com/news/2",
						description: "Latest in technology",
						pubDate: "2023-09-18T09:00:00Z",
					},
				],
				title: "News Feed",
				description: "Latest news updates",
			};

			const mockProcessedItems: CollectionItem[] = [
				{
					title: "Breaking News",
					src: "https://example.com/news/1",
					description: "Important news update",
					guid: "news-1-guid",
					variant: "article",
					details: {
						categories: ["news"],
						language: "en",
						published: "2023-09-18T10:00:00Z",
					},
				},
				{
					title: "Tech Update",
					src: "https://example.com/news/2",
					description: "Latest in technology",
					guid: "tech-1-guid",
					variant: "article",
					details: {
						categories: ["technology"],
						language: "en",
						published: "2023-09-18T09:00:00Z",
					},
				},
			];

			const mockFetchFn = jest.fn().mockResolvedValue(mockRSSData);
			const mockItemsCallback = jest.fn().mockResolvedValue(mockProcessedItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(result).toEqual(mockProcessedItems);
			expect(mockFetchFn).toHaveBeenCalledTimes(1);
			expect(mockItemsCallback).toHaveBeenCalledWith(mockRSSData);
		});

		it("should maintain proper order of operations", async () => {
			// Arrange
			const mockApiData = { data: "test" };
			const mockCollectionItems: CollectionItem[] = [
				{
					title: "Test Item",
					src: "https://example.com/test",
					description: "Test item description",
					guid: "test-guid",
					variant: "article",
				},
			];

			const mockFetchFn = jest.fn().mockResolvedValue(mockApiData);
			const mockItemsCallback = jest
				.fn()
				.mockResolvedValue(mockCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert - Verify call order
			const mockCalls = [
				mockConnectToMongoDB.mock.invocationCallOrder[0],
				mockFetchFn.mock.invocationCallOrder[0],
				mockItemsCallback.mock.invocationCallOrder[0],
			];

			expect(mockCalls[0]).toBeLessThan(mockCalls[1]);
			expect(mockCalls[1]).toBeLessThan(mockCalls[2]);
		});
	});

	describe("edge cases", () => {
		it("should handle undefined return from fetchFn", async () => {
			// Arrange
			const mockFetchFn = jest.fn().mockResolvedValue(undefined);
			const mockItemsCallback = jest.fn().mockResolvedValue([]);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockItemsCallback).toHaveBeenCalledWith(undefined);
			expect(result).toEqual([]);
		});

		it("should handle null return from fetchFn", async () => {
			// Arrange
			const mockFetchFn = jest.fn().mockResolvedValue(null);
			const mockItemsCallback = jest.fn().mockResolvedValue([]);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(mockItemsCallback).toHaveBeenCalledWith(null);
			expect(result).toEqual([]);
		});

		it("should handle very large datasets", async () => {
			// Arrange
			const largeDataset = {
				items: Array.from({ length: 1000 }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
				})),
			};

			const largeCollectionItems: CollectionItem[] = Array.from(
				{ length: 1000 },
				(_, i) => ({
					title: `Item ${i}`,
					src: `https://example.com/item${i}`,
					description: `Description for item ${i}`,
					guid: `guid-${i}`,
					variant: "article",
				})
			);

			const mockFetchFn = jest.fn().mockResolvedValue(largeDataset);
			const mockItemsCallback = jest
				.fn()
				.mockResolvedValue(largeCollectionItems);

			mockConnectToMongoDB.mockResolvedValue(undefined);

			// Act
			const result = await fetchAPI({
				fetchFn: mockFetchFn,
				itemsCallback: mockItemsCallback,
			});

			// Assert
			expect(result).toHaveLength(1000);
			expect(result).toEqual(largeCollectionItems);
		});
	});
});
