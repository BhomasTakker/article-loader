import { NewsDataSearchParams } from ".";
import { CollectionItem } from "../../types/article/item";
import { getArticle } from "../get-article";

type NewsDataHubArticle = {
	id: string;
	title: string;
	source_title: string;
	source_link: string;
	article_link: string;
	keywords: string[];
	topics: string[];
	description: string;
	pub_date: string;
	creator: string | null;
	content: string;
	media_url: string;
	media_description: string | null;
	media_credit: string | null;
	media_thumbnail: string | null;
	media_type: string;
	language: string;
	sentiment: object;
};

export type NewsDataHubResult = {
	total_results: number;
	next_cursor: string;
	per_page: number;
	data: NewsDataHubArticle[];
};

const convertNewsAPIItem = (
	data: NewsDataHubArticle,
	params: NewsDataSearchParams
) => {
	const { topic } = params;
	const {
		title,
		source_title,
		source_link,
		article_link,
		description,
		pub_date,
		creator,
		content,
		media_url,
		language,
		keywords,
		topics,
		media_type,
	} = data;

	const cats = keywords.concat(topics);

	return {
		title,
		src: article_link,
		description,
		content,
		guid: "",
		// media_type
		variant: "article",
		collectionType: "news",
		avatar: {
			src: media_url,
			alt: title,
		},
		details: {
			published: pub_date,
			publishers: creator ? [creator] : [],
			categories: cats ? cats : [],
			language,
		},
	} as CollectionItem;
};

export const newsDataHubCallback =
	(params: NewsDataSearchParams) => (newsDataHubResult: NewsDataHubResult) => {
		const { data, per_page, next_cursor, total_results } = newsDataHubResult;
		const returnItems = data.map((item) => {
			return getArticle(convertNewsAPIItem(item, params));
		});

		return Promise.all(returnItems);
	};
