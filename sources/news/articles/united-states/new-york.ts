import { NewsSources } from "../../sources";

const syracuse = {
	origin: "US",
	name: "Syracuse",
	description: "Syracuse is a local news outlet.",
	url: "https://www.syracuse.com/",
	logo: "https://www.syracuse.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wkbw = {
	origin: "US",
	name: "WKBW",
	description: "WKBW is a local news outlet in Buffalo, NY.",
	url: "https://www.wkbw.com/",
	logo: "https://www.wkbw.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wivb = {
	origin: "US",
	name: "WIVB",
	description: "WIVB is a local news outlet in Buffalo, NY.",
	url: "https://www.wivb.com/",
	logo: "https://www.wivb.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const spectrum = {
	origin: "US",
	name: "Spectrum News",
	description: "Spectrum News provides local news coverage in various regions.",
	url: "https://spectrumlocalnews.com/",
	logo: "https://spectrumlocalnews.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const fox5 = {
	origin: "US",
	name: "Fox 5 NY",
	description: "Fox 5 NY is a local news outlet in New York City.",
	url: "https://www.fox5ny.com/",
	logo: "https://www.fox5ny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const abc7ny = {
	origin: "US",
	name: "ABC 7 NY",
	description: "ABC 7 NY is a local news outlet in New York City.",
	url: "https://abc7ny.com/",
	logo: "https://abc7ny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const pix11 = {
	origin: "US",
	name: "PIX 11",
	description: "PIX 11 is a local news outlet in New York City.",
	url: "https://www.pix11.com/",
	logo: "https://www.pix11.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wsyr = {
	origin: "US",
	name: "WSYR",
	description: "WSYR is a local news outlet in Syracuse, NY.",
	url: "https://www.localsyr.com/",
	logo: "https://www.localsyr.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wham13 = {
	origin: "US",
	name: "13 WHAM",
	description: "13 WHAM is a local news outlet in Rochester, NY.",
	url: "https://13wham.com/",
	logo: "https://13wham.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const news8wroc = {
	origin: "US",
	name: "News 8 WROC",
	description: "News 8 WROC is a local news outlet in Rochester, NY.",
	url: "https://www.rochesterfirst.com/",
	logo: "https://www.rochesterfirst.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const rochesterFirst = {
	origin: "US",
	name: "Rochester First",
	description: "Rochester First is a local news outlet in Rochester, NY.",
	url: "https://www.rochesterfirst.com/",
	logo: "https://www.rochesterfirst.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const NEWS12 = {
	origin: "US",
	name: "News 12",
	description:
		"News 12 provides local news coverage in various regions of New York.",
	url: "https://brooklyn.news12.com/",
	logo: "https://www.news12.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const NEWS10 = {
	origin: "US",
	name: "News 10",
	description:
		"News 10 provides local news coverage in various regions of New York.",
	url: "https://www.news10.com/",
	logo: "https://www.news10.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const CBS6 = {
	origin: "US",
	name: "CBS 6 Albany",
	description: "CBS 6 Albany is a local news outlet in Albany, NY.",
	url: "https://cbs6albany.com/",
	logo: "https://cbs6albany.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const WNYT = {
	origin: "US",
	name: "WNYT",
	description: "WNYT is a local news outlet in Albany, NY.",
	url: "https://wnyt.com/",
	logo: "https://wnyt.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const WENY = {
	origin: "US",
	name: "WENY",
	description: "WENY is a local news outlet in Elmira, NY.",
	url: "https://www.weny.com/",
	logo: "https://www.weny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

// this way is probably better on a per country/region basis etc
export const ny_sources = {
	SYRACUSE: "Syracuse",
	WKBW: "WKBW",
	WIVB: "WIVB",
	SPECTRUM: "Spectrum News",
	FOX5_NY: "Fox 5 NY",
	ABC7NY: "ABC 7 NY",
	PIX11: "PIX 11",
	WSYR: "WSYR",
	WHAM13: "13 WHAM",
	News8WROC: "News 8 WROC",
	RochesterFirst: "Rochester First",
	NEWS12: "News 12",
	NEWS10: "News 10",
	CBS6: "CBS 6 Albany",
	WNYT: "WNYT",
	WENY: "WENY",
};

export const ny_sourcesMap = new Map([
	[ny_sources.SYRACUSE, syracuse],
	[ny_sources.WKBW, wkbw],
	[ny_sources.WIVB, wivb],
	[ny_sources.SPECTRUM, spectrum],
	[ny_sources.FOX5_NY, fox5],
	[ny_sources.ABC7NY, abc7ny],
	[ny_sources.PIX11, pix11],
	[ny_sources.WSYR, wsyr],
	[ny_sources.WHAM13, wham13],
	[ny_sources.News8WROC, news8wroc],
	[ny_sources.RochesterFirst, rochesterFirst],
	[ny_sources.NEWS12, NEWS12],
	[ny_sources.NEWS10, NEWS10],
	[ny_sources.CBS6, CBS6],
	[ny_sources.WNYT, WNYT],
	[ny_sources.WENY, WENY],
]);

export const NEW_YORK_ARTICLES = {
	categories: ["news"],
	region: ["North America", "US", "New York"],
	coverage: [],
	language: "en",
	sources: [
		{
			name: NewsSources.ABC7NY,
			src: "https://abc7ny.com/feed/",
		},
		// NBC has search style for all boroughs and regions?
		// Can be slow and few recent results but still useful
		// https://www.nbcnewyork.com/tag/jersey-shore/feed/
		// https://www.nbcnewyork.com/tag/new-jersey/feed/
		{
			name: NewsSources.NBC,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://www.nbcnewyork.com/?rss=y",
		},
		{
			name: NewsSources.NBC,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://www.nbcnewyork.com/news/local/feed/",
		},
		{
			name: NewsSources.SYRACUSE,
			region: ["Syracuse"],
			coverage: ["local"],
			src: "https://www.syracuse.com/arc/outboundfeeds/rss/category/state/?outputType=xml",
		},
		{
			name: NewsSources.WKBW,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wkbw.com/news/local-news/buffalo.rss",
		},
		{
			name: NewsSources.WIVB,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wivb.com/news/local-news/feed/",
		},
		{
			name: NewsSources.WIVB,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wivb.com/feed/",
		},
		// Much the same as each other / remove some
		{
			name: NewsSources.SPECTRUM,
			src: "https://ny1.com/services/contentfeed.nyc%7call-boroughs%7cnews.landing.rss",
			coverage: ["local"],
		},
		// {
		// 	name: NewsSources.SPECTRUM,
		// 	region: ["Central"],
		// 	src: "https://spectrumlocalnews.com/services/contentfeed.nys%7ccentral-ny%7cnews.landing.rss",
		// },
		{
			name: NewsSources.SPECTRUM,
			region: ["Hudson Valley"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7chudson-valley%7cnews.landing.rss",
		},
		{
			name: NewsSources.SPECTRUM,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7cbuffalo%7cnews.landing.rss",
		},
		{
			name: NewsSources.SPECTRUM,
			region: ["Rochester"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7crochester%7cnews.landing.rss",
		},
		{
			name: NewsSources.SPECTRUM,
			region: ["Binghamton"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7cbinghamton%7cnews.landing.rss",
		},
		{
			name: NewsSources.SPECTRUM,
			region: ["Watertown"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7cwatertown%7cnews.landing.rss",
		},

		{
			name: NewsSources.NEW_YORK_POST,
			region: ["NYC", "New York City"],
			coverage: ["local"],
			src: "https://nypost.com/metro/feed/",
		},
		{
			name: NewsSources.NEW_YORK_POST,
			region: ["NYC", "New York City", "Long Island"],
			coverage: ["regional", "local"],
			src: "https://nypost.com/long-island/feed/",
		},
		{
			name: NewsSources.FOX5_NY,
			region: ["NYC", "New York City"],
			coverage: ["local"],
			src: "https://www.fox5ny.com/rss/category/news",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["New York", "NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Bronx"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/bronx/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Brooklyn"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/brooklyn/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Queens"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/queens/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Staten Island"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/staten-island/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Manhattan"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/manhattan/feed/",
		},
		{
			name: NewsSources.PIX11,
			region: ["NYC", "New York City", "Long Island"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/local-news/long-island/feed/",
		},
		{
			name: NewsSources.WSYR,
			region: ["Syracuse"],
			coverage: ["local"],
			src: "https://www.localsyr.com/feed/",
		},
		{
			name: NewsSources.RochesterFirst,
			region: ["Rochester"],
			coverage: ["local"],
			src: "https://www.rochesterfirst.com/feed/",
		},
		{
			name: NewsSources.NEWS10,
			region: ["Albany"],
			coverage: ["local"],
			src: "https://www.news10.com/feed/",
		},
	],
};

export const NEW_YORK_VIDEOS = {
	categories: ["news"],
	region: ["North America", "US", "New York"],
	coverage: [],
	language: "en",
	sources: [
		{
			name: NewsSources.CBS,
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCNZyLULUQBp5e9Q1cKtvk6Q",
		},
		{
			name: NewsSources.NBC,
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCxCfoSInadl-4i3F70zDt1A",
		},
		{
			name: NewsSources.ABC7NY,
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCrlIS7z20CnVaCrMvdkig_g",
		},
		{
			name: NewsSources.PIX11,
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCnWi59TPymx0_qt7PX3VeNA",
		},
		{
			name: NewsSources.WSYR,
			region: ["Syracuse"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC-3Vp3Qy14wylC9WK8F1zUA",
		},
		{
			name: NewsSources.News8WROC,
			region: ["Rochester"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCzocYTD8J3ezkaoND4iQPGA",
		},
		{
			name: NewsSources.NEWS12,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCFhbonoFqxg2b9FMRzYAwog",
		},
		{
			name: NewsSources.NEWS10,
			region: ["Albany"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCTj_Xv-2yw52Cm8Bl3LZq2w",
		},
		{
			name: NewsSources.CBS6,
			region: ["Albany"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCMKP8n1dUg-b84lfpb0mfdA",
		},
		{
			name: NewsSources.WNYT,
			region: ["Albany"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UC5CEbfa5Q3j3w-rPIq-3XOg",
		},
		{
			name: NewsSources.WIVB,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCENwe4N7FQCfIWY5wEjimNA",
		},
		{
			name: NewsSources.WKBW,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCfbPQcdF5an7ui8bwwry1Cw",
		},
		{
			name: NewsSources.FOX5_NY,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIjSUWHWp6KohfnR5OQTXnQ",
		},
		{
			name: NewsSources.WENY,
			region: ["Elmira"],
			coverage: ["local"],
			src: "https://www.youtube.com/feeds/videos.xml?channel_id=UCENwe4N7FQCfIWY5wEjimNA",
		},
	],
};
