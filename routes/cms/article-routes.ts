import { Express } from "express";
import Article from "../../src/models/Article";
import { apiKeyAuth } from "./middleware";

export const initArticleRoutes = (app: Express) => {
	// Get article by source URL, title, or ID (use query param: ?src=... or ?title=... or ?id=...)
	app.get("/cms/articles/get", apiKeyAuth, async (req, res) => {
		try {
			const { src, title, id } = req.query;

			if (!src && !title && !id) {
				res.status(400).json({
					error: "Please provide 'src', 'title', or 'id' query parameter",
				});
				return;
			}

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

	// Update article
	app.put("/cms/articles/:id/update", apiKeyAuth, async (req, res) => {
		try {
			const allowedUpdates = ["variant", "media", "disabled", "ttl"];

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

	// Disable/Enable article (soft delete)
	app.patch("/cms/articles/:id/disable", apiKeyAuth, async (req, res) => {
		try {
			const { disabled = true } = req.body;

			const article = await Article.findByIdAndUpdate(
				req.params.id,
				{ disabled: disabled },
				{ new: true, runValidators: true }
			)
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

	// Set TTL for article
	app.patch("/cms/articles/:id/ttl", apiKeyAuth, async (req, res) => {
		try {
			const { ttl } = req.body;

			if (ttl === undefined || ttl === null) {
				res.status(400).json({ error: "TTL value is required" });
				return;
			}

			// TTL can be a timestamp or duration in seconds
			const article = await Article.findByIdAndUpdate(
				req.params.id,
				{ ttl: ttl },
				{ new: true, runValidators: true }
			)
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

	// Delete article (hard delete)
	app.delete("/cms/articles/:id/delete", apiKeyAuth, async (req, res) => {
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
};
