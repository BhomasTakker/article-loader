import mongoose, { model, Schema } from "mongoose";
import { ArticleSourceList } from "../types/cms/ArticleSourceList";

const ArticleSourceListSchema = new Schema<ArticleSourceList>(
	{
		sources: [
			{
				type: Schema.Types.ObjectId,
				ref: "ArticleSource",
			},
		],
	},
	{
		strict: false,
		timestamps: true,
	}
);

export default mongoose.models.ArticleSourceList ||
	model<ArticleSourceList>("ArticleSourceList", ArticleSourceListSchema);
