import * as cheerio from "cheerio";

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
		title: metaTags["og:title"],
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

		// Do this properly
		// set media type if possible - video/youtube
		const validTypes = ["article", "video", "audio"];
		if (!meta.type || !validTypes.includes(meta.type)) {
			meta.type = "article";
			if (src.includes("youtube")) {
				meta.type = "video";
			}
		}

		return meta;
	} catch (error) {
		return null;
	}
};
