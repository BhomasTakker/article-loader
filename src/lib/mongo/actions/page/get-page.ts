import { HydratedDocument } from "mongoose";
import Page from "../../../../models/Page";
import { IPage } from "../../../../types/page/page";

export const getPageByRoute = async (route: string) => {
	try {
		return (await Page.findOne({ route }).lean()) as HydratedDocument<IPage>;
	} catch (err) {
		console.error("Error fetching page:", err);
		return null;
	}
};
