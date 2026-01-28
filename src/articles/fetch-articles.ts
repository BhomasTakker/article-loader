import { ExtraData } from "../types/types";
import { RSSItem, UnknownObject } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { getArticle } from "./get-article";
import { ArticleSource } from "../types/cms/ArticleSource";

type Items = RSSItem[];

export type FetchArticles = {
	items: Items;
	extraData?: ExtraData | UnknownObject;
	provider?: ProviderItem;
	collectionData?: UnknownObject;
	feed?: ArticleSource;
};

export const fetchArticles = async ({
	items,
	feed,
	extraData,
	provider,
}: FetchArticles) => {
	items.forEach((item) => {
		getArticle({ item, extraData, provider, feed });
	});

	return Promise.resolve();
};
