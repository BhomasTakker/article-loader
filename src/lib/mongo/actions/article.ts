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
			}
		);

		return { message: "Saved Article!" };
	} catch (err) {
		console.error(err);
		// throw?
		return { message: "Error saving article" };
	}
};

export const getArticleExists = async (src: string) => {
	const exists = await Article.exists({ src });
	return exists;
};
