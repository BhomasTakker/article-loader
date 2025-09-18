import { addParams } from "./utils";
import { UnknownObject } from "../types/article/item";

describe("utils", () => {
	describe("addParams", () => {
		describe("basic functionality", () => {
			it("should add single parameter to URL", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = { key: "value" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/?key=value");
			});

			it("should add multiple parameters to URL", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					key1: "value1",
					key2: "value2",
					key3: "value3",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?key1=value1&key2=value2&key3=value3"
				);
			});

			it("should preserve existing query parameters", () => {
				// Arrange
				const url = "https://example.com?existing=param";
				const params: UnknownObject = { new: "parameter" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?existing=param&new=parameter"
				);
			});

			it("should handle URLs with paths", () => {
				// Arrange
				const url = "https://example.com/api/v1/endpoint";
				const params: UnknownObject = { id: "123", type: "user" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/api/v1/endpoint?id=123&type=user"
				);
			});

			it("should handle URLs with fragments", () => {
				// Arrange
				const url = "https://example.com#section";
				const params: UnknownObject = { filter: "active" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/?filter=active#section");
			});
		});

		describe("parameter types", () => {
			it("should handle string parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = { name: "John Doe", city: "New York" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/?name=John+Doe&city=New+York");
			});

			it("should handle number parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					count: 42,
					price: 19.99,
					negative: -5,
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?count=42&price=19.99&negative=-5"
				);
			});

			it("should handle boolean parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					active: true,
					visible: false,
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/?active=true&visible=false");
			});

			it("should handle null and undefined parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					nullValue: null,
					undefinedValue: undefined,
					normalValue: "test",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?nullValue=null&undefinedValue=undefined&normalValue=test"
				);
			});

			it("should handle array parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					tags: ["javascript", "typescript", "testing"],
					numbers: [1, 2, 3],
				};

				// Act
				const result = addParams(url, params);

				// Assert
				// Arrays are converted to strings when appended to URL
				expect(result).toBe(
					"https://example.com/?tags=javascript%2Ctypescript%2Ctesting&numbers=1%2C2%2C3"
				);
			});

			it("should handle object parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					config: { theme: "dark", lang: "en" },
					metadata: { version: "1.0" },
				};

				// Act
				const result = addParams(url, params);

				// Assert
				// Objects are converted to [object Object] when stringified
				expect(result).toBe(
					"https://example.com/?config=%5Bobject+Object%5D&metadata=%5Bobject+Object%5D"
				);
			});
		});

		describe("special characters and encoding", () => {
			it("should properly encode special characters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					query: "hello world",
					special: "test@#$%^&*()",
					unicode: "café",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?query=hello+world&special=test%40%23%24%25%5E%26*%28%29&unicode=caf%C3%A9"
				);
			});

			it("should handle empty string parameters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					empty: "",
					normal: "value",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/?empty=&normal=value");
			});

			it("should handle parameters with equals and ampersand characters", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					equation: "x=y&z=w",
					formula: "a=b+c",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"https://example.com/?equation=x%3Dy%26z%3Dw&formula=a%3Db%2Bc"
				);
			});
		});

		describe("edge cases", () => {
			it("should handle empty parameters object", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {};

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com/");
			});

			it("should handle URLs with different protocols", () => {
				// Arrange
				const httpUrl = "http://example.com";
				const httpsUrl = "https://example.com";
				const params: UnknownObject = { test: "value" };

				// Act
				const httpResult = addParams(httpUrl, params);
				const httpsResult = addParams(httpsUrl, params);

				// Assert
				expect(httpResult).toBe("http://example.com/?test=value");
				expect(httpsResult).toBe("https://example.com/?test=value");
			});

			it("should handle localhost URLs", () => {
				// Arrange
				const url = "http://localhost:3000/api";
				const params: UnknownObject = { debug: "true", env: "development" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe(
					"http://localhost:3000/api?debug=true&env=development"
				);
			});

			it("should handle URLs with ports", () => {
				// Arrange
				const url = "https://example.com:8080/path";
				const params: UnknownObject = { key: "value" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://example.com:8080/path?key=value");
			});

			it("should handle international domain names", () => {
				// Arrange
				const url = "https://例え.テスト";
				const params: UnknownObject = { param: "value" };

				// Act
				const result = addParams(url, params);

				// Assert
				expect(result).toBe("https://xn--r8jz45g.xn--zckzah/?param=value");
			});
		});

		describe("error handling", () => {
			it("should throw error for invalid URLs", () => {
				// Arrange
				const invalidUrl = "not-a-valid-url";
				const params: UnknownObject = { key: "value" };

				// Act & Assert
				expect(() => addParams(invalidUrl, params)).toThrow();
			});

			it("should handle URLs without protocol", () => {
				// Arrange
				const url = "example.com";
				const params: UnknownObject = { key: "value" };

				// Act & Assert
				expect(() => addParams(url, params)).toThrow();
			});
		});

		describe("parameter ordering", () => {
			it("should maintain parameter order based on Object.keys iteration", () => {
				// Arrange
				const url = "https://example.com";
				const params: UnknownObject = {
					c: "third",
					a: "first",
					b: "second",
				};

				// Act
				const result = addParams(url, params);

				// Assert
				// Object.keys maintains insertion order in modern JavaScript
				expect(result).toBe("https://example.com/?c=third&a=first&b=second");
			});
		});

		describe("duplicate parameters", () => {
			it("should handle adding parameters when URL already has same parameter name", () => {
				// Arrange
				const url = "https://example.com?key=existing";
				const params: UnknownObject = { key: "new" };

				// Act
				const result = addParams(url, params);

				// Assert
				// URLSearchParams.append adds another parameter with the same name
				expect(result).toBe("https://example.com/?key=existing&key=new");
			});
		});
	});
});
