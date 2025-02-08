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

		console.log(`Saved Article Collection: ${feed}`);

		return { result: res, message: "Saved Article Collection!" };
	} catch (err) {
		// console.error(err);
		// throw?
		console.log(`Error Article Collection: ${feed}`);
		return { message: "Error saving article collection" };
	}
};
