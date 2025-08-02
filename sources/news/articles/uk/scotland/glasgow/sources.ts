const glasgowLive = {
	origin: "UK",
	name: "Glasgow Live",
	description:
		"Glasgow Live is a local news website covering Glasgow and the surrounding areas.",
	url: "https://www.glasgowlive.co.uk/",
	logo: "https://www.glasgowlive.co.uk/favicon.ico",
	rating: 80,
};
const glasgowTimes = {
	origin: "UK",
	name: "Glasgow Times",
	description:
		"Glasgow Times is a local news website covering Glasgow and the surrounding areas.",
	url: "https://www.glasgowtimes.co.uk/",
	logo: "https://www.glasgowtimes.co.uk/favicon.ico",
	rating: 80,
	leaning: 0,
};

export const glasgowUKSources = {
	GLASGOW_LIVE: "Glasgow Live",
	GLASGOW_TIMES: "Glasgow Times",
	BBC: "BBC",
	STV: "STV News",
};

export const glasgowUKSourcesMap = new Map([
	[glasgowUKSources.GLASGOW_LIVE, glasgowLive],
	[glasgowUKSources.GLASGOW_TIMES, glasgowTimes],
]);
