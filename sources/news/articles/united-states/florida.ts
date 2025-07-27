const fox4 = {
	name: "FOX4",
	origin: "US",
	description: "FOX4 is a local news outlet in Florida.",
	url: "https://www.fox4now.com/",
	logo: "https://www.fox4now.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const miamiHerald = {
	name: "Miami Herald",
	origin: "US",
	description: "Miami Herald is a major daily newspaper in Florida.",
	url: "https://www.miamiherald.com/",
	logo: "https://www.miamiherald.com/favicon.ico",
	rating: 75,
	leaning: 0,
};

const local10 = {
	name: "Local 10 News",
	origin: "US",
	description: "Local 10 News is a news outlet serving the Miami area.",
	url: "https://www.local10.com/",
	logo: "https://www.local10.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const abcActionNews = {
	name: "ABC Action News",
	origin: "US",
	description: "ABC Action News is a local news station in Florida.",
	url: "https://www.abcactionnews.com/",
	logo: "https://www.abcactionnews.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const orlandoWeekly = {
	name: "Orlando Weekly",
	origin: "US",
	description:
		"Orlando Weekly is a news and entertainment publication in Florida.",
	url: "https://www.orlandoweekly.com/",
	logo: "https://www.orlandoweekly.com/favicon.ico",
	rating: 65,
	leaning: 0,
};

const news4jax = {
	name: "News 4 Jax",
	origin: "US",
	description:
		"News 4 Jax is a local news outlet serving Jacksonville, Florida.",
	url: "https://www.news4jax.com/",
	logo: "https://www.news4jax.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const nbc6 = {
	name: "NBC 6 South Florida",
	origin: "US",
	description:
		"NBC 6 South Florida is a local news station serving the South Florida area.",
	url: "https://www.nbcmiami.com/",
	logo: "https://www.nbcmiami.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const fox13 = {
	name: "Fox 13 Tampa Bay",
	origin: "US",
	description:
		"Fox 13 Tampa Bay is a local news station serving the Tampa Bay area.",
	url: "https://www.fox13news.com/",
	logo: "https://www.fox13news.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wesh = {
	name: "WESH 2 News",
	origin: "US",
	description: "WESH 2 News is a local news station in Orlando, Florida.",
	url: "https://www.wesh.com/",
	logo: "https://www.wesh.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const fox35 = {
	name: "Fox 35 Orlando",
	origin: "US",
	description: "Fox 35 Orlando is a local news station in Orlando, Florida.",
	url: "https://www.fox35orlando.com/",
	logo: "https://www.fox35orlando.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wkmg = {
	name: "WKMG News 6",
	origin: "US",
	description: "WKMG News 6 is a local news station in Orlando, Florida.",
	url: "https://www.clickorlando.com/",
	logo: "https://www.clickorlando.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wptv = {
	name: "WPTV News",
	origin: "US",
	description:
		"WPTV News is a local news station serving West Palm Beach, Florida.",
	url: "https://www.wptv.com/",
	logo: "https://www.wptv.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wflanews = {
	name: "WFLA News Channel 8",
	origin: "US",
	description: "WFLA News Channel 8 is a local news station in Tampa, Florida.",
	url: "https://www.wfla.com/",
	logo: "https://www.wfla.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const actionNewsJax = {
	name: "Action News Jax",
	origin: "US",
	description:
		"Action News Jax is a local news outlet serving Jacksonville, Florida.",
	url: "https://www.actionnewsjax.com/",
	logo: "https://www.actionnewsjax.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const cbsMiami = {
	name: "CBS Miami",
	origin: "US",
	description: "CBS Miami is a local news station serving the Miami area.",
	url: "https://www.cbsnews.com/miami/",
	logo: "https://www.cbsnews.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const floridaSources = {
	FOX4: "Fox 4 Now",
	LOCAL10: "Local 10 News",
	MIAMI_HERALD: "Miami Herald",
	ABC_ACTION_NEWS: "ABC Action News",
	ORLANDO_WEEKLY: "Orlando Weekly",
	NEWS4JAX: "News 4 Jax",
	NBC6: "NBC 6 South Florida",
	FOX13: "Fox 13 Tampa Bay",
	WESH: "WESH 2 News",
	FOX35: "Fox 35 Orlando",
	WKMG: "WKMG News 6",
	WPTV: "WPTV News",
	WFLA: "WFLA News Channel 8",
	ACTION_NEWS_JAX: "Action News Jax",
	CBSMIAMI: "CBS Miami",
};

export const floridaSourcesMap = new Map([
	// goes local
	[floridaSources.FOX4, fox4],
	[floridaSources.MIAMI_HERALD, miamiHerald],
	[floridaSources.LOCAL10, local10],
	// Goes local
	[floridaSources.ABC_ACTION_NEWS, abcActionNews],
	[floridaSources.ORLANDO_WEEKLY, orlandoWeekly],
	[floridaSources.NEWS4JAX, news4jax],
	[floridaSources.NBC6, nbc6],
	[floridaSources.FOX13, fox13],
	[floridaSources.WESH, wesh],
	[floridaSources.FOX35, fox35],
	[floridaSources.WKMG, wkmg],
	[floridaSources.WPTV, wptv],
	[floridaSources.WFLA, wflanews],
	[floridaSources.ACTION_NEWS_JAX, actionNewsJax],
	[floridaSources.CBSMIAMI, cbsMiami],
]);

export const FLORIDA_ARTICLES = {
	categories: ["news"],
	region: ["North America", "US", "Florida"],
	coverage: [],
	sources: [
		{
			name: floridaSources.FOX4,
			region: ["Florida"],
			coverage: ["regional", "local"],
			src: "https://www.fox4now.com/news/state.rss",
		},
		{
			name: floridaSources.MIAMI_HERALD,
			region: ["Florida", "Miami"],
			coverage: ["regional"],
			src: "https://feeds.mcclatchy.com/miamiherald/sections/news/local/stories",
		},
		{
			name: floridaSources.MIAMI_HERALD,
			region: ["Florida", "Miami"],
			coverage: ["regional"],
			src: "https://feeds.mcclatchy.com/miamiherald/sections/news/state/florida/stories",
		},
		{
			name: floridaSources.LOCAL10,
			region: ["Florida"],
			coverage: ["regional"],
			src: "https://www.local10.com/arc/outboundfeeds/rss/category/news/?outputType=xml",
		},
		{
			name: floridaSources.LOCAL10,
			region: ["Florida", "Miami"],
			coverage: ["regional", "local"],
			src: "https://www.local10.com/news/state.rss",
		},
		{
			name: floridaSources.ABC_ACTION_NEWS,
			region: ["Florida"],
			coverage: ["regional"],
			src: "https://www.abcactionnews.com/news/state.rss",
		},
		{
			name: floridaSources.ORLANDO_WEEKLY,
			region: ["Florida", "Orlando"],
			coverage: ["regional", "local"],
			src: "https://www.orlandoweekly.com/orlando/Rss.xml",
		},
		{
			name: floridaSources.NEWS4JAX,
			region: ["Florida", "Jacksonville"],
			coverage: ["regional", "local"],
			src: "https://www.news4jax.com/arc/outboundfeeds/rss/category/news/local/?outputType=xml&size=10",
		},
		{
			name: floridaSources.NBC6,
			region: ["Florida", "Miami"],
			coverage: ["regional", "local"],
			src: "https://www.nbcmiami.com/?rss=y",
		},
		{
			name: floridaSources.FOX13,
			region: ["Florida", "Tampa Bay"],
			coverage: ["regional", "local"],
			src: "https://www.fox13news.com/rss/category/local-news",
		},
	],
};

export const FLORIDA_VIDEOS = {
	categories: ["news"],
	region: ["North America", "US", "Florida"],
	coverage: ["regional"],
	sources: [
		{
			name: floridaSources.WESH,
			region: ["Florida", "Orlando"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCD9nZ3qeRGbPuHJaJduiQxA",
		},
		{
			name: floridaSources.FOX35,
			region: ["Florida", "Orlando"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCuXT13wiqK56NR7QSfDWpvg",
		},
		{
			name: floridaSources.WKMG,
			region: ["Florida", "Orlando"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCjpzEgbbDUg4YC6vpSrzsyg",
		},
		{
			name: floridaSources.WPTV,
			region: ["Florida", "West Palm Beach"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC0bCUnP5RrkJZUtd3bBz6Kw",
		},
		{
			name: floridaSources.FOX13,
			region: ["Florida", "Tampa Bay"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC13mSI38YWz5zfvxXDPpePA",
		},
		{
			name: floridaSources.WFLA,
			region: ["Florida", "Tampa"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCDvJcb8Adv-_bOrtnRLmiDw",
		},
		{
			name: floridaSources.ACTION_NEWS_JAX,
			region: ["Florida", "Jacksonville"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5mg__JG9m5lypJUZbcWTOw",
		},
		{
			name: floridaSources.ABC_ACTION_NEWS,
			region: ["Florida", "Tampa"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCK0UUsCjtMRNtS3BPh1Yc4w",
		},
		{
			name: floridaSources.NEWS4JAX,
			region: ["Florida", "Jacksonville"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_YFbvKedjnVjqrZqBR4L8Q",
		},
		{
			name: floridaSources.CBSMIAMI,
			region: ["Florida", "Miami"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCXJryYh6xcW5iEeJGzK191A",
		},
	],
};
