import { HydratedDocument } from "mongoose";
import { CollectionItem, RSSItem } from "../types/article/item";
import {
	getArticleBySrc,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { getMeta } from "../html/get-meta";

const convertRssItem = (data: RSSItem) => {
	const {
		title,
		// content potentially more likely to have html
		content,
		description,
		author,
		category,
		link,
		pubDate,
		enclosure,
		contentSnippet,
	} = data;
	const { url = "" } = enclosure || {};

	return {
		title: title,
		src: link,
		description: contentSnippet || content || description,
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
	} as CollectionItem;
};

// We're doing unnecessary work here
// convert to required format
export const getArticle = async (item: RSSItem) => {
	const { src, details = {} } = convertRssItem(item);

	const article = (await getArticleBySrc(
		src
	)) as HydratedDocument<CollectionItem>;
	if (article) {
		// console.log("article in db return");
		// We should check if we have any additional data
		// Then update the article

		return JSON.parse(JSON.stringify(article)) as CollectionItem;
	}

	const meta = await getMeta(src);
	if (!meta) {
		console.log("no meta loaded");
		return null;
	}
	const { title, description, image, imageAlt, type } = meta;

	if (!title || !image) {
		console.log("failed check ", { title, image });
		// We need a better or proper check here
		// based on type / we may not always expect an image
		// BlueSky post or some such
		return null;
	}

	const newArticle = {
		title,
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		details,
		avatar: {
			src: image,
			alt: imageAlt || "",
		},
	};

	try {
		await saveOrCreateArticleBySrc(newArticle);
	} catch (err) {
		console.log("getArticle Error");
	}

	return newArticle as CollectionItem;
};
