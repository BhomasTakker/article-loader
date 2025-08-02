const liverpoolEcho = {
	name: "Liverpool Echo",
	url: "https://www.liverpoolecho.co.uk",
	origin: "UK",
	description:
		"Liverpool Echo is a local news outlet covering Liverpool and the surrounding areas.",
	logo: "https://www.liverpoolecho.co.uk/favicon.ico",
	rating: 75,
	leaning: 0,
};
const liverpoolExpress = {
	name: "Liverpool Express",
	url: "https://liverpoolexpress.co.uk",
	origin: "UK",
	description:
		"Liverpool Express is a local news outlet focusing on Liverpool.",
	logo: "https://liverpoolexpress.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};
const liverpoolWorld = {
	name: "Liverpool World",
	url: "https://www.liverpoolworld.uk",
	origin: "UK",
	description:
		"Liverpool World is a local news outlet covering Liverpool and the surrounding areas.",
	logo: "https://www.liverpoolworld.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};
const liverpoolPost = {
	name: "Liverpool Post",
	url: "https://liverpoolpost.co.uk",
	origin: "UK",
	description: "Liverpool Post is a local news outlet focusing on Liverpool.",
	logo: "https://liverpoolpost.co.uk/favicon.ico",
	rating: 70,
	leaning: 0,
};
const merseysidePolice = {
	name: "Merseyside Police",
	url: "https://www.merseyside.police.uk",
	origin: "UK",
	description: "The official website of Merseyside Police.",
	logo: "https://www.merseyside.police.uk/favicon.ico",
	rating: 65,
	leaning: 0,
};

export const liverpoolUKSources = {
	LIVERPOOL_ECHO: "Liverpool Echo",
	LIVERPOOL_EXPRESS: "Liverpool Express",
	LIVERPOOL_WORLD: "Liverpool World",
	LIVERPOOL_POST: "Liverpool Post",
	MERSEYSIDE_POLICE: "Merseyside Police",
};

export const liverpoolUKSourcesMap = new Map([
	[liverpoolUKSources.LIVERPOOL_ECHO, liverpoolEcho],
	[liverpoolUKSources.LIVERPOOL_EXPRESS, liverpoolExpress],
	[liverpoolUKSources.LIVERPOOL_WORLD, liverpoolWorld],
	[liverpoolUKSources.LIVERPOOL_POST, liverpoolPost],
	[liverpoolUKSources.MERSEYSIDE_POLICE, merseysidePolice],
]);
