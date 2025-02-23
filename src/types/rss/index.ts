import { RSSImage, RSSItem } from "../article/item";
import { ProviderItem } from "../article/provider";

export type RSSArticleCollection = {
	items: string[] | RSSItem[];
	link?: string;
	title?: string;
	feed?: string;
	description?: string;
	lastBuildDate?: string;
	image?: RSSImage;
	provider?: ProviderItem;
};
