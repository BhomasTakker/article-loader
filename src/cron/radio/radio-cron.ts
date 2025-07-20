import { Station } from "radio-browser-api";
import { fetchAPI } from "../../api/fetch-api";
import { fetchNewsRadioStations } from "../../api/radio-browser";
import { radioBrowserApiCallback } from "../../api/radio-browser/callback";
import { CRON_TIMES } from "../create-cron";
import { CronConfig } from "../types";
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
	// const count = Array.isArray(result) ? result.length : 0;
	// console.dir(result, { depth: null, colors: true });
	// console.log("Fetched radio stations:", { count });
};

// A little random list of countries / We need what we use and double check the api
const countries = {
	UK: "The United Kingdom Of Great Britain And Northern Ireland",
	US: "The United States Of America",
	Canada: "Canada",
	NewZealand: "New Zealand",
	Australia: "Australia",
	Palestine: "State Of Palestine",
	Ireland: "Ireland",
	Greenland: "Greenland",
	Israel: "Israel",
	Iran: "Islamic Republic Of Iran",
	France: "France",
	Germany: "Germany",
	Japan: "Japan",
	Russia: "Russian Federation",
	China: "China",
	Italy: "Italy",
	Spain: "Spain",
	Sweden: "Sweden",
	Netherlands: "Netherlands",
	Belgium: "Belgium",
	Switzerland: "Switzerland",
	Finland: "Finland",
	Denmark: "Denmark",
	Portugal: "Portugal",
	Poland: "Poland",
	Brazil: "Brazil",
	Qatar: "Qatar",
	India: "India",
	UAE: "United Arab Emirates",
	Argentina: "Argentina",
	Chile: "Chile",
	Colombia: "Colombia",
	Venezuela: "Venezuela",
	Mexico: "Mexico",
	Peru: "Peru",
	Indonesia: "Indonesia",
	Malaysia: "Malaysia",
	Singapore: "Singapore",
	Philippines: "Philippines",
	SouthAfrica: "South Africa",
	Thailand: "Thailand",
	Turkey: "Turkey",
	Vietnam: "Vietnam",
	Ukraine: "Ukraine",
} as const;

// A little hack to assign to region
export const mapToBaseRegion = new Map<string, string>([
	[countries.UK, "UK"],
	[countries.US, "US"],
	[countries.Canada, "world"],
	[countries.NewZealand, "world"],
	[countries.Australia, "world"],
	[countries.Palestine, "world"],
	[countries.Ireland, "world"],
	[countries.Greenland, "world"],
	[countries.Iran, "world"],
]);

export const mapToRegion = new Map([
	[countries.UK, "UK"],
	[countries.US, "US"],
]);

export const RADIO_CRON_CONFIG: CronConfig = {
	id: "RSS Cron Queries",
	anyCommandsRequired: {},
	cron: [
		// {
		// 	// TEST DO NOT KEEP!!!!!!!!!!!!!!!!!!!!
		// 	time: CRON_TIMES.seconds_30,
		// 	fetchFn: () => runScripts({ limit: 100, offset: 400 }),
		// 	onComplete: () => {},
		// },
		{
			time: CRON_TIMES.days_7,
			fetchFn: () => runScripts({ limit: 100, offset: 0 }),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.days_7_1,
			fetchFn: () => runScripts({ limit: 100, offset: 100 }),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.days_7_2,
			fetchFn: () => runScripts({ limit: 100, offset: 200 }),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.days_7_3,
			fetchFn: () => runScripts({ limit: 100, offset: 300 }),
			onComplete: () => {},
		},
		{
			time: CRON_TIMES.days_7_4,
			fetchFn: () => runScripts({ limit: 100, offset: 400 }),
			onComplete: () => {},
		},
	],
};
