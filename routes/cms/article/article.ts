import { Router } from "express";
import Article from "../../../src/models/Article";
import { validateSelectArticleQuery } from "../middleware";
import {
	buildPaginationParams,
	buildPaginationResponse,
} from "../utils/pagination";
import {
	addDetailsFilter,
	addFilter,
	createArticle,
	createSort,
} from "./utils/article-utils";

export const articleRoute = Router();

articleRoute.get("/search", async (req, res) => {
	try {
		// builder really
		let filter = addFilter({}, req.query);
		filter = addDetailsFilter(filter, req.query);

		// abstract this into utils
		// Pagination
		const { page, limit, skip } = buildPaginationParams(req.query);

		const sort = createSort(req.query);

		// We should quite possibly use the existing get articles.
		const [articles, total] = await Promise.all([
			Article.find(filter)
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.populate("provider")
				.lean(),
			Article.countDocuments(filter),
		]);
		////

		res.json({
			data: articles,
			pagination: buildPaginationResponse(page, limit, total),
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

// Proper validation required... or at least some
articleRoute.post("/create", async (req, res) => {
	try {
		// we need to check the article doesn't already exist, otherwise we will get a duplicate key error from MongoDB due to the unique index on src. This is a common issue when multiple requests try to create the same article at the same time.
		const existingArticle = await Article.findOne({ src: req.body.src }).lean();
		if (existingArticle) {
			res.status(400).json({ error: "Article with this src already exists." });
			return;
		}
		const article = await createArticle(req.body);

		// Populate provider and feed for the response
		await article.populate("provider");
		await article.populate("feed");

		res.status(201).json(article);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

articleRoute.put("/update/:id", async (req, res) => {
	try {
		// utils
		const allowedUpdates = ["variant", "media", "disabled"];

		const updates: any = {};
		Object.keys(req.body).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				updates[key] = req.body[key];
			}
		});

		if (Object.keys(updates).length === 0) {
			res.status(400).json({ error: "No valid fields provided for update." });
		}
		/////

		// utils
		const article = await Article.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		})
			.populate("provider")
			.lean();
		////

		if (!article) {
			res.status(404).json({ error: "Article not found" });
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
