module.exports = {
	testEnvironment: "node",
	transform: {
		"^.+\\.ts$": "ts-jest",
	},
	moduleFileExtensions: ["ts", "js", "json", "node"],
	testMatch: [
		"**/__tests__/**/*.(spec|test).[jt]s?(x)",
		"**/*.(spec|test).[jt]s?(x)",
	],
	testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
	coverageDirectory: "coverage",
	collectCoverage: true,
	collectCoverageFrom: ["src/**/*.{ts,js}", "!src/**/*.d.ts"],
};
