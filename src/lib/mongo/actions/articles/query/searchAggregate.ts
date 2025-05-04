import { Aggregator } from ".";
import { GetLatestArticlesProps } from "../search";
import {
	addFilter,
	addDateRange,
	addDurationRange,
	addSort,
	addMinimumShouldMatch,
	getLimit,
} from "./search-query-functions";
import {
	addFields,
	addProviderLookup,
	matchLeaning,
	matchOrigin,
	matchTrust,
} from "./aggregator-functions";

// MongoDB Atlas Search Course
// https://learn.mongodb.com/learning-paths/atlas-search

// Clean me up!!

export const createSearchAggregate = (
	queryParams: GetLatestArticlesProps,
	aggregator: Aggregator
) => {
	const {
		query,
		variant,
		region,
		language,
		trustHigher,
		trustLower,
		leaningHigher,
		leaningLower,
		origin,
		mustContain = [],
		mustNotContain = [],
		shouldContain = [],
		filterContain = [],
	} = queryParams;
	const filter: any[] = [];
	const must: any[] = [];
	const mustNot: any[] = [];
	const should: any[] = [];
	// if (query) {
	if (variant) addFilter(filter, variant, "variant");
	if (region) addFilter(filter, region, "details.region");
	if (language) addFilter(filter, language, "details.languge");

	if (mustContain && mustContain?.length > 0) {
		mustContain.forEach((item) => {
			addFilter(must, item, "title");
		});
	}

	if (mustNotContain && mustNotContain?.length > 0) {
		mustNotContain.forEach((item) => {
			addFilter(mustNot, item, "title");
		});
	}

	if (shouldContain && shouldContain?.length > 0) {
		shouldContain.forEach((item) => {
			addFilter(should, item, "title");
		});
	}

	if (filterContain && filterContain?.length > 0) {
		filterContain.forEach((item) => {
			addFilter(filter, item, "title", "text");
		});
	}

	addDateRange(filter, queryParams);
	addDurationRange(filter, queryParams);

	if (query) {
		addFilter(must, query, "title");
	}

	const isFilter = filter.length > 0 ? { filter } : {};
	const isMust = must.length > 0 ? { must } : {};
	const isShould = should.length > 0 ? { should } : {};
	const isMustNot = mustNot.length > 0 ? { mustNot } : {};

	aggregator.push({
		$search: {
			// Also working on our date index
			index: "title",
			scoreDetails: true,
			// create sort
			sort: addSort(queryParams),

			// createCompoundQuery
			compound: {
				must: isMust ? must : undefined,
				mustNot: isMustNot ? mustNot : undefined,
				filter: isFilter ? filter : undefined,
				should: isShould ? should : undefined,
				minimumShouldMatch: addMinimumShouldMatch(queryParams),
			},
			count: {
				type: "lowerBound",
			},
		},
	});
	// we need to use provider for filtering trust
	addProviderLookup(aggregator);
	addFields(aggregator);
	// Technically I don't think we should do this
	// match after search is known for slowdowns
	// but I don't know another way to do this
	matchTrust(aggregator, trustHigher, trustLower);
	// Ready and seem fine but removed for now
	// matchLeaning(aggregator, leaningHigher, leaningLower);
	// matchOrigin(aggregator, origin);
	aggregator.push({ $limit: getLimit(queryParams) });

	return aggregator;
};
