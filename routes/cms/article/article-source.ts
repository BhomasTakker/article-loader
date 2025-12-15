import { Router } from "express";
import ArticleSource from "../../../src/models/ArticleSource";
import {
	buildPaginationParams,
	buildPaginationResponse,
} from "../utils/pagination";

export const articleSourceRoute = Router();

const addFilter = (filter: any, query: any) => {
	const {
		name,
		src,
		variant,
		categories,
		region,
		coverage,
		language,
		source,
		mediaType,
		collectionTitle,
	} = query;

	if (name) {
		filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
	}

	if (src) {
		filter.src = { $regex: src, $options: "i" };
	}

	if (variant) {
		filter.variant = { $regex: variant, $options: "i" };
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

	if (source) {
		filter.source = { $regex: source, $options: "i" };
	}

	if (mediaType) {
		filter.mediaType = mediaType;
	}

	if (collectionTitle) {
		filter.collectionTitle = { $regex: collectionTitle, $options: "i" };
	}

	return filter;
};

const createSort = (query: any) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;
	const sort: any = {};
	const allowedSortFields = [
		"createdAt",
		"name",
		"variant",
		"language",
		"collectionTitle",
	];
	const safeSortBy = allowedSortFields.includes(sortBy as string)
		? sortBy
		: "createdAt";
	sort[safeSortBy as string] = sortOrder === "asc" ? 1 : -1;

	return sort;
};

// Get all article sources with filtering and pagination
articleSourceRoute.get("/search", async (req, res) => {
	try {
		// Build filter query
		const filter = addFilter({}, req.query);

		// Pagination
		const { page, limit, skip } = buildPaginationParams(req.query, 25);

		// Sort
		const sort = createSort(req.query);

		// Execute query
		const [sources, total] = await Promise.all([
			ArticleSource.find(filter).sort(sort).skip(skip).limit(limit).lean(),
			ArticleSource.countDocuments(filter),
		]);

		res.json({
			data: sources,
			pagination: buildPaginationResponse(page, limit, total),
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Get single article source
articleSourceRoute.get("/get", async (req, res) => {
	try {
		const { name, src, id } = req.query;

		let articleSource;
		if (id) {
			articleSource = await ArticleSource.findById(id).lean();
		} else {
			const query: any = {};
			if (name) query.name = name;
			if (src) query.src = src;

			articleSource = await ArticleSource.findOne(query).lean();
		}

		if (!articleSource) {
			res.status(404).json({ error: "Article source not found" });
			return;
		}

		res.json(articleSource);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Create article source
articleSourceRoute.post("/create", async (req, res) => {
	try {
		const {
			name,
			src,
			variant,
			categories,
			region,
			coverage,
			language,
			source,
			mediaType,
			collectionTitle,
		} = req.body;

		// Create new article source
		const articleSource = new ArticleSource({
			name,
			src,
			variant,
			categories,
			region,
			coverage,
			language,
			source,
			mediaType,
			collectionTitle,
		});

		await articleSource.save();

		res.status(201).json(articleSource);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Update article source
articleSourceRoute.put("/update/:id", async (req, res) => {
	try {
		const allowedUpdates = [
			"name",
			"src",
			"variant",
			"categories",
			"region",
			"coverage",
			"language",
			"source",
			"mediaType",
			"collectionTitle",
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

		const articleSource = await ArticleSource.findByIdAndUpdate(
			req.params.id,
			updates,
			{
				new: true,
				runValidators: true,
			}
		).lean();

		if (!articleSource) {
			res.status(404).json({ error: "Article source not found" });
			return;
		}

		res.json(articleSource);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Delete article source
articleSourceRoute.delete("/delete/:id", async (req, res) => {
	try {
		const articleSource = await ArticleSource.findByIdAndDelete(
			req.params.id
		).lean();

		if (!articleSource) {
			res.status(404).json({ error: "Article source not found" });
			return;
		}

		res.json({
			message: "Article source deleted successfully",
			deletedSource: articleSource,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
