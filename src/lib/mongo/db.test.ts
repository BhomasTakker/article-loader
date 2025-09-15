import mongoose from "mongoose";

// Mock console.log to capture output
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

// Mock mongoose.connect to return a proper Promise
const mockConnect = jest.fn();
jest.mock("mongoose", () => ({
	connect: mockConnect,
}));

// Mock dotenv
jest.mock("dotenv", () => ({
	config: jest.fn(),
}));

describe("MongoDB Connection", () => {
	let connectToMongoDB: any;
	const originalEnv = process.env;
	const originalGlobal = global.mongoose;

	beforeEach(() => {
		// Reset environment variables
		process.env = { ...originalEnv };
		delete process.env.MONGODB_URI;

		// Reset global mongoose cache
		global.mongoose = undefined;

		// Clear all mocks
		jest.clearAllMocks();
		consoleLogSpy.mockClear();
		mockConnect.mockClear();

		// Clear module cache to get fresh imports
		jest.resetModules();
	});
	afterEach(() => {
		// Restore original environment
		process.env = originalEnv;
		global.mongoose = originalGlobal;
	});

	afterAll(() => {
		consoleLogSpy.mockRestore();
	});

	describe("connectToMongoDB", () => {
		beforeEach(() => {
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;
		});

		it("should throw an error when MONGODB_URI is not defined", async () => {
			// No MONGODB_URI set
			await expect(connectToMongoDB()).rejects.toThrow(
				"Please define the MONGODB_URI environment variable inside .env.local"
			);
		});

		it("should throw an error when MONGODB_URI is empty string", async () => {
			process.env.MONGODB_URI = "";

			// Need to re-import after setting env var
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			await expect(connectToMongoDB()).rejects.toThrow(
				"Please define the MONGODB_URI environment variable inside .env.local"
			);
		});

		it("should return cached connection when one exists", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			// Set up a cached connection
			global.mongoose = {
				conn: { connection: { readyState: 1 } },
				promise: null,
			};

			// Need to re-import after setting up cache
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			const result = await connectToMongoDB();

			expect(result).toEqual({ connection: { readyState: 1 } });
			expect(consoleLogSpy).toHaveBeenCalledWith("returned cached connection");
			expect(mockConnect).not.toHaveBeenCalled();
		});

		it("should create new connection when no cache exists", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			const mockConnection = { connection: { readyState: 1 } };
			mockConnect.mockResolvedValue(mockConnection as any);

			// Need to re-import after setting env var
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			const result = await connectToMongoDB();

			expect(mockConnect).toHaveBeenCalledWith(
				"mongodb://localhost:27017/test",
				{ bufferCommands: false }
			);
			expect(result).toEqual(mockConnection);
			expect(consoleLogSpy).toHaveBeenCalledWith("created new connection");
		});

		it("should use existing promise when connection is in progress", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			const mockConnection = { connection: { readyState: 1 } };
			const mockPromise = Promise.resolve(mockConnection);
			mockConnect.mockReturnValue(mockPromise as any);

			// Set up cache with existing promise but no connection
			global.mongoose = {
				conn: null,
				promise: mockPromise,
			};

			// Need to re-import after setting up cache
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			const result = await connectToMongoDB();

			expect(result).toEqual(mockConnection);
			expect(mockConnect).not.toHaveBeenCalled(); // Should use existing promise
			expect(consoleLogSpy).toHaveBeenCalledWith("created new connection");
		});

		it("should handle connection errors and reset promise", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			const connectionError = new Error("Connection failed");
			mockConnect.mockRejectedValue(connectionError);

			// Need to re-import after setting env var
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			await expect(connectToMongoDB()).rejects.toThrow("Connection failed");

			expect(mockConnect).toHaveBeenCalledWith(
				"mongodb://localhost:27017/test",
				{ bufferCommands: false }
			);

			// Verify that promise is reset to null after error
			expect(global.mongoose.promise).toBeNull();
		});

		it("should initialize global mongoose cache if not exists", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			// Ensure global.mongoose is not set
			global.mongoose = undefined;

			const mockConnection = { connection: { readyState: 1 } };
			mockConnect.mockResolvedValue(mockConnection as any);

			// Need to re-import after clearing global cache
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			const result = await connectToMongoDB();

			expect(global.mongoose).toBeDefined();
			expect(global.mongoose.conn).toEqual(mockConnection);
			expect(global.mongoose.promise).toBeDefined();
			expect(result).toEqual(mockConnection);
		});

		it("should use correct mongoose connection options", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";

			const mockConnection = { connection: { readyState: 1 } };
			mockConnect.mockResolvedValue(mockConnection as any);

			// Need to re-import after setting env var
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			await connectToMongoDB();

			expect(mockConnect).toHaveBeenCalledWith(
				"mongodb://localhost:27017/testdb",
				{ bufferCommands: false }
			);
		});

		it("should handle multiple concurrent connection attempts", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			const mockConnection = { connection: { readyState: 1 } };
			let resolvePromise: (value: any) => void;
			const delayedPromise = new Promise((resolve) => {
				resolvePromise = resolve;
			});

			mockConnect.mockReturnValue(delayedPromise as any);

			// Need to re-import after setting env var
			jest.resetModules();
			const dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			// Start multiple connection attempts
			const promise1 = connectToMongoDB();
			const promise2 = connectToMongoDB();
			const promise3 = connectToMongoDB();

			// Resolve the delayed promise
			resolvePromise!(mockConnection);

			const [result1, result2, result3] = await Promise.all([
				promise1,
				promise2,
				promise3,
			]);

			// All should return the same connection
			expect(result1).toEqual(mockConnection);
			expect(result2).toEqual(mockConnection);
			expect(result3).toEqual(mockConnection);

			// mongoose.connect should only be called once
			expect(mockConnect).toHaveBeenCalledTimes(1);
		});

		it("should handle different MONGODB_URI formats", async () => {
			const testCases = [
				"mongodb://localhost:27017/testdb",
				"mongodb+srv://user:pass@cluster.mongodb.net/testdb",
				"mongodb://user:password@host1:27017,host2:27017/testdb?replicaSet=rs0",
			];

			for (const uri of testCases) {
				// Reset for each test case
				global.mongoose = undefined;
				mockConnect.mockClear();
				process.env.MONGODB_URI = uri;

				const mockConnection = { connection: { readyState: 1 } };
				mockConnect.mockResolvedValue(mockConnection as any);

				// Need to re-import for each test case
				jest.resetModules();
				const dbModule = require("./db");
				connectToMongoDB = dbModule.connectToMongoDB;

				const result = await connectToMongoDB();

				expect(mockConnect).toHaveBeenCalledWith(uri, {
					bufferCommands: false,
				});
				expect(result).toEqual(mockConnection);
			}
		});
	});

	describe("global cache behavior", () => {
		it("should maintain cache state across multiple imports", async () => {
			process.env.MONGODB_URI = "mongodb://localhost:27017/test";

			const mockConnection = { connection: { readyState: 1 } };
			mockConnect.mockResolvedValue(mockConnection as any);

			// First import and connection
			jest.resetModules();
			let dbModule = require("./db");
			let connectToMongoDB = dbModule.connectToMongoDB;

			await connectToMongoDB();

			expect(global.mongoose.conn).toEqual(mockConnection);
			expect(mockConnect).toHaveBeenCalledTimes(1);

			// Second import should use the same cache
			jest.resetModules();
			dbModule = require("./db");
			connectToMongoDB = dbModule.connectToMongoDB;

			const result = await connectToMongoDB();

			expect(result).toEqual(mockConnection);
			expect(mockConnect).toHaveBeenCalledTimes(1); // Should not call again
			expect(consoleLogSpy).toHaveBeenCalledWith("returned cached connection");
		});
	});
});
