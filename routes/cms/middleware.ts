import { Request, Response, NextFunction } from "express";
import Article from "../../src/models/Article";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
	const apiKey = req.headers["x-api-key"];

	if (!apiKey || apiKey !== process.env.CMS_API_KEY) {
		res.status(401).json({ error: "Unauthorized" });
		return;
	}

	next();
};

export const validateSelectArticleQuery = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { src, title, id } = req.query;

	if (!src && !title && !id) {
		res.status(400).json({
			error: "Please provide 'src', 'title', or 'id' query parameter",
		});
		return;
	}

	next();
};
