import { Request, Response, NextFunction } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers["x-api-key"];

	if (!apiKey || apiKey !== process.env.CMS_API_KEY) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	next();
};
