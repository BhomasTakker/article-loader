import { RSSImage, RSSItem } from "../article/item";

export type RSSArticleCollection = {
	items: string[] | RSSItem[];
	link?: string;
	title?: string;
	feed?: string;
	description?: string;
	lastBuildDate?: string;
	image?: RSSImage;
};
