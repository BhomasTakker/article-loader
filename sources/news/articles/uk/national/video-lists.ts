import { NewsSources } from "../../../sources";

export const UK_LIVE = {
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
	language: "en",
	media: { mediaType: "24/7" },
	sources: [
		{
			src: "https://www.youtube.com/feeds/videos.xml?playlist_id=PLSoFrAUKXUrjserDqDUKFy-OQLYGIIVgc",
		},
	],
};

export const UK_VIDEO = {
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.SKY,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCoMdktPbSTixAyNGwb-UYkQ",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.BBC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC16niRr50-MSBwiO3YDb3RA",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.ITV,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCFQgi22Ht00CpaOQLtvZx2A",
		},
		{
			name: NewsSources.CHANNEL_4,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCTrQ7HXWRRxr7OsOtodr2_w",
		},
		{
			name: NewsSources.CHANNEL_5,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsAKRVq2n1vcHBzNu1ZikgA",
		},
		{
			name: NewsSources.MIRROR,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC3EmxrWVl7K8xBH_UVIWY4Q",
		},
		{
			name: NewsSources.SUN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIzXayRP7-P0ANpq-nD-h5g",
		},
		{
			name: NewsSources.DAILY_MAIL,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCw3fku0sH3qA3c3pZeJwdAw",
		},
		{
			name: NewsSources.GUARDIAN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIRYBXDze5krPDzAEOxFGVA",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.TELEGRAPH,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPgLNge0xqQHWM5B5EFH9Cg",
		},
		{
			name: NewsSources.INDEPENDENT,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCshwRhftzkiov5wKR7M_LsQ",
		},
		{
			name: NewsSources.GB_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC0vn8ISa4LKMunLbzaXLnOQ",
		},
	],
};

export const UK_VIDEO_2 = {
	categories: ["news"],
	region: ["Europe", "UK"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.OWEN_JONES,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSYCo8uRGF39qDCxF870K5Q",
		},
		{
			name: NewsSources.DOUBLE_DOWN_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?playlist_id=PLSoFrAUKXUrhi5gvtVN8SLeWz3hZgT2x3",
		},
	],
};
