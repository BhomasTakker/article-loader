import { Schema } from "mongoose";
import { IContentView } from "./IContentView";

export function createContentViewSchema(ttlSeconds: number) {
	const schema = new Schema<IContentView>({
		contentId: { type: Schema.Types.ObjectId, required: true, index: true },
		userId: { type: String, required: false },
		timestamp: { type: Date, required: true, default: Date.now },
	});
	schema.index({ timestamp: 1 }, { expireAfterSeconds: ttlSeconds });
	return schema;
}
