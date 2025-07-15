import { NewsSources } from "../sources";

export const WORLD_LIVE = {
	categories: ["news"],
	collectionType: "news",
	region: "world",
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
	region: "world",
	language: "en",
	sources: [
		{
			name: NewsSources.AL_JAZEERA,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNye-wNBqNL5ZzHSJj3l8Bg",
		},
		{
			name: NewsSources.CBC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCuFFtHWoLl5fauMMD5Ww2jA",
		},
		{
			name: NewsSources.DEUTSCHE_WELLE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCknLrEdhRCp1aegoMqRaCZg",
		},
		{
			name: NewsSources.GLOBAL_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UChLtXXpo4Ge1ReTEboVvTDg",
		},
		{
			name: NewsSources.EURONEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSrZ3UV4jOidv8ppoVuvW9Q",
		},
		{
			name: NewsSources.UN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5O114-PQNYkurlTg6hekZw",
		},
		{
			name: NewsSources.NINE_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIYLOcEUX6TbBo7HQVF2PKA",
		},
		{
			name: NewsSources.ABC_AUSTRALIA,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVgO39Bk5sMo66-6o6Spn6Q",
		},
		{
			name: NewsSources.FIRST_POST,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCz8QaiQxApLq8sLNcszYyJw",
		},
		{
			name: NewsSources.AFP,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC86dbj-lbDks_hZ5gRKL49Q",
		},
		{
			name: NewsSources.TRT,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC7fWeaHhqgM4Ry-RMpM2YYw",
		},
		{
			name: NewsSources.SABC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8yH-uI81UUtEMDsowQyx1g",
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
	region: "world",
	language: "en",
	sources: [
		{
			name: NewsSources.QUDS_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVG72F2Q5yCmLQfctNK6M2A",
		},
		{
			name: NewsSources.MIDDLE_EAST_EYE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCR0fZh5SBxxMNYdg0VzRFkg",
		},
		{
			name: NewsSources.THE_CRADLE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC2liaNc5y50YBVjgXiQxdHQ",
		},
		// {
		// 	name: NewsSources.ROYA_NEWS,
		// 	src: '',
		// },
	],
};
