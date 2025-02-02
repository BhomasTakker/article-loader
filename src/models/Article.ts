import mongoose, { model, Schema } from "mongoose";
import { CollectionItem } from "../types/article/item";

const DetailsSchema = new Schema(
	{
		docs: {
			type: [String],
		},
		categories: {
			type: [String],
		},
		authors: {
			type: [String],
		},
		publishers: {
			type: [String],
		},
		published: {
			type: Date,
		},
		modified: {
			type: Date,
		},
	},
	{ _id: false }
);

const AvatarSchema = new Schema(
	{
		src: {
			type: String,
			required: [true, "Please provide a src."],
		},
		alt: {
			type: String,
			default: "We apologize, but the image has no alt text available.",
		},
	},
	{ _id: false }
);

const ArticleSchema = new Schema<CollectionItem>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title."],
		},
		src: {
			type: String,
			required: [true, "Please provide a src."],
		},
		description: {
			type: String,
		},
		guid: {
			type: String,
		},
		variant: {
			type: String,
			default: "",
		},
		details: DetailsSchema,
		avatar: AvatarSchema,
	},
	{ timestamps: true }
);

export default mongoose.models.Article ||
	model<CollectionItem>("Article", ArticleSchema);
