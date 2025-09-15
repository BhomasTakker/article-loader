import { createCron, createApiCron } from "./create-cron";
import { CronJob } from "cron";

// Mock the CronJob constructor
jest.mock("cron", () => ({
	CronJob: jest.fn().mockImplementation(() => ({})),
}));

const MockedCronJob = CronJob as jest.MockedClass<typeof CronJob>;

describe("Create Cron", () => {
	beforeEach(() => {
		MockedCronJob.mockClear();
	});

	describe("createCron", () => {
		it("should create a CronJob with required parameters", () => {
			const mockFetchFn = jest.fn();
			const time = "0 */15 * * * *";

			createCron({
				time,
				fetchFn: mockFetchFn,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
			expect(MockedCronJob).toHaveBeenCalledWith(
				time,
				mockFetchFn,
				undefined,
				true
			);
		});

		it("should create a CronJob with onComplete callback", () => {
			const mockFetchFn = jest.fn();
			const mockOnComplete = jest.fn();
			const time = "0 0 12 * * *";

			createCron({
				time,
				fetchFn: mockFetchFn,
				onComplete: mockOnComplete,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
			expect(MockedCronJob).toHaveBeenCalledWith(
				time,
				mockFetchFn,
				mockOnComplete,
				true
			);
		});

		it("should create a CronJob with complex cron expression", () => {
			const mockFetchFn = jest.fn();
			const complexTime = "30 2,17,32,47 * * * *";

			createCron({
				time: complexTime,
				fetchFn: mockFetchFn,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
			expect(MockedCronJob).toHaveBeenCalledWith(
				complexTime,
				mockFetchFn,
				undefined,
				true
			);
		});

		it("should create a CronJob that starts automatically", () => {
			const mockFetchFn = jest.fn();
			const time = "0 0 * * * *";

			createCron({
				time,
				fetchFn: mockFetchFn,
			});

			// Verify that the job is set to start automatically (4th parameter is true)
			expect(MockedCronJob).toHaveBeenCalledWith(
				time,
				mockFetchFn,
				undefined,
				true
			);
		});

		it("should handle different types of fetch functions", () => {
			const syncFetchFn = jest.fn();
			const asyncFetchFn = jest.fn(async () => {});
			const arrowFetchFn = () => {};

			// Test sync function
			createCron({
				time: "0 0 0 * * *",
				fetchFn: syncFetchFn,
			});

			// Test async function
			createCron({
				time: "0 0 1 * * *",
				fetchFn: asyncFetchFn,
			});

			// Test arrow function
			createCron({
				time: "0 0 2 * * *",
				fetchFn: arrowFetchFn,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(3);
		});

		it("should handle various cron time formats", () => {
			const mockFetchFn = jest.fn();
			const timeFormats = [
				"* * * * * *", // Every second
				"0 * * * * *", // Every minute
				"0 0 * * * *", // Every hour
				"0 0 0 * * *", // Every day
				"0 0 0 * * 0", // Every Sunday
				"0 0 0 1 * *", // First day of every month
				"0 30 14 * * *", // Every day at 2:30 PM
				"0 0,15,30,45 * * * *", // Every 15 minutes
			];

			timeFormats.forEach((time) => {
				createCron({
					time,
					fetchFn: mockFetchFn,
				});
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(timeFormats.length);
		});

		it("should create multiple independent cron jobs", () => {
			const fetchFn1 = jest.fn();
			const fetchFn2 = jest.fn();
			const onComplete1 = jest.fn();
			const onComplete2 = jest.fn();

			createCron({
				time: "0 0 9 * * *",
				fetchFn: fetchFn1,
				onComplete: onComplete1,
			});

			createCron({
				time: "0 0 17 * * *",
				fetchFn: fetchFn2,
				onComplete: onComplete2,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(2);
			expect(MockedCronJob).toHaveBeenNthCalledWith(
				1,
				"0 0 9 * * *",
				fetchFn1,
				onComplete1,
				true
			);
			expect(MockedCronJob).toHaveBeenNthCalledWith(
				2,
				"0 0 17 * * *",
				fetchFn2,
				onComplete2,
				true
			);
		});
	});

	describe("createApiCron", () => {
		it("should create a CronJob with required parameters", () => {
			const mockFetchFn = jest.fn();
			const time = "0 */10 * * * *";

			createApiCron({
				time,
				fetchFn: mockFetchFn,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
			expect(MockedCronJob).toHaveBeenCalledWith(
				time,
				mockFetchFn,
				undefined,
				true
			);
		});

		it("should create a CronJob with onComplete callback", () => {
			const mockFetchFn = jest.fn();
			const mockOnComplete = jest.fn();
			const time = "0 0 */2 * * *";

			createApiCron({
				time,
				fetchFn: mockFetchFn,
				onComplete: mockOnComplete,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
			expect(MockedCronJob).toHaveBeenCalledWith(
				time,
				mockFetchFn,
				mockOnComplete,
				true
			);
		});

		it("should create a CronJob identical to createCron", () => {
			const mockFetchFn = jest.fn();
			const mockOnComplete = jest.fn();
			const time = "0 15 10 * * *";

			// Clear previous calls
			MockedCronJob.mockClear();

			createApiCron({
				time,
				fetchFn: mockFetchFn,
				onComplete: mockOnComplete,
			});

			const apiCronCall = MockedCronJob.mock.calls[0];

			// Clear and create regular cron with same parameters
			MockedCronJob.mockClear();

			createCron({
				time,
				fetchFn: mockFetchFn,
				onComplete: mockOnComplete,
			});

			const regularCronCall = MockedCronJob.mock.calls[0];

			// Both should create identical CronJob instances
			expect(apiCronCall).toEqual(regularCronCall);
		});

		it("should handle API-specific scheduling patterns", () => {
			const mockFetchFn = jest.fn();

			// Common API polling patterns
			const apiPatterns = [
				"0 */5 * * * *", // Every 5 minutes
				"0 */15 * * * *", // Every 15 minutes
				"0 0 */1 * * *", // Every hour
				"0 0 */6 * * *", // Every 6 hours
				"*/30 * * * * *", // Every 30 seconds
			];

			apiPatterns.forEach((time) => {
				createApiCron({
					time,
					fetchFn: mockFetchFn,
				});
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(apiPatterns.length);
		});

		it("should create multiple API cron jobs independently", () => {
			const newsFetchFn = jest.fn();
			const weatherFetchFn = jest.fn();
			const stocksFetchFn = jest.fn();

			createApiCron({
				time: "0 */15 * * * *",
				fetchFn: newsFetchFn,
			});

			createApiCron({
				time: "0 */30 * * * *",
				fetchFn: weatherFetchFn,
			});

			createApiCron({
				time: "0 0 9,12,15,18 * * 1-5",
				fetchFn: stocksFetchFn,
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(3);
		});
	});

	describe("Type Safety and Parameter Validation", () => {
		it("should accept string time parameter", () => {
			const mockFetchFn = jest.fn();

			expect(() => {
				createCron({
					time: "0 0 * * * *",
					fetchFn: mockFetchFn,
				});
			}).not.toThrow();
		});

		it("should accept function fetchFn parameter", () => {
			const functionTypes = [
				jest.fn(), // Jest mock
				() => {}, // Arrow function
				function () {}, // Regular function
				async () => {}, // Async arrow function
				async function () {}, // Async regular function
			];

			functionTypes.forEach((fn) => {
				expect(() => {
					createCron({
						time: "0 0 * * * *",
						fetchFn: fn,
					});
				}).not.toThrow();
			});

			expect(MockedCronJob).toHaveBeenCalledTimes(functionTypes.length);
		});

		it("should accept optional onComplete parameter", () => {
			const mockFetchFn = jest.fn();

			// Without onComplete
			expect(() => {
				createCron({
					time: "0 0 * * * *",
					fetchFn: mockFetchFn,
				});
			}).not.toThrow();

			// With onComplete
			expect(() => {
				createCron({
					time: "0 0 * * * *",
					fetchFn: mockFetchFn,
					onComplete: jest.fn(),
				});
			}).not.toThrow();

			expect(MockedCronJob).toHaveBeenCalledTimes(2);
		});
	});

	describe("Integration and Realistic Usage", () => {
		it("should handle realistic article loading cron job", () => {
			const fetchArticles = jest.fn(async () => {
				// Simulate article fetching
				console.log("Fetching articles...");
			});

			const onArticlesComplete = jest.fn(() => {
				console.log("Articles fetch completed");
			});

			createCron({
				time: "0 */15 * * * *", // Every 15 minutes
				fetchFn: fetchArticles,
				onComplete: onArticlesComplete,
			});

			expect(MockedCronJob).toHaveBeenCalledWith(
				"0 */15 * * * *",
				fetchArticles,
				onArticlesComplete,
				true
			);
		});

		it("should handle realistic API polling cron job", () => {
			const pollNewsAPI = jest.fn(async () => {
				// Simulate API polling
				try {
					const response = await fetch("https://api.example.com/news");
					const data = await response.json();
					return data;
				} catch (error) {
					console.error("API polling failed:", error);
				}
			});

			createApiCron({
				time: "0 */10 * * * *", // Every 10 minutes
				fetchFn: pollNewsAPI,
			});

			expect(MockedCronJob).toHaveBeenCalledWith(
				"0 */10 * * * *",
				pollNewsAPI,
				undefined,
				true
			);
		});

		it("should handle error-prone fetch functions gracefully", () => {
			const errorProneFetch = jest.fn(() => {
				throw new Error("Network error");
			});

			// Should not throw when creating the cron job
			expect(() => {
				createCron({
					time: "0 0 * * * *",
					fetchFn: errorProneFetch,
				});
			}).not.toThrow();

			expect(MockedCronJob).toHaveBeenCalledTimes(1);
		});

		it("should demonstrate the equivalence of createCron and createApiCron", () => {
			const fetchFn = jest.fn();
			const onComplete = jest.fn();
			const time = "0 0 12 * * *";

			MockedCronJob.mockClear();

			// Both functions should behave identically
			createCron({ time, fetchFn, onComplete });
			const cronCall = MockedCronJob.mock.calls[0];

			createApiCron({ time, fetchFn, onComplete });
			const apiCronCall = MockedCronJob.mock.calls[1];

			expect(cronCall).toEqual(apiCronCall);
		});
	});
});
