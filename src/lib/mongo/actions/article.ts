import Article from "../../../models/Article";
import { CollectionItem } from "../../../types/article/item";

export const getArticleBySrc = async (src: string) => {
	return await Article.findOne({ src }).lean();
};

export const saveOrCreateArticleBySrc = async (article: CollectionItem) => {
	const { src } = article;

	try {
		await Article.updateOne(
			{ src }, // find
			{ $set: article }, // update only specified fields
			{
				new: true,
				upsert: true, // Make this update into an upsert
			},
		);

		return { message: "Saved Article!" };
	} catch (err) {
		console.error(err);
		// throw?
		return { message: "Error saving article" };
	}
};

// pass in set? - or id - then update given - i.e. categories, region, coverage
export const updateArticleRegions = async (id: string, regions: string[]) => {
	try {
		await Article.updateOne(
			{ _id: id },
			{ $set: { "details.region": regions } },
		);
		return { message: "Updated Article Regions!" };
	} catch (err) {
		return { message: "Error updating article regions" };
	}
};

export const updateArticleCategories = async (
	id: string,
	categories: string[],
) => {
	try {
		await Article.updateOne(
			{ _id: id },
			{ $set: { "details.categories": categories } },
		);
		return { message: "Updated Article Categories!" };
	} catch (err) {
		return { message: "Error updating article categories" };
	}
};

export const getArticleExists = async (src: string) => {
	const exists = await Article.exists({ src });
	return exists;
};
