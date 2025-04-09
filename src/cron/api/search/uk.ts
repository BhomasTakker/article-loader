import { PartialSearchQuery } from "./search-queries";

export const MAIN_UK: PartialSearchQuery[] = [
	{
		contentType: "news",
		region: "UK",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		variant: "video",
		region: "UK",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		variant: "audio",
		region: "UK",
		contentType: "news",
		durationLower: "420",
		sort: "date-descending",
		limit: "10",
	},
];

export const BINDEPENDENCE_DAY: PartialSearchQuery[] = [
	{
		query: "Birmingham bin strike",
		variant: "article",
		textScore: "1",
		region: "UK",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: "Birmingham bin strike",
		variant: "article",
		textScore: "1",
		contentType: "news",
		sort: "date-descending",
		limit: "7",
	},
	{
		variant: "video",
		query: "Birmingham bin strike",
		textScore: "1",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
];

export const GANGS_SCOTLAND: PartialSearchQuery[] = [
	{
		query: "Edinburgh war",
		variant: "article",
		textScore: "1",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	// {
	// 	variant: "video",
	// 	query: "Scotland gang war",
	// 	contentType: "news",
	// 	sort: "date-descending",
	// 	limit: "25",
	// },
];

export const SPY_COPS: PartialSearchQuery[] = [
	{
		query: '"Spy cops"',
		textScore: "1",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: '"Spy Cops"',
		textScore: "0.7",
		variant: "audio",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: '"Spy cops"',
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
];
