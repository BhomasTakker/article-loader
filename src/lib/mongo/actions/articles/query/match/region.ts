import { GetLatestArticlesProps } from "../../search";

export const matchByRegion = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { region } = queryParams;
	let returnAggregator = aggregator;
	if (region) {
		returnAggregator = [
			...aggregator,
			{
				$match: {
					"details.region": region,
				},
			},
		];
	}
	return returnAggregator;
};
