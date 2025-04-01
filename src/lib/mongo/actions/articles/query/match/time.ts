import { GetLatestArticlesProps } from "../../search";

export const matchTime = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { before, after } = queryParams;
	let returnAggregator = aggregator;
	if (before) {
		returnAggregator.push({
			$match: {
				"details.published": {
					$lt: before,
				},
			},
		});
	}
	if (after) {
		returnAggregator.push({
			$match: {
				"details.published": {
					$gt: after,
				},
			},
		});
	}
	return returnAggregator;
};
