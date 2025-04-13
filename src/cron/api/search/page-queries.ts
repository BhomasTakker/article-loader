import { youtubeApiFetch } from "../../../lib/api/youtube/search";
import { logMemoryUsage } from "../../../lib/mem";
import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import { getPageByRoute } from "../../../lib/mongo/actions/page/get-page";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { IPage, WithQuery } from "../../../types/page/page";
import { CRON_TIMES } from "../../create-cron";
import { CronConfig } from "../../types";

const API_PROVIDERS = {
	ARTICLES_SEARCH_API: "articles-search-api",
	YOUTUBE_API: "youtube-api",
} as const;

type API_PROVIDERS = (typeof API_PROVIDERS)[keyof typeof API_PROVIDERS];

const apiMap = new Map<string, any>([
	[API_PROVIDERS.ARTICLES_SEARCH_API, searchArticles],
	[API_PROVIDERS.YOUTUBE_API, youtubeApiFetch],
]);

const getQueriesFromPage = ({ content }: IPage) => {
	const { components } = content;
	logMemoryUsage();
	const queries = components.map((component) => {
		const { _with } = component;
		const { query } = _with;
		return query;
	});
	return queries;
};

const executeQuery = (query: WithQuery) => {
	const { provider, params } = query;
	const api = apiMap.get(provider);
	if (!api) {
		console.error("No API found for provider:", provider);
		return Promise.resolve(null);
	}
	logMemoryUsage();
	return api(params); // 1 hour cache
};

const executeAndCacheQueriesFromPage = async (
	routes: string[],
	apis: API_PROVIDERS[]
) => {
	await connectToMongoDB();
	const pagePromises = routes.map(async (route) => {
		const pageDocument = getPageByRoute(route);
		pageDocument.then((page) => {
			if (!page) return Promise.resolve(null);
			const queries = getQueriesFromPage(page);
			const queryPromises = queries.map((query) => {
				const { provider } = query;
				if (apis.includes(provider as API_PROVIDERS) === false) {
					return Promise.resolve(null);
				}

				return executeQuery(query).then((res: any) => {
					logMemoryUsage();
				});
			});
			return Promise.all(queryPromises);
		});
	});
	await Promise.all(pagePromises);
};

export const pingApp = async (routes: string[]) => {
	logMemoryUsage();

	const promises = routes.map(async (route) => {
		return fetch(`https://datatattat.com${route}`, {
			method: "GET",
		}).catch((error) => {
			console.error("Error pinging route:", route, error);
			return Promise.reject(error);
		});
	});

	await Promise.all(promises);
	console.log("All routes pinged successfully:", routes);
	return Promise.resolve();
};

export const pageQueriesCronConfig: CronConfig = {
	id: "Search Queries",
	anyCommandsRequired: {},
	cron: [
		{
			time: "11,26,41,56 * * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage(
					["/uk", "/uk/bin-strike", "/uk/gangs-of-scotland", "/uk/spy-cops"],
					[API_PROVIDERS.ARTICLES_SEARCH_API]
				),
			onComplete: () => {},
		},
		{
			time: "12,27,42,57 * * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage(
					["/us", "/world", "/world/tariffs", "/ukraine"],
					[API_PROVIDERS.ARTICLES_SEARCH_API]
				),
			onComplete: () => {},
		},
		{
			time: "13 */6 * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage(["/uk"], [API_PROVIDERS.YOUTUBE_API]),
			onComplete: () => {},
		},
		{
			time: "14,29,44,59 * * * *",
			fetchFn: () =>
				pingApp([
					"/",
					"/uk",
					"/us",
					"/world",
					"/uk/bin-strike",
					"/uk/gangs-of-scotland",
					"/uk/spy-cops",
					"/world/tariffs",
					"/ukraine",
				]),
			onComplete: () => {},
		},
	],
};
