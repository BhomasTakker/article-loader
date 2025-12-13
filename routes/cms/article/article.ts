import { Router } from "express";
import Article from "../../../src/models/Article";
import { validateSelectArticleQuery } from "../middleware";

export const articleRoute = Router();

const addFilter = (filter: any, query: any) => {
	const { title, src, variant, provider, disabled, minDuration, maxDuration } =
		query;

	if (title) {
		filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
	}

	if (src) {
		filter.src = { $regex: src, $options: "i" };
	}

	if (variant) {
		filter.variant = variant;
	}

	if (provider) {
		filter.provider = provider;
	}

	if (disabled !== undefined) {
		filter.disabled = disabled === "true";
	}

	if (minDuration !== undefined || maxDuration !== undefined) {
		filter.duration = {};
		if (minDuration !== undefined) {
			filter.duration.$gte = Number(minDuration);
		}
		if (maxDuration !== undefined) {
			filter.duration.$lte = Number(maxDuration);
		}
	}
	return filter;
};

const addDetailsFilter = (filter: any, query: any) => {
	const { category, author, publisher, region, coverage, language } = query;

	if (category) {
		filter["details.categories"] = { $regex: category, $options: "i" };
	}

	if (author) {
		filter["details.authors"] = { $regex: author, $options: "i" };
	}

	if (publisher) {
		filter["details.publishers"] = { $regex: publisher, $options: "i" };
	}

	if (region) {
		filter["details.region"] = { $regex: region, $options: "i" };
	}

	if (coverage) {
		const coverageArray = Array.isArray(coverage) ? coverage : [coverage];
		filter["details.coverage"] = { $in: coverageArray };
	}

	if (language) {
		filter["details.language"] = { $regex: language, $options: "i" };
	}
	return filter;
};

const createSort = (query: any) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;

	const sort: any = {};
	const allowedSortFields = [
		"createdAt",
		"title",
		"src",
		"disabled",
		"duration",
	];
	const safeSortBy = allowedSortFields.includes(sortBy as string)
		? sortBy
		: "createdAt";
	sort[safeSortBy as string] = sortOrder === "asc" ? 1 : -1;

	return sort;
};

articleRoute.get("/search", async (req, res) => {
	try {
		const { page = "1", limit = "10" } = req.query;

		// builder really
		let filter = addFilter({}, req.query);
		filter = addDetailsFilter(filter, req.query);

		// Pagination
		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		const sort = createSort(req.query);

		// We should quite possibly use the existing get articles.
		const [articles, total] = await Promise.all([
			Article.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(limitNum)
				.populate("provider")
				.lean(),
			Article.countDocuments(filter),
		]);

		res.json({
			data: articles,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum),
			},
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

articleRoute.get("/get", validateSelectArticleQuery, async (req, res) => {
	try {
		const { src, title, id } = req.query;

		let article;
		if (id) {
			article = await Article.findById(id).populate("provider").lean();
		} else {
			const query: any = {};
			if (src) query.src = src;
			if (title) query.title = title;
			article = await Article.findOne(query).populate("provider").lean();
		}

		if (!article) {
			res.status(404).json({ error: "Article not found" });
			return;
		}

		res.json(article);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

articleRoute.put("/update/:id", async (req, res) => {
	try {
		const allowedUpdates = ["variant", "media", "disabled"];

		const updates: any = {};
		Object.keys(req.body).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				updates[key] = req.body[key];
			}
		});

		const article = await Article.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		})
			.populate("provider")
			.lean();

		if (!article) {
			res.status(404).json({ error: "Article not found" });
			return;
		}

		res.json(article);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

articleRoute.delete("/delete/:id", async (req, res) => {
	try {
		const article = await Article.findByIdAndDelete(req.params.id)
			.populate("provider")
			.lean();

		if (!article) {
			res.status(404).json({ error: "Article not found" });
			return;
		}

		res.json({
			message: "Article deleted successfully",
			deletedArticle: article,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
