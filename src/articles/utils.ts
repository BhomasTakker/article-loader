import {
	updateArticleCategories,
	updateArticleRegions,
} from "../lib/mongo/actions/article";
import { CollectionItemDocument } from "../types/article/item";

// Utils and make better
export const convertDurationToSeconds = (duration: string) => {
	if (!duration) {
		return undefined;
	}
	// assuming that the durtion is given in seconds when it is a number
	if (!isNaN(Number(duration))) {
		return Number(duration);
	}
	// Assuming the duration is in the format "HH:MM:SS"
	const parts = duration.split(":").map(Number);
	let seconds = 0;

	if (parts.length === 3) {
		seconds += parts[0] * 3600; // Hours
		seconds += parts[1] * 60; // Minutes
		seconds += parts[2]; // Seconds
	} else if (parts.length === 2) {
		seconds += parts[0] * 60; // Minutes
		seconds += parts[1]; // Seconds
	} else if (parts.length === 1) {
		seconds += parts[0]; // Seconds
	}

	return seconds;
};

export const parseDate = (
	dateString: string | undefined,
): string | undefined => {
	if (!dateString) return undefined;

	const parsed = new Date(dateString);
	// Check if valid date
	if (!isNaN(parsed.getTime())) {
		return parsed.toISOString();
	}

	// If invalid, return undefined or current date
	return undefined;
};

export const checkUpdateArticleRegions = async (
	exists: CollectionItemDocument,
	regionArray: string[],
) => {
	const existingRegions = new Set(exists.details?.region || []);
	const hasNewRegions = regionArray.some(
		(region) => !existingRegions.has(region),
	);

	if (hasNewRegions) {
		// Update existing article with merged regions
		const updatedRegions = Array.from(
			new Set([...(exists.details?.region || []), ...regionArray]),
		);

		await updateArticleRegions(exists._id, updatedRegions);
	}
};

export const checkUpdateArticleCategories = async (
	exists: CollectionItemDocument,
	categoryArray: string[],
) => {
	const existingCategories = new Set(exists.details?.categories || []);
	const hasNewCategories = categoryArray.some(
		(category) => !existingCategories.has(category),
	);

	if (hasNewCategories) {
		// Update existing article with merged categories
		const updatedCategories = Array.from(
			new Set([...(exists.details?.categories || []), ...categoryArray]),
		);

		await updateArticleCategories(exists._id, updatedCategories);
	}
};

// Do not do this with YouTube!!
export const stripQueryStringFromUrl = (url: URL) => {
	const { pathname, origin } = url;
	const newUrl = new URL(origin + pathname);
	// Remove query string from the URL
	newUrl.search = "";
	// Remove any hash fragments from the URL
	newUrl.hash = "";
	return newUrl.toString();
};
