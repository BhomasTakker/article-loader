const isRssRoute = process.env.RSS_ROUTE === "true" || false;
const isApiRoute = process.env.API_ROUTE === "true" || false;
const isCron = process.env.CRON === "true" || false;
const isApiCron = process.env.API_CRON === "true" || false;
const isRSSCron = process.env.RSS_CRON === "true" || false;

export const getEnv = () => {
	return { isRssRoute, isApiRoute, isCron, isApiCron, isRSSCron };
};

export const getYouTubeApiKey = () => {
	const apiKey = process.env.YOUTUBE_API_KEY;
	return apiKey;
};
