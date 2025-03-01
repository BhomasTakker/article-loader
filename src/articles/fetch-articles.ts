import { ExtraData } from "../../sources/news/articles/types";
import { RSSItem } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { getArticle } from "./get-article";

type Items = RSSItem[];

export type FetchArticles = {
	items: Items;
	extraData?: ExtraData;
	provider?: ProviderItem;
};

export const fetchArticles = async ({
	items,
	extraData,
	provider,
}: FetchArticles) => {
	// const data = items.map((item, i) => {
	// 	return getArticle({ item, extraData, provider });
	// });

	items.forEach((item) => {
		getArticle({ item, extraData, provider });
	});

	return Promise.resolve();
};
