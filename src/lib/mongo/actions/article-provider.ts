import ArticleProvider from "../../../models/ArticleProvider";
import { ProviderItem } from "../../../types/article/provider";

export const getArticleProviderByName = async (name: string) => {
	return await ArticleProvider.findOne({ name }).lean();
};

export const getArticleProviderByNameFuzzy = async (name: string) => {
	// Case-insensitive partial match - supports "bbc", "BBC", "BBC News", etc.
	return await ArticleProvider.findOne({
		name: { $regex: new RegExp(name, "i") },
	}).lean();
};

export const getArticleProviderByDomain = async (domain: string) => {
	return await ArticleProvider.findOne({ url: domain }).lean();
};

export const saveOrCreateArticleProviderByName = async (
	provider: ProviderItem
) => {
	const { name } = provider;

	try {
		return ArticleProvider.updateOne(
			{ name }, // find
			provider, // update
			{
				new: true,
				upsert: true, // Make this update into an upsert
			}
		);
	} catch (err) {
		console.error(err);
		return { message: "Error saving article provider" };
	}
};
