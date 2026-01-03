import { Router } from "express";
import ArticleSourceList from "../../../src/models/ArticleSourceList";
import {
	buildPaginationParams,
	buildPaginationResponse,
} from "../utils/pagination";

export const sourcesListRoute = Router();

const addFilter = (filter: any, query: any) => {
	const { title, variant, categories, region, coverage, language } = query;

	if (title) {
		filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
	}

	if (variant) {
		filter.variant = variant;
	}

	if (categories) {
		filter.categories = { $in: categories.split(",") };
	}

	if (region) {
		filter.region = { $in: region.split(",") };
	}

	if (coverage) {
		filter.coverage = { $in: coverage.split(",") };
	}

	if (language) {
		filter.language = language;
	}

	return filter;
};

const createSort = (query: any) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;
	const sort: any = {};
	const allowedSortFields = [
		"createdAt",
		"title",
		"variant",
		"language",
		"updatedAt",
	];
	const safeSortBy = allowedSortFields.includes(sortBy as string)
		? sortBy
		: "createdAt";
	sort[safeSortBy as string] = sortOrder === "asc" ? 1 : -1;

	return sort;
};

// Get all article source lists with filtering and pagination
sourcesListRoute.get("/search", async (req, res) => {
	try {
		// Build filter query
		const filter = addFilter({}, req.query);

		// Pagination
		const { page, limit, skip } = buildPaginationParams(req.query, 25);

		// Sort
		const sort = createSort(req.query);

		// Check if we should populate sources
		const shouldPopulate = req.query.populate === "true";

		// Execute query
		const query = ArticleSourceList.find(filter)
			.sort(sort)
			.skip(skip)
			.limit(limit);

		if (shouldPopulate) {
			query.populate("sources");
		}

		const [sourcesLists, total] = await Promise.all([
			query.lean(),
			ArticleSourceList.countDocuments(filter),
		]);

		res.json({
			data: sourcesLists,
			pagination: buildPaginationResponse(page, limit, total),
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Get single article source list
sourcesListRoute.get("/get", async (req, res) => {
	try {
		const { title, id } = req.query;
		const shouldPopulate = req.query.populate === "true";

		let articleSourceList;
		if (id) {
			const query = ArticleSourceList.findById(id);
			if (shouldPopulate) {
				query.populate("sources");
			}
			articleSourceList = await query.lean();
		} else if (title) {
			const query = ArticleSourceList.findOne({ title });
			if (shouldPopulate) {
				query.populate("sources");
			}
			articleSourceList = await query.lean();
		} else {
			res.status(400).json({ error: "Please provide either id or title" });
			return;
		}

		if (!articleSourceList) {
			res.status(404).json({ error: "Article source list not found" });
			return;
		}

		res.json(articleSourceList);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Create article source list
sourcesListRoute.post("/create", async (req, res) => {
	try {
		const {
			title,
			variant,
			categories = [],
			region = [],
			coverage = [],
			language,
			sources,
		} = req.body;

		// Validate required fields
		if (!title || !variant || !language) {
			res.status(400).json({
				error: "Missing required fields: title, variant, language",
			});
			return;
		}

		// Check if a source list with the same title already exists
		const existingList = await ArticleSourceList.findOne({ title });
		if (existingList) {
			res.status(409).json({
				error: "Article source list with this title already exists",
			});
			return;
		}

		const articleSourceList = new ArticleSourceList({
			title,
			variant,
			categories,
			region,
			coverage,
			language,
			sources: sources || [],
		});

		await articleSourceList.save();

		const shouldPopulate = req.query.populate === "true";
		if (shouldPopulate) {
			await articleSourceList.populate("sources");
		}

		res.status(201).json(articleSourceList);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Update article source list
sourcesListRoute.put("/update/:id", async (req, res) => {
	try {
		const allowedUpdates = [
			"title",
			"variant",
			"categories",
			"region",
			"coverage",
			"language",
			"sources",
		];

		const updates: any = {};
		Object.keys(req.body).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				updates[key] = req.body[key];
			}
		});

		if (Object.keys(updates).length === 0) {
			res.status(400).json({ error: "No valid fields provided for update." });
			return;
		}

		// Check for duplicate title if updating title
		if (updates.title) {
			const existingList = await ArticleSourceList.findOne({
				title: updates.title,
				_id: { $ne: req.params.id },
			});
			if (existingList) {
				res.status(409).json({
					error: "Article source list with this title already exists",
				});
				return;
			}
		}

		const articleSourceList = await ArticleSourceList.findByIdAndUpdate(
			req.params.id,
			updates,
			{
				new: true,
				runValidators: true,
			}
		).lean();

		if (!articleSourceList) {
			res.status(404).json({ error: "Article source list not found" });
			return;
		}

		res.json(articleSourceList);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Delete article source list
sourcesListRoute.delete("/delete/:id", async (req, res) => {
	try {
		const articleSourceList = await ArticleSourceList.findByIdAndDelete(
			req.params.id
		).lean();

		if (!articleSourceList) {
			res.status(404).json({ error: "Article source list not found" });
			return;
		}

		res.json({
			message: "Article source list deleted successfully",
			deletedList: articleSourceList,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Add sources to a source list
sourcesListRoute.post("/add-sources/:id", async (req, res) => {
	try {
		const { sources } = req.body;

		if (!sources || !Array.isArray(sources) || sources.length === 0) {
			res.status(400).json({
				error: "Please provide an array of source IDs",
			});
			return;
		}

		const articleSourceList = await ArticleSourceList.findByIdAndUpdate(
			req.params.id,
			{ $addToSet: { sources: { $each: sources } } },
			{ new: true, runValidators: true }
		).lean();

		if (!articleSourceList) {
			res.status(404).json({ error: "Article source list not found" });
			return;
		}

		res.json(articleSourceList);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Remove sources from a source list
sourcesListRoute.post("/remove-sources/:id", async (req, res) => {
	try {
		const { sources } = req.body;

		if (!sources || !Array.isArray(sources) || sources.length === 0) {
			res.status(400).json({
				error: "Please provide an array of source IDs to remove",
			});
			return;
		}

		const articleSourceList = await ArticleSourceList.findByIdAndUpdate(
			req.params.id,
			{ $pull: { sources: { $in: sources } } },
			{ new: true, runValidators: true }
		).lean();

		if (!articleSourceList) {
			res.status(404).json({ error: "Article source list not found" });
			return;
		}

		res.json(articleSourceList);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});
