import { staggerMinutes, everyNthHour } from "../cron-times";
import { fetchPodcasts } from "../loaders/fetchPodcasts";
import { CronConfig } from "../types";
import { loadSourceListsFromDB } from "../rss/db-source-loader";
import { connectToMongoDB } from "../../lib/mongo/db";

// Cached sources loaded from database
let cachedUKBites: any[] = [];
let cachedUSBites: any[] = [];
let cachedWorldBites: any[] = [];
let cachedUKNews1: any[] = [];
let cachedUKNews2: any[] = [];
let cachedUSNews1: any[] = [];
let cachedUSNews2: any[] = [];
let cachedUSNews3: any[] = [];
let cachedUSNews4: any[] = [];
let cachedWorldNews1: any[] = [];
let cachedWorldNews2: any[] = [];

// Flag to track if we're using DB sources
const USE_DB_SOURCES = true; // Set to true to load from database

/**
 * Initialize and cache all podcast sources from the database
 * This runs once before cron jobs are scheduled
 */
export async function initializePodcastSources() {
	if (!USE_DB_SOURCES) {
		console.log("Using hardcoded podcast sources");
		return;
	}

	await connectToMongoDB();

	try {
		// Load news bites
		cachedUKBites = await loadSourceListsFromDB({
			titles: ["UK News Bites"],
			variant: "audio",
		});

		cachedUSBites = await loadSourceListsFromDB({
			titles: ["US News Bites"],
			variant: "audio",
		});

		cachedWorldBites = await loadSourceListsFromDB({
			titles: ["World News Bites"],
			variant: "audio",
		});

		// Load UK news audio
		cachedUKNews1 = await loadSourceListsFromDB({
			titles: ["UK News Audio 1"],
			variant: "audio",
		});

		cachedUKNews2 = await loadSourceListsFromDB({
			titles: ["UK News Audio 2"],
			variant: "audio",
		});

		// Load US news audio
		cachedUSNews1 = await loadSourceListsFromDB({
			titles: ["US News Audio 1"],
			variant: "audio",
		});

		cachedUSNews2 = await loadSourceListsFromDB({
			titles: ["US News Audio 2"],
			variant: "audio",
		});

		cachedUSNews3 = await loadSourceListsFromDB({
			titles: ["US News Audio 3"],
			variant: "audio",
		});

		cachedUSNews4 = await loadSourceListsFromDB({
			titles: ["US News Audio 4"],
			variant: "audio",
		});

		// Load World news audio
		cachedWorldNews1 = await loadSourceListsFromDB({
			titles: ["World News Audio 1"],
			variant: "audio",
		});

		cachedWorldNews2 = await loadSourceListsFromDB({
			titles: ["World News Audio 2"],
			variant: "audio",
		});

		console.log("Podcast sources loaded from database successfully");
	} catch (error) {
		console.error("Error loading podcast sources from database:", error);
	}
}

/**
 * Create podcast RSS cron configuration
 * This function should be called AFTER initializePodcastSources() to ensure cached values are populated
 */
export function createPodcastRssCronConfig(): CronConfig {
	return {
		id: "News",
		anyCommandsRequired: {},
		cron: [
			{
				time: staggerMinutes(15, 8, 0),
				fetchFn: fetchPodcasts(cachedUKBites),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 8, 30),
				fetchFn: fetchPodcasts(cachedUSBites),
				onComplete: () => {},
			},
			{
				time: staggerMinutes(15, 9, 0),
				fetchFn: fetchPodcasts(cachedWorldBites),
				onComplete: () => {},
			},
			// These are spiking us a little - well to 16%
			{
				time: everyNthHour(6, 9, 30),
				fetchFn: fetchPodcasts(cachedUKNews1),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 10, 0),
				fetchFn: fetchPodcasts(cachedUKNews2),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 10, 30),
				fetchFn: fetchPodcasts(cachedUSNews1),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 11, 0),
				fetchFn: fetchPodcasts(cachedUSNews2),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 11, 30),
				fetchFn: fetchPodcasts(cachedUSNews3),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 12, 0),
				fetchFn: fetchPodcasts(cachedUSNews4),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 12, 30),
				fetchFn: fetchPodcasts(cachedWorldNews1),
				onComplete: () => {},
			},
			{
				time: everyNthHour(6, 13, 0),
				fetchFn: fetchPodcasts(cachedWorldNews2),
				onComplete: () => {},
			},
		],
	};
}
