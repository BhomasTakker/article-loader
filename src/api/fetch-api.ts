import { connectToMongoDB } from "../lib/mongo/db";
import { CollectionItem } from "../types/article/item";

type FetchAPIParams<A> = {
	fetchFn: () => Promise<A>;
	itemsCallback: (object: A) => Promise<(CollectionItem | null)[]>;
};

export const fetchAPI = async <A>({
	fetchFn,
	itemsCallback,
}: FetchAPIParams<A>) => {
	try {
		await connectToMongoDB();
		const result = await fetchFn();
		const items = await itemsCallback(result);
		return items;
	} catch (err) {
		console.log(err);
		return { status: "error", message: "Error fetching data" };
	}
};
