import { RSSParse } from "./parse-rss";
import Parser from "rss-parser";

// Mock the rss-parser module
jest.mock("rss-parser");

describe("RSSParse", () => {
	// Create a mock instance of Parser
	const mockParseURL = jest.fn();
	const MockedParser = Parser as jest.MockedClass<typeof Parser>;

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Setup the Parser constructor mock to return an object with parseURL method
		MockedParser.mockImplementation(
			() =>
				({
					parseURL: mockParseURL,
				} as any)
		);
	});

	describe("successful RSS parsing", () => {
		it("should successfully parse RSS from a valid endpoint", async () => {
			const mockRSSData = {
				title: "Test RSS Feed",
				description: "Test description",
				items: [
					{
						title: "Test Article",
						link: "https://example.com/article1",
						pubDate: "2025-01-01T00:00:00.000Z",
						content: "Test content",
					},
				],
			};

			mockParseURL.mockResolvedValue(mockRSSData);

			const result = await RSSParse("https://example.com/rss");

			expect(result).toEqual(mockRSSData);
			expect(MockedParser).toHaveBeenCalledWith({
				customFields: undefined,
				timeout: 10000,
			});
			expect(mockParseURL).toHaveBeenCalledWith("https://example.com/rss");
		});

		it("should parse RSS with custom fields", async () => {
			const customFields = {
				item: ["custom:field1", "custom:field2"],
				feed: ["custom:feedField"],
			};

			const mockRSSData = {
				title: "Test RSS Feed",
				items: [],
			};

			mockParseURL.mockResolvedValue(mockRSSData);

			const result = await RSSParse("https://example.com/rss", customFields);

			expect(result).toEqual(mockRSSData);
			expect(MockedParser).toHaveBeenCalledWith({
				customFields,
				timeout: 10000,
			});
			expect(mockParseURL).toHaveBeenCalledWith("https://example.com/rss");
		});

		it("should handle different endpoint formats", async () => {
			const mockRSSData = { title: "Test", items: [] };
			mockParseURL.mockResolvedValue(mockRSSData);

			// Test with different URL formats
			await RSSParse("http://example.com/feed.xml");
			expect(mockParseURL).toHaveBeenCalledWith("http://example.com/feed.xml");

			await RSSParse("https://feeds.example.com/rss.xml");
			expect(mockParseURL).toHaveBeenCalledWith(
				"https://feeds.example.com/rss.xml"
			);
		});
	});

	describe("error handling", () => {
		it("should return null when RSS parsing fails", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			mockParseURL.mockRejectedValue(new Error("Network error"));

			const result = await RSSParse("https://invalid-url.com/rss");

			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching rss");

			consoleErrorSpy.mockRestore();
		});

		it("should handle timeout errors", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			mockParseURL.mockRejectedValue(new Error("Timeout"));

			const result = await RSSParse("https://slow-endpoint.com/rss");

			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching rss");

			consoleErrorSpy.mockRestore();
		});

		it("should handle malformed RSS content", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			mockParseURL.mockRejectedValue(new Error("Invalid XML"));

			const result = await RSSParse("https://example.com/malformed-rss");

			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching rss");

			consoleErrorSpy.mockRestore();
		});

		it("should handle 404 errors gracefully", async () => {
			const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
			mockParseURL.mockRejectedValue(new Error("404 Not Found"));

			const result = await RSSParse("https://example.com/non-existent-feed");

			expect(result).toBeNull();
			expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching rss");

			consoleErrorSpy.mockRestore();
		});
	});

	describe("parser configuration", () => {
		it("should always set timeout to 10000ms", async () => {
			mockParseURL.mockResolvedValue({ items: [] });

			await RSSParse("https://example.com/rss");

			expect(MockedParser).toHaveBeenCalledWith({
				customFields: undefined,
				timeout: 10000,
			});
		});

		it("should pass custom fields correctly when provided", async () => {
			const customFields = {
				item: ["author", "category"],
				feed: ["language", "generator"],
			};

			mockParseURL.mockResolvedValue({ items: [] });

			await RSSParse("https://example.com/rss", customFields);

			expect(MockedParser).toHaveBeenCalledWith({
				customFields,
				timeout: 10000,
			});
		});

		it("should handle empty custom fields object", async () => {
			mockParseURL.mockResolvedValue({ items: [] });

			await RSSParse("https://example.com/rss", {});

			expect(MockedParser).toHaveBeenCalledWith({
				customFields: {},
				timeout: 10000,
			});
		});
	});

	describe("edge cases", () => {
		it("should handle empty RSS feed", async () => {
			const emptyFeed = {
				title: "",
				description: "",
				items: [],
			};

			mockParseURL.mockResolvedValue(emptyFeed);

			const result = await RSSParse("https://example.com/empty-feed");

			expect(result).toEqual(emptyFeed);
		});

		it("should handle RSS feed with large number of items", async () => {
			const largeFeed = {
				title: "Large Feed",
				items: Array(1000)
					.fill(null)
					.map((_, index) => ({
						title: `Article ${index}`,
						link: `https://example.com/article-${index}`,
						pubDate: "2025-01-01T00:00:00.000Z",
					})),
			};

			mockParseURL.mockResolvedValue(largeFeed);

			const result = await RSSParse("https://example.com/large-feed");

			expect(result).toEqual(largeFeed);
			expect(result?.items).toHaveLength(1000);
		});

		it("should handle RSS feed with special characters in URLs", async () => {
			const specialCharsURL =
				"https://example.com/rss?param=value&other=test%20space";
			mockParseURL.mockResolvedValue({ items: [] });

			await RSSParse(specialCharsURL);

			expect(mockParseURL).toHaveBeenCalledWith(specialCharsURL);
		});
	});
});
