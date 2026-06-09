import {
	ContentViewPast12Hours,
	ContentViewPast3Days,
	ContentViewPast3Hours,
	ContentViewPast6Hours,
	ContentViewPastDay,
	ContentViewPastHour,
	ContentViewPastWeek,
} from "../../../../../models/ContentViews";

import { PipelineStage } from "mongoose";
import Article from "../../../../../models/Article";

export type TrendingWindow =
	| "hour"
	| "threeHours"
	| "sixHours"
	| "twelveHours"
	| "day"
	| "threeDays"
	| "week";

export type GetTrendingArticlesProps = {
	window?: TrendingWindow;
	variant?: string;
	limit?: number;
};

const viewModels = {
	hour: ContentViewPastHour,
	threeHours: ContentViewPast3Hours,
	sixHours: ContentViewPast6Hours,
	twelveHours: ContentViewPast12Hours,
	day: ContentViewPastDay,
	threeDays: ContentViewPast3Days,
	week: ContentViewPastWeek,
} as const;

// ultimately add various filters?
// currently we only have pge articles view data
// We would provied different options for page and article variants
export const buildTrendingArticlesQuery = async ({
	window = "hour",
	variant,
	limit = 10,
}: GetTrendingArticlesProps) => {
	const Model = viewModels[window];
	console.log("TEST DATA", { window, variant, limit });
	if (!Model) {
		// should return an error here
		// & an empty array?
		return [];
	}

	const pipeline: PipelineStage[] = [
		{
			$group: {
				_id: "$contentId",
				viewCount: { $sum: 1 },
			},
		},
		{ $sort: { viewCount: -1 } },
		{
			$lookup: {
				from: Article.collection.name,
				localField: "_id",
				foreignField: "_id",
				as: "article",
			},
		},
		{ $unwind: "$article" },
	];

	if (variant) {
		pipeline.push({
			$match: { "article.variant": variant },
		});
	}

	pipeline.push(
		{ $limit: +limit },
		{
			$replaceRoot: {
				newRoot: {
					$mergeObjects: ["$article", { viewCount: "$viewCount" }],
				},
			},
		},
	);

	return Model.aggregate(pipeline);
};
