import {
	staggerMinutes,
	staggerSeconds,
	everyNDays,
	everyNthHour,
} from "./cron-times";

describe("Cron Times", () => {
	describe("staggerMinutes", () => {
		it("should generate cron expression for every 15 minutes with default stagger and second", () => {
			const result = staggerMinutes(15, 0);
			expect(result).toBe("0 0,15,30,45 * * * *");
		});

		it("should generate cron expression for every 15 minutes with stagger of 1", () => {
			const result = staggerMinutes(15, 1);
			expect(result).toBe("0 1,16,31,46 * * * *");
		});

		it("should generate cron expression for every 15 minutes with custom second", () => {
			const result = staggerMinutes(15, 2, 30);
			expect(result).toBe("30 2,17,32,47 * * * *");
		});

		it("should generate cron expression for every 10 minutes", () => {
			const result = staggerMinutes(10, 0);
			expect(result).toBe("0 0,10,20,30,40,50 * * * *");
		});

		it("should generate cron expression for every 20 minutes with stagger", () => {
			const result = staggerMinutes(20, 5);
			expect(result).toBe("0 5,25,45 * * * *");
		});

		it("should generate cron expression for every 30 minutes", () => {
			const result = staggerMinutes(30, 0);
			expect(result).toBe("0 0,30 * * * *");
		});

		it("should handle edge case where stagger equals the interval", () => {
			const result = staggerMinutes(15, 15);
			expect(result).toBe("0 15,30,45 * * * *");
		});

		it("should handle large stagger values", () => {
			const result = staggerMinutes(15, 50);
			expect(result).toBe("0 50 * * * *");
		});

		it("should handle stagger greater than interval", () => {
			const result = staggerMinutes(10, 55);
			expect(result).toBe("0 55 * * * *");
		});

		it("should handle minute interval of 1", () => {
			const result = staggerMinutes(1, 0);
			const expected =
				"0 " + Array.from({ length: 60 }, (_, i) => i).join(",") + " * * * *";
			expect(result).toBe(expected);
		});

		it("should handle minute interval of 60 (once per hour)", () => {
			const result = staggerMinutes(60, 0);
			expect(result).toBe("0 0 * * * *");
		});

		it("should handle different second values", () => {
			const result = staggerMinutes(15, 0, 45);
			expect(result).toBe("45 0,15,30,45 * * * *");
		});
	});

	describe("staggerSeconds", () => {
		it("should generate cron expression for every 15 seconds with no stagger", () => {
			const result = staggerSeconds(15, 0);
			expect(result).toBe("0,15,30,45 * * * * *");
		});

		it("should generate cron expression for every 15 seconds with stagger of 1", () => {
			const result = staggerSeconds(15, 1);
			expect(result).toBe("1,16,31,46 * * * * *");
		});

		it("should generate cron expression for every 10 seconds", () => {
			const result = staggerSeconds(10, 0);
			expect(result).toBe("0,10,20,30,40,50 * * * * *");
		});

		it("should generate cron expression for every 20 seconds with stagger", () => {
			const result = staggerSeconds(20, 5);
			expect(result).toBe("5,25,45 * * * * *");
		});

		it("should generate cron expression for every 30 seconds", () => {
			const result = staggerSeconds(30, 0);
			expect(result).toBe("0,30 * * * * *");
		});

		it("should handle edge case where stagger equals the interval", () => {
			const result = staggerSeconds(15, 15);
			expect(result).toBe("15,30,45 * * * * *");
		});

		it("should handle large stagger values", () => {
			const result = staggerSeconds(15, 50);
			expect(result).toBe("50 * * * * *");
		});

		it("should handle stagger greater than interval", () => {
			const result = staggerSeconds(10, 55);
			expect(result).toBe("55 * * * * *");
		});

		it("should handle second interval of 1", () => {
			const result = staggerSeconds(1, 0);
			const expected =
				Array.from({ length: 60 }, (_, i) => i).join(",") + " * * * * *";
			expect(result).toBe(expected);
		});

		it("should handle second interval of 60 (once per minute)", () => {
			const result = staggerSeconds(60, 0);
			expect(result).toBe("0 * * * * *");
		});

		it("should handle different stagger values", () => {
			const result = staggerSeconds(12, 3);
			expect(result).toBe("3,15,27,39,51 * * * * *");
		});
	});

	describe("everyNDays", () => {
		it("should generate cron expression for every day with default values", () => {
			const result = everyNDays(1);
			expect(result).toBe("0 0 0 */1 * *");
		});

		it("should generate cron expression for every 2 days", () => {
			const result = everyNDays(2);
			expect(result).toBe("0 0 0 */2 * *");
		});

		it("should generate cron expression for every 7 days (weekly)", () => {
			const result = everyNDays(7);
			expect(result).toBe("0 0 0 */7 * *");
		});

		it("should generate cron expression with custom hour", () => {
			const result = everyNDays(1, 14);
			expect(result).toBe("0 0 14 */1 * *");
		});

		it("should generate cron expression with custom minute", () => {
			const result = everyNDays(1, 0, 30);
			expect(result).toBe("0 30 0 */1 * *");
		});

		it("should generate cron expression with custom second", () => {
			const result = everyNDays(1, 0, 0, 45);
			expect(result).toBe("45 0 0 */1 * *");
		});

		it("should generate cron expression with all custom values", () => {
			const result = everyNDays(3, 15, 30, 45);
			expect(result).toBe("45 30 15 */3 * *");
		});

		it("should handle edge cases for time values", () => {
			const result = everyNDays(1, 23, 59, 59);
			expect(result).toBe("59 59 23 */1 * *");
		});

		it("should handle minimum values", () => {
			const result = everyNDays(1, 0, 0, 0);
			expect(result).toBe("0 0 0 */1 * *");
		});

		it("should generate cron expression for every 30 days (monthly-ish)", () => {
			const result = everyNDays(30, 12);
			expect(result).toBe("0 0 12 */30 * *");
		});
	});

	describe("everyNthHour", () => {
		it("should generate cron expression for every hour with default values", () => {
			const result = everyNthHour(1);
			expect(result).toBe("0 0 */1 * * *");
		});

		it("should generate cron expression for every 2 hours", () => {
			const result = everyNthHour(2);
			expect(result).toBe("0 0 */2 * * *");
		});

		it("should generate cron expression for every 6 hours", () => {
			const result = everyNthHour(6);
			expect(result).toBe("0 0 */6 * * *");
		});

		it("should generate cron expression for every 12 hours", () => {
			const result = everyNthHour(12);
			expect(result).toBe("0 0 */12 * * *");
		});

		it("should generate cron expression for every 24 hours (daily)", () => {
			const result = everyNthHour(24);
			expect(result).toBe("0 0 */24 * * *");
		});

		it("should generate cron expression with minutes offset", () => {
			const result = everyNthHour(2, 30);
			expect(result).toBe("0 30 */2 * * *");
		});

		it("should generate cron expression with custom second", () => {
			const result = everyNthHour(1, 0, 45);
			expect(result).toBe("45 0 */1 * * *");
		});

		it("should generate cron expression with both minutes offset and custom second", () => {
			const result = everyNthHour(4, 15, 30);
			expect(result).toBe("30 15 */4 * * *");
		});

		it("should handle edge cases for time values", () => {
			const result = everyNthHour(1, 59, 59);
			expect(result).toBe("59 59 */1 * * *");
		});

		it("should handle minimum values", () => {
			const result = everyNthHour(1, 0, 0);
			expect(result).toBe("0 0 */1 * * *");
		});

		it("should generate cron expression for every 3 hours with offset", () => {
			const result = everyNthHour(3, 45);
			expect(result).toBe("0 45 */3 * * *");
		});

		it("should generate cron expression for every 8 hours", () => {
			const result = everyNthHour(8);
			expect(result).toBe("0 0 */8 * * *");
		});
	});

	describe("Integration and Edge Cases", () => {
		it("should handle mathematical precision for staggerMinutes", () => {
			// Test that we don't get floating point issues
			const result = staggerMinutes(7, 0);
			expect(result).toBe("0 0,7,14,21,28,35,42,49,56 * * * *");
		});

		it("should handle mathematical precision for staggerSeconds", () => {
			// Test that we don't get floating point issues
			const result = staggerSeconds(7, 0);
			expect(result).toBe("0,7,14,21,28,35,42,49,56 * * * * *");
		});

		it("should validate that all generated cron expressions follow correct format", () => {
			const cronPatterns = [
				staggerMinutes(15, 0),
				staggerSeconds(30, 5),
				everyNDays(1),
				everyNthHour(6, 30, 15),
			];

			cronPatterns.forEach((pattern) => {
				const parts = pattern.split(" ");
				// Should have 6 parts for cron expressions
				expect(parts.length).toBe(6);
				// Each part should be non-empty
				parts.forEach((part) => {
					expect(part.length).toBeGreaterThan(0);
				});
			});
		});

		it("should handle boundary conditions for staggerMinutes", () => {
			// Test boundary at 59 minutes
			const result = staggerMinutes(15, 59);
			expect(result).toBe("0 59 * * * *");
		});

		it("should handle boundary conditions for staggerSeconds", () => {
			// Test boundary at 59 seconds
			const result = staggerSeconds(15, 59);
			expect(result).toBe("59 * * * * *");
		});

		it("should produce consistent results for repeated calls", () => {
			// Test that functions are pure and deterministic
			const result1 = staggerMinutes(10, 5);
			const result2 = staggerMinutes(10, 5);
			expect(result1).toBe(result2);

			const result3 = everyNDays(2, 14, 30);
			const result4 = everyNDays(2, 14, 30);
			expect(result3).toBe(result4);
		});
	});
});
