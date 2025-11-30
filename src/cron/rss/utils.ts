import { fetchArticles } from "../../articles/fetch-articles";
import { fetchPodcastArticles } from "../../articles/fetch-podcast-articles";
import { fetchYoutubeArticles } from "../../articles/fetch-youtube-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import {
	getCollection,
	getPodcastCollection,
	getYoutubeCollection,
} from "../../collections/get-collection";
import { connectToMongoDB } from "../../lib/mongo/db";
import { fetchRadioStations } from "../radio/radio-cron";
import { FetchFunction, SourceVariant } from "../types";
import { loadSourceListsFromDB } from "./db-source-loader";

export const loadSourceList = async (
	articles: string[],
	sourceVariant: SourceVariant
) => {
	await connectToMongoDB();
	return await loadSourceListsFromDB({
		titles: articles,
		variant: sourceVariant,
	});
};

export const fetchRSS = (srcs: any[]) =>
	fetchCollections({
		sources: srcs, //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

export const fetchYoutubeRSS = (srcs: any[]) =>
	fetchCollections({
		sources: [...srcs],
		feedCallback: getYoutubeCollection,
		itemsCallback: fetchYoutubeArticles,
		customFields: {
			// item: [["media:group", "media", { keepArray: false }]],
			item: ["media:group"],
		},
	});

export const fetchPodcasts = (srcs: any[]) =>
	fetchCollections({
		sources: [...srcs],
		feedCallback: getPodcastCollection,
		itemsCallback: fetchPodcastArticles,
	});

const functionMap = new Map<string, Function>([
	[FetchFunction.RSS, fetchRSS],
	[FetchFunction.YoutubeRSS, fetchYoutubeRSS],
	[FetchFunction.Podcasts, fetchPodcasts],
	[FetchFunction.RadioScripts, fetchRadioStations],
]);

export function getFetchFunction(
	funcName: string
): (...args: any[]) => Promise<any> {
	return functionMap.get(funcName) as (...args: any[]) => Promise<any>;
}
