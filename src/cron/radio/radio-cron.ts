import { Station } from "radio-browser-api";
import { fetchAPI } from "../../api/fetch-api";
import { fetchNewsRadioStations } from "../../api/radio-browser";
import { radioBrowserApiCallback } from "../../api/radio-browser/callback";

export type Options = {
	limit?: number;
	offset?: number;
	tag?: string;
	order?: string;
	reverse?: boolean;
	hideBroken?: boolean;
	language?: string;
};

export type FetchRadioStationsArgs = { options: Options };

export const fetchRadioStations =
	(args: FetchRadioStationsArgs) => async () => {
		const { options } = args;
		runScripts(options);
	};

export const runScripts = async (options: Options) => {
	// Example params for fetching radio stations
	const params = {
		tag: "news",
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
