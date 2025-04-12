import { youtubeApiFetch } from "../../../lib/api/youtube/search";
import { logMemoryUsage } from "../../../lib/mem";
import { searchArticles } from "../../../lib/mongo/actions/articles/search";
import { getPageByRoute } from "../../../lib/mongo/actions/page/get-page";
import { connectToMongoDB } from "../../../lib/mongo/db";
import { IPage, WithQuery } from "../../../types/page/page";
import { CRON_TIMES } from "../../create-cron";
import { CronConfig } from "../../types";

const apiMap = new Map<string, any>([
	["articles-search-api", searchArticles],
	["youtube-api", youtubeApiFetch],
]);

const getQueriesFromPage = ({ content }: IPage) => {
	const { components } = content;
	logMemoryUsage();
	console.log("getQueriesFromPage");
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

const executeAndCacheQueriesFromPage = async (routes: string[]) => {
	await connectToMongoDB();
	const pagePromises = routes.map(async (route) => {
		const pageDocument = getPageByRoute(route);
		pageDocument.then((page) => {
			if (!page) return Promise.resolve(null);
			const queries = getQueriesFromPage(page);
			const queryPromises = queries.map((query) => {
				return executeQuery(query).then((res: any) => {
					logMemoryUsage();
				});
			});
			return Promise.all(queryPromises);
		});
	});
	await Promise.all(pagePromises);
	console.log("All queries executed and cached.", { pagePromises });
	console.table(pagePromises);
};

export const pingApp = async () => {
	logMemoryUsage();
	try {
		await fetch("https://datatattat.com", {
			method: "GET",
		});
	} catch (error) {
		console.error("Error pinging app:", error);
		return Promise.reject(error);
	}

	logMemoryUsage();
	return Promise.resolve();
};

export const pageQueriesCronConfig: CronConfig = {
	id: "Search Queries",
	anyCommandsRequired: {},
	cron: [
		{
			time: "11,26,41,56 * * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage([
					"/uk",
					"/uk/bin-strike",
					"/uk/gangs-of-scotland",
					"/uk/spy-cops",
				]),
			onComplete: () => {},
		},
		{
			time: "12,27,42,57 * * * *",
			fetchFn: () =>
				executeAndCacheQueriesFromPage([
					"/us",
					"/world",
					"/world/tariffs",
					"/ukraine",
				]),
			onComplete: () => {},
		},
		{
			time: "13,28,43,58 * * * *",
			fetchFn: pingApp,
			onComplete: () => {},
		},
	],
};
