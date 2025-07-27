import { NewsSources } from "../../sources";
import { ny_sources } from "./newyork-sources";

export const NEW_YORK_ARTICLES = {
	categories: ["news"],
	region: ["North America", "US", "New York"],
	coverage: [],
	language: "en",
	sources: [
		{
			name: ny_sources.ABC7NY,
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
			name: ny_sources.SYRACUSE,
			region: ["Syracuse"],
			coverage: ["local"],
			src: "https://www.syracuse.com/arc/outboundfeeds/rss/category/state/?outputType=xml",
		},
		{
			name: ny_sources.WKBW,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wkbw.com/news/local-news/buffalo.rss",
		},
		{
			name: ny_sources.WIVB,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wivb.com/news/local-news/feed/",
		},
		{
			name: ny_sources.WIVB,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://www.wivb.com/feed/",
		},
		// Much the same as each other / remove some
		{
			name: ny_sources.SPECTRUM,
			src: "https://ny1.com/services/contentfeed.nyc%7call-boroughs%7cnews.landing.rss",
			coverage: ["local"],
		},
		{
			name: ny_sources.SPECTRUM,
			region: ["Central"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7ccentral-ny%7cnews.landing.rss",
		},
		{
			name: ny_sources.SPECTRUM,
			region: ["Hudson Valley"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7chudson-valley%7cnews.landing.rss",
		},
		{
			name: ny_sources.SPECTRUM,
			region: ["Buffalo"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7cbuffalo%7cnews.landing.rss",
		},
		{
			name: ny_sources.SPECTRUM,
			region: ["Rochester"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7crochester%7cnews.landing.rss",
		},
		{
			name: ny_sources.SPECTRUM,
			region: ["Binghamton"],
			coverage: ["local"],
			src: "https://spectrumlocalnews.com/services/contentfeed.nys%7cbinghamton%7cnews.landing.rss",
		},
		{
			name: ny_sources.SPECTRUM,
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
			name: ny_sources.FOX5_NY,
			region: ["NYC", "New York City"],
			coverage: ["local"],
			src: "https://www.fox5ny.com/rss/category/news",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["New York", "NYC", "New York City"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Bronx"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/bronx/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Brooklyn"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/brooklyn/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Queens"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/queens/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Staten Island"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/staten-island/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Manhattan"],
			coverage: ["local"],
			src: "https://pix11.com/news/local-news/manhattan/feed/",
		},
		{
			name: ny_sources.PIX11,
			region: ["NYC", "New York City", "Long Island"],
			coverage: ["regional", "local"],
			src: "https://pix11.com/news/local-news/long-island/feed/",
		},
		{
			name: ny_sources.WSYR,
			region: ["Syracuse"],
			coverage: ["local"],
			src: "https://www.localsyr.com/feed/",
		},
		{
			name: ny_sources.RochesterFirst,
			region: ["Rochester"],
			coverage: ["local"],
			src: "https://www.rochesterfirst.com/feed/",
		},
		{
			name: ny_sources.NEWS10,
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
