import { HydratedDocument } from "mongoose";
import { CollectionItem, RSSItem } from "../types/article/item";
import {
	getArticleBySrc,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { getMeta } from "../html/get-meta";
import { ExtraData } from "../../sources/news/articles/types";
import { ProviderItem } from "../types/article/provider";

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

	return {
		title: title,
		src: link,
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
	const { region, language, categories = [] } = extraData || {};

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

	const article = (await getArticleBySrc(
		src
	)) as HydratedDocument<CollectionItem>;
	if (article) {
		// check if need update
		// console.log("article in db return");
		// We should check if we have any additional data
		// Then update the article
		// console.log(`Already stored ${src}`);
		return JSON.parse(JSON.stringify(article)) as CollectionItem;
	}

	const meta = await getMeta(src);
	if (!meta) {
		console.log(`No meta loaded for ${src}`);
		return null;
	}
	const { title, description, image, imageAlt, type } = meta;

	if (!title || !image) {
		// We need a better or proper check here
		// based on type / we may not always expect an image
		// BlueSky post or some such
		console.log(`Check Failed - Do not save ${src}`);
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
		provider,
	};

	try {
		await saveOrCreateArticleBySrc(newArticle);
	} catch (err) {
		console.log(`Article Load Error ${src}`);
	}

	return newArticle as CollectionItem;
};
