import Redis from "ioredis";
import { REDIS_URL } from "./config";

let cachedConnection: Redis | null = null;

export const connectToRedisDB = () => {
	if (cachedConnection) {
		return cachedConnection;
	}
	try {
		const cnx = new Redis(REDIS_URL, { showFriendlyErrorStack: true });
		cachedConnection = cnx;
		return cachedConnection;
	} catch (error) {
		// If an error occurs during connection, log the error and throw it
		// console.log(error);
		throw error;
	}
};
