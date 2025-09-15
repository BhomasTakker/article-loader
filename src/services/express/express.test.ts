import express from "express";
import { initialiseExpress, startServer } from "./index";

// Mock express and its methods
jest.mock("express", () => {
	return jest.fn();
});

// Create a typed mock for express
const mockExpress = express as jest.MockedFunction<typeof express>;

describe("Express Service", () => {
	let mockApp: any;
	let mockListen: jest.Mock;
	let consoleSpy: jest.SpyInstance;

	beforeEach(() => {
		// Reset all mocks before each test
		jest.resetAllMocks();

		// Create mock express app with listen method
		mockListen = jest.fn();
		mockApp = {
			listen: mockListen,
		};

		// Mock express function to return our mock app
		mockExpress.mockReturnValue(mockApp);

		// Spy on console.log
		consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		// Restore console.log
		consoleSpy.mockRestore();
	});

	describe("initialiseExpress", () => {
		it("should create and return an express app", () => {
			const result = initialiseExpress();

			expect(express).toHaveBeenCalledTimes(1);
			expect(result).toBe(mockApp);
		});
	});

	describe("startServer", () => {
		it("should use default port 4000 when PORT environment variable is not set", () => {
			// Ensure PORT is not set
			delete process.env.PORT;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));
		});

		it("should use PORT environment variable when set", () => {
			const testPort = "3000";
			process.env.PORT = testPort;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith(testPort, expect.any(Function));

			// Clean up
			delete process.env.PORT;
		});

		it("should log the correct message when server starts with default port", () => {
			delete process.env.PORT;

			startServer(mockApp);

			// Get the callback function passed to listen and execute it
			const listenCallback = mockListen.mock.calls[0][1];
			listenCallback();

			expect(consoleSpy).toHaveBeenCalledWith("Server is running on port 4000");
		});

		it("should log the correct message when server starts with custom port", () => {
			const testPort = "8080";
			process.env.PORT = testPort;

			startServer(mockApp);

			// Get the callback function passed to listen and execute it
			const listenCallback = mockListen.mock.calls[0][1];
			listenCallback();

			expect(consoleSpy).toHaveBeenCalledWith(
				`Server is running on port ${testPort}`
			);

			// Clean up
			delete process.env.PORT;
		});

		it("should call app.listen with the correct parameters", () => {
			const testPort = "5000";
			process.env.PORT = testPort;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith(testPort, expect.any(Function));

			// Verify the callback is a function
			const callback = mockListen.mock.calls[0][1];
			expect(typeof callback).toBe("function");

			// Clean up
			delete process.env.PORT;
		});

		it("should handle string port numbers correctly", () => {
			// Test that string ports work (common in environment variables)
			process.env.PORT = "9000";

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith("9000", expect.any(Function));

			// Clean up
			delete process.env.PORT;
		});

		it("should work when PORT is an empty string", () => {
			process.env.PORT = "";

			startServer(mockApp);

			// Empty string is falsy, so should use default port
			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));

			// Clean up
			delete process.env.PORT;
		});
	});

	describe("Integration tests", () => {
		it("should initialize express app and start server in separate calls", () => {
			const testPort = "7000";
			process.env.PORT = testPort;

			// Test initialiseExpress
			const app = initialiseExpress();
			expect(express).toHaveBeenCalledTimes(1);
			expect(app).toBe(mockApp);

			// Test startServer
			startServer(app);
			expect(mockListen).toHaveBeenCalledWith(testPort, expect.any(Function));

			// Execute the callback and verify logging
			const listenCallback = mockListen.mock.calls[0][1];
			listenCallback();
			expect(consoleSpy).toHaveBeenCalledWith(
				`Server is running on port ${testPort}`
			);

			// Clean up
			delete process.env.PORT;
		});
	});
});
