import mongoose, { model, Schema } from "mongoose";
import { RSSArticleCollection } from "../types/rss";

const ImageSchema = new Schema(
	{
		src: {
			type: String,
			required: [true, "Please provide a src."],
		},
		alt: {
			type: String,
			default: "We apologize, but the image has no alt text available.",
		},
		link: {
			type: String,
		},
	},
	{ _id: false }
);

const ArticleCollectionSchema = new Schema<RSSArticleCollection>(
	{
		title: {
			type: String,
		},
		description: {
			type: String,
		},
		link: {
			type: String,
		},
		// no sure how to handle this
		// We want to save different item types?
		items: {
			type: [Schema.Types.Mixed as any],
			required: [true, "Please provide items."],
		},
		lastBuildDate: {
			type: Date,
		},
		image: {
			type: ImageSchema,
		},
		feed: {
			type: String,
		},
		collectionType: {
			type: String,
			default: "",
		},
		provider: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, "Please provide a provider."],
			ref: "ArticleProvider",
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// TTL index: documents will expire 24 hours after last update
ArticleCollectionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.models.ArticleCollection ||
	model<RSSArticleCollection>("ArticleCollection", ArticleCollectionSchema);
