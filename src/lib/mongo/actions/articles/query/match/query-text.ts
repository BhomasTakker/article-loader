import { Aggregator } from "..";
import { GetLatestArticlesProps } from "../../search";

export const matchQuery = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator
) => {
	const { query, textScore } = queryParams;
	if (query) {
		return [
			...aggregator,
			{
				$match: {
					$text: {
						$search: query,
						$caseSensitive: false,
					},
				},
			},
			{
				$addFields: {
					score: { $meta: "textScore" },
				},
			},
			{
				$match: {
					// Need to match given score if appropriate
					score: { $gte: textScore ? parseFloat(textScore) : 0 },
				},
			},
		];
	}
	return aggregator;
};
