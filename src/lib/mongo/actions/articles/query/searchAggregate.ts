import { Aggregator } from ".";
import { GetLatestArticlesProps } from "../search";
import {
	addFilter,
	addDateRange,
	addDurationRange,
	addSort,
	addMinimumShouldMatch,
	getLimit,
	addWithinTimeFrame,
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
		variant,
		region,
		coverage,
		continent,
		country,
		state,
		city,
		language,
		trustHigher,
		trustLower,
		mediaType,
		leaningHigher,
		leaningLower,
		origin,
		categories,
		mustContain = [],
		mustNotContain = [],
		shouldContain = [],
		filterContain = [],
	} = queryParams;
	const filter: any[] = [];
	const must: any[] = [];
	const mustNot: any[] = [];
	const should: any[] = [];

	// to search phrases
	//  "\"coffee shop\" cakes"

	// within the past x amount of time
	// last hour, last 3, last 6, last 12, last 24,
	// last 2 days, last 3 days, last 7 days, last 2 weeks, last 30 days
	// last 3 months, last 6 months, last year, all time

	if (variant) addFilter(filter, variant, "variant");

	if (language) addFilter(filter, language, "details.languge");
	if (mediaType) addFilter(filter, mediaType, "media.mediaType");

	// eventually this OR this
	if (region) addFilter(filter, region, "details.region");
	if (continent) addFilter(filter, continent, "details.region");
	if (country) addFilter(filter, country, "details.region");
	if (state) addFilter(filter, state, "details.region");
	if (city) addFilter(filter, city, "details.region");
	// add continent, country, state, city, etc - all use region
	// UK and Birmingham excludes Birmingham Alabama etc
	// ultimately we want this AND this
	// this OR this
	// Not this etc

	// coverage used for scoping articles. Give me US && national news
	if (coverage) addFilter(filter, coverage, "details.coverage");

	// Is this how you would do a multi select?
	// feels a little wrong?
	const categoriesArray = categories
		? categories.split(",").map((cat) => cat.trim())
		: [];
	if (categoriesArray && categoriesArray.length > 0) {
		addFilter(filter, categoriesArray, "details.categories");
	}

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
	addWithinTimeFrame(filter, queryParams);
	addDurationRange(filter, queryParams);

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
