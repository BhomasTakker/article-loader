import { PartialSearchQuery } from "./search-queries";

export const MAIN_UKRAINE: PartialSearchQuery[] = [
	{
		query: "Ukraine",
		variant: "article",
		contentType: "news",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		query: "Ukraine",
		variant: "video",
		trustHigher: "70",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: "Ukraine",
		variant: "audio",
		contentType: "news",
		sort: "date-descending",
		limit: "20",
	},
];
