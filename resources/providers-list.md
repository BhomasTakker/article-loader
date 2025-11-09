# Article Providers List

This document contains a comprehensive list of all article providers in the system. Providers are organized by region and can be used for filtering articles.

Last Updated: November 9, 2025

---

## Provider Structure

Each provider has the following properties:

- **name**: Display name of the provider
- **description**: Brief description
- **url**: Provider's website URL
- **rating**: Quality rating (0-100)
- **leaning**: Political leaning (-1 to 1, where negative=left, positive=right, 0=neutral)
- **origin**: Country/region of origin
- **logo**: Logo URL (optional)

---

## US National Providers (48)

1. Arab News
2. The Huffington Post
3. CNN
4. Fox News
5. The Wall Street Journal
6. Yahoo News
7. NPR
8. Washington Times
9. LA Times
10. Mercury News
11. CBS
12. ABC
13. Breitbart
14. Boston Herald
15. Denver Post
16. New York Post
17. The Hill
18. Politico
19. Vox
20. Buzzfeed
21. The Atlantic
22. Seattle Times
23. The Intercept
24. The Verge
25. The Daily Beast
26. The New Yorker
27. The Onion
28. The Daily Caller
29. The Federalist
30. The American Conservative
31. The Bulwark
32. New York Times
33. The Washington Post
34. CNBC
35. US News
36. Time
37. USA Today
38. NBC
39. PBS
40. Reuters
41. ProPublica
42. Democracy Now
43. Bloomberg
44. Tennessee Holler
45. The Intellectualist
46. Drop Site News
47. Daily Wire
48. Slate

---

## US Regional Providers

### New York State (16)

1. Syracuse
2. WKBW
3. WIVB
4. Spectrum News
5. Fox 5 NY
6. ABC 7 NY
7. PIX 11
8. WSYR
9. 13 WHAM
10. News 8 WROC
11. Rochester First
12. News 12
13. News 10
14. CBS 6 Albany
15. WNYT
16. WENY

### Florida (15)

1. Fox 4 Now
2. Local 10 News
3. Miami Herald
4. ABC Action News
5. Orlando Weekly
6. News 4 Jax
7. NBC 6 South Florida
8. Fox 13 Tampa Bay
9. WESH 2 News
10. Fox 35 Orlando
11. WKMG News 6
12. WPTV News
13. WFLA News Channel 8
14. Action News Jax
15. CBS Miami

---

## International Providers (34)

### Canadian

- CBC
- Global News
- Globe and Mail
- Toronto Star

### European

- Al Jazeera
- Deutsche Welle
- France 24
- Euronews
- The Moscow Times

### Asian & Pacific

- Sydney Morning Herald
- Japan Times
- South China Morning Post
- Straits Times
- Times of India
- NDTV
- Channel News Asia
- ABC AUS
- First Post

### Middle Eastern

- Arab News

### African

- News24
- SABC

### Global News Agencies

- Reuters
- AFP
- Associated Press

### International Organizations & Analysis

- United Nations
- E-International Relations
- The Cipher Brief
- The Diplomat
- The New Humanitarian
- Global Issues

### Other International

- RT
- Sputnik
- IFP News
- The World
- 9News
- TRT
- Raw Story

---

## Middle East & Conflict Coverage (16)

1. Kyiv Independent
2. The Gray Zone
3. Electronic Intifada
4. Quds News
5. The Times Of Israel
6. Haaretz
7. Middle East Eye
8. Rolling Stone
9. Mint Press News
10. Truthout
11. Reveal News
12. The Cradle
13. Roya News
14. Zeteo
15. Palestine Chronicle
16. Palestine News Network

---

## UK National Providers (30)

1. BBC
2. The Guardian
3. The Telegraph
4. The Mirror
5. The Daily Mail
6. Metro
7. The Evening Standard
8. The Sun
9. Sky News
10. Times
11. The Independent
12. ITV
13. Channel 4
14. Channel 5
15. The Sheffield Tribune
16. The Economist
17. Novara Media
18. Byline Times
19. Council Estate Media
20. Owen Jones
21. Double Down News
22. The Conversation
23. The Pink News
24. politics.co.uk
25. GB News
26. FT (Financial Times)
27. The Star
28. Declassified UK
29. TLDR News
30. Daily Express

---

## UK Regional Providers

### Scotland (6)

1. The National
2. Herald Scotland
3. STV
4. The Scotsman
5. Daily Record
6. Scottish Sun

**Regional Coverage:**

- Glasgow (providers in Glasgow subdirectory)
- Edinburgh (providers in Edinburgh subdirectory)

### Wales (12)

1. Wales Online
2. Herald Wales
3. Powys County Times
4. Wales 247
5. Nation Cymru
6. North Wales Live
7. South Wales Guardian
8. South Wales Argus
9. Cardiff TV
10. Cardiff Post
11. Penarth Times
12. Swansea Bay News

### Northern Ireland (4)

1. Belfast Live
2. The Irish News
3. Northern Ireland World
4. UTV

### England

**Cities with local providers:**

- Birmingham
- Manchester
- Liverpool
- Yorkshire

**Regional subdivisions planned:**

- West Midlands
- East Midlands
- East Anglia
- South East
- South West
- North East
- North West

---

## Provider Statistics

- **Total Providers**: 180+
- **US Providers**: 79 (National: 48, Regional: 31)
- **UK Providers**: 52 (National: 30, Regional: 22+)
- **International Providers**: 34
- **Middle East Coverage**: 16

---

## Filtering by Provider

Providers can be filtered using the `provider.name` field. Example queries:

```typescript
// Filter by specific provider
articles.filter((article) => article.provider?.name === "BBC");

// Filter by multiple providers
const providers = ["CNN", "BBC", "Reuters"];
articles.filter((article) => providers.includes(article.provider?.name));

// Filter by origin
articles.filter((article) => article.provider?.origin === "UK");

// Filter by political leaning (neutral sources)
articles.filter(
	(article) =>
		article.provider?.leaning >= -0.1 && article.provider?.leaning <= 0.1
);

// Filter by quality rating
articles.filter((article) => article.provider?.rating >= 80);
```

---

## Source Files

Provider definitions are located in:

- **Main sources**: `sources/news/sources.ts`
- **US providers**: `sources/news/providers/us.ts`
- **UK providers**: `sources/news/providers/uk.ts`
- **World providers**: `sources/news/providers/world.ts`
- **Regional sources**:
  - UK: `sources/news/articles/uk/`
  - US: `sources/news/articles/united-states/`

---

## Missing Major News Providers with RSS Feeds

The following are notable news providers with RSS feeds that are not currently in the system:

### US National News (Missing)

**Major Networks & Newspapers:**

- **MSNBC** - https://www.msnbc.com/feeds/latest
- **Newsweek** - https://www.newsweek.com/rss
- **Christian Science Monitor** - https://rss.csmonitor.com/feeds/all
- **The Boston Globe** - https://www.bostonglobe.com/rss
- **Chicago Tribune** - https://www.chicagotribune.com/arcio/rss/
- **San Francisco Chronicle** - https://www.sfchronicle.com/rss/
- **The Philadelphia Inquirer** - https://www.inquirer.com/arc/outboundfeeds/rss/
- **Houston Chronicle** - https://www.houstonchronicle.com/rss/
- **The Dallas Morning News** - https://www.dallasnews.com/feed/
- **The Arizona Republic** - https://www.azcentral.com/rss/
- **The Atlanta Journal-Constitution** - https://www.ajc.com/rss/

**Business & Tech:**

- **Forbes** - https://www.forbes.com/real-time/feed2/
- **Business Insider** - https://www.businessinsider.com/rss
- **MarketWatch** - https://www.marketwatch.com/rss/
- **Ars Technica** - https://feeds.arstechnica.com/arstechnica/index
- **TechCrunch** - https://techcrunch.com/feed/
- **Wired** - https://www.wired.com/feed/rss
- **The Information** (paid) - Limited RSS
- **Barron's** - https://www.barrons.com/rss

**Alternative/Independent:**

- **The American Prospect** - https://prospect.org/rss.xml
- **Mother Jones** - https://www.motherjones.com/feed/
- **The Nation** - https://www.thenation.com/feed/
- **Jacobin** - https://jacobin.com/feed/
- **Common Dreams** - https://www.commondreams.org/feeds/feed.rss
- **CounterPunch** - https://www.counterpunch.org/feed/
- **In These Times** - https://inthesetimes.com/rss.xml
- **Reason** - https://reason.com/feed/
- **The Libertarian Institute** - https://libertarianinstitute.org/feed/
- **National Review** - https://www.nationalreview.com/feed/

**Regional/Specialty:**

- **Texas Tribune** - https://www.texastribune.org/rss.xml
- **Voice of America** - https://www.voanews.com/api/zq_pveqm
- **The Oregonian** - https://www.oregonlive.com/arc/outboundfeeds/rss/
- **The Charlotte Observer** - https://www.charlotteobserver.com/rss/
- **The Sacramento Bee** - https://www.sacbee.com/rss/

### International News (Missing)

**European:**

- **The Local** (Europe) - Multiple RSS feeds by country
  - https://www.thelocal.com/feeds/rss/all
- **Politico Europe** - https://www.politico.eu/rss
- **Irish Times** - https://www.irishtimes.com/cmlink/news-1.1319192
- **The Irish Independent** - https://www.independent.ie/rss/
- **RTE News** (Ireland) - https://www.rte.ie/rss/
- **swissinfo.ch** - https://www.swissinfo.ch/eng/rss
- **The Brussels Times** - https://www.brusselstimes.com/feed
- **Agence France-Presse (AFP)** - Various feeds
- **EUobserver** - https://euobserver.com/rss.xml
- **Balkan Insight** - https://balkaninsight.com/feed/
- **Kyiv Post** - https://www.kyivpost.com/feed

**Asian:**

- **The Hindu** - https://www.thehindu.com/feeder/default.rss
- **The Indian Express** - https://indianexpress.com/feed/
- **Dawn** (Pakistan) - https://www.dawn.com/feeds/home
- **The Nation** (Pakistan) - https://nation.com.pk/rss/home
- **Bangkok Post** - https://www.bangkokpost.com/rss/data/news.xml
- **The Jakarta Post** - https://www.thejakartapost.com/rss
- **Nikkei Asia** - https://asia.nikkei.com/rss/feed/nar
- **Korea Times** - https://www.koreatimes.co.kr/www/rss/index.xml
- **China Daily** - https://www.chinadaily.com.cn/rss/
- **Taiwan News** - https://www.taiwannews.com.tw/rss
- **The Mainichi** (Japan) - https://mainichi.jp/english/rss/index.xml

**Middle East:**

- **Jerusalem Post** - https://www.jpost.com/rss/
- **Daily Sabah** (Turkey) - https://www.dailysabah.com/rss
- **Gulf News** - https://gulfnews.com/rss
- **The National** (UAE) - https://www.thenationalnews.com/rss
- **Asharq Al-Awsat** - https://english.aawsat.com/rss
- **Iran International** - https://www.iranintl.com/en/rss

**Latin America:**

- **Buenos Aires Times** - https://www.batimes.com.ar/feed
- **Brazil Reports** - https://brazilreports.com/feed/
- **Mexico News Daily** - https://mexiconewsdaily.com/feed/

**Africa:**

- **Daily Maverick** (South Africa) - https://www.dailymaverick.co.za/rss/
- **Mail & Guardian** (South Africa) - https://mg.co.za/rss/
- **The East African** - https://www.theeastafrican.co.ke/tea/rss
- **Premium Times** (Nigeria) - https://www.premiumtimesng.com/feed
- **The Standard** (Kenya) - https://www.standardmedia.co.ke/rss/

**Australia/NZ:**

- **The Age** - https://www.theage.com.au/rss/feed.xml
- **The Australian** - https://www.theaustralian.com.au/feed/
- **The Guardian Australia** - https://www.theguardian.com/australia-rss
- **New Zealand Herald** - https://www.nzherald.co.nz/arc/outboundfeeds/rss/

**Canadian (Additional):**

- **The Star** (Toronto Star) - You have this
- **National Post** - https://nationalpost.com/feed/
- **Montreal Gazette** - https://montrealgazette.com/feed/
- **Vancouver Sun** - https://vancouversun.com/feed/
- **CTV News** - https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009

### News Aggregators & Wire Services

- **Associated Press News** - https://apnews.com/apf-topnews (You have AP listed but may need specific feeds)
- **UPI** - https://www.upi.com/rss/
- **PRNewswire** - https://www.prnewswire.com/rss/
- **Xinhua** (China) - http://www.xinhuanet.com/english/rss.xml
- **TASS** (Russia) - https://tass.com/rss/v2.xml
- **ANI** (Asian News International) - https://www.aninews.in/feed/

### Investigative & Long-form

- **The Marshall Project** - https://www.themarshallproject.org/rss/
- **Bellingcat** - https://www.bellingcat.com/feed/
- **The Bureau of Investigative Journalism** - https://www.thebureauinvestigates.com/feed
- **Type Investigations** - https://www.typeinvestigations.org/feed/
- **100 Reporters** - https://100r.org/feed/

### Science & Environment

- **Science Daily** - https://www.sciencedaily.com/rss/all.xml
- **Phys.org** - https://phys.org/rss-feed/
- **Nature News** - https://www.nature.com/nature.rss
- **Scientific American** - https://www.scientificamerican.com/feeds/news/
- **Gizmodo** - https://gizmodo.com/rss
- **Yale Environment 360** - https://e360.yale.edu/feed
- **Inside Climate News** - https://insideclimatenews.org/feed/
- **Mongabay** - https://news.mongabay.com/feed/
- **Carbon Brief** - https://www.carbonbrief.org/feed/

### Fact-Checking & Media Analysis

- **PolitiFact** - https://www.politifact.com/rss/all/
- **FactCheck.org** - https://www.factcheck.org/feed/
- **Snopes** - https://www.snopes.com/feed/
- **Full Fact** (UK) - https://fullfact.org/rss/
- **Poynter** - https://www.poynter.org/feed/
- **Columbia Journalism Review** - https://www.cjr.org/feed

### Human Rights & Social Justice

- **Human Rights Watch** - https://www.hrw.org/rss
- **Amnesty International** - https://www.amnesty.org/en/rss/
- **ACLU** - https://www.aclu.org/rss.xml
- **Southern Poverty Law Center** - https://www.splcenter.org/rss.xml
- **The 19th** (Gender/Politics) - https://19thnews.org/feed/

---

## RSS Feed Implementation Notes

**Testing Feeds:**

- Always test RSS feeds before adding them permanently
- Some feeds may require parsing adjustments for different formats (RSS 2.0, Atom, etc.)
- Check update frequency - some providers update hourly, others daily

**Common RSS URL Patterns:**

- `/rss/` or `/feed/` at end of domain
- `/rss.xml` or `/feed.xml`
- `/arc/outboundfeeds/rss/` for sites using Arc Publishing
- Category-specific feeds often available (e.g., `/politics/rss`, `/world/feed`)

**Considerations:**

- Some feeds may be paywalled (WSJ, NYT, FT have limited free articles)
- Rate limiting may apply
- Feed quality varies (some include full text, others just headlines)
- Check robots.txt and terms of service

---

## Notes

- Providers are stored in a Map structure (`newsSourcesMap`)
- Each provider must be synced to MongoDB using `/update-providers` endpoint
- Provider ratings and leanings are subjective assessments for filtering purposes
- Additional regional providers can be added by creating new source files
