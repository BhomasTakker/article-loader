import { CollectionItemDocument } from "../types/article/item";
import {
	getArticleBySrc,
	saveOrCreateArticleBySrc,
} from "../lib/mongo/actions/article";
import { getMeta } from "../html/get-meta";
import { mergeStringOrArray } from "../utils";
import {
	checkUpdateArticleCategories,
	checkUpdateArticleRegions,
} from "./utils";
import { convertRssItem } from "./transformers/article";
import { GetArticle } from "./types";

// Needs major refactor
// We're doing unnecessary work here
// convert to required format
// get article data from meta
export const getArticle = async ({
	item,
	extraData,
	provider,
	feed,
}: GetArticle) => {
	// We're not doing anything with converted item - we're just getting the src and details
	const { src, details = {} } = convertRssItem(item);
	const { region, coverage = [], language, categories = [] } = extraData || {};

	///////////////////////////
	// Merge details
	// Do elsewhere and prbably check performance.....
	const mergedCategories = new Set([
		...(details.categories || []),
		...categories,
	]);

	const region1 = details?.region || [];
	const region2 = region || [];
	const mergedRegion = mergeStringOrArray(region1, region2);

	const coverage1 = details?.coverage || [];
	const coverage2 = coverage || [];
	const mergedCoverage = mergeStringOrArray(coverage1, coverage2);

	const mergedDetails = {
		...details,
		region: mergedRegion,
		coverage: mergedCoverage,
		language,
		categories: Array.from(mergedCategories),
	};
	///////////////////////////

	// get by source if exists check update
	const exists = (await getArticleBySrc(src)) as CollectionItemDocument | null;
	if (exists) {
		await checkUpdateArticleRegions(exists, mergedRegion);
		await checkUpdateArticleCategories(exists, Array.from(mergedCategories));
		// console.log(`Article Exists ${src}`);
		return null;
	}

	const { title, description, image, imageAlt, type } =
		(await getMeta(src)) || {};

	// checks
	if (!title || !image) {
		// We need a better or proper check here
		// based on type / we may not always expect an image
		// BlueSky post or some such
		// console.log(`Check Failed - Do not save ${src}`);
		return null;
	}

	// conversion
	const newArticle = {
		title,
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		details: mergedDetails,
		avatar: {
			src: image,
			alt: imageAlt || "",
		},
		...extraData,
		provider,
		feed,
	};

	try {
		saveOrCreateArticleBySrc(newArticle);
		// logMemoryUsage();
	} catch (err) {
		// console.log(`Article Load Error ${src}`);
	}

	return null;
};
