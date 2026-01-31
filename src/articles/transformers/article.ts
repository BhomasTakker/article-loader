import { CollectionItem, RSSItem } from "../../types/article/item";
import { parseDate, stripQueryStringFromUrl } from "../utils";

export const convertRssItem = (data: RSSItem) => {
	const {
		title,
		// content potentially more likely to have html

		description,
		author,
		category,
		link,
		pubDate,
		enclosure,
		// What is?
		content,
		contentSnippet,
	} = data;
	const { url = "" } = enclosure || {};
	const contentEncoded = data["content:encoded"];
	const dcDate = data["dc:date"];

	// we need to test this properly
	const parsedUrl = new URL(link);
	const strippedUrl = stripQueryStringFromUrl(parsedUrl);

	return {
		title: title,
		src: strippedUrl,
		// feels wrong to use contentSnippet and content
		description: description || contentEncoded, //contentSnippet || content || description,
		contentEncoded,
		guid: "",
		variant: "article",
		details: {
			published: parseDate(pubDate || dcDate) || "",
			categories: category ? [category] : [],
			publishers: author ? [author] : [],
		},
		avatar: {
			src: url,
			alt: title,
		},
	} as CollectionItem;
};
