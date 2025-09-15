// Mock console.log to capture output
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

// Mock process.memoryUsage
const mockMemoryUsage = jest.fn();
Object.defineProperty(process, "memoryUsage", {
	value: mockMemoryUsage,
	writable: true,
});

describe("Memory Utils", () => {
	// We need to import the module after setting up the environment
	let formatMemoryUsage: any;
	let logMemoryUsage: any;

	beforeEach(() => {
		consoleLogSpy.mockClear();
		mockMemoryUsage.mockClear();
		// Reset environment variable
		delete process.env.LOG_MEMORY_USAGE;
		// Clear the module cache to allow re-importing with new env vars
		jest.resetModules();
	});

	afterAll(() => {
		consoleLogSpy.mockRestore();
	});

	describe("formatMemoryUsage", () => {
		beforeEach(() => {
			const memModule = require("./index");
			formatMemoryUsage = memModule.formatMemoryUsage;
		});

		it("should format bytes to MB with 2 decimal places", () => {
			const bytes = 1024 * 1024; // 1 MB
			const result = formatMemoryUsage(bytes);
			expect(result).toBe("1 MB");
		});

		it("should format larger values correctly", () => {
			const bytes = 1024 * 1024 * 2.5; // 2.5 MB
			const result = formatMemoryUsage(bytes);
			expect(result).toBe("2.5 MB");
		});

		it("should format smaller values correctly", () => {
			const bytes = 512 * 1024; // 0.5 MB
			const result = formatMemoryUsage(bytes);
			expect(result).toBe("0.5 MB");
		});

		it("should handle zero bytes", () => {
			const result = formatMemoryUsage(0);
			expect(result).toBe("0 MB");
		});

		it("should round to 2 decimal places", () => {
			const bytes = 1024 * 1024 * 1.12345; // ~1.12345 MB
			const result = formatMemoryUsage(bytes);
			expect(result).toBe("1.12 MB");
		});

		it("should handle very large numbers", () => {
			const bytes = 1024 * 1024 * 1000; // 1000 MB
			const result = formatMemoryUsage(bytes);
			expect(result).toBe("1000 MB");
		});
	});

	describe("logMemoryUsage", () => {
		const mockMemoryData = {
			rss: 1024 * 1024 * 10, // 10 MB
			heapTotal: 1024 * 1024 * 5, // 5 MB
			heapUsed: 1024 * 1024 * 3, // 3 MB
			external: 1024 * 1024 * 1, // 1 MB
		};

		beforeEach(() => {
			mockMemoryUsage.mockReturnValue(mockMemoryData);
		});

		it("should not log when LOG_MEMORY_USAGE is not set", () => {
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			logMemoryUsage();
			expect(consoleLogSpy).not.toHaveBeenCalled();
			expect(mockMemoryUsage).not.toHaveBeenCalled();
		});

		it("should not log when LOG_MEMORY_USAGE is false", () => {
			process.env.LOG_MEMORY_USAGE = "false";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			logMemoryUsage();
			expect(consoleLogSpy).not.toHaveBeenCalled();
			expect(mockMemoryUsage).not.toHaveBeenCalled();
		});

		it("should log memory usage when LOG_MEMORY_USAGE is true", () => {
			process.env.LOG_MEMORY_USAGE = "true";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			logMemoryUsage();

			expect(mockMemoryUsage).toHaveBeenCalledTimes(1);
			expect(consoleLogSpy).toHaveBeenCalledTimes(2);

			// Check the memory usage object structure
			const memoryUsageCall = consoleLogSpy.mock.calls[0][0];
			expect(memoryUsageCall).toHaveProperty("rss");
			expect(memoryUsageCall).toHaveProperty("heapTotal");
			expect(memoryUsageCall).toHaveProperty("heapUsed");
			expect(memoryUsageCall).toHaveProperty("external");

			// Check specific values
			expect(memoryUsageCall.rss).toContain("10 MB");
			expect(memoryUsageCall.rss).toContain("Resident Set Size");
			expect(memoryUsageCall.heapTotal).toContain("5 MB");
			expect(memoryUsageCall.heapTotal).toContain(
				"total size of the allocated heap"
			);
			expect(memoryUsageCall.heapUsed).toContain("3 MB");
			expect(memoryUsageCall.heapUsed).toContain(
				"actual memory used during the execution"
			);
			expect(memoryUsageCall.external).toContain("1 MB");
			expect(memoryUsageCall.external).toContain("V8 external memory");

			// Check highest RSS log
			const highestRssCall = consoleLogSpy.mock.calls[1][0];
			expect(highestRssCall).toContain("Highest RSS: 10 MB");
		});

		it("should track the highest RSS value across multiple calls", () => {
			process.env.LOG_MEMORY_USAGE = "true";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			// First call with 10 MB RSS
			mockMemoryUsage.mockReturnValueOnce({
				...mockMemoryData,
				rss: 1024 * 1024 * 10, // 10 MB
			});
			logMemoryUsage();

			// Second call with 15 MB RSS (higher)
			mockMemoryUsage.mockReturnValueOnce({
				...mockMemoryData,
				rss: 1024 * 1024 * 15, // 15 MB
			});
			logMemoryUsage();

			// Third call with 12 MB RSS (lower than highest)
			mockMemoryUsage.mockReturnValueOnce({
				...mockMemoryData,
				rss: 1024 * 1024 * 12, // 12 MB
			});
			logMemoryUsage();

			// Check that highest RSS is tracked correctly
			expect(consoleLogSpy).toHaveBeenCalledTimes(6); // 3 calls * 2 logs each

			// Check the latest highest RSS log
			const lastHighestRssCall = consoleLogSpy.mock.calls[5][0];
			expect(lastHighestRssCall).toContain("Highest RSS: 15 MB");
		});

		it("should handle different memory values correctly", () => {
			process.env.LOG_MEMORY_USAGE = "true";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			const customMemoryData = {
				rss: 1024 * 1024 * 25.75, // 25.75 MB
				heapTotal: 1024 * 1024 * 12.25, // 12.25 MB
				heapUsed: 1024 * 1024 * 8.5, // 8.5 MB
				external: 1024 * 1024 * 2.33, // 2.33 MB
			};

			mockMemoryUsage.mockReturnValue(customMemoryData);
			logMemoryUsage();

			const memoryUsageCall = consoleLogSpy.mock.calls[0][0];
			expect(memoryUsageCall.rss).toContain("25.75 MB");
			expect(memoryUsageCall.heapTotal).toContain("12.25 MB");
			expect(memoryUsageCall.heapUsed).toContain("8.5 MB");
			expect(memoryUsageCall.external).toContain("2.33 MB");
		});

		it("should work with truthy string values for LOG_MEMORY_USAGE", () => {
			process.env.LOG_MEMORY_USAGE = "1";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;

			// Since the code uses === "true", other truthy values should not enable logging
			logMemoryUsage();
			expect(consoleLogSpy).not.toHaveBeenCalled();
		});
	});

	describe("integration tests", () => {
		it("should use formatMemoryUsage consistently in logMemoryUsage", () => {
			process.env.LOG_MEMORY_USAGE = "true";
			const memModule = require("./index");
			logMemoryUsage = memModule.logMemoryUsage;
			formatMemoryUsage = memModule.formatMemoryUsage;

			const testMemoryData = {
				rss: 1024 * 1024 * 7.89, // 7.89 MB
				heapTotal: 1024 * 1024 * 4.56, // 4.56 MB
				heapUsed: 1024 * 1024 * 2.34, // 2.34 MB
				external: 1024 * 1024 * 1.23, // 1.23 MB
			};

			mockMemoryUsage.mockReturnValue(testMemoryData);
			logMemoryUsage();

			const memoryUsageCall = consoleLogSpy.mock.calls[0][0];

			// Verify that the formatted values match what formatMemoryUsage would return
			expect(memoryUsageCall.rss).toContain(
				formatMemoryUsage(testMemoryData.rss)
			);
			expect(memoryUsageCall.heapTotal).toContain(
				formatMemoryUsage(testMemoryData.heapTotal)
			);
			expect(memoryUsageCall.heapUsed).toContain(
				formatMemoryUsage(testMemoryData.heapUsed)
			);
			expect(memoryUsageCall.external).toContain(
				formatMemoryUsage(testMemoryData.external)
			);
		});
	});
});
