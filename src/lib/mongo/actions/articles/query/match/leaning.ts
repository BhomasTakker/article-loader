import { GetLatestArticlesProps } from "../../search";

// This is incorrect and should be fixed
// leaning Lower will override higher
export const matchLeaning = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { leaningHigher, leaningLower } = queryParams;
	let returnAggregator = aggregator;
	if (leaningHigher) {
		returnAggregator.push({
			$match: {
				"provider.leaning": { $gte: +leaningHigher },
			},
		});
	}
	if (leaningLower) {
		returnAggregator.push({
			$match: {
				"provider.leaning": { $lte: +leaningLower },
			},
		});
	}
	return returnAggregator;
};
