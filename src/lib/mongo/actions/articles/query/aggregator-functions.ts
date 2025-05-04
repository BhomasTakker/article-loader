import { Aggregator } from ".";
import ArticleProvider from "../../../../../models/ArticleProvider";

export const addProviderLookup = (aggregator: Aggregator) => {
	aggregator.push({
		$lookup: {
			from: ArticleProvider.collection.name,
			localField: "provider",
			foreignField: "_id",
			as: "provider",
		},
	});
};

export const addFields = (aggregator: Aggregator) => {
	aggregator.push({
		$addFields: {
			score: { $meta: "searchScore" },
			scoreDetails: { $meta: "searchScoreDetails" },
			provider: { $arrayElemAt: ["$provider", 0] },
		},
	});
};

export const matchTrust = (
	aggregator: Aggregator,
	trustHigher: string | undefined,
	trustLower: string | undefined
) => {
	// must be numbers etc
	if (trustHigher || trustLower) {
		const higher = trustHigher ? +trustHigher : 0;
		const lower = trustLower ? +trustLower : 100;

		aggregator.push({
			$match: {
				$expr: {
					$and: [
						{ $gte: ["$provider.rating", higher] },
						{ $lte: ["$provider.rating", lower] },
					],
				},
			},
		});
	}
};

export const matchLeaning = (
	aggregator: Aggregator,
	leaningHigher: string | undefined,
	leaningLower: string | undefined
) => {
	if (leaningHigher || leaningLower) {
		const higher = leaningHigher ? +leaningHigher : -1;
		const lower = leaningLower ? +leaningLower : 1;
		aggregator.push({
			$match: {
				$expr: {
					$and: [
						{ $gte: ["$provider.leaning", higher] },
						{ $lte: ["$provider.leaning", lower] },
					],
				},
			},
		});
	}
};

export const matchOrigin = (
	aggregator: Aggregator,
	origin: string | undefined
) => {
	if (origin) {
		aggregator.push({
			$match: {
				$expr: {
					$and: [{ $eq: ["$provider.origin", origin] }],
				},
			},
		});
	}
};
