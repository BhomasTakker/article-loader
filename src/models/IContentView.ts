import { Types, Document } from "mongoose";

export interface IContentView extends Document {
	contentId: Types.ObjectId;
	userId?: string;
	timestamp: Date;
}
