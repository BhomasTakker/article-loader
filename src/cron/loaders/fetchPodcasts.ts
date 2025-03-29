import { SourceObject } from "../../../sources/news/articles/types";
import { fetchPodcastArticles } from "../../articles/fetch-podcast-articles";
import { fetchCollections } from "../../collections/fetch-collections";
import { getPodcastCollection } from "../../collections/get-collection";
import { connectToMongoDB } from "../../lib/mongo/db";

export const fetchPodcasts = (sources: SourceObject[]) => async () => {
	await connectToMongoDB();
	await fetchCollections({
		sources, //, US, WORLD
		feedCallback: getPodcastCollection,
		itemsCallback: fetchPodcastArticles,
	})();
};
