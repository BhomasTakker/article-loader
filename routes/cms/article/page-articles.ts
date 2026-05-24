import { Router } from "express";
import {
	PAGE_ARTICLE_BASE_URLS,
	syncPageArticles,
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
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});
