import { GetLatestArticlesProps } from "../../search";

export const matchProvider = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { provider } = queryParams;
	let returnAggregator = aggregator;
	if (provider) {
		const providerArray = provider.split(",");
		returnAggregator = [
			...aggregator,
			{
				$match: {
					"provider.name": {
						$in: providerArray,
					},
				},
			},
		];
	}
	return returnAggregator;
};

export const matchProviderOrigin = (
	queryParams: GetLatestArticlesProps,
	aggregator: any[]
) => {
	const { origin } = queryParams;
	let returnAggregator = aggregator;
	if (origin) {
		returnAggregator = [
			...aggregator,
			{
				$match: {
					"provider.origin": origin,
				},
			},
		];
	}
	return returnAggregator;
};
