const theManchesterMill = {
	origin: "UK",
	name: "The Manchester Mill",
	description: "The Manchester Mill is a British regional daily newspaper.",
	url: "https://manchestermill.co.uk/",
	logo: "https://manchestermill.co.uk/content/images/size/w256h256/2024/12/Untitled-design--25-.png",
	rating: 80,
	leaning: 0,
};

const manchesterEveningNews = {
	origin: "UK",
	name: "The Manchester Evening News",
	description: "The Manchester Evening News is a regional daily newspaper.",
	url: "https://www.manchestereveningnews.co.uk/",
	logo: "https://s2-prod.manchestereveningnews.co.uk/@trinitymirrordigital/chameleon-branding/publications/men/img/logo-men-social-sharing.png",
	rating: 85,
	leaning: -0.2,
};

const manchesterMagazine = {
	origin: "UK",
	name: "Manchester Magazine",
	description: "Manchester Magazine is a local lifestyle and culture magazine.",
	url: "https://manchestermagazine.co.uk/",
	logo: "https://manchestermagazine.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};

const manchesterWorld = {
	origin: "UK",
	name: "Manchester World",
	description:
		"Manchester World is a local news outlet covering Manchester and the surrounding areas.",
	url: "https://www.manchesterworld.uk/",
	logo: "https://www.manchesterworld.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

const manchesterCityCouncil = {
	origin: "UK",
	name: "Manchester City Council",
	description: "The official website of Manchester City Council.",
	url: "https://www.manchester.gov.uk/",
	logo: "https://www.manchester.gov.uk/favicon.ico",
	rating: 65,
	leaning: 0,
};

const aboutManchester = {
	origin: "UK",
	name: "About Manchester",
	description: "About Manchester is a local news and events website.",
	url: "https://aboutmanchester.co.uk/",
	logo: "https://aboutmanchester.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};

export const manchesterUKSources = {
	MANCHESTER_EVENING_NEWS: "The Manchester Evening News",
	MANCHESTER_MILL: "The Manchester Mill",
	MANCHESTER_MAGAZINE: "Manchester Magazine",
	MANCHESTER_WORLD: "Manchester World",
	MANCHESTER_CITY_COUNCIL: "Manchester City Council",
	MANCHESTER_ABOUT: "About Manchester",
	BBC: "BBC",
};

export const manchesterUKSourcesMap = new Map([
	[manchesterUKSources.MANCHESTER_EVENING_NEWS, manchesterEveningNews],
	[manchesterUKSources.MANCHESTER_MILL, theManchesterMill],
	[manchesterUKSources.MANCHESTER_MAGAZINE, manchesterMagazine],
	[manchesterUKSources.MANCHESTER_WORLD, manchesterWorld],
	[manchesterUKSources.MANCHESTER_CITY_COUNCIL, manchesterCityCouncil],
	[manchesterUKSources.MANCHESTER_ABOUT, aboutManchester],
]);
