export const mergeStringOrArray = (
	val1: string | string[] = [],
	val2: string | string[] = []
) => {
	const arrayVal1 = typeof val1 === "string" ? [val1] : val1;
	const arrayVal2 = typeof val2 === "string" ? [val2] : val2;
	return [...new Set([...arrayVal1, ...arrayVal2])];
};

const ITEMS_LIMIT = 50;
export const filterLimit = <T>(items: T[]) => {
	if (items.length > ITEMS_LIMIT) {
		return items.slice(0, ITEMS_LIMIT);
	}
	return items;
};

/**
 * Deep merge two objects, including nested objects and arrays
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns A new deeply merged object
 */
export const deepMerge = <
	T extends Record<string, any>,
	U extends Record<string, any>
>(
	target: T,
	source: U
): T & U => {
	// Handle null/undefined cases
	if (!target) return source as T & U;
	if (!source) return target as T & U;

	const result = { ...target } as any;

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const sourceValue = source[key];
			const targetValue = result[key];

			if (sourceValue === null || sourceValue === undefined) {
				// If source value is null/undefined, use it (overwrites target)
				result[key] = sourceValue;
			} else if (Array.isArray(sourceValue)) {
				// Handle arrays - replace target array with source array
				result[key] = [...sourceValue];
			} else if (
				typeof sourceValue === "object" &&
				typeof targetValue === "object" &&
				!Array.isArray(targetValue) &&
				targetValue !== null
			) {
				// Recursively merge nested objects
				result[key] = deepMerge(targetValue, sourceValue);
			} else {
				// For primitive values, source overwrites target
				result[key] = sourceValue;
			}
		}
	}

	return result as T & U;
};
