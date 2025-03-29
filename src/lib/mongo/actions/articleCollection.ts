import ArticleCollection from "../../../models/ArticleCollection";
import { RSSArticleCollection } from "../../../types/rss";
import { logMemoryUsage } from "../../mem";

export const getArticleCollectionByFeed = async (feed: string) => {
	return await ArticleCollection.findOne({ feed }).lean();
};

export const saveOrCreateArticleCollectionByFeed = async (
	collection: RSSArticleCollection
) => {
	const { feed, link = "" } = collection;

	try {
		const res = await ArticleCollection.findOneAndUpdate(
			{ feed }, // find
			collection, // update
			{
				new: true,
				upsert: true, // Make this update into an upsert
			}
		);

		// logMemoryUsage();
		console.log(`Saved Article Collection: ${feed}`);

		return { result: res, message: "Saved Article Collection!" };
	} catch (err) {
		return { message: "Error saving article collection" };
	}
};
