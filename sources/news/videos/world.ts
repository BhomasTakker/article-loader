import { NewsSources } from "../sources";

export const WORLD_LIVE = {
	categories: ["news"],
	collectionType: "news",
	region: ["world"],
	coverage: ["international"],
	language: "en",
	media: { mediaType: "24/7" },
	sources: [
		{
			src: "https://www.youtube.com/feeds/videos.xml?playlist_id=PLSoFrAUKXUrimAmeTbZsrKOn5-vM8SrVi",
		},
		{
			src: "https://www.youtube.com/feeds/videos.xml?playlist_id=PLSoFrAUKXUrgy54B6mRKOMlhXgSWj2JEV",
		},
	],
};

// More sources than region
// We are largely all world news
export const WORLD_VIDEO = {
	categories: ["news"],
	collectionType: "news",
	region: ["world"],
	coverage: ["international"],
	language: "en",
	sources: [
		{
			name: NewsSources.AL_JAZEERA,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNye-wNBqNL5ZzHSJj3l8Bg",
			region: ["world", "Middle East", "Qatar"],
		},
		{
			name: NewsSources.CBC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCuFFtHWoLl5fauMMD5Ww2jA",
			region: ["world", "North America", "Canada"],
		},
		{
			name: NewsSources.DEUTSCHE_WELLE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCknLrEdhRCp1aegoMqRaCZg",
			region: ["world", "Europe", "Germany"],
		},
		{
			name: NewsSources.GLOBAL_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UChLtXXpo4Ge1ReTEboVvTDg",
			region: ["world", "North America", "Canada"],
		},
		{
			name: NewsSources.EURONEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSrZ3UV4jOidv8ppoVuvW9Q",
			region: ["world", "Europe"],
		},
		{
			name: NewsSources.UN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5O114-PQNYkurlTg6hekZw",
		},
		{
			name: NewsSources.NINE_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIYLOcEUX6TbBo7HQVF2PKA",
			region: ["world", "Australia"],
		},
		{
			name: NewsSources.ABC_AUSTRALIA,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVgO39Bk5sMo66-6o6Spn6Q",
			region: ["world", "Australia"],
		},
		{
			name: NewsSources.FIRST_POST,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCz8QaiQxApLq8sLNcszYyJw",
			region: ["world", "South Asia", "India"],
		},
		{
			name: NewsSources.AFP,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC86dbj-lbDks_hZ5gRKL49Q",
			region: ["world", "Europe", "France"],
		},
		{
			name: NewsSources.TRT,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC7fWeaHhqgM4Ry-RMpM2YYw",
			region: ["world", "Europe", "Turkey"],
		},
		{
			name: NewsSources.SABC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8yH-uI81UUtEMDsowQyx1g",
			region: ["world", "Africa", "South Africa"],
		},
		{
			name: NewsSources.THE_CONVERSATION,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCQfzgoCt72pQNpkvnHjNvog",
		},
	],
};

export const WORLD_VIDEO_2 = {
	categories: ["news"],
	collectionType: "news",
	region: ["world"],
	coverage: ["international"],
	language: "en",
	sources: [
		{
			name: NewsSources.QUDS_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVG72F2Q5yCmLQfctNK6M2A",
			region: ["world", "Middle East", "Iran"],
		},
		{
			name: NewsSources.MIDDLE_EAST_EYE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCR0fZh5SBxxMNYdg0VzRFkg",
			region: ["world", "Middle East"],
		},
		{
			name: NewsSources.THE_CRADLE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC2liaNc5y50YBVjgXiQxdHQ",
			region: ["world", "Middle East"],
		},
		// {
		// 	name: NewsSources.ROYA_NEWS,
		// 	src: '',
		// },
	],
};
