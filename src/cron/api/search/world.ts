import { PartialSearchQuery } from "./search-queries";

export const MAIN_WORLD: PartialSearchQuery[] = [
	{
		variant: "article",
		contentType: "news",
		region: "world",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		query: "tariffs",
		textScore: "0.5",
		variant: "article",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		variant: "video",
		contentType: "news",
		region: "world",
		textScore: "1",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		variant: "audio",
		contentType: "news",
		region: "world",
		durationLower: "420",
		sort: "date-descending",
		limit: "20",
	},
];

export const TRADE_WAR: PartialSearchQuery[] = [
	{
		query: "tariffs",
		variant: "article",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: "China tariffs",
		textScore: "0.8",
		variant: "article",
		contentType: "news",
		sort: "date-descending",
		limit: "7",
	},
	{
		query: "tariffs",
		textScore: "0.5",
		variant: "video",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
];
