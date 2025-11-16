import { CronConfig } from "../types";
import { fetchRSS, fetchYoutubeRSS } from "./utils";
import { staggerMinutes, staggerSeconds } from "../cron-times";
import { loadSourceListsFromDB } from "./db-source-loader";
import { connectToMongoDB } from "../../lib/mongo/db";

// Cached sources loaded from database
let cachedUSArticles1: any[] = [];
let cachedUSArticles2: any[] = [];
let cachedWorldArticles1: any[] = [];
let cachedWorldArticles2: any[] = [];
let cachedWorldArticles3: any[] = [];
let cachedNewYorkArticles: any[] = [];
let cachedNewYorkVideos: any[] = [];
let cachedFloridaArticles: any[] = [];
let cachedFloridaVideos: any[] = [];
let cachedVideos: any[] = [];

// Flag to track if we're using DB sources
const USE_DB_SOURCES = true; // Set to true to load from database

/**
 * Initialize and cache all RSS sources from the database
 * This runs once before cron jobs are scheduled
 */
export async function initializeRSSSources() {
	if (!USE_DB_SOURCES) {
		console.log("Using hardcoded RSS sources");
		return;
	}

	await connectToMongoDB();

	try {
		// Load US articles
		cachedUSArticles1 = await loadSourceListsFromDB({
			titles: ["US National Articles 1", "US National Articles 2"],
			variant: "article",
		});

		cachedUSArticles2 = await loadSourceListsFromDB({
			titles: [
				"US National Articles 3",
				"US National Articles 4",
				"US National Articles 5",
			],
			variant: "article",
		});

		// Load World articles
		cachedWorldArticles1 = await loadSourceListsFromDB({
			titles: ["World Articles 1", "World Articles 2"],
			variant: "article",
		});

		cachedWorldArticles2 = await loadSourceListsFromDB({
			titles: ["World Articles 3", "World Articles 4", "World Articles 5"],
			variant: "article",
		});

		cachedWorldArticles3 = await loadSourceListsFromDB({
			titles: ["World Articles 5", "World Articles 6", "World Articles 7"],
			variant: "article",
		});

		// Load regional sources
		cachedNewYorkArticles = await loadSourceListsFromDB({
			titles: ["New York Articles"],
			variant: "article",
		});

		cachedNewYorkVideos = await loadSourceListsFromDB({
			titles: ["New York Video News"],
			variant: "video",
		});

		cachedFloridaArticles = await loadSourceListsFromDB({
			titles: ["Florida Articles"],
			variant: "article",
		});

		cachedFloridaVideos = await loadSourceListsFromDB({
			titles: ["Florida Video News"],
			variant: "video",
		});

		// Load all video sources
		cachedVideos = await loadSourceListsFromDB({
			titles: [
				"US Video News",
				"US Video News 2",
				"US Live Video",
				"World Video News",
				"World Video News 2",
				"World Live Video",
			],
			variant: "video",
		});

		console.log("RSS sources loaded from database successfully");
	} catch (error) {
		console.error("Error loading RSS sources from database:", error);
	}
}

/**
 * Create RSS cron configuration
 * This function should be called AFTER initializeRSSSources() to ensure cached values are populated
 */
export function createRssCronConfig(): CronConfig {
	return {
		id: "RSS Cron Queries",
		anyCommandsRequired: {},
		cron: [
			// {
			// 	time: staggerSeconds(30, 0),
			// 	fetchFn: fetchRSS(cachedUSArticles1),
			// 	onComplete: () => {},
			// },
			{
				time: staggerMinutes(15, 3, 0),
				fetchFn: fetchRSS(cachedUSArticles1),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 3, 30),
				fetchFn: fetchRSS(cachedUSArticles2),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 4, 0),
				fetchFn: fetchRSS(cachedWorldArticles1),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 4, 30),
				fetchFn: fetchRSS(cachedWorldArticles2),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 5),
				fetchFn: fetchRSS(cachedWorldArticles3),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(30, 5, 30),
				fetchFn: fetchRSS(cachedNewYorkArticles),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(30, 6, 0),
				fetchFn: fetchYoutubeRSS(cachedNewYorkVideos),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(30, 6, 30),
				fetchFn: fetchRSS(cachedFloridaArticles),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(30, 6, 0),
				fetchFn: fetchYoutubeRSS(cachedFloridaVideos),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 7, 0),
				fetchFn: fetchYoutubeRSS(cachedVideos),
				onComplete: () => {},
			},
		],
	};
}
