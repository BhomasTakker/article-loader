import { getTimeFunction } from "./cron-times";
import { getFetchFunction } from "./rss/utils";
import { FetchFunction, FetchFunctionProps, TimeFunction } from "./types";

// one of
type CreateCronJobDataParams = {
	fetchFunctionData: FetchFunctionProps; // typeof fecthFunctionData; / argument for fetch data function
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
