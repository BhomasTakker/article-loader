import { ProviderItem } from "./provider";

export type UnknownObject = Record<string, unknown>;
// [1]     link: 'https://www.bbc.com/news/videos/c2d3zgkxwwpo',
// [1]     pubDate: 'Thu, 30 Jan 2025 13:14:45 GMT',
// [1]     content: 'Three Israelis and five Thai nationals comprised the latest group of hostages released since the Gaza ceasefire was announced.',
// [1]     contentSnippet: 'Three Israelis and five Thai nationals comprised the latest group of hostages released since the Gaza ceasefire was announced.',
// [1]     guid: 'https://www.bbc.com/news/videos/c2d3zgkxwwpo#3',
// [1]     isoDate: '2025-01-30T13:14:45.000Z'

export type DataResponse = {
	items: RSSItem[];
	link?: string;
	title?: string;
	feed?: string;
	description?: string;
	lastBuildDate?: string;
	language?: string;
	webMaster?: string;
	pubDate?: string;
	generator?: string;
	image?: RSSImage;
	ttl?: string;
} & UnknownObject;

export type RSSEnclosure = {
	type: string;
	length: string;
	url: string;
};

export type RSSImage = {
	url: string;
	title: string;
	link: string;
};

export type RSSSource = {
	url: string;
};

// Add content:encoded
export type RSSItem = {
	title: string;
	description: string;
	["content:encoded"]?: string;
	author?: string;
	category?: string;
	content?: string;
	contentSnippet?: string;
	creator?: string;
	guid?: string;
	isoDate?: string;
	link: string;
	pubDate?: string;
	source?: string;
	comments?: [];
	image?: RSSImage;
	enclosure?: RSSEnclosure;

	categories?: string[];
};

export type RSSChannelType = {
	generator?: string;
	webMaster?: string;
	title: string;
	cloud?: string;
	copyright?: string;
	description: string;
	docs?: string;
	feedUrl?: string;
	language?: string;
	lastBuildDate?: string;
	link: string;
	managingEditor?: string;
	paginationLinks?: string;
	pubDate?: string;
	rating?: string;
	image?: RSSImage;
	skipDays?: string;
	skipHours?: string;
	textInput?: string;
	ttl?: string;

	items?: RSSItem[];
};

///////////////////////////////
type Temp = {
	// youtube
	rating?: string;
	views?: string;

	// itunes podcast
	duration?: number;
};

export type BaseInfo = {
	title: string;
	src: string; // URL format
	description: string;
	guid: string;
	variant: string; // union
	collectionType?: string;
	// use for youtube, podcast/mp3, etc?
	format?: string;
} & Temp;

export type Details = {
	docs?: string[];
	categories?: string[];
	authors?: string[];
	publishers?: string[];
	published?: Date | string;
	modified?: Date | string;
};

export type Media = UnknownObject;

export type Avatar = {
	src: string;
	alt: string;
};

export type Pagination = {
	results: number;
};

export type CollectionItem = BaseInfo & {
	details?: Details;
	avatar?: Avatar;
	provider?: ProviderItem;
};
