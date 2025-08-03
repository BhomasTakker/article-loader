import { getMeta } from "../html/get-meta";
import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

// we should try to use this for rss load
export const getArticle = async (article: CollectionItem) => {
	const { src } = article;

	const exists = await getArticleExists(src);
	if (exists) {
		return null;
	}

	const { title, description, image, imageAlt, type } =
		(await getMeta(src)) || {};

	if (!title || !image) {
		return null;
	}

	const newArticle = {
		...article,
		title,
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		avatar: {
			src: image,
			alt: imageAlt || "",
		},
	} as CollectionItem;

	try {
		saveOrCreateArticleBySrc(newArticle).then((res) => {
			// console.log("Article Saved", src);
		});
	} catch (err) {
		console.log(`Article Load Error ${src}`);
	}

	return newArticle;
};
