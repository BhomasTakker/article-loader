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
		logMemoryUsage();
		const res = await ArticleCollection.findOneAndUpdate(
			{ feed }, // find
			collection, // update
			{
				new: true,
				upsert: true, // Make this update into an upsert
			}
		);
		logMemoryUsage();
		// if _updatedAt is old then we can assume that the collection is not new
		// We don't need to load the collection addingto db etc
		// logMemoryUsage();
		console.log(`Saved Article Collection: ${feed}`);

		return { result: res, message: "Saved Article Collection!" };
	} catch (err) {
		return { message: "Error saving article collection" };
	}
};
