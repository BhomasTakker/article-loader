import { youtubeApiFetch } from "../../../lib/api/youtube/search";
import { logMemoryUsage } from "../../../lib/mem";
import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import {
	getPageByRoute,
	getPagesByUser,
} from "../../../lib/mongo/actions/page/get-page";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { IPage, WithQuery } from "../../../types/page/page";
import { CRON_TIMES } from "../../create-cron";
import { CronConfig } from "../../types";

require("dotenv").config();

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

const getPageRoutes = async () => {
	await connectToMongoDB();
	// Better by name - then get the id and use that.
	const USER_ID = process.env.ADMIN_USER;

	if (!USER_ID) {
		console.error("No USER_ID found in environment variables.");
		return Promise.resolve([]);
	}

	const pages = (await getPagesByUser(USER_ID)) || [];
	const pageRoutes = pages.map((page) => {
		const { route } = page;
		return route;
	});

	return pageRoutes;
};

const executeAndCacheQueriesFromPage = async (apis: API_PROVIDERS[]) => {
	await connectToMongoDB();
	const pageRoutes = await getPageRoutes();

	const pagePromises = pageRoutes.map(async (route) => {
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

export const pingApp = async (includes: string[]) => {
	logMemoryUsage();
	const pageRoutes = await getPageRoutes();

	const promises = pageRoutes.map(async (route) => {
		// A nasty little piece of logic
		// We're getting warned about too many connections
		// This is a little hopeful stop gap
		let shouldPing = false;
		if (route === "/") {
			shouldPing = true;
		}
		includes.forEach((include) => {
			if (route.includes(include)) {
				shouldPing = true;
			}
		});
		if (!shouldPing) return Promise.resolve(null);

		// console.log("Pinging route:", route);

		return fetch(`https://datatattat.com${route}`, {
			method: "GET",
		}).catch((error) => {
			console.error("Error pinging route:", route, error);
			return Promise.reject(error);
		});
	});

	await Promise.all(promises);
	console.log("All routes pinged successfully:", pageRoutes);
	return Promise.resolve();
};

export const pageQueriesCronConfig: CronConfig = {
	id: "Search Queries",
	anyCommandsRequired: {},
	cron: [
		{
			time: "11,26,41,56 * * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage([API_PROVIDERS.ARTICLES_SEARCH_API]),
			onComplete: () => {},
		},
		{
			time: "13 */6 * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage([API_PROVIDERS.YOUTUBE_API]),
			onComplete: () => {},
		},
		{
			time: "12,27,42,57 * * * *",
			fetchFn: () => pingApp(["/uk"]),
			onComplete: () => {},
		},
		{
			time: "14,29,44,59 * * * *",
			fetchFn: () => pingApp(["/us", "/world", "/pope-francis"]),
			onComplete: () => {},
		},
	],
};
