import { RSSImage } from "../article/item";

export type RSSArticleCollection = {
	items: string[];
	link?: string;
	title?: string;
	feed?: string;
	description?: string;
	lastBuildDate?: string;
	image?: RSSImage;
};
