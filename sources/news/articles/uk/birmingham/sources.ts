const birminghamMail = {
	name: "Birmingham Mail",
	url: "https://www.birminghammail.co.uk",
	origin: "UK",
	description: "The official website of Birmingham Mail.",
	logo: "https://www.birminghammail.co.uk/favicon.ico",
	rating: 65,
	leaning: 0,
};

const birminghamWorld = {
	name: "Birmingham World",
	url: "https://www.birminghamworld.uk",
	origin: "UK",
	description:
		"Birmingham World is a local news outlet covering Birmingham and the surrounding areas.",
	logo: "https://www.birminghamworld.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const birminghamMagazine = {
	name: "Birmingham Magazine",
	url: "https://birminghammagazine.co.uk",
	origin: "UK",
	description: "Birmingham Magazine is a local lifestyle and culture magazine.",
	logo: "https://birminghammagazine.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const birminghamTimes = {
	name: "Birmingham Times",
	url: "https://birminghamtimes.co.uk/",
	origin: "UK",
	description:
		"Birmingham Times is a local news outlet focusing on Birmingham.",
	logo: "https://birminghamtimes.co.uk/favicon.ico",
	rating: 65,
	leaning: 0,
};

const iAmBirmingham = {
	name: "I Am Birmingham",
	url: "https://www.iambirmingham.co.uk",
	origin: "UK",
	description: "I Am Birmingham is a local news and events website.",
	logo: "https://www.iambirmingham.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const birminghamTV = {
	name: "Birmingham TV",
	url: "https://www.youtube.com/@bhamlocaltv",
	origin: "UK",
	description:
		"Birmingham TV is a local television channel providing news and entertainment.",
	logo: "https://birminghamtv.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const birminghamUKSources = {
	BIRMINGHAM_LIVE: "Birmingham Live",
	BIRMINGHAM_WORLD: "Birmingham World",
	BIRMINGHAM_MAGAZINE: "Birmingham Magazine",
	BIRMINGHAM_TIMES: "Birmingham Times",
	I_AM_BIRMINGHAM: "I Am Birmingham",
	BIRMINGHAM_TV: "Birmingham TV",
};

export const birminghamUKSourcesMap = new Map([
	[birminghamUKSources.BIRMINGHAM_LIVE, birminghamMail],
	[birminghamUKSources.BIRMINGHAM_WORLD, birminghamWorld],
	[birminghamUKSources.BIRMINGHAM_MAGAZINE, birminghamMagazine],
	[birminghamUKSources.BIRMINGHAM_TIMES, birminghamTimes],
	[birminghamUKSources.I_AM_BIRMINGHAM, iAmBirmingham],
	[birminghamUKSources.BIRMINGHAM_TV, birminghamTV],
]);
