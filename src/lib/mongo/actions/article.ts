import Article from "../../../models/Article";
import { CollectionItem } from "../../../types/article/item";

export const getArticleBySrc = async (src: string) => {
	return await Article.findOne({ src }).lean();
};

export const saveOrCreateArticleBySrc = async (article: CollectionItem) => {
	const { src } = article;

	try {
		const res = await Article.findOneAndUpdate(
			{ src }, // find
			article, // update
			{
				new: true,
				upsert: true, // Make this update into an upsert
			}
		);

		return { result: res, message: "Saved Article!" };
	} catch (err) {
		console.error(err);
		// throw?
		return { message: "Error saving article" };
	}
};
