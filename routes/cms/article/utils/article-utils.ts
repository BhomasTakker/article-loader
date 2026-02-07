import Article from "../../../../src/models/Article";

export const createArticle = async (articleData: any) => {
	const {
		title,
		src,
		description,
		guid,
		variant,
		details,
		avatar,
		media,
		provider,
		feed,
		rating,
		views,
		duration,
		disabled,
	} = articleData;

	// Create new article
	const article = new Article({
		title,
		src,
		description,
		guid,
		variant,
		details,
		avatar,
		media,
		provider,
		feed: feed && feed !== "" ? feed : undefined, // Only include feed if it's provided and not an empty string
		rating,
		views,
		duration,
		disabled,
	});
	return await article.save();
};

// any...
export const addFilter = (filter: any, query: any) => {
	const {
		title,
		src,
		variant,
		provider,
		feed,
		disabled,
		minDuration,
		maxDuration,
	} = query;

	if (title) {
		filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
	}

	if (src) {
		filter.src = { $regex: src, $options: "i" };
	}

	if (variant) {
		filter.variant = variant;
	}

	if (provider) {
		filter.provider = provider;
	}

	if (feed) {
		filter.feed = feed;
	}

	if (disabled !== undefined) {
		filter.disabled = disabled === "true";
	}

	if (minDuration !== undefined || maxDuration !== undefined) {
		filter.duration = {};
		if (minDuration !== undefined) {
			filter.duration.$gte = Number(minDuration);
		}
		if (maxDuration !== undefined) {
			filter.duration.$lte = Number(maxDuration);
		}
	}
	return filter;
};

export const addDetailsFilter = (filter: any, query: any) => {
	const { category, author, publisher, region, coverage, language } = query;

	if (category) {
		filter["details.categories"] = { $regex: category, $options: "i" };
	}

	if (author) {
		filter["details.authors"] = { $regex: author, $options: "i" };
	}

	if (publisher) {
		filter["details.publishers"] = { $regex: publisher, $options: "i" };
	}

	if (region) {
		filter["details.region"] = { $regex: region, $options: "i" };
	}

	if (coverage) {
		const coverageArray = Array.isArray(coverage) ? coverage : [coverage];
		filter["details.coverage"] = { $in: coverageArray };
	}

	if (language) {
		filter["details.language"] = { $regex: language, $options: "i" };
	}
	return filter;
};

export const createSort = (query: any) => {
	const { sortBy = "createdAt", sortOrder = "desc" } = query;

	const sort: any = {};
	const allowedSortFields = [
		"createdAt",
		"title",
		"src",
		"disabled",
		"duration",
	];
	const safeSortBy = allowedSortFields.includes(sortBy as string)
		? sortBy
		: "createdAt";
	sort[safeSortBy as string] = sortOrder === "asc" ? 1 : -1;

	return sort;
};
