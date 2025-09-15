import { initCronJobs } from "./init-cron";
import { createCron } from "./create-cron";
import { CronConfig, CronJob, CronJobConfig } from "./types";

// Mock the createCron function
jest.mock("./create-cron", () => ({
	createCron: jest.fn(),
}));

const mockCreateCron = createCron as jest.MockedFunction<typeof createCron>;

describe("Init Cron", () => {
	beforeEach(() => {
		mockCreateCron.mockClear();
	});

	describe("initCronJobs", () => {
		it("should initialize a single cron job from config", () => {
			const mockFetchFn = jest.fn();
			const mockOnComplete = jest.fn();

			const config: CronConfig = {
				id: "test-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 */15 * * * *",
						fetchFn: mockFetchFn,
						onComplete: mockOnComplete,
					},
				],
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledTimes(1);
			expect(mockCreateCron).toHaveBeenCalledWith({
				time: "0 */15 * * * *",
				fetchFn: mockFetchFn,
				onComplete: mockOnComplete,
			});
		});

		it("should initialize multiple cron jobs from config", () => {
			const mockFetchFn1 = jest.fn();
			const mockFetchFn2 = jest.fn();
			const mockFetchFn3 = jest.fn();
			const mockOnComplete1 = jest.fn();
			const mockOnComplete2 = jest.fn();

			const config: CronConfig = {
				id: "multi-job-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 */5 * * * *",
						fetchFn: mockFetchFn1,
						onComplete: mockOnComplete1,
					},
					{
						time: "0 */10 * * * *",
						fetchFn: mockFetchFn2,
						onComplete: mockOnComplete2,
					},
					{
						time: "0 0 */1 * * *",
						fetchFn: mockFetchFn3,
						onComplete: undefined as any, // Test undefined onComplete
					},
				],
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledTimes(3);
			expect(mockCreateCron).toHaveBeenNthCalledWith(1, {
				time: "0 */5 * * * *",
				fetchFn: mockFetchFn1,
				onComplete: mockOnComplete1,
			});
			expect(mockCreateCron).toHaveBeenNthCalledWith(2, {
				time: "0 */10 * * * *",
				fetchFn: mockFetchFn2,
				onComplete: mockOnComplete2,
			});
			expect(mockCreateCron).toHaveBeenNthCalledWith(3, {
				time: "0 0 */1 * * *",
				fetchFn: mockFetchFn3,
				onComplete: undefined,
			});
		});

		it("should handle empty cron array in config", () => {
			const config: CronConfig = {
				id: "empty-config",
				anyCommandsRequired: {},
				cron: [],
			};

			initCronJobs(config);

			expect(mockCreateCron).not.toHaveBeenCalled();
		});

		it("should handle config with only required properties", () => {
			const mockFetchFn = jest.fn();

			const config: CronConfig = {
				id: "minimal-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 0 12 * * *",
						fetchFn: mockFetchFn,
						onComplete: undefined as any,
					},
				],
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledTimes(1);
			expect(mockCreateCron).toHaveBeenCalledWith({
				time: "0 0 12 * * *",
				fetchFn: mockFetchFn,
				onComplete: undefined,
			});
		});

		it("should pass through all job properties correctly", () => {
			const asyncFetchFn = jest.fn(async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
			});
			const syncOnComplete = jest.fn(() => {
				console.log("Job completed");
			});

			const config: CronConfig = {
				id: "property-test-config",
				anyCommandsRequired: { someProperty: "value" },
				cron: [
					{
						time: "30 2,17,32,47 * * * *",
						fetchFn: asyncFetchFn,
						onComplete: syncOnComplete,
					},
				],
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledWith({
				time: "30 2,17,32,47 * * * *",
				fetchFn: asyncFetchFn,
				onComplete: syncOnComplete,
			});
		});

		it("should handle various cron time expressions", () => {
			const mockFetchFn = jest.fn();

			const timeExpressions = [
				"* * * * * *", // Every second
				"0 * * * * *", // Every minute
				"0 0 * * * *", // Every hour
				"0 0 0 * * *", // Every day
				"0 0 0 * * 0", // Every Sunday
				"0 30 14 * * 1-5", // Weekdays at 2:30 PM
				"0 0,15,30,45 * * * *", // Every 15 minutes
				"*/10 * * * * *", // Every 10 seconds
			];

			const config: CronConfig = {
				id: "time-expression-config",
				anyCommandsRequired: {},
				cron: timeExpressions.map((time) => ({
					time,
					fetchFn: mockFetchFn,
					onComplete: jest.fn(),
				})),
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledTimes(timeExpressions.length);
			timeExpressions.forEach((time, index) => {
				expect(mockCreateCron).toHaveBeenNthCalledWith(index + 1, {
					time,
					fetchFn: mockFetchFn,
					onComplete: expect.any(Function),
				});
			});
		});

		it("should maintain function references correctly", () => {
			const specificFetchFn = jest.fn();
			const specificOnComplete = jest.fn();

			const config: CronConfig = {
				id: "function-reference-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 0 9 * * *",
						fetchFn: specificFetchFn,
						onComplete: specificOnComplete,
					},
				],
			};

			initCronJobs(config);

			// Verify exact function references are passed through
			const createCronCall = mockCreateCron.mock.calls[0][0];
			expect(createCronCall.fetchFn).toBe(specificFetchFn);
			expect(createCronCall.onComplete).toBe(specificOnComplete);
		});
	});

	describe("Type Safety and Configuration Validation", () => {
		it("should accept valid CronConfig with all properties", () => {
			const validConfig: CronConfig = {
				id: "valid-config",
				anyCommandsRequired: {
					apiKey: "test-key",
					maxRetries: 3,
					timeout: 5000,
				},
				cron: [
					{
						time: "0 */20 * * * *",
						fetchFn: async () => {
							console.log("Fetching data...");
						},
						onComplete: () => {
							console.log("Fetch completed");
						},
					},
				],
			};

			expect(() => {
				initCronJobs(validConfig);
			}).not.toThrow();

			expect(mockCreateCron).toHaveBeenCalledTimes(1);
		});

		it("should handle different function types in config", () => {
			const arrowFunction = async () => {};
			const asyncArrowFunction = async () => {};
			const regularFunction = async function () {};
			const asyncRegularFunction = async function () {};

			const config: CronConfig = {
				id: "function-types-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 0 6 * * *",
						fetchFn: arrowFunction,
						onComplete: () => {},
					},
					{
						time: "0 0 12 * * *",
						fetchFn: asyncArrowFunction,
						onComplete: () => {},
					},
					{
						time: "0 0 18 * * *",
						fetchFn: regularFunction,
						onComplete: () => {},
					},
					{
						time: "0 0 22 * * *",
						fetchFn: asyncRegularFunction,
						onComplete: () => {},
					},
				],
			};

			expect(() => {
				initCronJobs(config);
			}).not.toThrow();

			expect(mockCreateCron).toHaveBeenCalledTimes(4);
		});
	});

	describe("Integration and Realistic Usage", () => {
		it("should handle realistic article loading configuration", () => {
			const fetchNewsArticles = jest.fn(async () => {
				// Simulate fetching news articles
				console.log("Fetching news articles...");
			});

			const fetchPodcastArticles = jest.fn(async () => {
				// Simulate fetching podcast articles
				console.log("Fetching podcast articles...");
			});

			const onArticlesComplete = jest.fn(() => {
				console.log("Articles fetch completed");
			});

			const articleLoaderConfig: CronConfig = {
				id: "article-loader-config",
				anyCommandsRequired: {
					apiEndpoint: "https://api.example.com",
					authToken: "bearer-token-123",
				},
				cron: [
					{
						time: "0 */15 * * * *", // Every 15 minutes
						fetchFn: fetchNewsArticles,
						onComplete: onArticlesComplete,
					},
					{
						time: "0 0 */2 * * *", // Every 2 hours
						fetchFn: fetchPodcastArticles,
						onComplete: onArticlesComplete,
					},
				],
			};

			initCronJobs(articleLoaderConfig);

			expect(mockCreateCron).toHaveBeenCalledTimes(2);
			expect(mockCreateCron).toHaveBeenNthCalledWith(1, {
				time: "0 */15 * * * *",
				fetchFn: fetchNewsArticles,
				onComplete: onArticlesComplete,
			});
			expect(mockCreateCron).toHaveBeenNthCalledWith(2, {
				time: "0 0 */2 * * *",
				fetchFn: fetchPodcastArticles,
				onComplete: onArticlesComplete,
			});
		});

		it("should handle API polling configuration", () => {
			const pollWeatherAPI = jest.fn(async () => {
				try {
					console.log("Polling weather API...");
				} catch (error) {
					console.error("Weather API error:", error);
				}
			});

			const pollStockAPI = jest.fn(async () => {
				try {
					console.log("Polling stock API...");
				} catch (error) {
					console.error("Stock API error:", error);
				}
			});

			const apiConfig: CronConfig = {
				id: "api-polling-config",
				anyCommandsRequired: {
					retryAttempts: 3,
					timeout: 10000,
				},
				cron: [
					{
						time: "0 */30 * * * *", // Every 30 minutes
						fetchFn: pollWeatherAPI,
						onComplete: () => console.log("Weather data updated"),
					},
					{
						time: "0 0 9,12,15,18 * * 1-5", // Business hours on weekdays
						fetchFn: pollStockAPI,
						onComplete: () => console.log("Stock data updated"),
					},
				],
			};

			initCronJobs(apiConfig);

			expect(mockCreateCron).toHaveBeenCalledTimes(2);
		});

		it("should handle mixed synchronous and asynchronous jobs", () => {
			const syncJob = jest.fn(async () => {
				console.log("Synchronous job executed");
			});

			const asyncJob = jest.fn(async () => {
				await new Promise((resolve) => setTimeout(resolve, 100));
				console.log("Asynchronous job executed");
			});

			const mixedConfig: CronConfig = {
				id: "mixed-jobs-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 */5 * * * *",
						fetchFn: syncJob,
						onComplete: () => console.log("Sync job done"),
					},
					{
						time: "0 */10 * * * *",
						fetchFn: asyncJob,
						onComplete: () => console.log("Async job done"),
					},
				],
			};

			initCronJobs(mixedConfig);

			expect(mockCreateCron).toHaveBeenCalledTimes(2);
			expect(mockCreateCron).toHaveBeenCalledWith({
				time: "0 */5 * * * *",
				fetchFn: syncJob,
				onComplete: expect.any(Function),
			});
			expect(mockCreateCron).toHaveBeenCalledWith({
				time: "0 */10 * * * *",
				fetchFn: asyncJob,
				onComplete: expect.any(Function),
			});
		});

		it("should demonstrate proper config structure handling", () => {
			const config: CronConfig = {
				id: "structured-config-test",
				anyCommandsRequired: {
					database: {
						host: "localhost",
						port: 5432,
						name: "articles",
					},
					api: {
						baseUrl: "https://api.example.com",
						version: "v1",
					},
				},
				cron: [
					{
						time: "0 0 3 * * *", // Daily at 3 AM
						fetchFn: jest.fn(async () => {
							console.log("Daily maintenance job");
						}),
						onComplete: jest.fn(() => {
							console.log("Maintenance completed");
						}),
					},
				],
			};

			// Should handle complex anyCommandsRequired structure
			expect(() => {
				initCronJobs(config);
			}).not.toThrow();

			expect(mockCreateCron).toHaveBeenCalledTimes(1);
		});
	});

	describe("Error Handling and Edge Cases", () => {
		it("should handle jobs with error-prone fetch functions", () => {
			const errorProneFetch = jest.fn(() => {
				throw new Error("Simulated fetch error");
			});

			const config: CronConfig = {
				id: "error-handling-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 */1 * * * *",
						fetchFn: errorProneFetch,
						onComplete: jest.fn(),
					},
				],
			};

			// initCronJobs should not throw even if fetchFn would throw
			expect(() => {
				initCronJobs(config);
			}).not.toThrow();

			expect(mockCreateCron).toHaveBeenCalledTimes(1);
		});

		it("should preserve the order of job initialization", () => {
			const job1 = jest.fn();
			const job2 = jest.fn();
			const job3 = jest.fn();

			const config: CronConfig = {
				id: "order-test-config",
				anyCommandsRequired: {},
				cron: [
					{
						time: "0 0 6 * * *",
						fetchFn: job1,
						onComplete: jest.fn(),
					},
					{
						time: "0 0 12 * * *",
						fetchFn: job2,
						onComplete: jest.fn(),
					},
					{
						time: "0 0 18 * * *",
						fetchFn: job3,
						onComplete: jest.fn(),
					},
				],
			};

			initCronJobs(config);

			expect(mockCreateCron).toHaveBeenCalledTimes(3);

			// Verify the order of calls
			expect(mockCreateCron.mock.calls[0][0].fetchFn).toBe(job1);
			expect(mockCreateCron.mock.calls[1][0].fetchFn).toBe(job2);
			expect(mockCreateCron.mock.calls[2][0].fetchFn).toBe(job3);
		});
	});
});
