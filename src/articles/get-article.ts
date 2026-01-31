import { saveOrCreateArticleBySrc } from "../lib/mongo/actions/article";
import {
	doesArticleExist,
	loadAndValidateArticleMeta,
	mergeArticleDetails,
	setType,
	validateArticleData,
	ValidateArticleDataParams,
} from "./utils";
import { convertRssItem } from "./transformers/article";
import { GetArticle } from "./types";
import { CollectionItem, RSSItem } from "../types/article/item";

const rssArticleFallback = (item: RSSItem, src: string) => {
	const { title, description, image } = item;
	return {
		title,
		src,
		description: description || "",
		image: image?.link || image?.url || "",
		imageAlt:
			image?.title || "There is no alternative text provided for this image",
		type: setType({}, src),
	};
};

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

	const articleData = articleMetaData || rssArticleFallback(item, src);

	if (!validateArticleData(articleData as ValidateArticleDataParams)) {
		return null;
	}
	const { title, description, image, imageAlt, type } = articleData;
	// conversion
	const newArticle: CollectionItem = {
		title: title || "",
		src,
		description: description || "",
		guid: "",
		variant: type || "",
		details: mergedDetails,
		// We want avatar as null so we can actually filter by missing image
		// and try to load it on the client side matybe
		// if no image return undefined for avatar
		avatar: image
			? {
					src: image || "",
					alt: imageAlt || "",
				}
			: undefined,
		provider,
		feed,
		media: extraData?.media,
	};

	try {
		await saveOrCreateArticleBySrc(newArticle);
		// logMemoryUsage();
	} catch (err) {
		// console.log(`Article Load Error ${src}`);
	}

	return null;
};
