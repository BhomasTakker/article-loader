import * as cheerio from "cheerio";
import { setType } from "../articles/utils";

// Probably get meta data and split/get card data from it
export type MetaData = {
	description?: string | null;
	image?: string | null;
	imageAlt?: string | null;
	locale?: string | null;
	site_name?: string | null;
	title?: string | null;
	type?: string | null;
	url?: string | null;
};

export const getOGMetaFromCheerio = (str: string) => {
	const $ = cheerio.load(str);
	const metaTags: any = {};

	$("meta").each((i, element) => {
		const name = $(element).attr("name") || $(element).attr("property");
		if (name) {
			metaTags[name] = $(element).attr("content");
		}
	});

	return {
		description: metaTags["description"],
		image: metaTags["og:image"],
		imageAlt: metaTags["og:image:alt"],
		locale: metaTags["og:locale"],
		site_name: metaTags["og:site_name"],
		title:
			metaTags["og:title"] ||
			metaTags["twitter:title"] ||
			metaTags["title"] ||
			undefined,
		type: metaTags["og:type"],
		url: metaTags["og:url"],
	} as MetaData;
};

export const getMeta = async (src: string) => {
	if (!src) {
		console.log("null source");
		return null;
	}
	try {
		const response = await fetch(src);
		const result = await response.text();

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const meta = getOGMetaFromCheerio(result);

		setType(meta, src);

		return meta;
	} catch (error) {
		return null;
	}
};
