import { fetchPodcasts } from "./fetchPodcasts";
import { SourceObject } from "../../../sources/news/articles/types";
import { fetchPodcastArticles } from "../../articles/fetch-podcast-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import { getPodcastCollection } from "../../collections/get-collection";
import { connectToMongoDB } from "../../lib/mongo/db";

// Mock all dependencies
jest.mock("../../articles/fetch-podcast-articles", () => ({
	fetchPodcastArticles: jest.fn(),
}));

jest.mock("../../collections/fetch-collections", () => ({
	fetchCollections: jest.fn(),
}));

jest.mock("../../collections/get-collection", () => ({
	getPodcastCollection: jest.fn(),
}));

jest.mock("../../lib/mongo/db", () => ({
	connectToMongoDB: jest.fn(),
}));

const mockFetchPodcastArticles = fetchPodcastArticles as jest.MockedFunction<
	typeof fetchPodcastArticles
>;
const mockFetchCollections = fetchCollections as jest.MockedFunction<
	typeof fetchCollections
>;
const mockGetPodcastCollection = getPodcastCollection as jest.MockedFunction<
	typeof getPodcastCollection
>;
const mockConnectToMongoDB = connectToMongoDB as jest.MockedFunction<
	typeof connectToMongoDB
>;

// Mock the return value of fetchCollections to be a function
const mockFetchCollectionsReturn = jest.fn();

describe("FetchPodcasts", () => {
	beforeEach(() => {
		mockFetchPodcastArticles.mockClear();
		mockFetchCollections.mockClear();
		mockGetPodcastCollection.mockClear();
		mockConnectToMongoDB.mockClear();
		mockFetchCollectionsReturn.mockClear();

		// Setup fetchCollections to return a function
		mockFetchCollections.mockReturnValue(mockFetchCollectionsReturn);
		mockConnectToMongoDB.mockResolvedValue(undefined);
		mockFetchCollectionsReturn.mockResolvedValue(undefined);
	});

	describe("fetchPodcasts", () => {
		it("should return an async function when called with sources", () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology"],
					region: "US",
					language: "en",
				},
			];

			const result = fetchPodcasts(sources);

			expect(typeof result).toBe("function");
			// The function should be async (returns a Promise when called)
			expect(result()).toBeInstanceOf(Promise);
		});

		it("should connect to MongoDB when the returned function is executed", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["news"],
					region: "UK",
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
		});

		it("should call fetchCollections with correct parameters", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology", "science"],
					region: "US",
					coverage: ["global"],
					language: "en",
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});

		it("should execute the function returned by fetchCollections", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["entertainment"],
					region: "CA",
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockFetchCollectionsReturn).toHaveBeenCalledTimes(1);
		});

		it("should handle empty sources array", async () => {
			const sources: SourceObject[] = [];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: [],
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
			expect(mockFetchCollectionsReturn).toHaveBeenCalledTimes(1);
		});

		it("should handle sources with all optional properties", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology", "business"],
					region: ["US", "UK"],
					coverage: ["local", "national", "international"],
					language: "en",
					sources: [
						{ name: "TechCrunch", src: "https://techcrunch.com/feed" },
						{ name: "Wired", src: "https://wired.com/feed" },
					],
					media: {
						type: "podcast",
						format: "audio",
						quality: "high",
					},
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});

		it("should handle sources with minimal properties", async () => {
			const sources: SourceObject[] = [
				{}, // Empty source object
				{
					region: "US",
				},
				{
					categories: ["news"],
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});

		it("should handle multiple diverse sources", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology"],
					region: "US",
					language: "en",
				},
				{
					categories: ["science", "health"],
					region: ["UK", "CA"],
					coverage: ["international"],
					language: "en",
				},
				{
					categories: ["entertainment"],
					region: "AU",
					sources: [{ name: "ABC News", src: "https://abc.net.au/news/feed/" }],
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});
	});

	describe("Integration and Error Handling", () => {
		it("should handle MongoDB connection errors gracefully", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["news"],
					region: "US",
				},
			];

			const dbError = new Error("MongoDB connection failed");
			mockConnectToMongoDB.mockRejectedValue(dbError);

			const podcastFetcher = fetchPodcasts(sources);

			await expect(podcastFetcher()).rejects.toThrow(
				"MongoDB connection failed"
			);
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
		});

		it("should handle fetchCollections errors gracefully", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology"],
					region: "US",
				},
			];

			const fetchError = new Error("Failed to fetch collections");
			mockFetchCollectionsReturn.mockRejectedValue(fetchError);

			const podcastFetcher = fetchPodcasts(sources);

			await expect(podcastFetcher()).rejects.toThrow(
				"Failed to fetch collections"
			);
			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledTimes(1);
		});

		it("should maintain proper execution order", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["news"],
					region: "US",
				},
			];

			const executionOrder: string[] = [];

			mockConnectToMongoDB.mockImplementation(async () => {
				executionOrder.push("connectToMongoDB");
			});

			mockFetchCollections.mockImplementation(() => {
				executionOrder.push("fetchCollections");
				return jest.fn(async () => {
					executionOrder.push("fetchCollections-execution");
				});
			});

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			expect(executionOrder).toEqual([
				"connectToMongoDB",
				"fetchCollections",
				"fetchCollections-execution",
			]);
		});

		it("should handle complex SourceObject structures", async () => {
			const complexSources: SourceObject[] = [
				{
					categories: [
						"technology",
						"artificial-intelligence",
						"machine-learning",
					],
					region: ["US", "EU", "APAC"],
					coverage: ["local", "national", "international"],
					language: "en",
					sources: [
						{ name: "AI News", src: "https://ai-news.com/rss" },
						{ name: "ML Today", src: "https://ml-today.com/feed" },
						{ name: "Tech Podcasts", src: "https://tech-podcasts.com/rss" },
					],
					media: {
						type: "podcast",
						format: ["audio", "video"],
						duration: {
							min: 30,
							max: 120,
							preferred: 60,
						},
						quality: "high",
						encoding: "mp3",
						metadata: {
							includeTranscripts: true,
							includeChapters: false,
							includeTags: true,
						},
					},
				},
			];

			const podcastFetcher = fetchPodcasts(complexSources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: complexSources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});
	});

	describe("Callback Function References", () => {
		it("should pass correct callback functions to fetchCollections", async () => {
			const sources: SourceObject[] = [
				{
					categories: ["technology"],
					region: "US",
				},
			];

			const podcastFetcher = fetchPodcasts(sources);
			await podcastFetcher();

			const callArgs = mockFetchCollections.mock.calls[0][0];
			expect(callArgs.feedCallback).toBe(getPodcastCollection);
			expect(callArgs.itemsCallback).toBe(fetchPodcastArticles);
		});

		it("should maintain function identity across multiple calls", async () => {
			const sources1: SourceObject[] = [{ region: "US" }];
			const sources2: SourceObject[] = [{ region: "UK" }];

			const podcastFetcher1 = fetchPodcasts(sources1);
			const podcastFetcher2 = fetchPodcasts(sources2);

			await podcastFetcher1();
			await podcastFetcher2();

			// Both calls should use the same callback function references
			const call1Args = mockFetchCollections.mock.calls[0][0];
			const call2Args = mockFetchCollections.mock.calls[1][0];

			expect(call1Args.feedCallback).toBe(call2Args.feedCallback);
			expect(call1Args.itemsCallback).toBe(call2Args.itemsCallback);
			expect(call1Args.feedCallback).toBe(getPodcastCollection);
			expect(call1Args.itemsCallback).toBe(fetchPodcastArticles);
		});
	});

	describe("Realistic Usage Scenarios", () => {
		it("should handle typical podcast source configuration", async () => {
			const podcastSources: SourceObject[] = [
				{
					categories: ["technology", "programming"],
					region: "US",
					language: "en",
					sources: [
						{
							name: "The Changelog",
							src: "https://changelog.com/podcast/feed",
						},
						{
							name: "Software Engineering Daily",
							src: "https://softwareengineeringdaily.com/feed/",
						},
					],
					media: {
						type: "podcast",
						format: "audio",
					},
				},
				{
					categories: ["business", "entrepreneurship"],
					region: ["US", "UK"],
					language: "en",
					sources: [
						{
							name: "How I Built This",
							src: "https://feeds.npr.org/510313/podcast.xml",
						},
						{
							name: "Masters of Scale",
							src: "https://mastersofscale.com/feed/",
						},
					],
				},
			];

			const podcastFetcher = fetchPodcasts(podcastSources);
			await podcastFetcher();

			expect(mockConnectToMongoDB).toHaveBeenCalledTimes(1);
			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: podcastSources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
			expect(mockFetchCollectionsReturn).toHaveBeenCalledTimes(1);
		});

		it("should handle news podcast aggregation scenario", async () => {
			const newsPodcastSources: SourceObject[] = [
				{
					categories: ["news", "politics"],
					region: "US",
					coverage: ["national", "international"],
					language: "en",
				},
				{
					categories: ["news", "world"],
					region: ["UK", "CA", "AU"],
					coverage: ["international"],
					language: "en",
				},
			];

			const podcastFetcher = fetchPodcasts(newsPodcastSources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: newsPodcastSources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});

		it("should support educational podcast configuration", async () => {
			const educationalSources: SourceObject[] = [
				{
					categories: ["education", "science"],
					region: "GLOBAL",
					language: "en",
					media: {
						type: "educational-podcast",
						duration: { min: 20, max: 45 },
						quality: "high",
						transcripts: true,
					},
				},
			];

			const podcastFetcher = fetchPodcasts(educationalSources);
			await podcastFetcher();

			expect(mockFetchCollections).toHaveBeenCalledWith({
				sources: educationalSources,
				feedCallback: getPodcastCollection,
				itemsCallback: fetchPodcastArticles,
			});
		});
	});
});
