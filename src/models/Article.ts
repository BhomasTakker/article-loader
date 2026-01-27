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
	{ _id: false, strict: false },
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
	{ _id: false },
);

// Add any media specific data here - i.e. video ratings, audioi duration etc
const MediaSchema = new Schema({}, { _id: false, strict: false });

const ArticleSchema = new Schema<CollectionItem>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title."],
		},
		src: {
			type: String,
			required: [true, "Please provide a src."],
			unique: true,
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
		media: MediaSchema,
		provider: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Please provide a provider."],
			ref: "ArticleProvider",
		},
		feed: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Please provide a source feed."],
			ref: "ArticleSource",
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
		// Management fields
		disabled: {
			type: Boolean,
			default: false,
		},
		// We would like to be able to remove error articles after a certain time
		// ttl: {
		// 	type: Number, // Time-to-live in seconds or timestamp
		// },
	},
	{ timestamps: true },
);

export default mongoose.models.Article ||
	model<CollectionItem>("Article", ArticleSchema);
