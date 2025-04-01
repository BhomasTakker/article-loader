import { GetLatestArticlesProps } from "../search";
import { match, matchQuery } from "./match";
import { destructProvider } from "./populate";
import { PipelineStage } from "mongoose";
import { sortCollection } from "./sort";
import { setLimit } from "./limit";
import Article from "../../../../../models/Article";

// Aggregation course 2 hour
// https://www.youtube.com/watch?v=vx1C8EyTa7Y

export type Aggregator = PipelineStage[];

const createAggregate = (queryParams: GetLatestArticlesProps) => {
	const aggregate: Aggregator = [];
	// queried
	const queryAdded = matchQuery(queryParams, aggregate);
	// populated
	const providerAdded = destructProvider(queryAdded);
	// call match all
	const matched = match(queryParams, providerAdded);
	// call sort
	const sorted = sortCollection(queryParams, matched);
	// @ts-expect-error - typing error my sort is not correct type
	const limited = setLimit(queryParams, sorted);
	return limited;
};

export const buildArticleSearchQuery = async (
	queryParams: GetLatestArticlesProps
) => {
	const res = await Article.aggregate(createAggregate(queryParams));
	return res;
};
