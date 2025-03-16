import { UnknownObject } from "../types/article/item";

export const addParams = (url: string, params: UnknownObject) => {
	let newUrl = new URL(url);
	Object.keys(params).forEach((key) => {
		// @ts-expect-error - dunno man hacky
		newUrl.searchParams.append(key, params[key]);
	});
	return newUrl.toString();
};
