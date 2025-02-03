// export const BBC_COLLECTIONS = [
// 	"https://feeds.bbci.co.uk/news/world/rss.xml",
// 	"https://feeds.bbci.co.uk/news/uk/rss.xml",
// 	"https://feeds.bbci.co.uk/news/business/rss.xml",
// 	"https://feeds.bbci.co.uk/news/politics/rss.xml",
// 	"https://feeds.bbci.co.uk/news/health/rss.xml",
// 	"https://feeds.bbci.co.uk/news/education/rss.xml",
// 	"https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
// 	"https://feeds.bbci.co.uk/news/technology/rss.xml",
// 	"https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
// ];

// Look at london economis say
// We are not taking sources correctly from RSS 1.0?
/////
// Wall street journal - blocking meta loads
// https://feeds.content.dowjones.io/public/rss/RSSUSnews
//
//doesn't want to happen
// https://www.democracynow.org/democracynow.rss
export const WORLD_MAIN = [
	"https://feeds.bbci.co.uk/news/world/rss.xml",
	"https://feeds.skynews.com/feeds/rss/world.xml",
	"https://www.aljazeera.com/xml/rss/all.xml",
	"https://www.theguardian.com/world/rss",
	"https://theconversation.com/uk/world/articles.atom",
	"https://rss.dw.com/rdf/rss-en-world",
	// dpuble check this is okay with the query! / we may be stripping that off?
	"https://www.euronews.com/rss?format=mrss&level=theme&name=news,",
];

export const UK_MAIN = [
	"https://feeds.bbci.co.uk/news/uk/rss.xml",
	"https://feeds.skynews.com/feeds/rss/uk.xml",
	"https://www.theguardian.com/uk/rss",
	"https://www.independent.co.uk/news/uk/rss",
	// "https://www.telegraph.co.uk/rss.xml",
	"https://www.huffingtonpost.co.uk/feeds/index.xml",
	"https://www.mirror.co.uk/?service=rss",
	"https://metro.co.uk/feed/",
	// "https://www.thelondoneconomic.com/feed",
];

export const US_MAIN = [
	"https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
	"https://feeds.skynews.com/feeds/rss/us.xml",
	"https://www.propublica.org/feeds/propublica/main",
	// "https://www.usnews.com/rss/news",
	// "https://feeds.content.dowjones.io/public/rss/RSSUSnews",
	"https://www.theguardian.com/us-news/rss",
	// "https://www.democracynow.org/democracynow.rss",
	"https://truthout.org/latest/feed/",
	"https://theconversation.com/us/articles.atom",
];

export const US_INDEPENDENTS = [
	"https://forbiddenstories.org/feed/",
	"https://www.dropsitenews.com/feed",
	"https://www.caitlinjohnst.one/feed",
	"https://www.muellershewrote.com/feed",
	"https://www.thefp.com/feed",
];

export const UK_INDEPENDENTS = [
	"https://www.thecanary.co/feed/",
	"https://novaramedia.com/feed/",
	"https://bylinetimes.com/feed/",
	"https://morningstaronline.co.uk/rss.xml",
];

export const UK_REPORTERS = [
	"https://www.owenjones.news/feed",
	"https://broligarchy.substack.com/feed",
	"https://manchestermill.co.uk/rss/",
];

export const INVESTIGATIVE = [
	"https://www.bellingcat.com/feed/",
	"https://www.thebureauinvestigates.com/feed",
	"https://www.icij.org/feed/",
	"https://www.occrp.org/en/feed/",
	"https://revealnews.org/feed/",
	"https://readsludge.com/rss/",
	"https://unlimitedhangout.com/feed/",
	"https://covertactionmagazine.com/feed/",
	"https://americanoversight.org/feed/",
	"https://www.exposedbycmd.org/feed/",
	"https://forbiddenstories.org/feed/",
	"https://www.dropsitenews.com/feed",
	"https://unearthed.greenpeace.org/feed/",
];

export const NEWS_ARTICLES_COLLECTION = [
	...WORLD_MAIN,
	...UK_MAIN,
	...US_MAIN,
	// ...US_INDEPENDENTS,
	// ...UK_INDEPENDENTS,
	// ...UK_REPORTERS,
	// ...INVESTGATIVE,
];
