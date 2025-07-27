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
		region: [String],
		coverage: {
			type: [String],
			enum: ["international", "national", "regional", "local"],
		},
		language: String,
	},
	{ _id: false, strict: false }
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

// Add any media specific data here - i.e. video ratings, audioi duration etc
const MediaSchema = new Schema({}, { _id: false, strict: false });

const ArticleSchema = new Schema<CollectionItem>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title."],
			unique: [true, "Title must be unique"],
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
		collectionType: {
			type: String,
			default: "",
		},
		details: DetailsSchema,
		avatar: AvatarSchema,
		media: MediaSchema,
		provider: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Please provide a provider."],
			ref: "ArticleProvider",
		},
		rating: {
			type: String,
		},
		views: {
			type: String,
		},
		///// Extra types?
		duration: {
			type: Number,
		},
	},
	{ timestamps: true }
);

export default mongoose.models.Article ||
	model<CollectionItem>("Article", ArticleSchema);
