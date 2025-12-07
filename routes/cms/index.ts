import { Router } from "express";
import { articleRoute } from "./Article";

export const cmsRoute = Router();

cmsRoute.get("/", async (req, res) => {
	res.send("CMS Management UI - Add sources, etc.");
});
cmsRoute.use("/articles", articleRoute);
