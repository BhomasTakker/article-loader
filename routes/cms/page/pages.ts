import { Router, Response } from "express";
import mongoose from "mongoose";
import Page from "../../../src/models/Page";
import {
	buildPaginationParams,
	buildPaginationResponse,
} from "../utils/pagination";

export const pagesRoute = Router();

interface PageQuery {
	_id?: string;
	route?: string;
	pageType?: string;
	live?: string;
	sortBy?: string;
	sortOrder?: string;
}

interface PageFilter {
	_id?: string;
	route?: { $regex: string; $options: string };
	pageType?: string;
	live?: boolean;
}

const addFilter = (filter: PageFilter, query: PageQuery): PageFilter => {
	const { _id, route, pageType, live } = query;
	const result: PageFilter = { ...filter };

	if (_id) {
		if (!mongoose.isValidObjectId(_id)) {
			return result;
		}
		result._id = _id;
	}

	if (route) {
		result.route = { $regex: route, $options: "i" };
	}

	if (pageType) {
		result.pageType = pageType;
	}

	if (live === "true" || live === "false") {
		result.live = live === "true";
	}

	return result;
};

const createSort = (query: PageQuery) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;

	const sort: Record<string, 1 | -1> = {};
	const allowedSortFields = [
		"createdAt",
		"updatedAt",
		"route",
		"pageType",
		"live",
		"totalViewCount",
	];
	const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
	sort[safeSortBy] = sortOrder === "asc" ? 1 : -1;

	return sort;
};

const validateObjectId = (id: string, res: Response): boolean => {
	if (!mongoose.isValidObjectId(id)) {
		res.status(400).json({ error: "Invalid 'id' format" });
		return false;
	}
	return true;
};

pagesRoute.get("/search", async (req, res) => {
	try {
		const filter = addFilter({}, req.query);

		const { page, limit, skip } = buildPaginationParams(req.query);

		const sort = createSort(req.query);

		const [pages, total] = await Promise.all([
			Page.find(filter)
				.select("-content")
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean(),
			Page.countDocuments(filter),
		]);

		res.json({
			data: pages,
			pagination: buildPaginationResponse(page, limit, total),
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

pagesRoute.get("/get", async (req, res) => {
	try {
		const { _id, route } = req.query;

		if (!_id && !route) {
			res.status(400).json({
				error: "Please provide '_id' or 'route' query parameter",
			});
			return;
		}

		if (_id && !validateObjectId(_id as string, res)) return;

		let page;
		if (_id) {
			page = await Page.findById(_id).lean();
		} else {
			page = await Page.findOne({ route: route as string }).lean();
		}

		if (!page) {
			res.status(404).json({ error: "Page not found" });
			return;
		}

		res.json(page);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

pagesRoute.put("/update/:id", async (req, res) => {
	try {
		if (!validateObjectId(req.params.id, res)) return;

		const allowedUpdates = ["live", "pageType"];

		const updates: any = {};
		Object.keys(req.body).forEach((key) => {
			if (allowedUpdates.includes(key)) {
				updates[key] = req.body[key];
			}
		});

		if (Object.keys(updates).length === 0) {
			res.status(400).json({ error: "No valid fields provided for update." });
			return;
		}

		const page = await Page.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}).lean();

		if (!page) {
			res.status(404).json({ error: "Page not found" });
			return;
		}

		res.json(page);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});
