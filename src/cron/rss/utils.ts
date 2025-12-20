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
import { SourceObject } from "../../types/types";
import { cachePageQueries, pingRoutes } from "../api/search/page-queries";
import { fetchRadioStations } from "../radio/radio-cron";
import { FetchFunction, FetchFunctionProps, SourceVariant } from "../types";
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
export type FetchCollectionsArgs = {
	sources: SourceObject[];
};

export const fetchRSS = ({ sources }: FetchCollectionsArgs) =>
	fetchCollections({
		sources: sources, //, US, WORLD
		feedCallback: getCollection,
		itemsCallback: fetchArticles,
	});

export const fetchYoutubeRSS = ({ sources }: FetchCollectionsArgs) =>
	fetchCollections({
		sources: [...sources],
		feedCallback: getYoutubeCollection,
		itemsCallback: fetchYoutubeArticles,
		customFields: {
			// item: [["media:group", "media", { keepArray: false }]],
			item: ["media:group"],
		},
	});

export const fetchPodcasts = ({ sources }: FetchCollectionsArgs) =>
	fetchCollections({
		sources: [...sources],
		feedCallback: getPodcastCollection,
		itemsCallback: fetchPodcastArticles,
	});

// We need to convert each function - or api function - into taking a single argument - an object
const functionMap = new Map<string, Function>([
	[FetchFunction.RSS, fetchRSS],
	[FetchFunction.YoutubeRSS, fetchYoutubeRSS],
	[FetchFunction.Podcasts, fetchPodcasts],
	[FetchFunction.RadioScripts, fetchRadioStations],
	[FetchFunction.PageQueries, cachePageQueries],
	[FetchFunction.PingRoutes, pingRoutes],
]);

export function getFetchFunction(
	funcName: string
): (args: FetchFunctionProps) => Promise<any> {
	return functionMap.get(funcName) as (
		args: FetchFunctionProps
	) => Promise<any>;
}
