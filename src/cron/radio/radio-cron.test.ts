import { runScripts } from "./radio-cron";
import { fetchAPI } from "../../api/fetch-api";
import { fetchNewsRadioStations } from "../../api/radio-browser";
import { radioBrowserApiCallback } from "../../api/radio-browser/callback";
import { Station } from "radio-browser-api";
import { UnknownObject } from "../../types/article/item";

// Mock all dependencies
jest.mock("../../api/fetch-api");
jest.mock("../../api/radio-browser");
jest.mock("../../api/radio-browser/callback");

const mockFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;
const mockFetchNewsRadioStations =
	fetchNewsRadioStations as jest.MockedFunction<typeof fetchNewsRadioStations>;
const mockRadioBrowserApiCallback =
	radioBrowserApiCallback as jest.MockedFunction<
		typeof radioBrowserApiCallback
	>;

describe("Radio Cron", () => {
	// Helper function to create a complete mock Station
	const createMockStation = (overrides: Partial<Station> = {}): Station =>
		({
			changeId: "test-change-id",
			id: "test-station-id",
			name: "Test Station",
			url: "http://test.com/stream",
			urlResolved: "http://test.com/stream",
			homepage: "http://test.com",
			favicon: "http://test.com/favicon.ico",
			tags: "news,test",
			country: "Test Country",
			countryCode: "TC",
			state: "Test State",
			language: "english",
			languageCodes: ["en"],
			votes: 100,
			lastChangeTime: "2023-01-01T00:00:00Z",
			lastChangeTimeIso8601: "2023-01-01T00:00:00Z",
			codec: "MP3",
			bitrate: 128,
			hls: false,
			lastCheckOk: true,
			lastCheckTime: "2023-01-01T00:00:00Z",
			lastCheckTimeIso8601: "2023-01-01T00:00:00Z",
			lastCheckOkTime: "2023-01-01T00:00:00Z",
			lastCheckOkTimeIso8601: "2023-01-01T00:00:00Z",
			lastLocalCheckTime: "2023-01-01T00:00:00Z",
			lastLocalCheckTimeIso8601: "2023-01-01T00:00:00Z",
			clickTimestamp: "2023-01-01T00:00:00Z",
			clickTimestampIso8601: "2023-01-01T00:00:00Z",
			clickCount: 500,
			clickTrend: 5,
			sslError: false,
			geoLat: 51.5074,
			geoLong: -0.1278,
			hasExtendedInfo: false,
			...overrides,
		} as Station);

	// Helper function to create a mock CollectionItem
	const createMockCollectionItem = (overrides: Partial<any> = {}): any => ({
		title: "Test Radio Station",
		src: "http://test.com/stream",
		description: "Test radio station description",
		guid: "test-guid-123",
		variant: "radio-station",
		...overrides,
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("runScripts", () => {
		it("should call fetchAPI with default parameters when no options provided", async () => {
			const mockStations: Station[] = [
				createMockStation({
					name: "BBC News",
					url: "http://bbc.co.uk/radio",
					urlResolved: "http://bbc.co.uk/radio",
					homepage: "http://bbc.co.uk",
					favicon: "http://bbc.co.uk/favicon.ico",
					country: "United Kingdom",
					countryCode: "GB",
					state: "",
					votes: 100,
					clickCount: 500,
					clickTrend: 5,
					geoLat: 51.5074,
					geoLong: -0.1278,
				}),
			];

			const mockCallback = jest.fn().mockResolvedValue([]);
			mockFetchNewsRadioStations.mockResolvedValue(mockStations);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts({});

			// Verify fetchAPI was called with correct structure
			expect(mockFetchAPI).toHaveBeenCalledTimes(1);
			expect(mockFetchAPI).toHaveBeenCalledWith({
				fetchFn: expect.any(Function),
				itemsCallback: expect.any(Function),
			});

			// Verify the parameters passed to radioBrowserApiCallback
			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith({
				tag: "news",
				limit: 25,
				order: "votes",
				reverse: true,
				hideBroken: true,
				language: "english",
			});
		});

		it("should merge custom options with default parameters", async () => {
			const customOptions: UnknownObject = {
				tag: "music",
				limit: 50,
				country: "United States",
				newParam: "custom-value",
			};

			const mockStations: Station[] = [];
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockFetchNewsRadioStations.mockResolvedValue(mockStations);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts(customOptions);

			// Verify the merged parameters were passed to radioBrowserApiCallback
			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith({
				tag: "music", // overridden
				limit: 50, // overridden
				country: "United States", // added
				newParam: "custom-value", // added
				order: "votes", // from defaults
				reverse: true, // from defaults
				hideBroken: true, // from defaults
				language: "english", // from defaults
			});
		});

		it("should preserve all default parameters when options is empty", async () => {
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockFetchNewsRadioStations.mockResolvedValue([]);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts({});

			const expectedParams = {
				tag: "news",
				limit: 25,
				order: "votes",
				reverse: true,
				hideBroken: true,
				language: "english",
			};

			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith(expectedParams);
		});

		it("should pass fetchFn that calls fetchNewsRadioStations with merged params", async () => {
			const customOptions = { tag: "sports", limit: 10 };
			const expectedParams = {
				tag: "sports",
				limit: 10,
				order: "votes",
				reverse: true,
				hideBroken: true,
				language: "english",
			};

			const mockStations: Station[] = [];
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockFetchNewsRadioStations.mockResolvedValue(mockStations);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts(customOptions);

			// Extract the fetchFn that was passed to fetchAPI
			const fetchAPICall = mockFetchAPI.mock.calls[0][0];
			const fetchFn = fetchAPICall.fetchFn;

			// Call the fetchFn to verify it calls fetchNewsRadioStations with correct params
			await fetchFn();

			expect(mockFetchNewsRadioStations).toHaveBeenCalledWith(expectedParams);
		});

		it("should pass itemsCallback that is returned from radioBrowserApiCallback", async () => {
			const mockCallback = jest.fn().mockResolvedValue([{ id: "test" }]);
			const mockStations: Station[] = [];
			mockFetchNewsRadioStations.mockResolvedValue(mockStations);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts({});

			// Extract the itemsCallback that was passed to fetchAPI
			const fetchAPICall = mockFetchAPI.mock.calls[0][0];
			const itemsCallback = fetchAPICall.itemsCallback;

			// Verify it's the same function returned by radioBrowserApiCallback
			expect(itemsCallback).toBe(mockCallback);
		});

		it("should handle fetchAPI errors gracefully", async () => {
			const error = new Error("API Error");
			mockFetchAPI.mockRejectedValue(error);
			mockRadioBrowserApiCallback.mockReturnValue(jest.fn());

			// Should not throw error
			await expect(runScripts({})).rejects.toThrow("API Error");

			expect(mockFetchAPI).toHaveBeenCalledTimes(1);
		});

		it("should handle fetchNewsRadioStations errors in fetchFn", async () => {
			const error = new Error("Radio API Error");
			mockFetchNewsRadioStations.mockRejectedValue(error);
			mockRadioBrowserApiCallback.mockReturnValue(jest.fn());
			mockFetchAPI.mockImplementation(async ({ fetchFn }) => {
				// This will trigger the error when fetchFn is called
				await fetchFn();
				return [];
			});

			await expect(runScripts({})).rejects.toThrow("Radio API Error");
		});

		it("should handle radioBrowserApiCallback errors", async () => {
			const error = new Error("Callback Error");
			const mockStations: Station[] = [
				createMockStation({
					name: "Test Station",
					url: "http://test.com",
					country: "Test Country",
				}),
			];

			const mockCallback = jest.fn().mockRejectedValue(error);
			mockFetchNewsRadioStations.mockResolvedValue(mockStations);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockImplementation(async ({ itemsCallback }) => {
				// This will trigger the error when itemsCallback is called
				await itemsCallback(mockStations);
				return [];
			});

			await expect(runScripts({})).rejects.toThrow("Callback Error");
		});

		it("should handle boolean reverse parameter correctly", async () => {
			const customOptions = { reverse: false };
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts(customOptions);

			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					reverse: false,
				})
			);
		});

		it("should handle numeric limit parameter correctly", async () => {
			const customOptions = { limit: 100 };
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts(customOptions);

			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					limit: 100,
				})
			);
		});

		it("should handle string parameters correctly", async () => {
			const customOptions = {
				language: "spanish",
				order: "name",
				tag: "classical",
			};
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			await runScripts(customOptions);

			expect(mockRadioBrowserApiCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					language: "spanish",
					order: "name",
					tag: "classical",
				})
			);
		});

		it("should call fetchAPI and complete successfully", async () => {
			const mockCallback = jest.fn().mockResolvedValue([]);
			mockRadioBrowserApiCallback.mockReturnValue(mockCallback);
			mockFetchAPI.mockResolvedValue([]);

			// Should not throw an error and should complete successfully
			await expect(runScripts({})).resolves.toBeUndefined();

			// Verify fetchAPI was called
			expect(mockFetchAPI).toHaveBeenCalledTimes(1);
		});
	});
});
