import { CollectionItem } from "../../types/article/item";
import { ConvertPodcastRssItemToArticle } from "../types";
import { convertDurationToSeconds } from "../utils";

export const convertPodcastRssItemToArticle = ({
	item,
	extraData,
	provider,
	collectionData,
	feed,
}: ConvertPodcastRssItemToArticle) => {
	const { itunes } = item;
	const { duration, author, summary } = itunes;
	const { itunes: collectionItunes } = collectionData || {};
	const {
		owner,
		image,
		categories: collectionCategories = [],
		explicit,
		author: collectionAuthor,
		summary: collectionSummary,
	} = collectionItunes || {};

	const { description: collectionDescription, title: collectionTitle } =
		collectionData || {};
	const {
		region,
		coverage = [],
		language,
		categories = [],
		collectionTitle: seriesTitle,
	} = extraData || {};

	const { title, description, pubDate, enclosure, guid } = item;

	const newItem: CollectionItem = {
		title,
		src: enclosure.url,
		description: description || summary,
		guid: guid,
		variant: "audio",

		avatar: {
			src: image || "",
			alt: collectionTitle || "",
		},
		media: {
			duration: convertDurationToSeconds(duration),
			mediaType: "podcast",
			type: enclosure.type || "audio/mpeg",
			collectionTitle: seriesTitle,
		},
		details: {
			published: pubDate,
			publishers: [author],
			categories: [...categories, ...collectionCategories],
			authors: [collectionAuthor || author],
			region,
			coverage,
			language,
		},
		provider,
		feed,
	};

	return newItem;
};
