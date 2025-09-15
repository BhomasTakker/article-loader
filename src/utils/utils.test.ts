import { mergeStringOrArray, filterLimit, deepMerge } from "./index";

describe("Utils", () => {
	describe("mergeStringOrArray", () => {
		it("should merge two strings into an array", () => {
			const result = mergeStringOrArray("value1", "value2");
			expect(result).toEqual(["value1", "value2"]);
		});

		it("should merge a string and an array", () => {
			const result = mergeStringOrArray("value1", ["value2", "value3"]);
			expect(result).toEqual(["value1", "value2", "value3"]);
		});

		it("should merge two arrays", () => {
			const result = mergeStringOrArray(
				["value1", "value2"],
				["value3", "value4"]
			);
			expect(result).toEqual(["value1", "value2", "value3", "value4"]);
		});

		it("should remove duplicates when merging", () => {
			const result = mergeStringOrArray(
				["value1", "value2"],
				["value2", "value3"]
			);
			expect(result).toEqual(["value1", "value2", "value3"]);
		});

		it("should handle empty inputs and use default empty arrays", () => {
			const result = mergeStringOrArray();
			expect(result).toEqual([]);
		});

		it("should handle one empty input", () => {
			const result1 = mergeStringOrArray("value1");
			expect(result1).toEqual(["value1"]);

			const result2 = mergeStringOrArray(undefined, "value2");
			expect(result2).toEqual(["value2"]);
		});

		it("should handle empty strings", () => {
			const result = mergeStringOrArray("", "value2");
			expect(result).toEqual(["", "value2"]);
		});

		it("should handle empty arrays", () => {
			const result = mergeStringOrArray([], ["value1"]);
			expect(result).toEqual(["value1"]);
		});

		it("should preserve order and remove duplicates correctly", () => {
			const result = mergeStringOrArray(["a", "b", "c"], ["b", "d", "a"]);
			expect(result).toEqual(["a", "b", "c", "d"]);
		});
	});

	describe("filterLimit", () => {
		it("should return the same array if it has fewer than 50 items", () => {
			const items = Array.from({ length: 30 }, (_, i) => i);
			const result = filterLimit(items);
			expect(result).toEqual(items);
			expect(result.length).toBe(30);
		});

		it("should return the same array if it has exactly 50 items", () => {
			const items = Array.from({ length: 50 }, (_, i) => i);
			const result = filterLimit(items);
			expect(result).toEqual(items);
			expect(result.length).toBe(50);
		});

		it("should limit array to first 50 items if it has more than 50 items", () => {
			const items = Array.from({ length: 100 }, (_, i) => i);
			const result = filterLimit(items);
			expect(result.length).toBe(50);
			expect(result).toEqual(Array.from({ length: 50 }, (_, i) => i));
		});

		it("should handle empty array", () => {
			const result = filterLimit([]);
			expect(result).toEqual([]);
		});

		it("should work with different data types", () => {
			const stringItems = Array.from({ length: 60 }, (_, i) => `item${i}`);
			const result = filterLimit(stringItems);
			expect(result.length).toBe(50);
			expect(result[0]).toBe("item0");
			expect(result[49]).toBe("item49");
		});

		it("should work with objects", () => {
			const objectItems = Array.from({ length: 75 }, (_, i) => ({
				id: i,
				name: `name${i}`,
			}));
			const result = filterLimit(objectItems);
			expect(result.length).toBe(50);
			expect(result[0]).toEqual({ id: 0, name: "name0" });
			expect(result[49]).toEqual({ id: 49, name: "name49" });
		});
	});

	describe("deepMerge", () => {
		it("should merge simple objects", () => {
			const target = { a: 1, b: 2 };
			const source = { b: 3, c: 4 };
			const result = deepMerge(target, source);
			expect(result).toEqual({ a: 1, b: 3, c: 4 });
		});

		it("should merge nested objects", () => {
			const target = { a: 1, nested: { x: 1, y: 2 } };
			const source = { nested: { y: 3, z: 4 }, b: 2 };
			const result = deepMerge(target, source);
			expect(result).toEqual({
				a: 1,
				b: 2,
				nested: { x: 1, y: 3, z: 4 },
			});
		});

		it("should handle arrays by replacing them entirely", () => {
			const target = { arr: [1, 2, 3] };
			const source = { arr: [4, 5] };
			const result = deepMerge(target, source);
			expect(result).toEqual({ arr: [4, 5] });
		});

		it("should handle null and undefined values in source", () => {
			const target = { a: 1, b: 2, c: 3 };
			const source = { a: null, b: undefined, d: 4 };
			const result = deepMerge(target, source);
			expect(result).toEqual({ a: null, b: undefined, c: 3, d: 4 });
		});

		it("should handle null target", () => {
			const source = { a: 1, b: 2 };
			const result = deepMerge(null as any, source);
			expect(result).toEqual(source);
		});

		it("should handle undefined target", () => {
			const source = { a: 1, b: 2 };
			const result = deepMerge(undefined as any, source);
			expect(result).toEqual(source);
		});

		it("should handle null source", () => {
			const target = { a: 1, b: 2 };
			const result = deepMerge(target, null as any);
			expect(result).toEqual(target);
		});

		it("should handle undefined source", () => {
			const target = { a: 1, b: 2 };
			const result = deepMerge(target, undefined as any);
			expect(result).toEqual(target);
		});

		it("should handle deeply nested objects", () => {
			const target = {
				level1: {
					level2: {
						level3: {
							a: 1,
							b: 2,
						},
					},
				},
			};
			const source = {
				level1: {
					level2: {
						level3: {
							b: 3,
							c: 4,
						},
					},
				},
			};
			const result = deepMerge(target, source);
			expect(result).toEqual({
				level1: {
					level2: {
						level3: {
							a: 1,
							b: 3,
							c: 4,
						},
					},
				},
			});
		});

		it("should handle mixed data types", () => {
			const target = {
				string: "hello",
				number: 42,
				boolean: true,
				array: [1, 2, 3],
				object: { nested: "value" },
			};
			const source = {
				string: "world",
				number: 100,
				boolean: false,
				array: ["a", "b"],
				object: { nested: "updated", new: "property" },
			};
			const result = deepMerge(target, source);
			expect(result).toEqual({
				string: "world",
				number: 100,
				boolean: false,
				array: ["a", "b"],
				object: { nested: "updated", new: "property" },
			});
		});

		it("should not mutate original objects", () => {
			const target = { a: 1, nested: { x: 1 } };
			const source = { nested: { y: 2 } };
			const result = deepMerge(target, source);

			// Original objects should not be modified
			expect(target).toEqual({ a: 1, nested: { x: 1 } });
			expect(source).toEqual({ nested: { y: 2 } });
			// Result should be the merged version
			expect(result).toEqual({ a: 1, nested: { x: 1, y: 2 } });
		});

		it("should handle arrays within nested objects", () => {
			const target = {
				config: {
					items: [1, 2, 3],
					settings: { theme: "dark" },
				},
			};
			const source = {
				config: {
					items: [4, 5],
					settings: { theme: "light", lang: "en" },
				},
			};
			const result = deepMerge(target, source);
			expect(result).toEqual({
				config: {
					items: [4, 5],
					settings: { theme: "light", lang: "en" },
				},
			});
		});

		it("should handle empty objects", () => {
			const target = {};
			const source = { a: 1 };
			const result = deepMerge(target, source);
			expect(result).toEqual({ a: 1 });

			const result2 = deepMerge({ a: 1 }, {});
			expect(result2).toEqual({ a: 1 });
		});
	});
});
