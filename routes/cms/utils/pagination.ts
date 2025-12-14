export const MAX_LIMIT = 100;

export interface PaginationParams {
	page: number;
	limit: number;
	skip: number;
}

export interface PaginationQuery {
	page?: string;
	limit?: string;
}

/**
 * Builds pagination parameters from query string
 * @param query - Query object containing page and limit
 * @param maxLimit - Maximum allowed limit (default: MAX_LIMIT)
 * @returns Validated pagination parameters
 */
export const buildPaginationParams = (
	query: PaginationQuery,
	maxLimit: number = MAX_LIMIT
): PaginationParams => {
	let page = parseInt(query.page || "1", 10);
	let limit = parseInt(query.limit || "10", 10);

	// Validate and clamp values
	if (page < 1) page = 1;
	if (limit < 1) limit = 1;
	if (limit > maxLimit) limit = maxLimit;

	const skip = (page - 1) * limit;

	return { page, limit, skip };
};

/**
 * Builds pagination response object
 */
export const buildPaginationResponse = (
	page: number,
	limit: number,
	total: number
) => {
	return {
		page,
		limit,
		total,
		pages: Math.ceil(total / limit),
	};
};
