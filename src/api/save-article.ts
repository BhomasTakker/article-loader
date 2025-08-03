import {
	getArticleExists,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

export const saveArticle = async (
	article: CollectionItem,
	overwrite: boolean = false
) => {
	const { src } = article;

	if (!src) {
		return null;
	}

	// what about overwrite?
	const exists = await getArticleExists(src);
	if (exists && !overwrite) {
		return article;
	}

	try {
		saveOrCreateArticleBySrc(article).then((res) => {
			// console.log("Article Saved", src);
		});
	} catch (err) {
		console.log(`Article Load Error ${src}`);
	}

	return article;
};
