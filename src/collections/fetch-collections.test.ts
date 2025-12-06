import { fetchCollections } from "./fetch-collections";
import { connectToMongoDB } from "../lib/mongo/db";
import { fetchRss } from "../rss/fetch-rss";
import { Service, ServiceState } from "../service";
import { SourceObject } from "../types/types";

// Mock all dependencies
jest.mock("../lib/mongo/db");
jest.mock("../rss/fetch-rss");
jest.mock("../service");

const mockConnectToMongoDB = connectToMongoDB as jest.MockedFunction<
	typeof connectToMongoDB
>;
const mockFetchRss = fetchRss as jest.MockedFunction<typeof fetchRss>;

// Mock Service class
const mockServiceInstance = {
	getState: jest.fn(),
	setState: jest.fn(),
} as any;

// Mock the Service class properly
(Service.getInstance as jest.Mock) = jest
	.fn()
	.mockReturnValue(mockServiceInstance);

describe("fetchCollections", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(Service.getInstance as jest.Mock).mockReturnValue(mockServiceInstance);
		mockServiceInstance.getState.mockReturnValue(ServiceState.ready);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("with default parameters", () => {
		it("should connect to MongoDB", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
		});

		it("should get service instance and check state", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(Service.getInstance).toHaveBeenCalledTimes(1);
			expect(mockServiceInstance.getState).toHaveBeenCalledTimes(1);
		});

		it("should not process sources when service state is not ready", async () => {
			mockServiceInstance.getState.mockReturnValue(ServiceState.running);

			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});
			const sources: SourceObject[] = [
				{
					sources: [{ name: "Test Source", src: "http://example.com/rss" }],
					categories: ["test"],
				},
			];

			const fetchFunc = fetchCollections({
				sources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockFetchRss).not.toHaveBeenCalled();
			expect(mockServiceInstance.setState).not.toHaveBeenCalled();
		});
	});

	describe("with sources", () => {
		const mockSources: SourceObject[] = [
			{
				sources: [{ name: "Example News 1", src: "http://example1.com/rss" }],
				categories: ["news"],
				region: "provider1",
			},
			{
				sources: [
					{ name: "Example Tech 1", src: "http://example2.com/rss" },
					{ name: "Example Tech 2", src: "http://example2.com/rss2" },
				],
				categories: ["tech"],
				region: "provider2",
			},
		];

		it("should set service state to running when state is ready", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				sources: mockSources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockServiceInstance.setState).toHaveBeenCalledWith(
				ServiceState.running
			);
		});

		it("should call fetchRss for each source", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				sources: mockSources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockFetchRss).toHaveBeenCalledTimes(2);
		});

		it("should pass correct parameters to fetchRss", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});
			const customFields = { customField: "customValue" };

			const fetchFunc = fetchCollections({
				sources: mockSources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
				customFields,
			});

			await fetchFunc();

			// Check first source call
			expect(mockFetchRss).toHaveBeenNthCalledWith(1, {
				urls: [],
				sources: mockSources[0].sources,
				callback: expect.any(Function),
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
				customFields,
				extraData: {
					categories: ["news"],
					region: "provider1",
				},
			});

			// Check second source call
			expect(mockFetchRss).toHaveBeenNthCalledWith(2, {
				urls: [],
				sources: mockSources[1].sources,
				callback: expect.any(Function),
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
				customFields,
				extraData: {
					categories: ["tech"],
					region: "provider2",
				},
			});
		});

		it("should handle sources without custom fields", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				sources: mockSources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockFetchRss).toHaveBeenCalledWith(
				expect.objectContaining({
					customFields: undefined,
				})
			);
		});
	});

	describe("callback function", () => {
		it("should provide callback that sets service state to ready", async () => {
			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});
			const sources: SourceObject[] = [
				{
					sources: [{ name: "Test Source", src: "http://example.com/rss" }],
					categories: ["test"],
				},
			];

			const fetchFunc = fetchCollections({
				sources,
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			// Get the callback function passed to fetchRss
			const callbackFn = mockFetchRss.mock.calls[0][0].callback;

			// Execute the callback
			callbackFn();

			expect(mockServiceInstance.setState).toHaveBeenCalledWith(
				ServiceState.ready
			);
		});
	});

	describe("generic type support", () => {
		it("should work with typed callbacks", async () => {
			interface TestItemType {
				id: string;
				title: string;
			}

			interface TestFeedType {
				feedId: string;
				items: TestItemType[];
			}

			const mockItemsCallback = jest.fn().mockResolvedValue({
				id: "test-id",
				title: "Test Title",
			} as TestItemType);

			const mockFeedCallback = jest.fn().mockResolvedValue({
				feedId: "test-feed",
				items: [],
			} as TestFeedType);

			const fetchFunc = fetchCollections<TestItemType, TestFeedType>({
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await fetchFunc();

			expect(mockConnectToMongoDB).toHaveBeenCalled();
			expect(Service.getInstance).toHaveBeenCalled();
		});
	});

	describe("error handling", () => {
		it("should handle MongoDB connection errors gracefully", async () => {
			mockConnectToMongoDB.mockRejectedValue(
				new Error("MongoDB connection failed")
			);

			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await expect(fetchFunc()).rejects.toThrow("MongoDB connection failed");
		});

		it("should handle service instance errors", async () => {
			(Service.getInstance as jest.Mock).mockImplementation(() => {
				throw new Error("Service error");
			});

			const mockItemsCallback = jest.fn().mockResolvedValue({});
			const mockFeedCallback = jest.fn().mockResolvedValue({});

			const fetchFunc = fetchCollections({
				itemsCallback: mockItemsCallback,
				feedCallback: mockFeedCallback,
			});

			await expect(fetchFunc()).rejects.toThrow("Service error");
		});
	});
});
