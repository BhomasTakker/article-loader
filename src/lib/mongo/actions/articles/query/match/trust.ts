import { GetLatestArticlesProps } from "../../search";

export const matchTrust = (
	queryParams: GetLatestArticlesProps,
	// Aggregator type does not like $match
	aggregator: any[]
) => {
	const { trustHigher, trustLower } = queryParams;
	let returnAggregator = aggregator;
	if (trustHigher) {
		returnAggregator.push({
			$match: {
				"provider.rating": { $gte: +trustHigher },
			},
		});
	}
	if (trustLower) {
		returnAggregator.push({
			$match: {
				"provider.rating": { $lte: +trustLower },
			},
		});
	}
	return returnAggregator;
};
