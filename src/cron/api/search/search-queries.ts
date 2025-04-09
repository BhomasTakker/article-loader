import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { CronConfig } from "../../types";
import { BINDEPENDENCE_DAY, GANGS_SCOTLAND, MAIN_UK, SPY_COPS } from "./Uk";
import { MAIN_UKRAINE } from "./ukraine";
import { MAIN_US } from "./us";
import { MAIN_WORLD, TRADE_WAR } from "./world";

const CACHE_TIME = 60 * 16; // 16 minutes

export type SearchQuery = {
	query: string;
	textScore: string;
	variant: string;
	contentType: string;
	durationHigher: string;
	durationLower: string;
	region: string;
	origin: string;
	language: string;
	before: string;
	after: string;
	provider: string;
	trustHigher: string;
	trustLower: string;
	leaningHigher: string;
	leaningLower: string;
	sort: string;
	limit: string;
};

export type PartialSearchQuery = Partial<SearchQuery>;

const EMPTY: SearchQuery = {
	query: "",
	textScore: "",
	variant: "",
	contentType: "",
	durationHigher: "",
	durationLower: "",
	region: "",
	origin: "",
	language: "",
	before: "",
	after: "",
	provider: "",
	trustHigher: "",
	trustLower: "",
	leaningHigher: "",
	leaningLower: "",
	sort: "",
	limit: "",
};

const DEFAULT: PartialSearchQuery = {
	variant: "article",
	limit: "50",
};

const createQuery = (query: PartialSearchQuery) => {
	// currently we need to be inorder...
	const newQuery = { ...EMPTY, ...DEFAULT, ...query };
	const {
		query: q,
		textScore,
		variant,
		contentType,
		durationHigher,
		durationLower,
		region,
		origin,
		language,
		before,
		after,
		provider,
		trustHigher,
		trustLower,
		leaningHigher,
		leaningLower,
		sort,
		limit,
	} = newQuery;
	return {
		query: q,
		textScore,
		variant,
		contentType,
		durationHigher,
		durationLower,
		region,
		origin,
		language,
		before,
		after,
		provider,
		trustHigher,
		trustLower,
		leaningHigher,
		leaningLower,
		sort,
		limit,
	};
};

const triggerSearch = async (queries: any) => {
	await connectToMongoDB();

	queries.forEach((query: PartialSearchQuery) => {
		searchArticles(createQuery(query), CACHE_TIME)
			.then(() => {
				console.log("Search Results loaded");
			})
			.catch((err) => {
				console.error("Search Error:", err);
			});
	});
};

export const searchCronConfig: CronConfig = {
	id: "Search Queries",
	anyCommandsRequired: {},
	cron: [
		{
			// time: CRON_TIMES.seconds_30,
			time: "11,26,41,56 * * * *",
			fetchFn: () =>
				triggerSearch([...MAIN_UK, ...BINDEPENDENCE_DAY, ...GANGS_SCOTLAND]),
			onComplete: () => {},
		},
		{
			time: "12,27,42,57 * * * *",
			fetchFn: () => triggerSearch([...MAIN_US, ...SPY_COPS]),
			onComplete: () => {},
		},
		{
			time: "13,28,43,58 * * * *",
			fetchFn: () => triggerSearch([...MAIN_WORLD, ...TRADE_WAR]),
			onComplete: () => {},
		},
		{
			time: "14,29,44,59 * * * *",
			fetchFn: () => triggerSearch([...MAIN_UKRAINE]),
			onComplete: () => {},
		},
	],
};
