import mongoose from "mongoose";
import { IContentView } from "./IContentView";
import { createContentViewSchema } from "./contentViewSchemaFactory";

const ContentViewPastHourSchema = createContentViewSchema(3600);

export const ContentViewPastHour =
	mongoose.models.ContentViewPastHour ||
	mongoose.model<IContentView>(
		"ContentViewPastHour",
		ContentViewPastHourSchema,
	);

const ContentViewPast3HoursSchema = createContentViewSchema(10800);

export const ContentViewPast3Hours =
	mongoose.models.ContentViewPast3Hours ||
	mongoose.model<IContentView>(
		"ContentViewPast3Hours",
		ContentViewPast3HoursSchema,
	);

const ContentViewPast6HoursSchema = createContentViewSchema(21600);

export const ContentViewPast6Hours =
	mongoose.models.ContentViewPast6Hours ||
	mongoose.model<IContentView>(
		"ContentViewPast6Hours",
		ContentViewPast6HoursSchema,
	);

const ContentViewPast12HoursSchema = createContentViewSchema(43200);

export const ContentViewPast12Hours =
	mongoose.models.ContentViewPast12Hours ||
	mongoose.model<IContentView>(
		"ContentViewPast12Hours",
		ContentViewPast12HoursSchema,
	);

const ContentViewPastDaySchema = createContentViewSchema(86400);

export const ContentViewPastDay =
	mongoose.models.ContentViewPastDay ||
	mongoose.model<IContentView>("ContentViewPastDay", ContentViewPastDaySchema);

const ContentViewPast3DaysSchema = createContentViewSchema(259200);

export const ContentViewPast3Days =
	mongoose.models.ContentViewPast3Days ||
	mongoose.model<IContentView>(
		"ContentViewPast3Days",
		ContentViewPast3DaysSchema,
	);

const ContentViewPastWeekSchema = createContentViewSchema(604800);

export const ContentViewPastWeek =
	mongoose.models.ContentViewPastWeek ||
	mongoose.model<IContentView>(
		"ContentViewPastWeek",
		ContentViewPastWeekSchema,
	);
