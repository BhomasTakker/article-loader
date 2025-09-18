import { updateArticleProviders } from "./update-article-providers";
import { newsSourcesMap } from "../../sources/news/sources";
import { saveOrCreateArticleProviderByName } from "../lib/mongo/actions/article-provider";

// Mock the dependencies
jest.mock("../../sources/news/sources");
jest.mock("../lib/mongo/actions/article-provider");

// Mock console methods to test logging
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("updateArticleProviders", () => {
	// Cast the mocks for proper typing
	const mockNewsSourcesMap = {
		forEach: jest.fn(),
	} as any;
	const mockSaveOrCreateArticleProviderByName =
		saveOrCreateArticleProviderByName as jest.MockedFunction<
			typeof saveOrCreateArticleProviderByName
		>;

	// Override the mocked newsSourcesMap
	(require("../../sources/news/sources") as any).newsSourcesMap =
		mockNewsSourcesMap;

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		mockConsoleLog.mockClear();
		mockConsoleError.mockClear();
	});

	afterAll(() => {
		// Restore console methods
		mockConsoleLog.mockRestore();
		mockConsoleError.mockRestore();
	});

	describe("successful execution", () => {
		it("should process all providers and return success message", async () => {
			// Arrange
			const mockProvider1 = {
				name: "Test Provider 1",
				description: "Test Description 1",
				url: "https://test1.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			};
			const mockProvider2 = {
				name: "Test Provider 2",
				description: "Test Description 2",
				url: "https://test2.com",
				rating: 4,
				leaning: 1,
				origin: "test",
			};

			// Mock the Map behavior
			const mockEntries = [
				["provider1", mockProvider1],
				["provider2", mockProvider2],
			] as [string, any][];

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				mockEntries.forEach(([key, value]) =>
					callback(value, key, mockNewsSourcesMap)
				);
			});

			mockSaveOrCreateArticleProviderByName.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			});

			// Act
			const result = await updateArticleProviders();

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});

			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledTimes(2);
			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledWith(
				mockProvider1
			);
			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledWith(
				mockProvider2
			);

			expect(mockConsoleLog).toHaveBeenCalledWith("key", "provider1");
			expect(mockConsoleLog).toHaveBeenCalledWith("key", "provider2");
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"We have added all providers"
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"Error or successful completion. Reset fetch"
			);
		});

		it("should handle empty provider map", async () => {
			// Arrange
			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				// Empty map - callback never called
			});

			// Act
			const result = await updateArticleProviders();

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});

			expect(mockSaveOrCreateArticleProviderByName).not.toHaveBeenCalled();
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"We have added all providers"
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"Error or successful completion. Reset fetch"
			);
		});
	});

	describe("error handling", () => {
		it("should handle null/undefined providers", async () => {
			// Arrange
			const mockEntries = [
				["provider1", null],
				["provider2", undefined],
				[
					"provider3",
					{
						name: "Valid Provider",
						description: "Valid Description",
						url: "https://valid.com",
						rating: 5,
						leaning: 0,
						origin: "test",
					},
				],
			] as [string, any][];

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				mockEntries.forEach(([key, value]) =>
					callback(value, key, mockNewsSourcesMap)
				);
			});

			mockSaveOrCreateArticleProviderByName.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			});

			// Act
			const result = await updateArticleProviders();

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});

			expect(mockConsoleError).toHaveBeenCalledWith(
				"No provider found for provider1"
			);
			expect(mockConsoleError).toHaveBeenCalledWith(
				"No provider found for provider2"
			);
			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledTimes(1);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"We have added all providers"
			);
		});

		it("should handle database errors during provider save", async () => {
			// Arrange
			const mockProvider = {
				name: "Test Provider",
				description: "Test Description",
				url: "https://test.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			};

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				callback(mockProvider, "testProvider", mockNewsSourcesMap);
			});

			const dbError = new Error("Database connection failed");
			mockSaveOrCreateArticleProviderByName.mockRejectedValue(dbError);

			// Act
			const result = await updateArticleProviders();

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});

			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledWith(
				mockProvider
			);
			expect(mockConsoleError).toHaveBeenCalledWith(
				"Error adding providers",
				dbError
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"Error or successful completion. Reset fetch"
			);
		});

		it("should handle mixed success and failure scenarios", async () => {
			// Arrange
			const mockProvider1 = {
				name: "Success Provider",
				description: "Success Description",
				url: "https://success.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			};
			const mockProvider2 = {
				name: "Failure Provider",
				description: "Failure Description",
				url: "https://failure.com",
				rating: 4,
				leaning: 1,
				origin: "test",
			};

			const mockEntries = [
				["success", mockProvider1],
				["failure", mockProvider2],
			] as [string, any][];

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				mockEntries.forEach(([key, value]) =>
					callback(value, key, mockNewsSourcesMap)
				);
			});

			// First call succeeds, second fails
			mockSaveOrCreateArticleProviderByName
				.mockResolvedValueOnce({
					acknowledged: true,
					matchedCount: 1,
					modifiedCount: 1,
					upsertedCount: 0,
					upsertedId: null,
				})
				.mockRejectedValueOnce(new Error("Save failed"));

			// Act
			const result = await updateArticleProviders();

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});

			expect(mockSaveOrCreateArticleProviderByName).toHaveBeenCalledTimes(2);
			expect(mockConsoleError).toHaveBeenCalledWith(
				"Error adding providers",
				expect.any(Error)
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"Error or successful completion. Reset fetch"
			);
		});
	});

	describe("Promise handling", () => {
		it("should wait for all promises to complete before returning", async () => {
			// Arrange
			const mockProvider1 = {
				name: "Provider 1",
				description: "Description 1",
				url: "https://provider1.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			};
			const mockProvider2 = {
				name: "Provider 2",
				description: "Description 2",
				url: "https://provider2.com",
				rating: 4,
				leaning: 1,
				origin: "test",
			};

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				callback(mockProvider1, "provider1", mockNewsSourcesMap);
				callback(mockProvider2, "provider2", mockNewsSourcesMap);
			});

			// Create promises that resolve after different delays
			let resolvePromise1: (value: any) => void;
			let resolvePromise2: (value: any) => void;

			const promise1 = new Promise((resolve) => {
				resolvePromise1 = resolve;
			});
			const promise2 = new Promise((resolve) => {
				resolvePromise2 = resolve;
			});

			mockSaveOrCreateArticleProviderByName
				.mockReturnValueOnce(promise1 as any)
				.mockReturnValueOnce(promise2 as any);

			// Act
			const resultPromise = updateArticleProviders();

			// Resolve promises in reverse order
			setTimeout(() => resolvePromise2!({ acknowledged: true }), 10);
			setTimeout(() => resolvePromise1!({ acknowledged: true }), 20);

			const result = await resultPromise;

			// Assert
			expect(result).toEqual({
				message:
					"Updated all article providers. We should proivide updated and errors details.",
			});
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"We have added all providers"
			);
		});
	});

	describe("console logging", () => {
		it("should log provider keys during processing", async () => {
			// Arrange
			const mockProvider = {
				name: "Test Provider",
				description: "Test Description",
				url: "https://test.com",
				rating: 5,
				leaning: 0,
				origin: "test",
			};

			mockNewsSourcesMap.forEach = jest.fn((callback) => {
				callback(mockProvider, "testKey", mockNewsSourcesMap);
			});

			mockSaveOrCreateArticleProviderByName.mockResolvedValue({
				acknowledged: true,
				matchedCount: 1,
				modifiedCount: 1,
				upsertedCount: 0,
				upsertedId: null,
			});

			// Act
			await updateArticleProviders();

			// Assert
			expect(mockConsoleLog).toHaveBeenCalledWith("key", "testKey");
		});

		it("should log completion messages", async () => {
			// Arrange
			mockNewsSourcesMap.forEach = jest.fn();

			// Act
			await updateArticleProviders();

			// Assert
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"We have added all providers"
			);
			expect(mockConsoleLog).toHaveBeenCalledWith(
				"Error or successful completion. Reset fetch"
			);
		});
	});
});
