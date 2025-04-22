import mongoose, { HydratedDocument } from "mongoose";
import Page from "../../../../models/Page";
import { IPage } from "../../../../types/page/page";

export const getPagesByUser = async (userId: string) => {
	try {
		const userIdAsObjectId = new mongoose.Types.ObjectId(userId);
		const pages = await Page.find({ creator: userIdAsObjectId }).lean();
		if (!pages) return null;
		return pages as HydratedDocument<IPage>[];
	} catch (err) {
		console.error("Error fetching pages by user:", err);
		return null;
	}
};

export const getPageByRoute = async (route: string) => {
	try {
		return (await Page.findOne({ route }).lean()) as HydratedDocument<IPage>;
	} catch (err) {
		console.error("Error fetching page:", err);
		return null;
	}
};
