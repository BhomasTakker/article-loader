const leedsLive = {
	origin: "UK",
	name: "Leeds Live",
	description:
		"Leeds Live is a news website covering the latest stories from Leeds and West Yorkshire.",
	url: "https://www.leeds-live.co.uk/",
	logo: "https://www.leeds-live.co.uk/favicon.ico",
	rating: 80,
	leaning: 0,
};

const yorkshirePost = {
	origin: "UK",
	name: "Yorkshire Post",
	description:
		"Yorkshire Post is a regional newspaper covering news from across Yorkshire.",
	url: "https://www.yorkshirepost.co.uk/",
	logo: "https://www.yorkshirepost.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const bradfordTelegraphAndArgus = {
	origin: "UK",
	name: "Bradford Telegraph and Argus",
	description:
		"Bradford Telegraph and Argus is a local newspaper covering Bradford and surrounding areas.",
	url: "https://www.thetelegraphandargus.co.uk/",
	logo: "https://www.thetelegraphandargus.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const yorkshireLive = {
	origin: "UK",
	name: "Yorkshire Live",
	description:
		"Yorkshire Live is a news website covering the latest stories from across Yorkshire.",
	url: "https://www.yorkshirelive.co.uk/",
	logo: "https://www.yorkshirelive.co.uk/favicon.ico",
	rating: 80,
	leaning: 0,
};

const yorkshireEveningPost = {
	origin: "UK",
	name: "Yorkshire Evening Post",
	description:
		"Yorkshire Evening Post is a local newspaper covering Leeds and West Yorkshire.",
	url: "https://www.yorkshireeveningpost.co.uk/",
	logo: "https://www.yorkshireeveningpost.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const yorkPress = {
	origin: "UK",
	name: "York Press",
	description:
		"York Press is a local newspaper covering York and surrounding areas.",
	url: "https://www.yorkpress.co.uk/",
	logo: "https://www.yorkpress.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const examinerLive = {
	origin: "UK",
	name: "Examiner Live",
	description:
		"Examiner Live is a news website covering Huddersfield and West Yorkshire.",
	url: "https://www.examinerlive.co.uk/",
	logo: "https://www.examinerlive.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const keighlyNews = {
	origin: "UK",
	name: "Keighly News",
	description:
		"Keighly News is a local newspaper covering Keighley and surrounding areas.",
	url: "https://www.keighleynews.co.uk/",
	logo: "https://www.keighleynews.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const ilkeyGazette = {
	origin: "UK",
	name: "Ilkey Gazette",
	description:
		"Ilkey Gazette is a local newspaper covering Ilkley and surrounding areas.",
	url: "https://www.ilkleygazette.co.uk/",
	logo: "https://www.ilkleygazette.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const cravenHerald = {
	origin: "UK",
	name: "Craven Herald",
	description:
		"Craven Herald is a local newspaper covering Craven and surrounding areas.",
	url: "https://www.cravenherald.co.uk/",
	logo: "https://www.cravenherald.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wharfedaleObserver = {
	origin: "UK",
	name: "Wharfedale Observer",
	description:
		"Wharfedale Observer is a local newspaper covering Wharfedale and surrounding areas.",
	url: "https://www.wharfedaleobserver.co.uk/",
	logo: "https://www.wharfedaleobserver.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const hullLive = {
	origin: "UK",
	name: "Hull Live",
	description:
		"Hull Live is a news website covering the latest stories from Hull and East Yorkshire.",
	url: "https://www.hulllive.co.uk/",
	logo: "https://www.hulllive.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const whereInHull = {
	origin: "UK",
	name: "Where in Hull",
	description:
		"Where in Hull is a local news and events website focused on Hull and East Yorkshire.",
	url: "https://www.whereinhull.co.uk/",
	logo: "https://www.whereinhull.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const yorkshireSources = {
	LEEDS_LIVE: "Leeds Live",
	YORKSHIRE_POST: "Yorkshire Post",
	BRADFORD_TELEGRAPH_AND_ARGUS: "Bradford Telegraph and Argus",
	YORKSHIRE_LIVE: "Yorkshire Live",
	BBC: "BBC",
	YORKSHIRE_EVENING_POST: "Yorkshire Evening Post",
	YORK_PRESS: "York Press",
	EXAMINER_LIVE: "Examiner Live",
	KEIGHLY_NEWS: "Keighly News",
	ILKEY_GAZETTE: "Ilkey Gazette",
	CRAVEN_HERALD: "Craven Herald",
	WHARFEDALE_OBSERVER: "Wharfedale Observer",
	HULL_LIVE: "Hull Live",
	WHERE_IN_HULL: "Where in Hull",
};

export const yorkshireSourcesMap = new Map([
	[yorkshireSources.LEEDS_LIVE, leedsLive],
	[yorkshireSources.YORKSHIRE_POST, yorkshirePost],
	[yorkshireSources.BRADFORD_TELEGRAPH_AND_ARGUS, bradfordTelegraphAndArgus],
	[yorkshireSources.YORKSHIRE_LIVE, yorkshireLive],
	[yorkshireSources.YORKSHIRE_EVENING_POST, yorkshireEveningPost],
	[yorkshireSources.YORK_PRESS, yorkPress],
	[yorkshireSources.EXAMINER_LIVE, examinerLive],
	[yorkshireSources.KEIGHLY_NEWS, keighlyNews],
	[yorkshireSources.ILKEY_GAZETTE, ilkeyGazette],
	[yorkshireSources.CRAVEN_HERALD, cravenHerald],
	[yorkshireSources.WHARFEDALE_OBSERVER, wharfedaleObserver],
	[yorkshireSources.HULL_LIVE, hullLive],
	[yorkshireSources.WHERE_IN_HULL, whereInHull],
]);
