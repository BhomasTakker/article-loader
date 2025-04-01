import { Aggregator } from "..";
import { GetLatestArticlesProps } from "../../search";

const sortByRelevance = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator
) => {
	const { query } = queryParams;
	if (!query) {
		return aggregator;
	}
	return [
		...aggregator,
		{
			$sort: { score: { $meta: "textScore" } },
		},
	];
};

const sorByDate = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator,
	direction: 1 | -1
) => {
	return [
		...aggregator,
		{
			$sort: { "details.published": direction },
		},
	];
};

const AvailableSort = {
	NONE: "none",
	RELEVANCE: "relevance",
	DATE_ASCENDING: "date-ascending",
	DATE_DESCENDING: "date-descending",
} as const;

export const sortCollection = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator
) => {
	const { sort } = queryParams;

	switch (sort) {
		case AvailableSort.RELEVANCE:
			// check a query!
			return sortByRelevance(queryParams, aggregator);
		case AvailableSort.DATE_ASCENDING:
			return sorByDate(queryParams, aggregator, 1);
		case AvailableSort.DATE_DESCENDING:
			return sorByDate(queryParams, aggregator, -1);
		default:
			return aggregator;
	}
};
