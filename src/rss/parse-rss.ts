import Parser from "rss-parser";
import { UnknownObject } from "../types/article/item";

export const RSSParse = async (
	endpoint: string,
	customFields?: UnknownObject
) => {
	const parser = new Parser({
		// Todo:- Config
		customFields,
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
