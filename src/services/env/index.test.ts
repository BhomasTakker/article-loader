import { getEnv } from "./index";

describe("env service", () => {
	// Store original environment variables
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset the environment before each test
		jest.resetModules();
		process.env = { ...originalEnv };
	});

	afterAll(() => {
		// Restore original environment
		process.env = originalEnv;
	});

	describe("getEnv", () => {
		it("should return all false values when no environment variables are set", () => {
			// Clear all relevant environment variables
			delete process.env.RSS_ROUTE;
			delete process.env.API_ROUTE;
			delete process.env.CRON;
			delete process.env.API_CRON;
			delete process.env.RSS_CRON;

			// Re-import the module to get fresh values
			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: false,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it('should return true for RSS_ROUTE when set to "true"', () => {
			process.env.RSS_ROUTE = "true";
			delete process.env.API_ROUTE;
			delete process.env.CRON;
			delete process.env.API_CRON;
			delete process.env.RSS_CRON;

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: true,
				isApiRoute: false,
				isCron: false,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it('should return true for API_ROUTE when set to "true"', () => {
			delete process.env.RSS_ROUTE;
			process.env.API_ROUTE = "true";
			delete process.env.CRON;
			delete process.env.API_CRON;
			delete process.env.RSS_CRON;

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: true,
				isCron: false,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it('should return true for CRON when set to "true"', () => {
			delete process.env.RSS_ROUTE;
			delete process.env.API_ROUTE;
			process.env.CRON = "true";
			delete process.env.API_CRON;
			delete process.env.RSS_CRON;

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: true,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it('should return true for API_CRON when set to "true"', () => {
			delete process.env.RSS_ROUTE;
			delete process.env.API_ROUTE;
			delete process.env.CRON;
			process.env.API_CRON = "true";
			delete process.env.RSS_CRON;

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: false,
				isApiCron: true,
				isRSSCron: false,
			});
		});

		it('should return true for RSS_CRON when set to "true"', () => {
			delete process.env.RSS_ROUTE;
			delete process.env.API_ROUTE;
			delete process.env.CRON;
			delete process.env.API_CRON;
			process.env.RSS_CRON = "true";

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: false,
				isApiCron: false,
				isRSSCron: true,
			});
		});

		it('should return all true values when all environment variables are set to "true"', () => {
			process.env.RSS_ROUTE = "true";
			process.env.API_ROUTE = "true";
			process.env.CRON = "true";
			process.env.API_CRON = "true";
			process.env.RSS_CRON = "true";

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: true,
				isApiRoute: true,
				isCron: true,
				isApiCron: true,
				isRSSCron: true,
			});
		});

		it('should return false for environment variables set to "false"', () => {
			process.env.RSS_ROUTE = "false";
			process.env.API_ROUTE = "false";
			process.env.CRON = "false";
			process.env.API_CRON = "false";
			process.env.RSS_CRON = "false";

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: false,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it('should return false for environment variables set to non-"true" values', () => {
			process.env.RSS_ROUTE = "yes";
			process.env.API_ROUTE = "1";
			process.env.CRON = "TRUE"; // case sensitive
			process.env.API_CRON = "on";
			process.env.RSS_CRON = "enabled";

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: false,
				isApiRoute: false,
				isCron: false,
				isApiCron: false,
				isRSSCron: false,
			});
		});

		it("should handle mixed environment variable states", () => {
			process.env.RSS_ROUTE = "true";
			process.env.API_ROUTE = "false";
			process.env.CRON = "true";
			delete process.env.API_CRON; // undefined
			process.env.RSS_CRON = "invalid";

			const { getEnv } = require("./index");

			const result = getEnv();

			expect(result).toEqual({
				isRssRoute: true,
				isApiRoute: false,
				isCron: true,
				isApiCron: false,
				isRSSCron: false,
			});
		});
	});
});
