import { getMeta } from "../html/get-meta";
import {
	getArticleBySrc,
	updateArticleCategories,
	updateArticleRegions,
} from "../lib/mongo/actions/article";
import { CollectionItemDocument, Details } from "../types/article/item";
import { ExtraData } from "../types/types";
import { mergeStringOrArray } from "../utils";

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

export const mergeArticleDetails = (obj1: Details, obj2: ExtraData) => {
	const {
		region: obj1Region,
		coverage: obj1Coverage,
		categories: obj1Categories,
	} = obj1;
	const {
		region: obj2Region,
		coverage: obj2Coverage,
		categories: obj2Categories,
	} = obj2;

	const categories1 = obj1Categories || [];
	const categories2 = obj2Categories || [];
	const mergedCategories = mergeStringOrArray(categories1, categories2);

	const region1 = obj1Region || [];
	const region2 = obj2Region || [];
	const mergedRegion = mergeStringOrArray(region1, region2);

	const coverage1 = obj1Coverage || [];
	const coverage2 = obj2Coverage || [];
	const mergedCoverage = mergeStringOrArray(coverage1, coverage2);

	const mergedDetails = {
		...obj1,
		region: mergedRegion || [],
		coverage: mergedCoverage || [],
		categories: Array.from(mergedCategories) || [],
	};
	return mergedDetails;
};

type DoesArticleExistParams = {
	region: string[];
	categories: string[];
};

export const doesArticleExist = async (
	src: string,
	{ region = [], categories = [] }: DoesArticleExistParams,
) => {
	const exists = (await getArticleBySrc(src)) as CollectionItemDocument | null;
	if (exists) {
		await checkUpdateArticleRegions(exists, region);
		await checkUpdateArticleCategories(exists, categories);
		return true;
	}
	return false;
};

export const loadAndValidateArticleMeta = async (src: string) => {
	const { title, description, image, imageAlt, type } =
		(await getMeta(src)) || {};
	if (!title) {
		// We need a better or proper check here
		// based on type / we may not always expect an image
		// BlueSky/Reddit post or some such
		return null;
	}
	// we need a transform and more data?
	// twitter:stream for instance might be a video/audio source
	return { title, description, image, imageAlt, type };
};
