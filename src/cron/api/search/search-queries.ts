import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { CronConfig } from "../../types";

const CACHE_TIME = 60 * 16; // 16 minutes

type SearchQuery = {
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

type PartialSearchQuery = Partial<SearchQuery>;

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

const HOMEPAGE = [
	{
		contentType: "news",
		region: "UK",
		trustHigher: "70",
		sort: "date-descending",
	},
	{
		contentType: "news",
		region: "US",
		trustHigher: "70",
		sort: "date-descending",
	},
	{
		contentType: "news",
		region: "world",
		trustHigher: "70",
		sort: "date-descending",
	},
];

const WORLD = [
	{
		query: "Trump annex Greenland invasion",
		textScore: "1",
		trustHigher: "70",
		sort: "relevance",
		limit: "7",
	},
];

const US = [
	// {
	//   region: "US",
	//   trustHigher: "70",
	//   sort: "date-descending",
	// 	limit: "50",
	// },
	{
		variant: "video",
		region: "US",
		trustHigher: "70",
		sort: "date-descending",
		limit: "50",
	},
	{
		query: "Boycott USA US",
		textScore: "1",
		contentType: "news",
		sort: "relevance",
		limit: "7",
	},
	{
		query: "Putin Trump",
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "relevance",
		limit: "7",
	},
	{
		query: "Tesla Stock Slump ",
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "relevance",
		limit: "7",
	},
];

const UK = [
	{
		variant: "video",
		region: "UK",
		trustHigher: "70",
		sort: "date-descending",
	},
	{
		vaiant: "audio",
		region: "UK",
		durationLower: "420",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: '"Spy cops"',
		textScore: "1",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: '"Spy Cops"',
		textScore: "0.7",
		variant: "audio",
		contentType: "news",
		sort: "date-descending",
		limit: "25",
	},
];

const UKRAINE = [
	{
		query: "Ukraine mineral minerals",
		textScore: "1",
		contentType: "news",
		trustHigher: "60",
		sort: "date-descending",
		limit: "7",
	},
	{
		query: "Ukraine peace Russia",
		textScore: "0",
		contentType: "news",
		trustHigher: "65",
		sort: "date-descending",
		limit: "7",
	},
	{
		query: "Ukraine",
		contentType: "news",
		trustHigher: "66",
		sort: "date-descending",
	},
	{
		query: "Ukraine",
		variant: "video",
		trustHigher: "70",
		sort: "date-descending",
	},
];

const TRADE_WAR = [
	{
		query: "200% tariff wine",
		textScore: "1",
		contentType: "news",
		sort: "relevance",
	},
	{
		query: "Canada Trade Tariffs America",
		textScore: "1",
		variant: "article",
		contentType: "news",
		trustHigher: "68",
		sort: "date-descending",
		limit: "7",
	},
	{
		query: "China Trump Tariffs",
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "relevance",
		limit: "7",
	},
	{
		query: "EU trade tariffs",
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "relevance",
		limit: "7",
	},
	{
		query: "trade tariffs trump",
		textScore: "1",
		variant: "article",
		contentType: "news",
		trustHigher: "70",
		sort: "date-descending",
		limit: "25",
	},
	{
		query: "UK Trump Trade",
		textScore: "1",
		variant: "article",
		contentType: "news",
		sort: "relevance",
		limit: "5",
	},
];

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
			fetchFn: () => triggerSearch([...HOMEPAGE, ...WORLD, ...UK]),
			onComplete: () => {},
		},
		{
			time: "12,27,42,57 * * * *",
			fetchFn: () => triggerSearch(US),
			onComplete: () => {},
		},
		{
			time: "13,28,43,58 * * * *",
			fetchFn: () => triggerSearch(UKRAINE),
			onComplete: () => {},
		},
		{
			time: "14,29,44,59 * * * *",
			fetchFn: () => triggerSearch(TRADE_WAR),
			onComplete: () => {},
		},
	],
};
