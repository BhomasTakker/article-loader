import { Router } from "express";
import ArticleProvider from "../../../src/models/ArticleProvider";

export const articleProviderRoute = Router();

// Get all article providers with filtering and pagination
articleProviderRoute.get("/search", async (req, res) => {
	try {
		const {
			name,
			url,
			origin,
			leaning,
			minRating,
			maxRating,
			page = "1",
			limit = "10",
			sortBy = "createdAt",
			sortOrder = "desc",
		} = req.query;

		// Build filter query
		const filter: any = {};

		if (name) {
			filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
		}

		if (url) {
			filter.url = { $regex: url, $options: "i" };
		}

		if (origin) {
			filter.origin = { $regex: origin, $options: "i" };
		}

		if (leaning) {
			filter.leaning = Number(leaning);
		}

		if (minRating !== undefined || maxRating !== undefined) {
			filter.rating = {};
			if (minRating !== undefined) {
				filter.rating.$gte = Number(minRating);
			}
			if (maxRating !== undefined) {
				filter.rating.$lte = Number(maxRating);
			}
		}

		// Pagination
		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		// Sort
		const sort: any = {};
		sort[sortBy as string] = sortOrder === "asc" ? 1 : -1;

		// Execute query
		const [providers, total] = await Promise.all([
			ArticleProvider.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
			ArticleProvider.countDocuments(filter),
		]);

		res.json({
			data: providers,
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
