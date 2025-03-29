import { NewsSources } from "../../../news/sources";

export const BITES_WORLD = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
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
			collectionTitle: "News In Brief",
			name: "News In Brief",
			// Europe / EU
			src: "https://api.octopus.saooti.com/rss/emission/1480.rss",
		},
		{
			collectionTitle: NewsSources.TRT,
			name: "Daily News Brief",
			src: "https://feeds.soundcloud.com/users/soundcloud:users:299903955/sounds.rss",
		},
	],
};

export const NEWS_WORLD = {
	categories: [],
	collectionType: "news",
	region: "US",
	language: "en",
	sources: [
		{
			// 10 minutes
			name: "Reuters World News",
			collectionTitle: NewsSources.REUTERS,
			src: "https://feeds.megaphone.fm/reutersworldnews",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "BBC Global News Podcast",
			src: "https://www.spreaker.com/show/5307839/episodes/feed",
		},
		{
			// 1 per day - 15 minutes
			collectionTitle: "ABC News Daily",
			name: NewsSources.ABC_AUSTRALIA,
			src: "https://www.abc.net.au/feeds/9443166/podcast.xml",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Ukrainecast",
			src: "https://podcasts.files.bbci.co.uk/p0bqztzm.rss",
		},
		{
			name: "Pod Save the World",
			collectionTitle: "Pod Save the World",
			src: "https://feeds.simplecast.com/AeLYwXNc",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Focus on Africa",
			src: "https://podcasts.files.bbci.co.uk/p02nrtyw.rss",
		},
		{
			name: NewsSources.BBC,
			collectionTitle: "Newshour",
			src: "https://podcasts.files.bbci.co.uk/p002vsnk.rss",
		},
		{
			name: NewsSources.PBS,
			collectionTitle: "PBS News Hour - World",
			src: "https://feeds.feedburner.com/NewshourWorldPodcast",
		},
		{
			// 10 minutes
			collectionTitle: "The World in Brief from The Economist",
			name: NewsSources.THE_ECONOMIST,
			src: "https://access.acast.com/rss/theeconomistmorningbriefing/default",
		},
	],
};
