import ArticleCollection from "../../../models/ArticleCollection";
import { RSSArticleCollection } from "../../../types/rss";

export const getArticleCollectionByFeed = async (feed: string) => {
	return await ArticleCollection.findOne({ feed }).lean();
};

export const saveOrCreateArticleCollectionByFeed = async (
	collection: RSSArticleCollection
) => {
	const { feed } = collection;

	try {
		const res = await ArticleCollection.findOneAndUpdate(
			{ feed }, // find
			collection, // update
			{
				new: true,
				upsert: true, // Make this update into an upsert
			}
		);

		console.log(res);

		return { result: res, message: "Saved Article Collection!" };
	} catch (err) {
		console.error(err);
		// throw?
		return { message: "Error saving article collection" };
	}
};
