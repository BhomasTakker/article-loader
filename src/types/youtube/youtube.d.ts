export type Thumbnail = {
	url: string;
	width: number;
	height: number;
};

export type YouTubeItem = {
	kind: string;
	etag: string;
	id: {
		kind: string;
		videoId: string;
	};
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: {
			default: Thumbnail;
			medium: Thumbnail;
			high: Thumbnail;
		};
		channelTitle: string;
		liveBroadcastContent: string;
		publishTime: string;
	};
};

export type YouTubeAPISearchResult = {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: YouTubeItem[];
};
