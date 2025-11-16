import mongoose, { model, Schema } from "mongoose";
import { ArticleSourceList } from "../types/cms/ArticleSourceList";

const ArticleSourceListSchema = new Schema<ArticleSourceList>(
	{
		title: {
			type: String,
			required: true,
		},
		articleType: {
			type: String,
			required: true,
		},
		categories: {
			type: [String],
			required: true,
		},
		region: {
			type: [String],
			required: true,
		},
		coverage: {
			type: [String],
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
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
