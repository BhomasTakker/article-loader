import { GetLatestArticlesProps } from "../../search";

export const matchDuration = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { durationHigher, durationLower } = queryParams;

	let returnAggregator = aggregator;
	if (durationHigher) {
		returnAggregator.push({
			$match: {
				"media.duration": { $gte: +durationHigher },
			},
		});
	}
	if (durationLower) {
		returnAggregator.push({
			$match: {
				"media.duration": { $lte: +durationLower },
			},
		});
	}
	return returnAggregator;
};
