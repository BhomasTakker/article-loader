import { ExtraData } from "../../sources/news/articles/types";
import { logMemoryUsage } from "../lib/mem";
import { CollectionItem } from "../types/article/item";
import { ProviderItem } from "../types/article/provider";
import { FetchArticles } from "./fetch-articles";
import { saveArticle } from "./save";

export type PodcastRSSCollection = {
	items: PodcastRSSItem[];
	link?: string;
	title?: string;
	description?: string;
	lastBuildDate?: string;
	language?: string;
	copyright?: string;
	generator?: string;
	author?: string;
	image?: {
		url: string;
		title: string;
		link: string;
	};
	itunes: {
		owner: {
			name: string;
			email: string;
		};
		image: string;
		categories: string[];
		explicit: string;
		author: string;
		summary: string;
	};
};

// Curren
export type PodcastRSSItem = {
	title: string;
	description: string;
	link: string;
	pubDate: string;

	itunes: {
		duration: string;
		episodeType: string;
		author: string;
		subtitle: string;
		summary: string;
		block: string;
		explicit: string;
	};
	content: {
		encoded: string;
	};

	guid: string;
	enclosure: {
		url: string;
		type?: string;
	};
};

type PodcastExtraData = ExtraData & { collectionTitle: string };

type ConvertPodcastRssItemToArticle = {
	item: PodcastRSSItem;
	extraData?: PodcastExtraData;
	provider?: ProviderItem;
	collectionData?: PodcastRSSCollection;
};

// Utils and make better
const convertDurationToSeconds = (duration: string) => {
	if (!duration) {
		return undefined;
	}
	// assuming that the durtion is given in seconds when it is a number
	if (!isNaN(Number(duration))) {
		return Number(duration);
	}
	// Assuming the duration is in the format "HH:MM:SS"
	const parts = duration.split(":").map(Number);
	let seconds = 0;

	if (parts.length === 3) {
		seconds += parts[0] * 3600; // Hours
		seconds += parts[1] * 60; // Minutes
		seconds += parts[2]; // Seconds
	} else if (parts.length === 2) {
		seconds += parts[0] * 60; // Minutes
		seconds += parts[1]; // Seconds
	} else if (parts.length === 1) {
		seconds += parts[0]; // Seconds
	}

	return seconds;
};

const convertPodcastRssItemToArticle = ({
	item,
	extraData,
	provider,
	collectionData,
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
		language,
		categories = [],
		collectionType,
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
			format: "podcast",
			type: enclosure.type || "audio/mpeg",
			collectionTitle: seriesTitle,
		},
		details: {
			published: pubDate,
			publishers: [author],
			categories: [...categories, ...collectionCategories],
			authors: [collectionAuthor || author],
		},
		provider,
		collectionType,
	};

	return newItem;
};

export const fetchPodcastArticles = async ({
	items,
	extraData,
	provider,
	collectionData,
}: FetchArticles) => {
	// We are not excuding articles with incorrect data.....
	const data = items.map((item, i) => {
		const newItem: PodcastRSSItem = item as unknown as PodcastRSSItem;
		return saveArticle(
			convertPodcastRssItemToArticle({
				item: newItem,
				extraData: extraData as PodcastExtraData,
				provider,
				collectionData: collectionData as PodcastRSSCollection,
			})
		);
	});

	logMemoryUsage();
	const results = await Promise.all(data);
	logMemoryUsage();
	return results; //Promise.all(data);
};
