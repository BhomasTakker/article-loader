// Simple function to manually test RSS cron jobs
// Usage: Import and call this function when the server is running

import {
	fetchRSS,
	fetchYoutubeRSS,
	fetchPodcasts,
	loadSourceList,
} from "./rss/utils";
import { SourceVariant } from "./types";

export const testRssJob = async (
	titles: string[],
	variant: SourceVariant = SourceVariant.ARTICLE,
) => {
	console.log(`\n=== Testing RSS Job ===`);
	console.log(`Titles: ${titles.join(", ")}`);
	console.log(`Variant: ${variant}\n`);

	const sources = await loadSourceList(titles, variant);
	console.log(`Loaded ${sources.length} source(s)`);
	sources.forEach((source, index) => {
		console.log(`Source ${index + 1}:`, source);
		console.log("REGION FIELD LOAD SOURCES:", source.region);
	});

	const fetchFn = fetchRSS({ sources });
	const result = await fetchFn();

	console.log(`\n✓ Complete\n`);
	return result;
};
