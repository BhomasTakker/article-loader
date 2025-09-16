import { Aggregator } from ".";
import {
	addProviderLookup,
	addFields,
	matchTrust,
	matchLeaning,
	matchOrigin,
} from "./aggregator-functions";

// Mock the ArticleProvider model
jest.mock("../../../../../models/ArticleProvider", () => ({
	collection: {
		name: "articleproviders",
	},
}));

describe("Aggregator Functions", () => {
	let aggregator: Aggregator;

	beforeEach(() => {
		aggregator = [];
	});

	describe("addProviderLookup", () => {
		it("should add lookup stage to aggregator", () => {
			addProviderLookup(aggregator);

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$lookup: {
					from: "articleproviders",
					localField: "provider",
					foreignField: "_id",
					as: "provider",
				},
			});
		});

		it("should not modify existing aggregator stages", () => {
			const existingStage = { $match: { test: "value" } };
			aggregator.push(existingStage);

			addProviderLookup(aggregator);

			expect(aggregator).toHaveLength(2);
			expect(aggregator[0]).toEqual(existingStage);
			expect(aggregator[1]).toEqual({
				$lookup: {
					from: "articleproviders",
					localField: "provider",
					foreignField: "_id",
					as: "provider",
				},
			});
		});
	});

	describe("addFields", () => {
		it("should add fields stage to aggregator", () => {
			addFields(aggregator);

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$addFields: {
					score: { $meta: "searchScore" },
					scoreDetails: { $meta: "searchScoreDetails" },
					provider: { $arrayElemAt: ["$provider", 0] },
				},
			});
		});

		it("should not modify existing aggregator stages", () => {
			const existingStage = { $match: { test: "value" } };
			aggregator.push(existingStage);

			addFields(aggregator);

			expect(aggregator).toHaveLength(2);
			expect(aggregator[0]).toEqual(existingStage);
			expect(aggregator[1]).toEqual({
				$addFields: {
					score: { $meta: "searchScore" },
					scoreDetails: { $meta: "searchScoreDetails" },
					provider: { $arrayElemAt: ["$provider", 0] },
				},
			});
		});
	});

	describe("matchTrust", () => {
		it("should add trust match stage when both trustHigher and trustLower are provided", () => {
			matchTrust(aggregator, "25", "75");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 25] },
							{ $lte: ["$provider.rating", 75] },
						],
					},
				},
			});
		});

		it("should add trust match stage when only trustHigher is provided", () => {
			matchTrust(aggregator, "30", undefined);

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 30] },
							{ $lte: ["$provider.rating", 100] },
						],
					},
				},
			});
		});

		it("should add trust match stage when only trustLower is provided", () => {
			matchTrust(aggregator, undefined, "60");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 0] },
							{ $lte: ["$provider.rating", 60] },
						],
					},
				},
			});
		});

		it("should not add any stage when both parameters are undefined", () => {
			matchTrust(aggregator, undefined, undefined);

			expect(aggregator).toHaveLength(0);
		});

		it("should not add any stage when both parameters are empty strings", () => {
			matchTrust(aggregator, "", "");

			expect(aggregator).toHaveLength(0);
		});

		it("should handle string numbers correctly", () => {
			matchTrust(aggregator, "10", "90");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 10] },
							{ $lte: ["$provider.rating", 90] },
						],
					},
				},
			});
		});

		it("should handle zero values correctly", () => {
			matchTrust(aggregator, "0", "0");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 0] },
							{ $lte: ["$provider.rating", 0] },
						],
					},
				},
			});
		});
	});

	describe("matchLeaning", () => {
		it("should add leaning match stage when both leaningHigher and leaningLower are provided", () => {
			matchLeaning(aggregator, "-0.5", "0.5");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", -0.5] },
							{ $lte: ["$provider.leaning", 0.5] },
						],
					},
				},
			});
		});

		it("should add leaning match stage when only leaningHigher is provided", () => {
			matchLeaning(aggregator, "0.2", undefined);

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", 0.2] },
							{ $lte: ["$provider.leaning", 1] },
						],
					},
				},
			});
		});

		it("should add leaning match stage when only leaningLower is provided", () => {
			matchLeaning(aggregator, undefined, "-0.3");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", -1] },
							{ $lte: ["$provider.leaning", -0.3] },
						],
					},
				},
			});
		});

		it("should not add any stage when both parameters are undefined", () => {
			matchLeaning(aggregator, undefined, undefined);

			expect(aggregator).toHaveLength(0);
		});

		it("should not add any stage when both parameters are empty strings", () => {
			matchLeaning(aggregator, "", "");

			expect(aggregator).toHaveLength(0);
		});

		it("should handle negative values correctly", () => {
			matchLeaning(aggregator, "-1", "-0.5");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", -1] },
							{ $lte: ["$provider.leaning", -0.5] },
						],
					},
				},
			});
		});

		it("should handle positive values correctly", () => {
			matchLeaning(aggregator, "0.3", "0.8");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", 0.3] },
							{ $lte: ["$provider.leaning", 0.8] },
						],
					},
				},
			});
		});

		it("should handle zero values correctly", () => {
			matchLeaning(aggregator, "0", "0");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", 0] },
							{ $lte: ["$provider.leaning", 0] },
						],
					},
				},
			});
		});
	});

	describe("matchOrigin", () => {
		it("should add origin match stage when origin is provided", () => {
			matchOrigin(aggregator, "US");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [{ $eq: ["$provider.origin", "US"] }],
					},
				},
			});
		});

		it("should handle different origin values", () => {
			matchOrigin(aggregator, "UK");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [{ $eq: ["$provider.origin", "UK"] }],
					},
				},
			});
		});

		it("should not add any stage when origin is undefined", () => {
			matchOrigin(aggregator, undefined);

			expect(aggregator).toHaveLength(0);
		});

		it("should not add any stage when origin is empty string", () => {
			matchOrigin(aggregator, "");

			expect(aggregator).toHaveLength(0);
		});

		it("should handle special characters in origin", () => {
			matchOrigin(aggregator, "EU-27");

			expect(aggregator).toHaveLength(1);
			expect(aggregator[0]).toEqual({
				$match: {
					$expr: {
						$and: [{ $eq: ["$provider.origin", "EU-27"] }],
					},
				},
			});
		});

		it("should not modify existing aggregator stages", () => {
			const existingStage = { $match: { test: "value" } };
			aggregator.push(existingStage);

			matchOrigin(aggregator, "CA");

			expect(aggregator).toHaveLength(2);
			expect(aggregator[0]).toEqual(existingStage);
			expect(aggregator[1]).toEqual({
				$match: {
					$expr: {
						$and: [{ $eq: ["$provider.origin", "CA"] }],
					},
				},
			});
		});
	});

	describe("Integration tests", () => {
		it("should work correctly when multiple functions are called", () => {
			addProviderLookup(aggregator);
			addFields(aggregator);
			matchTrust(aggregator, "50", "100");
			matchLeaning(aggregator, "-0.5", "0.5");
			matchOrigin(aggregator, "US");

			expect(aggregator).toHaveLength(5);

			// Verify the order and content of all stages
			expect(aggregator[0]).toEqual({
				$lookup: {
					from: "articleproviders",
					localField: "provider",
					foreignField: "_id",
					as: "provider",
				},
			});

			expect(aggregator[1]).toEqual({
				$addFields: {
					score: { $meta: "searchScore" },
					scoreDetails: { $meta: "searchScoreDetails" },
					provider: { $arrayElemAt: ["$provider", 0] },
				},
			});

			expect(aggregator[2]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.rating", 50] },
							{ $lte: ["$provider.rating", 100] },
						],
					},
				},
			});

			expect(aggregator[3]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", -0.5] },
							{ $lte: ["$provider.leaning", 0.5] },
						],
					},
				},
			});

			expect(aggregator[4]).toEqual({
				$match: {
					$expr: {
						$and: [{ $eq: ["$provider.origin", "US"] }],
					},
				},
			});
		});

		it("should handle partial filter application", () => {
			addProviderLookup(aggregator);
			addFields(aggregator);
			matchTrust(aggregator, undefined, undefined); // Should not add anything
			matchLeaning(aggregator, "0", undefined);
			matchOrigin(aggregator, undefined); // Should not add anything

			expect(aggregator).toHaveLength(3);

			expect(aggregator[0]).toHaveProperty("$lookup");
			expect(aggregator[1]).toHaveProperty("$addFields");
			expect(aggregator[2]).toEqual({
				$match: {
					$expr: {
						$and: [
							{ $gte: ["$provider.leaning", 0] },
							{ $lte: ["$provider.leaning", 1] },
						],
					},
				},
			});
		});
	});
});
