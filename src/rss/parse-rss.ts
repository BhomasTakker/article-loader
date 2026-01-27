import Parser from "rss-parser";
import { UnknownObject } from "../types/article/item";

export const RSSParse = async (
	endpoint: string,
	customFields?: UnknownObject,
) => {
	const parser = new Parser({
		// Todo:- Config
		customFields,
		timeout: 10000,
	});
	// if error do something!
	try {
		return await parser.parseURL(endpoint.toString());
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorType = error instanceof Error ? error.name : "Unknown";
		console.error(
			`RSS parsing failed [${errorType}] for "${endpoint}": ${errorMessage}`,
		);
		return null;
	}
};
