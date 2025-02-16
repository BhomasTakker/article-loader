import { RSSImage, RSSItem } from "../article/item";

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
};
