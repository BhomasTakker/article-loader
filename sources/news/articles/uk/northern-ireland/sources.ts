const northernIrelandWorld = {
	origin: "UK",
	name: "Northern Ireland World",
	description: "Northern Ireland World is a regional news website.",
	url: "https://northernirelandworld.com/",
	logo: "https://www.northernirelandworld.com/img/placeholder.png",
	rating: 80,
	leaning: 0,
};

const theIrish = {
	origin: "UK",
	name: "The Irish News",
	description: "The Irish News is a regional news website.",
	url: "https://www.irishnews.com/",
	logo: "https://www.irishnews.com/resources/images/irishnews-logo.png",
	rating: 80,
	leaning: 0,
};

const belfastLive = {
	origin: "UK",
	name: "Belfast Live",
	description: "Belfast Live is a regional news website.",
	url: "https://www.belfastlive.co.uk/",
	logo: "https://www.belfastlive.co.uk/resources/images/belfastlive-logo.png",
	rating: 80,
	leaning: 0,
};

const utv = {
	origin: "UK",
	name: "UTV",
	description: "UTV is a regional news website.",
	url: "https://www.u.tv/",
	logo: "https://www.u.tv/resources/images/utv-logo.png",
	rating: 75,
	leaning: 0,
};

export const northernIrelandSources = {
	BELFAST_LIVE: "Belfast Live",
	THE_IRISH_NEWS: "The Irish News",
	NORTHERN_IRELAND_WORLD: "Northern Ireland World",
	UTV: "UTV",
	BBC: "BBC",
};

export const northernIrelandSourcesMap = new Map([
	[northernIrelandSources.NORTHERN_IRELAND_WORLD, northernIrelandWorld],
	[northernIrelandSources.THE_IRISH_NEWS, theIrish],
	[northernIrelandSources.BELFAST_LIVE, belfastLive],
	[northernIrelandSources.UTV, utv],
]);
