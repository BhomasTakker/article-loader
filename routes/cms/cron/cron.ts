import { Router } from "express";
import CronJob from "../../../src/models/CronJob";
import {
	buildPaginationParams,
	buildPaginationResponse,
} from "../utils/pagination";

export const cronRoute = Router();

const addFilter = (filter: any, query: any) => {
	const { _id, id, type, isActive } = query;

	if (id) {
		filter.id = { $regex: id, $options: "i" }; // Case-insensitive search
	}

	if (_id) {
		filter._id = _id;
	}

	if (type) {
		filter.type = type;
	}

	if (isActive !== undefined) {
		filter.isActive = isActive === "true";
	}

	return filter;
};

const addCronItemFilter = (filter: any, query: any) => {
	const { timeFunction, fetchFunction, variant } = query;

	if (timeFunction) {
		filter["cron.timeFunction"] = timeFunction;
	}

	if (fetchFunction) {
		filter["cron.fetchFunction"] = fetchFunction;
	}

	if (variant) {
		filter["cron.variant"] = variant;
	}

	return filter;
};

const createSort = (query: any) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;

	const sort: any = {};
	const allowedSortFields = [
		"createdAt",
		"id",
		"type",
		"isActive",
		"updatedAt",
	];
	const safeSortBy = allowedSortFields.includes(sortBy as string)
		? sortBy
		: "createdAt";
	sort[safeSortBy as string] = sortOrder === "asc" ? 1 : -1;

	return sort;
};

cronRoute.get("/search", async (req, res) => {
	try {
		let filter = addFilter({}, req.query);
		filter = addCronItemFilter(filter, req.query);

		// Pagination
		const { page, limit, skip } = buildPaginationParams(req.query);

		const sort = createSort(req.query);

		const [cronJobs, total] = await Promise.all([
			CronJob.find(filter).sort(sort).skip(skip).limit(limit).lean(),
			CronJob.countDocuments(filter),
		]);

		res.json({
			data: cronJobs,
			pagination: buildPaginationResponse(page, limit, total),
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

cronRoute.get("/get", async (req, res) => {
	try {
		const { id, _id } = req.query;

		if (!id && !_id) {
			res.status(400).json({
				error: "Please provide 'id' or '_id' query parameter",
			});
			return;
		}

		let cronJob;
		if (_id) {
			cronJob = await CronJob.findById(_id).lean();
		} else {
			cronJob = await CronJob.findOne({ id: id as string }).lean();
		}

		if (!cronJob) {
			res.status(404).json({ error: "CronJob not found" });
			return;
		}

		res.json(cronJob);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});

cronRoute.post("/create", async (req, res) => {
	try {
		const { id, type, cron, isActive } = req.body;

		if (!id || !type || !cron) {
			res.status(400).json({
				error: "Please provide 'id', 'type', and 'cron' in the request body",
			});
			return;
		}

		const existingCronJob = await CronJob.findOne({ id });
		if (existingCronJob) {
			res.status(409).json({
				error: `CronJob with id '${id}' already exists`,
			});
			return;
		}

		const newCronJob = new CronJob({
			id,
			type,
			cron,
			isActive: isActive !== undefined ? isActive : true,
		});

		const savedCronJob = await newCronJob.save();

		res.status(201).json(savedCronJob);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

cronRoute.put("/update/:id", async (req, res) => {
	try {
		const allowedUpdates = ["type", "cron", "isActive"];

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

		const cronJob = await CronJob.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}).lean();

		if (!cronJob) {
			res.status(404).json({ error: "CronJob not found" });
			return;
		}

		res.json(cronJob);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
});

cronRoute.delete("/delete/:id", async (req, res) => {
	try {
		const cronJob = await CronJob.findByIdAndDelete(req.params.id).lean();

		if (!cronJob) {
			res.status(404).json({ error: "CronJob not found" });
			return;
		}

		res.json({
			message: "CronJob deleted successfully",
			deletedCronJob: cronJob,
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
});
