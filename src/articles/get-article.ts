import { saveOrCreateArticleBySrc } from "../lib/mongo/actions/article";
import {
	doesArticleExist,
	loadAndValidateArticleMeta,
	mergeArticleDetails,
} from "./utils";
import { convertRssItem } from "./transformers/article";
import { GetArticle } from "./types";

export const getArticle = async ({
	item,
	extraData,
	provider,
	feed,
}: GetArticle) => {
	// We're not doing anything with converted item - we're just getting the src and details
	const { src, details = {} } = convertRssItem(item);

	const mergedDetails = mergeArticleDetails(details, extraData || {});

	const doesExist = await doesArticleExist(src, mergedDetails);
	if (doesExist) {
		return null;
	}

	const articleMetaData = await loadAndValidateArticleMeta(src);
	if (!articleMetaData) {
		return null;
	}

	const { title, description, image, imageAlt, type } = articleMetaData;

	// conversion
	const newArticle = {
		title,
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		details: mergedDetails,
		// We want avatar as null so we can actually filter by missing image
		// and try to load it on the client side matybe
		avatar: {
			src: image || "",
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
