import { getTimeFunction } from "./cron-times";
import { getFetchFunction } from "./rss/utils";
import { FetchFunction, TimeFunction } from "./types";

type CreateCronJobDataParams = {
	fetchFunctionData: any; // typeof fecthFunctionData;
	timeFunction: TimeFunction;
	timeParams: number[];
	fetchFunction: FetchFunction;
	onComplete: () => void;
};

// For now createRSS Cron Job Data
export const createCronJobData = async ({
	fetchFunctionData,
	timeFunction,
	timeParams,
	fetchFunction,
	onComplete,
}: CreateCronJobDataParams) => {
	// fetchData function could be the way?
	// nice pattern but not yet
	// const time = TimeFunction.getTimeFunction(timeFunction)(...timeParams);
	const cronTime = getTimeFunction(timeFunction)(...timeParams);
	const cronFetchFunction = await getFetchFunction(fetchFunction)(
		fetchFunctionData
	);

	return {
		time: cronTime,
		fetchFn: cronFetchFunction,
		onComplete,
	};
};
