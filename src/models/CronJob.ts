import mongoose, { model, Schema } from "mongoose";
import {
	CronType,
	FetchFunction,
	TimeFunction,
	SourceVariant,
} from "../cron/types";

// Base cron job item schema
const CronJobItemSchema = new Schema(
	{
		timeFunction: {
			type: String,
			enum: Object.values(TimeFunction),
			required: true,
		},
		timeParams: {
			type: [Number],
			required: true,
		},
		fetchFunction: {
			type: String,
			enum: Object.values(FetchFunction),
			required: true,
		},
		// RSS-specific fields
		titles: {
			type: [String],
			required: false,
		},
		variant: {
			type: String,
			enum: Object.values(SourceVariant),
			required: false,
		},
		// API-specific fields
		fetchFunctionData: {
			type: Schema.Types.Mixed,
			required: false,
		},
	},
	{ _id: false, strict: false }
);

// Main CronJob schema
const CronJobSchema = new Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		type: {
			type: String,
			enum: Object.values(CronType),
			required: true,
		},
		cron: {
			type: [CronJobItemSchema],
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

export interface ICronJobItem {
	timeFunction: TimeFunction;
	timeParams: number[];
	fetchFunction: FetchFunction;
	titles?: string[];
	variant?: SourceVariant;
	fetchFunctionData?: any;
}

export interface ICronJob {
	id: string;
	type: CronType;
	cron: ICronJobItem[];
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export default mongoose.models.CronJob ||
	model<ICronJob>("CronJob", CronJobSchema);
