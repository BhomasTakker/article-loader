import { Station } from "radio-browser-api";
import { RadioBrowserAPISearchParams } from ".";
import { saveArticle } from "../save-article";
import { CollectionItem } from "../../types/article/item";
import {
	mapToBaseRegion,
	mapToRegion,
	mapToState,
} from "../../cron/radio/index";

const convertRadioBrowserStationToArticle = (
	station: Station,
	params: RadioBrowserAPISearchParams
) => {
	const {
		name,
		url,
		urlResolved,
		homepage,
		favicon,
		country,
		countryCode,
		language,
		state,
		tags,
		geoLat,
		geoLong,
		clickCount,
		clickTrend,
		votes,
	} = station;

	/////////////////////////////////////////////////
	// We map what we have to - the rest are as is
	const regionBase = mapToBaseRegion.get(country) || "world";
	const region = [regionBase, mapToRegion.get(country) || country || "world"];

	if (state) {
		const mappedState = mapToState.get(state);
		if (mappedState) {
			typeof mappedState === "string"
				? region.push(mappedState)
				: region.push(...mappedState);
		} else {
			// If we have a state that is not mapped, we can still add it
			region.push(state);
		}
	}

	// const mappedState = state ? mapToState.get(state) : null;
	/////////////////////////////////////////////////

	return {
		title: name,
		// we need a sitename link no?
		src: urlResolved || url,
		description: `Radio station from ${country} (${countryCode}) broadcasting in ${language}. Tags: ${tags.join(
			", "
		)}`,
		guid: "",
		variant: "audio",
		avatar: {
			src: favicon || "",
			alt: name,
		},
		media: {
			mediaType: "radio",
			// We would need to refresh this
			clicks: clickCount,
			clickTrend: clickTrend,
			votes: votes,
		},
		details: {
			region: [...new Set(region)],
			publishers: [name],
			categories: tags || [],
			language: language[0],
			state: state || null,
			country,
			countryCode,
			coordinates: {
				lat: geoLat || null,
				long: geoLong || null,
			},
		},
	} as CollectionItem;
};

export const radioBrowserApiCallback =
	(params: RadioBrowserAPISearchParams) => (stations: Station[]) => {
		const returnItems = stations.map((station) => {
			// manual overwrite here for now - we need to set false
			// until we come up with a proper way of management
			return saveArticle(
				convertRadioBrowserStationToArticle(station, params),
				false
			);
		});

		return Promise.all(returnItems);
	};
