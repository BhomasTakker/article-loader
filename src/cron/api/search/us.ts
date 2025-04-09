import { PartialSearchQuery } from "./search-queries";

// Should give each one a title
export const MAIN_US: PartialSearchQuery[] = [
	{
		contentType: "news",
		region: "US",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		query: "US recession",
		textScore: "1",
		variant: "article",
		contentType: "news",
		trustHigher: "65",
		sort: "relevance",
		limit: "25",
	},
	{
		variant: "video",
		region: "US",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		variant: "audio",
		region: "US",
		contentType: "news",
		durationLower: "420",
		sort: "date-descending",
		limit: "20",
	},
	{
		query: "tariffs pause",
		textScore: "0.5",
		variant: "article",
		contentType: "news",
		sort: "date-descending",
		limit: "7",
	},
	{
		query: "Trump no pause",
		textScore: "1",
		variant: "video",
		contentType: "news",
		sort: "relevance",
		limit: "25",
	},
];
