import { ExtraData } from "../../sources/news/articles/types";
import { RSSItem, UnknownObject } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { getArticle } from "./get-article";

type Items = RSSItem[];

export type FetchArticles = {
	items: Items;
	extraData?: ExtraData;
	provider?: ProviderItem;
	collectionData?: UnknownObject;
};

export const fetchArticles = async ({
	items,
	extraData,
	provider,
}: FetchArticles) => {
	items.forEach((item) => {
		getArticle({ item, extraData, provider });
	});

	return Promise.resolve();
};
