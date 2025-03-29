import { saveOrCreateArticleBySrc } from "../lib/mongo/actions/article";
import { CollectionItem } from "../types/article/item";

export const saveArticle = async (item: CollectionItem) => {
	const { src } = item;
	const { message } = await saveOrCreateArticleBySrc(item);
	if (message === "Saved Article!") {
		return item;
	} else {
		console.log(`Failed to save ${src}`);
		return null;
	}
};
