import { staggerMinutes, everyNthHour, staggerSeconds } from "../cron-times";
import { CronConfig } from "../types";
import { fetchRSS, fetchYoutubeRSS } from "./utils";
import { loadSourceListsFromDB } from "./db-source-loader";
import { connectToMongoDB } from "../../lib/mongo/db";

// Cached sources loaded from database
let cachedUKNationalArticles1: any[] = [];
let cachedUKNationalArticles2: any[] = [];
let cachedUKNationalVideos: any[] = [];
let cachedUKLiveVideos: any[] = [];
let cachedUKRegionalVideos: any[] = [];
let cachedUKRegionalArticles: any[] = [];
let cachedUKRegionalArticles2: any[] = [];

// Flag to track if we're using DB sources
const USE_DB_SOURCES = true; // Set to true to load from database

/**
 * Initialize and cache all UK sources from the database
 * This runs once before cron jobs are scheduled
 */
export async function initializeUKSources() {
	if (!USE_DB_SOURCES) {
		console.log("Using hardcoded UK sources");
		return;
	}

	await connectToMongoDB();

	try {
		// Load each source list from DB
		// ukNationalArticles1 contains 3 lists: UK_1, UK_2, UK_3
		cachedUKNationalArticles1 = await loadSourceListsFromDB({
			titles: [
				"UK National Articles 1",
				"UK National Articles 2",
				"UK National Articles 3",
			],
			variant: "article",
		});

		// ukNationalArticles2 contains Scotland, Wales, Northern Ireland
		cachedUKNationalArticles2 = await loadSourceListsFromDB({
			titles: [
				"Scotland Articles",
				"Wales Articles",
				"Northern Ireland Articles",
			],
			variant: "article",
		});

		// ukNationalVideos contains UK_VIDEO and UK_VIDEO_2
		cachedUKNationalVideos = await loadSourceListsFromDB({
			titles: ["UK Video News", "UK Video News 2"],
			variant: "video",
		});

		// console.log("UK sources loaded from database successfully", {
		// 	cachedUKNationalVideosSrcs: cachedUKNationalVideos[0].sources,
		// 	ukNationalVideosSrcs: ukNationalVideos[0].sources,
		// });

		// ukLiveVideos contains UK_LIVE
		cachedUKLiveVideos = await loadSourceListsFromDB({
			titles: ["UK Live Video"], // Note: singular "Video" not "Videos"
			variant: "video",
		});

		// ukRegionalVideos contains Manchester, Liverpool, Birmingham videos
		cachedUKRegionalVideos = await loadSourceListsFromDB({
			titles: [
				"Manchester Video News",
				"Liverpool Video News",
				"Birmingham Video News",
			],
			variant: "video",
		});

		// ukRegionalArticles contains Manchester, Liverpool, Birmingham articles
		cachedUKRegionalArticles = await loadSourceListsFromDB({
			titles: [
				"Manchester Articles",
				"Liverpool Articles",
				"Birmingham Articles",
			],
			variant: "article",
		});

		// ukRegionalArticles2 contains Yorkshire
		cachedUKRegionalArticles2 = await loadSourceListsFromDB({
			titles: ["Yorkshire Articles"],
			variant: "article",
		});

		console.log("UK sources loaded from database successfully");
	} catch (error) {
		console.error("Error loading UK sources from database:", error);
		// console.log("Falling back to hardcoded sources");
	}
}

// Helper function to get the appropriate source list
function getSourceList(dbCache: any[], fallback: any[]) {
	return dbCache;
}

/**
 * Create UK RSS cron configuration
 * This function should be called AFTER initializeUKSources() to ensure cached values are populated
 */
export function createUkRssCronConfig(): CronConfig {
	return {
		id: "RSS Cron Queries",
		anyCommandsRequired: {},
		cron: [
			// {
			// 	time: staggerSeconds(30, 0),
			// 	fetchFn: fetchYoutubeRSS(cachedUKNationalVideos),
			// 	onComplete: () => {},
			// },
			{
				time: staggerMinutes(15, 0, 0),
				fetchFn: fetchRSS(cachedUKNationalArticles1),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 0, 30),
				fetchFn: fetchRSS(cachedUKNationalArticles2),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 1, 0),
				fetchFn: fetchYoutubeRSS(cachedUKNationalVideos),
				onComplete: () => {},
			},
			{
				time: everyNthHour(24, 1, 0),
				fetchFn: fetchYoutubeRSS(cachedUKLiveVideos),
				onComplete: () => {},
			},
			{
				time: everyNthHour(1, 1, 30),
				fetchFn: fetchYoutubeRSS(cachedUKRegionalVideos),
				onComplete: () => {},
			},
			{
				time: everyNthHour(1, 2, 0),
				fetchFn: fetchRSS(cachedUKRegionalArticles),
				onComplete: () => {},
			},
			{
				time: everyNthHour(1, 2, 30),
				fetchFn: fetchRSS(cachedUKRegionalArticles2),
				onComplete: () => {},
			},
		],
	};
}
