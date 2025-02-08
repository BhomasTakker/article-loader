import Parser from "rss-parser";

export const RSSParse = async (endpoint: string) => {
	const parser = new Parser({
		// Todo:- Config
		timeout: 2000,
	});
	// if error do something!
	try {
		return await parser.parseURL(endpoint.toString());
	} catch (error) {
		console.error("Error fetching rss");
		return null;
	}
};
