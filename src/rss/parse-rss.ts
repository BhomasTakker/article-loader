import Parser from "rss-parser";
import { UnknownObject } from "../types/article/item";
import { log } from "console";
import { logError } from "../error/logging/logger";

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
		logError(`RSS parsing failed for "${endpoint}"`, error);
		return null;
	}
};
