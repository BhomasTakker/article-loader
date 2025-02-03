import { RSSItem } from "../types/article/item";
import { getArticle } from "./get-article";

type Items = RSSItem[];

export const fetchArticles = async (items: Items) => {
	// console.log(items);
	const data = items.map((item, i) => {
		return getArticle(item);
	});

	return Promise.all(data);
};
