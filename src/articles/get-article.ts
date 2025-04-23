import { CollectionItem, RSSItem } from "../types/article/item";
import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { getMeta } from "../html/get-meta";
import { ExtraData } from "../../sources/news/articles/types";
import { ProviderItem } from "../types/article/provider";

// Do not do this with YouTube!!
const stripQueryStringFromUrl = (url: URL) => {
	const { pathname, origin } = url;
	const newUrl = new URL(origin + pathname);
	// Remove query string from the URL
	newUrl.search = "";
	// Remove any hash fragments from the URL
	newUrl.hash = "";
	return newUrl.toString();
};

const convertRssItem = (data: RSSItem) => {
	const {
		title,
		// content potentially more likely to have html

		description,
		author,
		category,
		link,
		pubDate,
		enclosure,
		// What is?
		content,
		contentSnippet,
	} = data;
	const { url = "" } = enclosure || {};
	const contentEncoded = data["content:encoded"];

	const parsedUrl = new URL(link);
	const strippedUrl = stripQueryStringFromUrl(parsedUrl);

	return {
		title: title,
		src: strippedUrl,
		// feels wrong to use contentSnippet and content
		description: description || contentEncoded, //contentSnippet || content || description,
		contentEncoded,
		guid: "",
		variant: "article",
		details: {
			published: pubDate,
			categories: category ? [category] : [],
			publishers: author ? [author] : [],
		},
		avatar: {
			src: url,
			alt: title,
		},
		collectionType: "",
	} as CollectionItem;
};

export type GetArticle = {
	item: RSSItem;
	extraData?: ExtraData;
	provider?: ProviderItem;
};
// We're doing unnecessary work here
// convert to required format
// get article data from meta
export const getArticle = async ({ item, extraData, provider }: GetArticle) => {
	// We're not doing anything with converted item - we're just getting the src and details
	const { src, details = {} } = convertRssItem(item);
	const { region, language, categories = [], collectionType } = extraData || {};

	// Do elsewhere and prbably check performance.....
	const mergedCategories = new Set([
		...(details.categories || []),
		...categories,
	]);
	const mergedDetails = {
		...details,
		region,
		language,
		categories: Array.from(mergedCategories),
	};

	const exists = await getArticleExists(src);
	if (exists) {
		return null;
	}

	const { title, description, image, imageAlt, type } =
		(await getMeta(src)) || {};

	if (!title || !image) {
		// We need a better or proper check here
		// based on type / we may not always expect an image
		// BlueSky post or some such
		// console.log(`Check Failed - Do not save ${src}`);
		return null;
	}

	const newArticle = {
		title,
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		details: mergedDetails,
		avatar: {
			src: image,
			alt: imageAlt || "",
		},
		...extraData,
		collectionType,
		provider,
	};

	try {
		saveOrCreateArticleBySrc(newArticle);
		// logMemoryUsage();
	} catch (err) {
		// console.log(`Article Load Error ${src}`);
	}

	return null;
};
