import { Router } from "express";
import mongoose from "mongoose";
import {
	PAGE_ARTICLE_BASE_URLS,
	syncPageArticles,
	syncPageArticle,
} from "../../../src/articles/sync-page-articles";

export const pageArticleRoute = Router();

// POST /cms/articles/pages/sync?env=prod
// Syncs a page-variant Article for every live Page in the DB.
// Optional ?env query param selects the base URL (defaults to "prod").
pageArticleRoute.post("/sync", async (req, res) => {
	const env = (req.query.env as string) || "prod";

	if (!PAGE_ARTICLE_BASE_URLS[env]) {
		res.status(400).json({
			error: `Unknown env "${env}". Valid options: ${Object.keys(PAGE_ARTICLE_BASE_URLS).join(", ")}`,
		});
		return;
	}

	const baseUrl = PAGE_ARTICLE_BASE_URLS[env];

	try {
		const result = await syncPageArticles(baseUrl);
		res.json({ env, baseUrl, result });
	} catch (err) {
		console.error("[sync-page-articles]", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

// POST /cms/articles/pages/sync-one?env=prod
// Syncs a page-variant Article for a single Page.
// Requires either 'id' (_id) or 'route' in the request body.
pageArticleRoute.post("/sync-article", async (req, res) => {
	const env = (req.query.env as string) || "prod";

	if (!PAGE_ARTICLE_BASE_URLS[env]) {
		res.status(400).json({
			error: `Unknown env "${env}". Valid options: ${Object.keys(PAGE_ARTICLE_BASE_URLS).join(", ")}`,
		});
		return;
	}

	const { id, route } = req.body;

	if (!id && !route) {
		res.status(400).json({
			error: "Please provide 'id' or 'route' in the request body",
		});
		return;
	}

	if (id && !mongoose.isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid 'id' format" });
		return;
	}

	// This is the function - the above is mostly protection
	const baseUrl = PAGE_ARTICLE_BASE_URLS[env];

	try {
		const result = await syncPageArticle(baseUrl, { id, route });

		if (result.status === "error") {
			res.status(404).json({ error: result.error });
			return;
		}

		res.json({ env, baseUrl, result });
	} catch (err) {
		console.error("[sync-page-article]", err);
		res.status(500).json({ error: "Internal server error" });
	}
});
