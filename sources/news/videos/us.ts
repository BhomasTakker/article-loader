import { NewsSources } from "../sources";

export const US_LIVE = {
	categories: ["news"],
	region: ["US"],
	coverage: ["national"],
	language: "en",
	media: { mediaType: "24/7" },
	sources: [
		{
			src: "https://www.youtube.com/feeds/videos.xml?playlist_id=PLSoFrAUKXUriLHmJ64QCHgITgIjalbgMl",
		},
	],
};

// More sources than region
// We are largely all world news
export const US_VIDEO = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.CNN,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCupvZG-5ko_eiXAupbDfxWw",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.FOX,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXIJgqnII2ZOINSWNOGFThA",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.NBC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCeY0bbntWzzVIaj2z3QigXg",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.CBS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC8p1vwvWtl6T73JiExfWs1g",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.ABC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCBi2mrWuNuyYy4gbM6fU18Q",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.PBS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCgyeJxD05YnoDquRMNBfBqw",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.NPR,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJnS2EsPfv46u1JR8cnD0NA",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.BLOOMBERG,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIALMKvObZNtJ6AmdCLP7Lg",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.REUTERS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UChqUTb7kYRX8-EiaN3XFrSQ",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCK7tptUDHh-RYDsdxO1-5QQ",
		},
		{
			name: NewsSources.NEW_YORK_TIMES,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCqnbDFdCpuN8CMEg0VuEBqA",
		},
		{
			name: NewsSources.AP,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC52X5wxOL_s5yw0dQk7NtgA",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.CNBC,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCvJJ_dzjViJCoLf5uKUTwoA",
		},
		{
			name: NewsSources.WASHINGTON_POST,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCHd62-u_v4DvJ8TCFtpi4GA",
		},
		{
			name: NewsSources.PRO_PUBLICA,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCtCL58_DaVdVRmev3yHK7pg",
		},
		{
			name: NewsSources.DEMOCRACY_NOW,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCzuqE7-t13O4NIDYJfakrhw",
		},
	],
};

export const US_VIDEO_2 = {
	categories: ["news"],
	region: ["US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.INTERCEPT,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCv002AUCZaPNwiADqwchijg",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.DAILY_WIRE,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCaeO5vkdj5xOQHp4UmIN6dw",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.DROP_SITE_NEWS,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCBMrOkjg3AbvLS5g1MhtlRQ",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.ZETEO,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCVG72F2Q5yCmLQfctNK6M2A",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.SPECTRUM,
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCc6V-G2u7j9Avbbk9-0jIxA",
		},
	],
};
