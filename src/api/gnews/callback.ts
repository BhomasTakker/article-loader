import { GNewsHeadlinesParams } from ".";
import { CollectionItem } from "../../types/article/item";
import { getArticle } from "../get-article";

type GNewsArticle = {
	title: string;
	description: string;
	url: string;
	image: string;
	publishedAt: string;
	source: {
		name: string;
		url: string;
	};
	content: string;
};

export type GNewsResult = {
	totalArticles: number;
	articles: GNewsArticle[];
};

const convertNewsAPIItem = (
	data: GNewsArticle,
	params: GNewsHeadlinesParams
) => {
	const { lang, country, category } = params;
	const { title, description, url, image, publishedAt, source, content } = data;

	return {
		title,
		src: url,
		description: description,
		content,
		guid: "",
		variant: "article",
		avatar: {
			src: image,
			alt: title,
		},
		details: {
			published: publishedAt,
			publishers: [source.name],
			// is category an array?
			categories: [category],
			language: lang,
			region: country,
		},
	} as CollectionItem;
};

export const gNewsCallback =
	(params: GNewsHeadlinesParams) => (gNewsResult: GNewsResult) => {
		const { articles, totalArticles } = gNewsResult;
		const promises = articles.map((item) => {
			return getArticle(convertNewsAPIItem(item, params));
		});

		return Promise.all(promises);
	};
