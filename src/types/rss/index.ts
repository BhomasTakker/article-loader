import { RSSImage, RSSItem } from "../article/item";
import { ProviderItem } from "../article/provider";

type StrippedItem = {
	link: string;
};

export type RSSArticleCollection = {
	items: StrippedItem[] | RSSItem[];
	link?: string;
	title?: string;
	feed?: string;
	description?: string;
	lastBuildDate?: string;
	image?: RSSImage;
	provider?: ProviderItem;
	collectionType?: string;
};
