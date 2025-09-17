import { Station } from "radio-browser-api";
import { fetchAPI } from "../../api/fetch-api";
import { fetchNewsRadioStations } from "../../api/radio-browser";
import { radioBrowserApiCallback } from "../../api/radio-browser/callback";
import { UnknownObject } from "../../types/article/item";

type Options = UnknownObject;
export const runScripts = async (options: Options) => {
	// Example params for fetching radio stations
	const params = {
		tag: "news",
		limit: 25,
		// country: "The United Kingdom Of Great Britain And Northern Ireland",
		order: "votes",
		// This is a common pattern to ensure we get the most popular stations first
		reverse: true,
		hideBroken: true,
		language: "english",
		...options,
	};

	await fetchAPI<Station[]>({
		fetchFn: () => fetchNewsRadioStations(params),
		itemsCallback: radioBrowserApiCallback(params),
	});
};
