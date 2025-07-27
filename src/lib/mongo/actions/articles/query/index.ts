import { GetLatestArticlesProps } from "../search";
import { PipelineStage } from "mongoose";
import Article from "../../../../../models/Article";
import { createSearchAggregate } from "./searchAggregate";

// Aggregation course 2 hour
// https://www.youtube.com/watch?v=vx1C8EyTa7Y

export type Aggregator = PipelineStage[];

export const buildArticleSearchQuery = async (
	queryParams: GetLatestArticlesProps
) => {
	const res = await Article.aggregate(
		createSearchAggregate(queryParams, [] as Aggregator)
	);

	return res;
};
