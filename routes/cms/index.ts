import { Router } from "express";
import { articleRoute } from "./article/article";
import { articleProviderRoute } from "./article/article-provider";
import { apiKeyAuth } from "./middleware";

export const cmsRoute = Router();

// CMS Management UI root
cmsRoute.get("/", async (req, res) => {
	res.send("CMS Management UI - Add sources, etc.");
});

// All routes require API key auth
cmsRoute.use("/articles", apiKeyAuth, articleRoute);
cmsRoute.use("/articles/providers", apiKeyAuth, articleProviderRoute);
