import { NewsSources } from "../../../news/sources";

export const BITES_US = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			// every hour / 5 minutes
			name: NewsSources.CNN,
			collectionTitle: "CNN 5 Things",
			src: "https://feeds.megaphone.fm/WMHY2007701094",
		},
		{
			// upto 5 per day - 5 minutes
			collectionTitle: "NPR News Now",
			name: NewsSources.NPR,
			src: "https://feeds.npr.org/500005/podcast.xml",
		},
		{
			collectionTitle: "WSJ Minute Briefing",
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.megaphone.fm/WSJ7928321669",
		},
		{
			name: NewsSources.PBS,
			collectionTitle: "PBS News Hour - Segments",
			src: "https://feeds.feedburner.com/NewsHourHeadlinesPodcast",
		},
	],
};

export const NEWS_US_1 = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			// 30 minutes
			name: "The Daily",
			collectionTitle: "The Daily",
			src: "https://feeds.simplecast.com/54nAGcIl",
		},
		{
			// 10 minutes
			name: "The Newsworthy",
			collectionTitle: "The Newsworthy",
			src: "https://thenewsworthy.libsyn.com/rss",
		},
		{
			// 10 minutes
			name: "WSJ What’s News",
			collectionTitle: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.megaphone.fm/WSJ4886593505",
		},
		{
			// would we
			// Up First - 30 minutes
			name: NewsSources.NPR,
			// we should distinguish
			// collectionTitle for instance
			collectionTitle: "Up First",
			src: "https://feeds.npr.org/510318/podcast.xml",
		},
		{
			name: NewsSources.NPR,
			collectionTitle: "The NPR Politics Podcast",
			src: "https://feeds.npr.org/510310/podcast.xml",
		},
		{
			// hour + / 2 weekly ish
			name: "Pod Save America",
			collectionTitle: "Pod Save America",
			src: "https://feeds.simplecast.com/dxZsm5kX",
		},
	],
};

export const NEWS_US_2 = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			name: "60 Minutes",
			collectionTitle: "60 Minutes",
			src: "https://feeds.megaphone.fm/CBS5826355202",
		},
		{
			name: "What a Day",
			collectionTitle: "What a Day",
			src: "https://feeds.simplecast.com/M7qXQ5Pd",
		},
		{
			name: NewsSources.WASHINGTON_POST,
			collectionTitle: "Post Reports",
			src: "https://podcast.posttv.com/itunes/post-reports.xml",
		},
		{
			name: NewsSources.THE_NEW_YORKER,
			collectionTitle: "The New Yorker: Politics and More",
			src: "https://feeds.simplecast.com/TRuO_SRo",
		},
		{
			name: NewsSources.WASHINGTON_POST,
			collectionTitle: "The 7",
			src: "https://podcast.posttv.com/itunes/the-7.xml",
		},
		{
			name: NewsSources.DAILY_WIRE,
			collectionTitle: "Morning Wire",
			src: "https://feeds.simplecast.com/WCb5SgYj",
		},
	],
};

export const NEWS_US_3 = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			name: NewsSources.NBC,
			collectionTitle: "Dateline NBC",
			src: "https://podcastfeeds.nbcnews.com/dateline",
		},
		{
			name: "The Daily Show",
			collectionTitle: "The Daily Sohw: Ears Edition",
			src: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/e5e49f91-be9b-42f1-a426-ae3c00026e8b/04b51c34-8028-49a3-b42f-ae3c00026e95/podcast.rss",
		},
		{
			name: "Apple News Today",
			collectionTitle: "Apple News Today",
			src: "https://rss.art19.com/apple-news-daily",
		},
		{
			name: "On the Media",
			collectionTitle: "On the Media",
			src: "https://feeds.simplecast.com/o4jAFXaw",
		},
		{
			name: NewsSources.VOX,
			collectionTitle: "Today, Explained",
			src: "https://feeds.megaphone.fm/VMP5705694065",
		},
		{
			collectionTitle: "WSJ The Journal",
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://video-api.wsj.com/podcast/rss/wsj/the-journal",
		},
		{
			collectionTitle: "WSJ What's News",
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.megaphone.fm/WSJ4886593505?limit=50",
		},
	],
};

export const NEWS_US_4 = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			name: NewsSources.THE_BULWARK,
			collectionTitle: "The Bulwark Podcast",
			src: "https://audioboom.com/channels/5114286.rss",
		},
		{
			name: NewsSources.PBS,
			collectionTitle: "PBS News Hour - Full Show",
			src: "https://feeds.feedburner.com/NewshourFullProgramPodcast",
		},

		{
			collectionTitle: "Times Headlines",
			name: NewsSources.NEW_YORK_TIMES,
			src: "https://feeds.simplecast.com/ydACIPHO",
		},
		{
			collectionTitle: "Bloomberg News Now",
			name: NewsSources.BLOOMBERG,
			src: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/d9566f78-0464-4367-9dcc-b05700aeec6f/7f880b3c-7f67-4b4b-b520-b05700af9172/podcast.rss",
		},
		{
			collectionTitle: "Democracy Now",
			name: NewsSources.DEMOCRACY_NOW,
			src: "https://www.democracynow.org/podcast.xml",
		},
		{
			collectionTitle: "The Intercept Briefing",
			name: NewsSources.INTERCEPT,
			src: "https://feeds.acast.com/public/shows/f5b64019-68c3-57d4-b70b-043e63e5cbf6",
		},
		{
			name: NewsSources.SLATE,
			collectionTitle: "What Next | Daily News and Analysis",
			src: "https://feeds.megaphone.fm/whatnext",
		},
		{
			name: NewsSources.DROP_SITE_NEWS,
			collectionTitle: "Drop Site News",
			src: "https://api.substack.com/feed/podcast/2510348/s/153051.rss",
		},
	],
};
