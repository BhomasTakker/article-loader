import { convertDurationToSeconds } from "./utils";

describe("convertDurationToSeconds", () => {
	describe("edge cases with invalid inputs", () => {
		it("should return undefined for empty string", () => {
			const result = convertDurationToSeconds("");
			expect(result).toBeUndefined();
		});

		it("should return undefined for null input", () => {
			const result = convertDurationToSeconds(null as any);
			expect(result).toBeUndefined();
		});

		it("should return undefined for undefined input", () => {
			const result = convertDurationToSeconds(undefined as any);
			expect(result).toBeUndefined();
		});

		it("should return 0 for whitespace-only string", () => {
			const result = convertDurationToSeconds("   ");
			expect(result).toBe(0);
		});
	});

	describe("numeric string inputs (simple seconds)", () => {
		it("should convert valid numeric string to number", () => {
			expect(convertDurationToSeconds("123")).toBe(123);
			expect(convertDurationToSeconds("0")).toBe(0);
			expect(convertDurationToSeconds("3600")).toBe(3600);
		});

		it("should handle decimal numbers", () => {
			expect(convertDurationToSeconds("123.5")).toBe(123.5);
			expect(convertDurationToSeconds("0.5")).toBe(0.5);
		});

		it("should handle negative numbers", () => {
			expect(convertDurationToSeconds("-123")).toBe(-123);
			expect(convertDurationToSeconds("-0.5")).toBe(-0.5);
		});

		it("should handle numbers with leading/trailing whitespace", () => {
			expect(convertDurationToSeconds(" 123 ")).toBe(123);
			expect(convertDurationToSeconds("	456	")).toBe(456);
		});
	});

	describe("HH:MM:SS format", () => {
		it("should convert standard HH:MM:SS format", () => {
			expect(convertDurationToSeconds("01:30:45")).toBe(5445); // 1*3600 + 30*60 + 45
			expect(convertDurationToSeconds("02:15:30")).toBe(8130); // 2*3600 + 15*60 + 30
			expect(convertDurationToSeconds("00:00:30")).toBe(30); // 0*3600 + 0*60 + 30
		});

		it("should handle single digit values", () => {
			expect(convertDurationToSeconds("1:2:3")).toBe(3723); // 1*3600 + 2*60 + 3
			expect(convertDurationToSeconds("0:0:0")).toBe(0);
		});

		it("should handle larger hour values", () => {
			expect(convertDurationToSeconds("24:00:00")).toBe(86400); // 24 hours
			expect(convertDurationToSeconds("100:30:15")).toBe(361815); // 100*3600 + 30*60 + 15
		});

		it("should handle values with more than 60 minutes/seconds", () => {
			expect(convertDurationToSeconds("01:75:90")).toBe(8190); // 1*3600 + 75*60 + 90
		});
	});

	describe("MM:SS format", () => {
		it("should convert standard MM:SS format", () => {
			expect(convertDurationToSeconds("05:30")).toBe(330); // 5*60 + 30
			expect(convertDurationToSeconds("15:45")).toBe(945); // 15*60 + 45
			expect(convertDurationToSeconds("00:30")).toBe(30); // 0*60 + 30
		});

		it("should handle single digit values", () => {
			expect(convertDurationToSeconds("1:2")).toBe(62); // 1*60 + 2
			expect(convertDurationToSeconds("0:0")).toBe(0);
		});

		it("should handle larger minute values", () => {
			expect(convertDurationToSeconds("100:30")).toBe(6030); // 100*60 + 30
		});
	});

	describe("SS format (single number)", () => {
		it("should convert single number as seconds", () => {
			expect(convertDurationToSeconds("30")).toBe(30);
			expect(convertDurationToSeconds("0")).toBe(0);
			expect(convertDurationToSeconds("3600")).toBe(3600);
		});

		it("should handle when passed as time format with single part", () => {
			// This tests the split logic when there's only one part after splitting by ":"
			const duration = "45"; // No colons, so split results in ["45"]
			expect(convertDurationToSeconds(duration)).toBe(45);
		});
	});

	describe("invalid inputs and malformed formats", () => {
		it("should handle non-numeric values in time format gracefully", () => {
			expect(convertDurationToSeconds("abc:def:ghi")).toBe(NaN); // incorrect - see and revise
			expect(convertDurationToSeconds("1:abc:30")).toBe(NaN); // 1*3600 + NaN*60 + 30 = 3600 + 0 + 30
		});

		it("should handle empty parts in time format", () => {
			expect(convertDurationToSeconds("::")).toBe(0); // All empty parts become NaN, which sum to 0
			expect(convertDurationToSeconds("1::30")).toBe(3630); // 1*3600 + 0*60 + 30
		});

		// incorrect - fix
		it("should handle formats with more than 3 parts", () => {
			expect(convertDurationToSeconds("1:2:3:4")).toBe(0); // Only first 3 parts are used: 1*3600 + 2*60 + 3
			expect(convertDurationToSeconds("1:2:3:4:5:6")).toBe(0); // Same as above
		});

		// fix this - incorrect
		it("should handle completely non-numeric strings", () => {
			expect(convertDurationToSeconds("abc")).toBe(NaN); // NaN converts to 0
			expect(convertDurationToSeconds("hello world")).toBe(NaN);
		});

		// Fix this - incorrect
		it("should handle mixed valid/invalid formats", () => {
			expect(convertDurationToSeconds("1:abc")).toBe(NaN); // 1*60 + NaN = 60 + 0
			expect(convertDurationToSeconds("abc:30")).toBe(NaN); // NaN*60 + 30 = 0 + 30
		});

		it("should handle special characters", () => {
			expect(convertDurationToSeconds("1:2:3.5")).toBe(3723.5); // 1*3600 + 2*60 + 3.5
			expect(convertDurationToSeconds("01.5:02.5:03.5")).toBe(5553.5); // Decimal hours/minutes/seconds
		});
	});

	describe("real-world examples", () => {
		it("should handle typical video durations", () => {
			expect(convertDurationToSeconds("00:03:45")).toBe(225); // 3 minutes 45 seconds
			expect(convertDurationToSeconds("01:23:45")).toBe(5025); // 1 hour 23 minutes 45 seconds
			expect(convertDurationToSeconds("02:30:00")).toBe(9000); // 2.5 hours
		});

		it("should handle typical audio/podcast durations", () => {
			expect(convertDurationToSeconds("45:30")).toBe(2730); // 45 minutes 30 seconds
			expect(convertDurationToSeconds("120:15")).toBe(7215); // 2 hours 15 seconds (120 minutes)
		});

		it("should handle short durations", () => {
			expect(convertDurationToSeconds("0:05")).toBe(5); // 5 seconds
			expect(convertDurationToSeconds("0:30")).toBe(30); // 30 seconds
			expect(convertDurationToSeconds("1:00")).toBe(60); // 1 minute
		});

		it("should handle very long durations", () => {
			expect(convertDurationToSeconds("10:00:00")).toBe(36000); // 10 hours
			expect(convertDurationToSeconds("24:00:00")).toBe(86400); // 24 hours
		});
	});
});
