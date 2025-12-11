import { Router } from "express";
import Article from "../../src/models/Article";

export const articleRoute = Router();

articleRoute.get("/get", async (req, res) => {
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

// Delete article (hard delete)
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
