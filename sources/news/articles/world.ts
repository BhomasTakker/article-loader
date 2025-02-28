import { NewsSources } from "../sources";

// https://rss.feedspot.com/world_news_rss_feeds/
export const WORLD = {
	categories: [],
	collectionType: "news",
	region: "world",
	language: "en",
	sources: [
		{
			name: NewsSources.BBC,
			src: "https://feeds.bbci.co.uk/news/world/rss.xml",
		},
		{
			name: NewsSources.METRO,
			src: "https://metro.co.uk/news/world/feed/",
		},
		{
			name: NewsSources.SKY,
			src: "https://feeds.skynews.com/feeds/rss/world.xml",
		},
		{
			name: NewsSources.GUARDIAN,
			src: "https://www.theguardian.com/international/rss",
		},
		{
			name: NewsSources.AL_JAZEERA,
			src: "https://www.aljazeera.com/xml/rss/all.xml",
		},
		{
			name: NewsSources.NEW_YORK_TIMES,
			src: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
		},
		{
			name: NewsSources.WASHINGTON_POST,
			src: "http://feeds.washingtonpost.com/rss/world",
		},
		{
			name: NewsSources.ARAB_NEWS,
			src: "https://www.arabnews.com/taxonomy/term/3/feed",
		},
		{
			name: NewsSources.CNBC,
			src: "https://www.cnbc.com/id/100727362/device/rss/rss.html",
		},
		{
			name: NewsSources.ABC,
			src: "https://abcnews.go.com/abcnews/internationalheadlines",
		},
		{
			name: NewsSources.FOX,
			src: "https://feeds.foxnews.com/foxnews/world",
		},
		{
			name: NewsSources.CBS,
			src: "https://www.cbsnews.com/latest/rss/world",
		},
		{
			name: NewsSources.CBC,
			src: "https://www.cbc.ca/cmlink/rss-world",
		},
		{
			name: NewsSources.THE_PINK_NEWS,
			src: "https://www.thepinknews.com/news/world/feed/",
		},
		{
			name: NewsSources.HERALD_SCOTLAND,
			src: "https://www.heraldscotland.com/news/world_news/rss/",
		},
		{
			name: NewsSources.INDEPENDENT,
			src: "https://www.independent.co.uk/news/world/rss",
		},
		{
			name: NewsSources.WALL_STREET_JOURNAL,
			src: "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
		},
		// {
		//   name: 'The Atlantic',
		//   url: 'https://www.theatlantic.com/world/',
		//   description: 'World news and analysis from The Atlantic.',
		//   category: 'world',
		//   provider: 'The Atlantic',
		//   src: 'https://www.theatlantic.com/feed/all/',
		// },
		{
			name: NewsSources.THE_CONVERSATION,
			src: "https://theconversation.com/global/articles.atom",
		},
		{
			name: NewsSources.DEUTSCHE_WELLE,
			src: "https://rss.dw.com/rdf/rss-en-all",
		},
		{
			name: NewsSources.FRANCE_24,
			src: "https://www.france24.com/en/rss",
		},
		{
			name: NewsSources.US_NEWS,
			src: "https://www.usnews.com/rss/news/world",
		},
		{
			name: NewsSources.GLOBAL_NEWS,
			src: "https://globalnews.ca/world/feed/",
		},
		{
			name: NewsSources.TIME,
			src: "https://time.com/feed/",
		},
		{
			name: NewsSources.NPR,
			src: "https://www.npr.org/rss/rss.php?id=1004",
		},
		{
			name: NewsSources.YAHOO,
			src: "https://news.yahoo.com/rss/world",
		},
		{
			name: NewsSources.WASHINGTON_TIMES,
			src: "https://www.washingtontimes.com/rss/headlines/news/world/",
		},
		{
			name: NewsSources.USA_TODAY,
			src: "https://rssfeeds.usatoday.com/usatoday-NewsTopStories",
		},
		{
			name: NewsSources.SUN,
			src: "https://www.thesun.co.uk/news/worldnews/feed/",
		},
		{
			name: NewsSources.MIRROR,
			src: "https://www.mirror.co.uk/news/world-news/?service=rss",
		},
		{
			name: NewsSources.DAILY_MAIL,
			src: "https://www.dailymail.co.uk/news/worldnews/index.rss",
		},
		{
			name: NewsSources.HUFFPOST,
			src: "https://www.huffpost.com/section/world-news/feed",
		},
		{
			name: NewsSources.SYDNEY_MORNING_HERALD,
			src: "https://www.smh.com.au/rss/world.xml",
		},
		{
			name: NewsSources.GLOBE_AND_MAIL,
			src: "https://www.theglobeandmail.com/world/?service=rss",
		},
		{
			name: NewsSources.TORONTO_STAR,
			// Accepts a query!
			src: "https://www.thestar.com/search/?f=rss&t=article&c=news/world*&l=50&s=start_time&sd=desc",
		},
		{
			name: NewsSources.JAPAN_TIMES,
			src: "https://www.japantimes.co.jp/feed/",
		},
		{
			name: NewsSources.SOUTH_CHINA_MORNING_POST,
			src: "https://www.scmp.com/rss/4/feed",
		},
		{
			name: NewsSources.STRAITS_TIMES,
			src: "https://www.straitstimes.com/news/world/rss.xml",
		},
		{
			name: NewsSources.TIMES_OF_INDIA,
			src: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
		},
		{
			name: NewsSources.LA_TIMES,
			src: "https://www.latimes.com/world-nation/rss2.0.xml",
		},
		{
			name: NewsSources.SEATLE_TIMES,
			src: "https://www.seattletimes.com/nation-world/feed/",
		},
		{
			name: NewsSources.RT,
			src: "https://www.rt.com/rss/news/",
		},
		{
			name: NewsSources.NDTV,
			src: "https://feeds.feedburner.com/NDTV-LatestNews",
		},
		{
			name: NewsSources.E_INTERNATIONAL_RELATIONS,
			src: "https://www.e-ir.info/feed/",
		},
		{
			name: NewsSources.UN,
			src: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
		},
		{
			name: NewsSources.GLOBAL_ISSUES,
			src: "https://www.globalissues.org/news/feed",
		},
		{
			name: NewsSources.CIPHER_BRIEF,
			src: "https://www.thecipherbrief.com/feed",
		},
		{
			name: NewsSources.EXPRESS,
			src: "https://feeds.feedburner.com/daily-express-world-news",
		},
		{
			name: NewsSources.EURONEWS,
			src: "https://www.euronews.com/rss?level=theme&name=news",
		},
		{
			name: NewsSources.VOX,
			src: "https://www.vox.com/rss/world-politics/index.xml",
		},
		{
			name: NewsSources.CHANNEL_NEWS_ASIA,
			src: "https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml",
		},
		{
			name: NewsSources.NEWS_24,
			src: "https://www.news24.com/news24/TopStories/rss",
		},
		{
			name: NewsSources.THE_DIPLOMAT,
			src: "https://thediplomat.com/feed/",
		},
		{
			name: NewsSources.MOSCOW_TIMES,
			src: "https://www.themoscowtimes.com/rss/news",
		},
		// {
		//   name: 'The New Yorker',
		//   origin: 'USA',
		//   url: 'https://www.newyorker.com/news',
		//   description: 'World news and headlines from The New Yorker.',
		//   category: 'world',
		//   provider: 'The New Yorker',
		//   src: 'https://www.newyorker.com/feed/news',
		// },
		{
			name: NewsSources.THE_NEW_HUMANITARIAN,
			src: "https://www.thenewhumanitarian.org/rss",
		},
		{
			name: NewsSources.RAW_STORY,
			src: "https://www.rawstory.com/category/world/feed/",
		},
		{
			name: NewsSources.IFP_NEWS,
			src: "https://ifpnews.com/category/news/world/feed/",
		},
		{
			name: NewsSources.SOUTH_CHINA_MORNING_POST,
			src: "https://www.scmp.com/rss/5/feed",
		},
		{
			name: NewsSources.THE_WORLD,
			src: "https://feeds.theworld.org/feed",
		},
		{
			name: NewsSources.SPUTNIK,
			src: "https://sputniknews.com/export/rss2/archive/index.xml",
		},
		{
			name: NewsSources.BUZZFEED,
			src: "https://www.buzzfeednews.com/world.xml",
		},
	],
};
