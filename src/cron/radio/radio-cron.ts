import { Station } from "radio-browser-api";
import { fetchAPI } from "../../api/fetch-api";
import { fetchNewsRadioStations } from "../../api/radio-browser";
import { radioBrowserApiCallback } from "../../api/radio-browser/callback";
import { CronConfig } from "../types";
import { UnknownObject } from "../../types/article/item";
import { everyNDays } from "../cron-times";

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
	Tanzania: "United Republic Of Tanzania",
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
]);

export const mapToRegion = new Map<string, string>([
	[countries.UK, "UK"],
	[countries.US, "US"],
	[countries.Tanzania, "Tanzania"],
]);

// Just add the ones you see
export const mapToState = new Map<string, string | string[]>([
	["New York NY", "New York"],
	["New London NH", ["New London", "New Hampshire"]],
	["Tampa, Florida", ["Tampa", "Florida"]],
	["Coconut Creek, Florida 33073", ["Coconut Creek", "Florida"]],
	["Florida, Clearwater", ["Clearwater", "Florida"]],
	["Florida, Ft. Lauderdale", ["Ft. Lauderdale", "Florida"]],
	["Florida, Largo", ["Largo", "Florida"]],
	["Florida, Miami", ["Miami", "Florida"]],
	["Florida, Miami, MP3, 192 kbits", ["Miami", "Florida"]],
	["Florida, Pmpano Beach,", ["Pmpano Beach", "Florida"]],
	["Florida, Ocala", ["Ocala", "Florida"]],
	["Hollywood, Florida", ["Hollywood", "Florida"]],
	["Key West Florida", ["Key West", "Florida"]],
	["Miami, Florida", ["Miami", "Florida"]],
	["Orlando, Florida", ["Orlando", "Florida"]],
	["Palma Sola, Florida", ["Palma Sola", "Florida"]],
	["Port St. Lucie, Florida", ["Port St. Lucie", "Florida"]],
	["Tallahassee Florida", ["Tallahassee", "Florida"]],
	["Tampa Florida", ["Tampa", "Florida"]],
	["The Villages, Florida", ["The Villages", "Florida"]],
	["Weeki Wachee, Florida", ["Weeki Wachee", "Florida"]],
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
			time: everyNDays({ day: 7, hour: 0, minute: 14 }),
			fetchFn: () => runScripts({ limit: 100, offset: 0 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 28 }),
			fetchFn: () => runScripts({ limit: 100, offset: 100 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 42 }),
			fetchFn: () => runScripts({ limit: 100, offset: 200 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 0, minute: 56 }),
			fetchFn: () => runScripts({ limit: 100, offset: 300 }),
			onComplete: () => {},
		},
		{
			time: everyNDays({ day: 7, hour: 1, minute: 14 }),
			fetchFn: () => runScripts({ limit: 100, offset: 400 }),
			onComplete: () => {},
		},
	],
};
