import { Aggregator } from "..";
import { GetLatestArticlesProps } from "../../search";

// Would we want to though?
// Until we can paginate
const HARD_LIMIT = 100;

// Would we always have a limit?
export const setLimit = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator
) => {
	const { limit = HARD_LIMIT } = queryParams;
	let limitToUse = +limit <= HARD_LIMIT ? +limit : HARD_LIMIT;

	if (isNaN(+limit) || !limit) {
		limitToUse = HARD_LIMIT;
	}

	return [
		...aggregator,
		{
			$limit: limitToUse,
		},
	];
};
