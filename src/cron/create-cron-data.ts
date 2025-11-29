import { connectToMongoDB } from "../lib/mongo/db";
import { getTimeFunction } from "./cron-times";
import { loadSourceListsFromDB } from "./rss/db-source-loader";
import { getFetchFunction } from "./rss/utils";
import { FetchFunction, SourceVariant, TimeFunction } from "./types";

const loadSourceList = async (
	articles: string[],
	sourceVariant: SourceVariant
) => {
	await connectToMongoDB();
	return await loadSourceListsFromDB({
		titles: articles,
		variant: sourceVariant,
	});
};

type CreateCronJobDataParams = {
	titles: string[];
	sourceVariant: SourceVariant;
	timeFunction: TimeFunction;
	timeParams: number[];
	fetchFunction: FetchFunction;
	onComplete: () => void;
};

export const createCronJobData = async ({
	titles,
	sourceVariant,
	timeFunction,
	timeParams,
	fetchFunction,
	onComplete,
}: CreateCronJobDataParams) => {
	const sources = await loadSourceList(titles, sourceVariant);
	// nice pattern but not yet
	// const time = TimeFunction.getTimeFunction(timeFunction)(...timeParams);
	const cronTime = getTimeFunction(timeFunction)(...timeParams);
	const cronFetchFunction = await getFetchFunction(fetchFunction)(sources);

	return {
		time: cronTime,
		fetchFn: cronFetchFunction,
		onComplete,
	};
};
