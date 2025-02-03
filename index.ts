import { connectToMongoDB } from "./src/lib/mongo/db";
import { fetchCollections } from "./src/cron/main-rss-cron";
import { createCron, CRON_TIMES } from "./src/cron/create-cron";
import { NEWS_ARTICLES_COLLECTION } from "./sources/news/articles_collections";
import { NEWS_VIDEOS_COLLECTION } from "./sources/news/video_collections";

require("dotenv").config();

const startServer = async () => {
	await connectToMongoDB();

	createCron({
		time: CRON_TIMES.minutes_5,
		fetchFn: fetchCollections([
			...NEWS_ARTICLES_COLLECTION,
			...NEWS_VIDEOS_COLLECTION,
		]),
	});
};

startServer();
