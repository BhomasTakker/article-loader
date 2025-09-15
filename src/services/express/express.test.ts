import express from "express";
import { initialiseExpress, startServer } from "./index";

// Mock console.log to prevent output during tests
const originalLog = console.log;

describe("Express Service", () => {
	beforeEach(() => {
		// Mock console.log for each test
		console.log = jest.fn();
	});

	afterEach(() => {
		// Restore console.log after each test
		console.log = originalLog;
		// Clear all mocks
		jest.clearAllMocks();
		// Reset environment variables
		delete process.env.PORT;
	});

	describe("initialiseExpress", () => {
		it("should return an Express application instance", () => {
			const app = initialiseExpress();

			expect(app).toBeDefined();
			expect(typeof app).toBe("function");
			expect(app).toHaveProperty("listen");
			expect(app).toHaveProperty("use");
			expect(app).toHaveProperty("get");
			expect(app).toHaveProperty("post");
		});

		it("should create a new Express app instance each time it's called", () => {
			const app1 = initialiseExpress();
			const app2 = initialiseExpress();

			expect(app1).toBeDefined();
			expect(app2).toBeDefined();
			expect(app1).not.toBe(app2);
		});

		it("should return an Express app that can handle middleware", () => {
			const app = initialiseExpress();
			const middleware = jest.fn((req, res, next) => next());

			// Should not throw when adding middleware
			expect(() => {
				app.use(middleware);
			}).not.toThrow();
		});

		it("should return an Express app that can define routes", () => {
			const app = initialiseExpress();
			const routeHandler = jest.fn((req, res) => res.send("test"));

			// Should not throw when defining routes
			expect(() => {
				app.get("/test", routeHandler);
				app.post("/test", routeHandler);
			}).not.toThrow();
		});
	});

	describe("startServer", () => {
		let mockApp: express.Express;
		let mockListen: jest.Mock;

		beforeEach(() => {
			mockListen = jest.fn();
			// Create a real Express app and mock its listen method
			mockApp = express();
			mockApp.listen = mockListen as any;
		});

		it("should call app.listen with default port 4000 when PORT env var is not set", () => {
			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));
		});

		it("should call app.listen with PORT env var when set", () => {
			process.env.PORT = "3000";

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith("3000", expect.any(Function));
		});

		it("should call app.listen with custom PORT env var", () => {
			process.env.PORT = "8080";

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledTimes(1);
			expect(mockListen).toHaveBeenCalledWith("8080", expect.any(Function));
		});

		it("should log server start message when callback is executed", () => {
			mockListen.mockImplementation((port, callback) => {
				callback();
			});

			startServer(mockApp);

			expect(console.log).toHaveBeenCalledWith(
				"Server is running on port 4000"
			);
		});

		it("should log correct port in message when custom PORT is set", () => {
			process.env.PORT = "5000";
			mockListen.mockImplementation((port, callback) => {
				callback();
			});

			startServer(mockApp);

			expect(console.log).toHaveBeenCalledWith(
				"Server is running on port 5000"
			);
		});

		it("should handle numeric port values", () => {
			process.env.PORT = "9000";

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith("9000", expect.any(Function));
		});

		it("should work with a real Express app instance", () => {
			const realApp = express();
			const originalAppListen = realApp.listen;
			realApp.listen = jest.fn() as any;

			startServer(realApp);

			expect(realApp.listen).toHaveBeenCalledWith(4000, expect.any(Function));
		});
	});

	describe("Integration Tests", () => {
		it("should create and start a server with default configuration", () => {
			const app = initialiseExpress();
			const mockListen = jest.fn();
			app.listen = mockListen as any;

			startServer(app);

			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));
		});

		it("should create and start a server with custom port", () => {
			process.env.PORT = "7000";
			const app = initialiseExpress();
			const mockListen = jest.fn();
			app.listen = mockListen as any;

			startServer(app);

			expect(mockListen).toHaveBeenCalledWith("7000", expect.any(Function));
		});

		it("should handle the complete flow of initializing and starting Express", () => {
			process.env.PORT = "6000";
			const app = initialiseExpress();

			// Verify app is properly initialized
			expect(app).toBeDefined();
			expect(typeof app.listen).toBe("function");

			// Mock the listen method
			const mockListen = jest.fn((port, callback) => {
				callback();
			});
			app.listen = mockListen as any;

			// Start the server
			startServer(app);

			// Verify server started correctly
			expect(mockListen).toHaveBeenCalledWith("6000", expect.any(Function));
			expect(console.log).toHaveBeenCalledWith(
				"Server is running on port 6000"
			);
		});
	});

	describe("Error Handling", () => {
		it("should handle invalid PORT environment variable gracefully", () => {
			process.env.PORT = "invalid-port";
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith(
				"invalid-port",
				expect.any(Function)
			);
		});

		it("should handle empty PORT environment variable", () => {
			process.env.PORT = "";
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			// Empty string is falsy, so should default to 4000
			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));
		});

		it("should handle undefined PORT environment variable", () => {
			delete process.env.PORT;
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith(4000, expect.any(Function));
		});
	});

	describe("Type Safety", () => {
		it("should accept Express application from initialiseExpress", () => {
			const app = initialiseExpress();
			const mockListen = jest.fn();
			app.listen = mockListen as any;

			expect(() => {
				startServer(app);
			}).not.toThrow();

			expect(mockListen).toHaveBeenCalled();
		});

		it("should work with freshly created Express app", () => {
			const app = express();
			const mockListen = jest.fn();
			app.listen = mockListen as any;

			expect(() => {
				startServer(app);
			}).not.toThrow();

			expect(mockListen).toHaveBeenCalled();
		});
	});

	describe("Environment Variable Edge Cases", () => {
		it("should handle PORT as string number", () => {
			process.env.PORT = "3000";
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith("3000", expect.any(Function));
		});

		it("should handle PORT with whitespace", () => {
			process.env.PORT = " 4500 ";
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith(" 4500 ", expect.any(Function));
		});

		it("should handle PORT as zero", () => {
			process.env.PORT = "0";
			const mockApp = express();
			const mockListen = jest.fn();
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(mockListen).toHaveBeenCalledWith("0", expect.any(Function));
		});
	});

	describe("Console Logging", () => {
		it("should log with correct format", () => {
			const mockApp = express();
			const mockListen = jest.fn((port, callback) => callback());
			mockApp.listen = mockListen as any;

			startServer(mockApp);

			expect(console.log).toHaveBeenCalledWith(
				"Server is running on port 4000"
			);
			expect(console.log).toHaveBeenCalledTimes(1);
		});

		it("should log different ports correctly", () => {
			const testPorts = ["3000", "8080", "5432"];

			testPorts.forEach((port) => {
				jest.clearAllMocks();
				process.env.PORT = port;

				const mockApp = express();
				const mockListen = jest.fn((port, callback) => callback());
				mockApp.listen = mockListen as any;

				startServer(mockApp);

				expect(console.log).toHaveBeenCalledWith(
					`Server is running on port ${port}`
				);
			});
		});
	});
});
