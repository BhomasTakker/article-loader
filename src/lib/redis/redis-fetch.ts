import { connectToRedisDB } from "./db";

type FetchFn<T> = () => Promise<T>;

const DEFAULT_CACHE = 60 * 60 * 24; // 1 day

// Should generic
export const setCache = async <T>(
	fetchFn: FetchFn<T>,
	key: string,
	expiry: number = DEFAULT_CACHE
) => {
	try {
		const client = connectToRedisDB();

		const data = await fetchFn();

		if (!data) {
			// For Gods sake stop caching null!!!
			console.error(`No data loaded for ${key}:`);
		}

		// do we need to await?
		// I think only of we plan on doing something on an error
		// or if we were plannin gon doing anything with the data
		client.set(key, JSON.stringify(data), "EX", expiry);
	} catch (error) {
		console.error(`Error setting cache for ${key}:`, error);
	}
};
