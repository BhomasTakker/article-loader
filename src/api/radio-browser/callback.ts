import { Station } from "radio-browser-api";
import { RadioBrowserAPISearchParams } from ".";
import { saveArticle } from "../save-article";
import { CollectionItem } from "../../types/article/item";

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

	return {
		title: name,
		// we need a sitename link no?
		src: urlResolved || url,
		description: `Radio station from ${country} (${countryCode}) broadcasting in ${language}. Tags: ${tags.join(
			", "
		)}`,
		guid: "",
		variant: "audio",
		collectionType: "",
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
			publishers: [name],
			categories: tags || [],
			language: language[0],
			state,
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
			return saveArticle(convertRadioBrowserStationToArticle(station, params));
		});

		return Promise.all(returnItems);
	};
