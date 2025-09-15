import { getOGMetaFromCheerio, getMeta, MetaData } from "./get-meta";

// Mock console.log to capture output
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("HTML Meta Extraction", () => {
	beforeEach(() => {
		consoleLogSpy.mockClear();
		mockFetch.mockClear();
	});

	afterAll(() => {
		consoleLogSpy.mockRestore();
	});

	describe("getOGMetaFromCheerio", () => {
		it("should extract basic Open Graph meta tags", () => {
			const html = `
				<html>
					<head>
						<meta property="og:title" content="Test Article" />
						<meta property="og:description" content="A test article description" />
						<meta property="og:image" content="https://example.com/image.jpg" />
						<meta property="og:url" content="https://example.com/article" />
						<meta property="og:type" content="article" />
						<meta property="og:site_name" content="Test Site" />
						<meta property="og:locale" content="en_US" />
						<meta property="og:image:alt" content="Test image alt text" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result).toEqual({
				title: "Test Article",
				description: undefined, // Not an og: tag
				image: "https://example.com/image.jpg",
				url: "https://example.com/article",
				type: "article",
				site_name: "Test Site",
				locale: "en_US",
				imageAlt: "Test image alt text",
			});
		});

		it("should extract description from name attribute", () => {
			const html = `
				<html>
					<head>
						<meta name="description" content="Meta description content" />
						<meta property="og:title" content="Test Title" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result).toEqual({
				title: "Test Title",
				description: "Meta description content",
				image: undefined,
				url: undefined,
				type: undefined,
				site_name: undefined,
				locale: undefined,
				imageAlt: undefined,
			});
		});

		it("should handle missing meta tags gracefully", () => {
			const html = `
				<html>
					<head>
						<title>Just a title</title>
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result).toEqual({
				title: undefined,
				description: undefined,
				image: undefined,
				url: undefined,
				type: undefined,
				site_name: undefined,
				locale: undefined,
				imageAlt: undefined,
			});
		});

		it("should handle empty HTML", () => {
			const html = "";

			const result = getOGMetaFromCheerio(html);

			expect(result).toEqual({
				title: undefined,
				description: undefined,
				image: undefined,
				url: undefined,
				type: undefined,
				site_name: undefined,
				locale: undefined,
				imageAlt: undefined,
			});
		});

		it("should handle malformed HTML", () => {
			const html = `
				<html>
					<head>
						<meta property="og:title" content="Test Title" />
						<meta property="og:description" content="Test Description">
						<meta property="og:image" content="https://example.com/image.jpg"
					</head>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result.title).toBe("Test Title");
			expect(result.image).toBe("https://example.com/image.jpg");
		});

		it("should handle meta tags with both name and property attributes", () => {
			const html = `
				<html>
					<head>
						<meta name="description" content="Name description" />
						<meta property="description" content="Property description" />
						<meta property="og:title" content="OG Title" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			// Should pick up both, but property takes precedence when both are present
			expect(result.description).toBe("Property description");
			expect(result.title).toBe("OG Title");
		});

		it("should handle meta tags with special characters in content", () => {
			const html = `
				<html>
					<head>
						<meta property="og:title" content="Title with &quot;quotes&quot; and &amp; symbols" />
						<meta property="og:description" content="Description with émojis 🚀 and special chars: <>&" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result.title).toBe('Title with "quotes" and & symbols');
			expect(result.description).toBeUndefined(); // Not og:description
		});

		it("should handle meta tags without content attribute", () => {
			const html = `
				<html>
					<head>
						<meta property="og:title" />
						<meta property="og:description" content="" />
						<meta property="og:image" content="https://example.com/image.jpg" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			expect(result.title).toBeUndefined();
			expect(result.description).toBeUndefined();
			expect(result.image).toBe("https://example.com/image.jpg");
		});

		it("should handle meta tags without name or property attributes", () => {
			const html = `
				<html>
					<head>
						<meta content="Some content" />
						<meta charset="utf-8" />
						<meta property="og:title" content="Valid Title" />
					</head>
					<body></body>
				</html>
			`;

			const result = getOGMetaFromCheerio(html);

			// Should ignore meta tags without name or property attributes
			expect(result.title).toBe("Valid Title");
			expect(result.description).toBeUndefined();
		});
	});

	describe("getMeta", () => {
		it("should return null for empty source", async () => {
			const result = await getMeta("");

			expect(result).toBeNull();
			expect(consoleLogSpy).toHaveBeenCalledWith("null source");
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should return null for null source", async () => {
			const result = await getMeta(null as any);

			expect(result).toBeNull();
			expect(consoleLogSpy).toHaveBeenCalledWith("null source");
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it("should fetch and extract meta data successfully", async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="Test Article" />
						<meta name="description" content="Test description" />
						<meta property="og:image" content="https://example.com/image.jpg" />
						<meta property="og:url" content="https://example.com/article" />
						<meta property="og:site_name" content="Test Site" />
					</head>
					<body></body>
				</html>
			`;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(mockHtml),
			});

			const result = await getMeta("https://example.com/test");

			expect(mockFetch).toHaveBeenCalledWith("https://example.com/test");
			expect(result).toEqual({
				title: "Test Article",
				description: "Test description",
				image: "https://example.com/image.jpg",
				url: "https://example.com/article",
				type: "article", // Default fallback
				site_name: "Test Site",
				locale: undefined,
				imageAlt: undefined,
			});
		});

		it("should set type to 'video' for YouTube URLs", async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="YouTube Video" />
						<meta name="description" content="Video description" />
					</head>
					<body></body>
				</html>
			`;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(mockHtml),
			});

			const result = await getMeta("https://youtube.com/watch?v=123");

			expect(result?.type).toBe("video");
			expect(result?.title).toBe("YouTube Video");
		});

		it("should preserve existing type if present", async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="Test Content" />
						<meta property="og:type" content="website" />
					</head>
					<body></body>
				</html>
			`;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(mockHtml),
			});

			const result = await getMeta("https://example.com/test");

			expect(result?.type).toBe("website");
		});

		it("should return null on HTTP error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 404,
				text: jest.fn().mockResolvedValue(""),
			});

			const result = await getMeta("https://example.com/notfound");

			expect(mockFetch).toHaveBeenCalledWith("https://example.com/notfound");
			expect(result).toBeNull();
		});

		it("should return null on network error", async () => {
			mockFetch.mockRejectedValue(new Error("Network error"));

			const result = await getMeta("https://example.com/error");

			expect(mockFetch).toHaveBeenCalledWith("https://example.com/error");
			expect(result).toBeNull();
		});

		it("should handle text() method rejection", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockRejectedValue(new Error("Text parsing error")),
			});

			const result = await getMeta("https://example.com/text-error");

			expect(result).toBeNull();
		});

		it("should handle different YouTube URL formats", async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="YouTube Video" />
					</head>
					<body></body>
				</html>
			`;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(mockHtml),
			});

			const youtubeUrls = [
				"https://www.youtube.com/watch?v=123",
				"https://youtube.com/watch?v=123",
				"https://m.youtube.com/watch?v=123",
				"https://youtu.be/123",
			];

			for (const url of youtubeUrls) {
				mockFetch.mockClear();
				mockFetch.mockResolvedValue({
					ok: true,
					status: 200,
					text: jest.fn().mockResolvedValue(mockHtml),
				});

				const result = await getMeta(url);
				expect(result?.type).toBe(
					url.includes("youtube") ? "video" : "article"
				);
			}
		});

		it("should handle empty response body", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(""),
			});

			const result = await getMeta("https://example.com/empty");

			expect(result).toEqual({
				title: undefined,
				description: undefined,
				image: undefined,
				url: undefined,
				type: "article",
				site_name: undefined,
				locale: undefined,
				imageAlt: undefined,
			});
		});

		it("should handle response with only regular HTML (no meta tags)", async () => {
			const mockHtml = `
				<html>
					<head>
						<title>Regular Title</title>
					</head>
					<body>
						<h1>Content</h1>
					</body>
				</html>
			`;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				text: jest.fn().mockResolvedValue(mockHtml),
			});

			const result = await getMeta("https://example.com/no-meta");

			expect(result).toEqual({
				title: undefined,
				description: undefined,
				image: undefined,
				url: undefined,
				type: "article",
				site_name: undefined,
				locale: undefined,
				imageAlt: undefined,
			});
		});
	});

	describe("MetaData type", () => {
		it("should allow all properties to be optional", () => {
			const metadata: MetaData = {};
			expect(metadata).toBeDefined();
		});

		it("should allow null values", () => {
			const metadata: MetaData = {
				title: null,
				description: null,
				image: null,
				url: null,
				type: null,
				site_name: null,
				locale: null,
				imageAlt: null,
			};
			expect(metadata).toBeDefined();
		});

		it("should allow string values", () => {
			const metadata: MetaData = {
				title: "Test Title",
				description: "Test Description",
				image: "https://example.com/image.jpg",
				url: "https://example.com/url",
				type: "article",
				site_name: "Test Site",
				locale: "en_US",
				imageAlt: "Alt text",
			};
			expect(metadata).toBeDefined();
		});
	});
});
