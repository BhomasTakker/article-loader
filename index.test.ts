import { testFunction } from "./testfile";

describe("testFunction", () => {
	test("should add two positive numbers correctly", () => {
		const result = testFunction(2, 3);
		expect(result).toBe(5);
	});

	test("should add two negative numbers correctly", () => {
		const result = testFunction(-2, -3);
		expect(result).toBe(-5);
	});

	test("should add a positive and negative number correctly", () => {
		const result = testFunction(5, -3);
		expect(result).toBe(2);
	});

	test("should add zero to a number correctly", () => {
		const result = testFunction(0, 5);
		expect(result).toBe(5);
	});

	test("should add two zeros correctly", () => {
		const result = testFunction(0, 0);
		expect(result).toBe(0);
	});

	test("should handle decimal numbers correctly", () => {
		const result = testFunction(1.5, 2.5);
		expect(result).toBe(4);
	});

	test("should handle large numbers correctly", () => {
		const result = testFunction(1000000, 2000000);
		expect(result).toBe(3000000);
	});
});
