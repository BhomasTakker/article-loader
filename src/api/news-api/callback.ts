import { NewsAPISearchParams } from ".";
import { CollectionItem } from "../../types/article/item";
import { getArticle } from "../get-article";

type NewsAPIArticle = {
	title: string;
	author: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: string;
	content: string;
	source: {
		name: string;
		id: string;
	};
};

export type NewsAPIResult = {
	status: string;
	totalResults: number;
	articles: NewsAPIArticle[];
};

const convertNewsAPIItem = (
	data: NewsAPIArticle,
	params: NewsAPISearchParams
) => {
	const { language } = params;
	const {
		title,
		author,
		description,
		url,
		urlToImage,
		publishedAt,
		content,
		source,
	} = data;
	// creae new with the daa
	return {
		title,
		src: url,
		description,
		content,
		guid: "",
		variant: "article",
		collectionType: "news",
		avatar: {
			src: urlToImage,
			alt: title,
		},
		details: {
			published: publishedAt,
			publishers: author ? [author] : [],
			categories: source ? [source.name] : [],
			language,
		},
	} as CollectionItem;
};

export const newsAPICallback =
	(params: NewsAPISearchParams) => (newsAPIResult: NewsAPIResult) => {
		const { articles, status, totalResults } = newsAPIResult;

		const returnItems = articles.map((item) => {
			return getArticle(convertNewsAPIItem(item, params));
		});

		return Promise.all(returnItems);
	};
