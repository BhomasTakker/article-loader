import mongoose, { model, Schema } from "mongoose";
import { ArticleSource } from "../types/cms/ArticleSource";

const ArticleSourceSchema = new Schema<ArticleSource>(
	{
		collectionTitle: {
			type: String,
		},
		name: {
			type: String,
			required: true,
		},
		src: {
			type: String,
			required: true,
		},
		articleType: {
			type: String,
			required: true,
		},
		variant: {
			type: String,
			required: false,
			default: "",
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
		source: {
			type: String,
			default: "",
		},
	},
	{
		strict: false,
		timestamps: true,
	}
);

export default mongoose.models.ArticleSource ||
	model<ArticleSource>("ArticleSource", ArticleSourceSchema);
