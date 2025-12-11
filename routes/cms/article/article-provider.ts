import { Router } from "express";
import ArticleProvider from "../../../src/models/ArticleProvider";

export const articleProviderRoute = Router();

// Get single article provider
articleProviderRoute.get("/get", async (req, res) => {
	try {
		const { name, url, id } = req.query;

		let articleProvider;
		if (id) {
			articleProvider = await ArticleProvider.findById(id).lean();
		} else {
			const query: any = {};
			if (name) query.name = name;
			if (url) query.url = url;
			articleProvider = await ArticleProvider.findOne(query).lean();
		}

		if (!articleProvider) {
			res.status(404).json({ error: "Article provider not found" });
			return;
		}

		res.json(articleProvider);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

// Update article provider
articleProviderRoute.put("/update/:id", async (req, res) => {
	try {
		const allowedUpdates = [
			"name",
			"description",
			"url",
			"rating",
			"leaning",
			"origin",
			"logo",
		];

		const updates: any = {};
		Object.keys(req.body).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				updates[key] = req.body[key];
			}
		});

		const articleProvider = await ArticleProvider.findByIdAndUpdate(
			req.params.id,
			updates,
			{
				new: true,
				runValidators: true,
			}
		).lean();

		if (!articleProvider) {
			res.status(404).json({ error: "Article provider not found" });
			return;
		}

		res.json(articleProvider);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

// Delete article provider
articleProviderRoute.delete("/delete/:id", async (req, res) => {
	try {
		const articleProvider = await ArticleProvider.findByIdAndDelete(
			req.params.id
		).lean();

		if (!articleProvider) {
			res.status(404).json({ error: "Article provider not found" });
			return;
		}

		res.json({
			message: "Article provider deleted successfully",
			deletedProvider: articleProvider,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
