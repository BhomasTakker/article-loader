import { NewsSources } from "../../sources";

export const US_1 = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.CNN,
			src: "http://rss.cnn.com/rss/cnn_us.rss",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.FOX,
			src: "http://feeds.foxnews.com/foxnews/national",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
		},
		{
			name: NewsSources.YAHOO,
			src: "https://news.yahoo.com/rss/",
		},
		{
			name: NewsSources.SKY,
			src: "https://feeds.skynews.com/feeds/rss/us.xml",
		},
		{
			name: NewsSources.GUARDIAN,
			src: "https://www.theguardian.com/us/rss",
		},
		{
			name: NewsSources.NPR,
			src: "https://www.npr.org/rss/rss.php?id=1001",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.WKBW,
			src: "https://www.wkbw.com/news.rss",
		},
	],
};

export const US_2 = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.NEW_YORK_TIMES,
			src: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
		},
		{
			name: NewsSources.WASHINGTON_TIMES,
			src: "https://www.washingtontimes.com/rss/headlines/news/",
		},
		{
			name: NewsSources.LA_TIMES,
			src: "https://www.latimes.com/world-nation/rss2.0.xml",
		},
		{
			name: NewsSources.MERCURY_NEWS,
			src: "https://www.mercurynews.com/news/national-news/feed/",
		},
		{
			name: NewsSources.CBS,
			src: "https://www.cbsnews.com/latest/rss/main",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.ABC,
			src: "http://abcnews.go.com/abcnews/usheadlines",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.BREITBART,
			src: "https://www.breitbart.com/feed/",
			coverage: ["national", "international"],
		},
		{
			name: NewsSources.BOSTON_HEARLD,
			src: "https://www.bostonherald.com/feed/",
			coverage: ["national", "regional", "local"],
			region: ["New England", "Northeast", "Boston"],
		},
		{
			name: NewsSources.DENVER_POST,
			src: "https://www.denverpost.com/news/national/feed/",
		},
		{
			name: NewsSources.NEW_YORK_POST,
			src: "https://nypost.com/us-news/feed/",
		},
		{
			name: NewsSources.WIVB,
			src: "https://www.wivb.com/news/national/feed/",
		},
	],
};

export const US_3 = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.THE_HILL,
			src: "http://thehill.com/rss/syndicator/19110",
		},

		{
			name: NewsSources.POLITICO,
			src: "https://www.politico.com/rss/politicopicks.xml",
		},
		{
			name: NewsSources.VOX,
			// https://www.vox.com/rss/politics/index.xml
			src: "https://www.vox.com/rss/index.xml",
		},
		{
			name: NewsSources.THE_ATLANTIC,
			src: "https://www.theatlantic.com/feed/all/",
		},
		{
			name: NewsSources.SEATTLE_TIMES,
			src: "https://www.seattletimes.com/nation-world/nation/feed/",
		},
		{
			name: NewsSources.INTERCEPT,
			src: "https://theintercept.com/feed/?lang=en",
		},
		{
			name: NewsSources.VERGE,
			src: "https://www.theverge.com/rss/index.xml",
		},
		{
			name: NewsSources.THE_DAILY_BEAST,
			src: "https://www.thedailybeast.com/arc/outboundfeeds/rss/articles/",
		},
		{
			name: NewsSources.METRO,
			src: "https://metro.co.uk/news/us/feed/",
		},
		{
			name: NewsSources.FOX5_NY,
			region: ["NYC", "New York City"],
			src: "https://www.fox5ny.com/rss/category/national-news",
		},
	],
};

export const US_4 = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.DAILY_MAIL,
			src: "https://www.dailymail.co.uk/ushome/index.rss",
		},
		{
			name: NewsSources.THE_PINK_NEWS,
			src: "https://www.thepinknews.com/news/us/feed/",
		},
		{
			name: NewsSources.THE_NEW_YORKER,
			src: "https://www.newyorker.com/feed/news",
		},
		{
			name: NewsSources.THE_ONION,
			src: "https://www.theonion.com/rss",
		},
		{
			name: NewsSources.THE_DAILY_CALLER,
			src: "https://dailycaller.com/feed/",
		},
		{
			name: NewsSources.THE_FEDERALIST,
			src: "https://thefederalist.com/feed/",
		},
		{
			name: NewsSources.THE_AMERICAN_CONSERVATIVE,
			src: "https://www.theamericanconservative.com/feed/",
		},
		{
			name: NewsSources.THE_BULWARK,
			src: "https://thebulwark.com/feed/",
		},
		{
			name: NewsSources.SUN,
			src: "https://www.thesun.co.uk/news/us-news/feed/",
		},
		{
			name: NewsSources.MIRROR,
			src: "https://www.mirror.co.uk/news/us-news/rss.xml",
		},
		{
			name: NewsSources.LOCAL10,
			src: "https://www.local10.com/arc/outboundfeeds/rss/category/news/national/?outputType=xml",
		},
	],
};

export const US_5 = {
	categories: ["news"],
	region: ["North America", "US"],
	coverage: ["national"],
	language: "en",
	sources: [
		{
			name: NewsSources.TENNESSEE_HOLLER,
			src: "https://tnholler.com/feed/",
			coverage: ["regional"],
			region: ["Tennessee"],
		},
		{
			name: NewsSources.DROP_SITE_NEWS,
			src: "https://www.dropsitenews.com/feed",
		},
		{
			name: NewsSources.THE_INTELLECTUALIST,
			src: "https://theintellectualist.com/feed/",
		},
		{
			name: NewsSources.GRAY_ZONE,
			src: "https://thegrayzone.com/feed/",
		},
		{
			name: NewsSources.ROLLING_STONE,
			src: "https://www.rollingstone.com/feed/",
		},
		{
			news: NewsSources.MINT_PRESS_NEWS,
			src: "https://www.mintpressnews.com/feed/",
		},
		{
			news: NewsSources.TRUTHOUT,
			src: "https://truthout.org/feed/",
		},
		{
			news: NewsSources.REVEAL_NEWS,
			src: "https://www.revealnews.org/feed/",
		},
		{
			news: NewsSources.DAILY_WIRE,
			src: "https://www.dailywire.com/feeds/rss.xml",
		},
		{
			news: NewsSources.SLATE,
			src: "https://slate.com/feeds/all.rss",
		},
		{
			news: NewsSources.ZETEO,
			src: "https://zeteo.com/feed",
		},
		{
			name: NewsSources.EXPRESS,
			src: "https://www.express.co.uk/posts/rss/198/us",
		},
	],
};
