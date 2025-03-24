import { NewsSources } from "../../../news/sources";

// We absolutely want to be defining Origins and Categories
// We want to be able to filter by these in news alone

// BITES - 5 minutes
// BRIEFS - 10 minutes
// DAILYS
// WEEKLIES
// PODCASTS

// We should load by region etc / or would you have variant audio type podcast type2 briefs
// Then offer search by duration - then can get the briefs etc??
// up to and around 5 minutes?
// Should delete these after x amount of time??
// set a flag and daily delete?
export const NEWS_BITES = {
	categories: [],
	collectionType: "news",
	region: "",
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
			// upto 5 per day - 5 minutes
			collectionTitle: NewsSources.SKY,
			name: NewsSources.SKY,
			src: "http://a.365dm.com/api/apple/v1/audio/news-bulletin",
		},
		{
			// 10 minutes
			collectionTitle: "The World in Brief from The Economist",
			name: "The Economist",
			src: "http://a.365dm.com/api/apple/v1/audio/news-bulletin",
		},
		{
			collectionTitle: "Times News Briefing",
			name: NewsSources.TIMES,
			// src: "http://a.365dm.com/api/apple/v1/audio/news-bulletin",
			src: "https://feeds.acast.com/public/shows/c5cdab6e-7ef4-4562-b081-71f44a5b9533",
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
			collectionTitle: "WSJ Minute Briefing",
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.megaphone.fm/WSJ7928321669",
		},
		{
			collectionTitle: "Al Jazeera News Updates",
			name: NewsSources.AL_JAZEERA,
			src: "https://www.omnycontent.com/d/playlist/9c074afa-3313-47e8-b802-a9f900789975/63048eda-2427-408a-b47c-ad5001293fca/6677d422-fd43-4aaa-be74-ad5001293fd8/podcast.rss",
		},
		{
			collectionTitle: "DW News Brief",
			name: NewsSources.DEUTSCHE_WELLE,
			src: "https://rss.dw.com/syndication/feeds/podcast_en_newsbrief.33191-mrss.xml",
		},
		{
			collectionTitle: "The Daily Briefing",
			name: NewsSources.TLDR,
			src: "https://rss.art19.com/the-daily-briefing",
		},
		{
			collectionTitle: "Daily News Brief",
			name: "Daily News Brief",
			src: "https://feeds.soundcloud.com/users/soundcloud:users:299903955/sounds.rss",
		},
		{
			collectionTitle: "News In Brief",
			name: "News In Brief",
			// Europe / EU
			src: "https://api.octopus.saooti.com/rss/emission/1480.rss",
		},
	],
};

export const NEWS = {
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
			// 10 minutes
			name: "Reuters World News",
			collectionTitle: NewsSources.REUTERS,
			src: "https://feeds.megaphone.fm/reutersworldnews",
		},
		{
			// 10 minutes
			name: "UK News Daily",
			collectionTitle: "UK News Daily",
			src: "https://feeds.transistor.fm/uk-news",
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
			name: NewsSources.BBC,
			collectionTitle: "BBC Global News Podcast",
			src: "https://www.spreaker.com/show/5307839/episodes/feed",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Newshour",
			src: "https://podcasts.files.bbci.co.uk/p002vsnk.rss",
		},
		{
			name: "The News Agents",
			collectionTitle: "The News Agents",
			src: "https://feeds.captivate.fm/the-news-agents/",
		},
		{
			// 1 per day - 15 minutes
			collectionTitle: "ABC News Daily",
			name: NewsSources.ABC_AUSTRALIA,
			src: "https://www.abc.net.au/feeds/9443166/podcast.xml",
		},
	],
};
