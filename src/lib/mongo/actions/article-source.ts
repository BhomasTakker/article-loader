import ArticleSource from "../../../models/ArticleSource";

export const getArticleSourceBySource = async (src: string) => {
	return await ArticleSource.findOne({ src }).lean();
};

// get all by provider/name
