const edinburghLive = {
	origin: "UK",
	name: "Edinburgh Live",
	description: "Edinburgh Live is a local news and events website.",
	url: "https://www.edinburghlive.co.uk/",
	logo: "https://www.edinburghlive.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const edinburghReporter = {
	origin: "UK",
	name: "Edinburgh Reporter",
	description: "Edinburgh Reporter is a local news website covering Edinburgh.",
	url: "https://theedinburghreporter.co.uk/",
	logo: "https://theedinburghreporter.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const edinburghSources = {
	EDINBURGH_LIVE: "Edinburgh Live",
	EDINBURGH_REPORTER: "Edinburgh Reporter",
	THE_SCOTSMAN: "The Scotsman",
	BBC: "BBC",
};

export const edinburghSourcesMap = new Map([
	[edinburghSources.EDINBURGH_LIVE, edinburghLive],
	[edinburghSources.EDINBURGH_REPORTER, edinburghReporter],
]);
