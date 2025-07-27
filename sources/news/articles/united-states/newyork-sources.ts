const syracuse = {
	origin: "US",
	name: "Syracuse",
	description: "Syracuse is a local news outlet.",
	url: "https://www.syracuse.com/",
	logo: "https://www.syracuse.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wkbw = {
	origin: "US",
	name: "WKBW",
	description: "WKBW is a local news outlet in Buffalo, NY.",
	url: "https://www.wkbw.com/",
	logo: "https://www.wkbw.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wivb = {
	origin: "US",
	name: "WIVB",
	description: "WIVB is a local news outlet in Buffalo, NY.",
	url: "https://www.wivb.com/",
	logo: "https://www.wivb.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const spectrum = {
	origin: "US",
	name: "Spectrum News",
	description: "Spectrum News provides local news coverage in various regions.",
	url: "https://spectrumlocalnews.com/",
	logo: "https://spectrumlocalnews.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const fox5 = {
	origin: "US",
	name: "Fox 5 NY",
	description: "Fox 5 NY is a local news outlet in New York City.",
	url: "https://www.fox5ny.com/",
	logo: "https://www.fox5ny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const abc7ny = {
	origin: "US",
	name: "ABC 7 NY",
	description: "ABC 7 NY is a local news outlet in New York City.",
	url: "https://abc7ny.com/",
	logo: "https://abc7ny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const pix11 = {
	origin: "US",
	name: "PIX 11",
	description: "PIX 11 is a local news outlet in New York City.",
	url: "https://www.pix11.com/",
	logo: "https://www.pix11.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wsyr = {
	origin: "US",
	name: "WSYR",
	description: "WSYR is a local news outlet in Syracuse, NY.",
	url: "https://www.localsyr.com/",
	logo: "https://www.localsyr.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const wham13 = {
	origin: "US",
	name: "13 WHAM",
	description: "13 WHAM is a local news outlet in Rochester, NY.",
	url: "https://13wham.com/",
	logo: "https://13wham.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const news8wroc = {
	origin: "US",
	name: "News 8 WROC",
	description: "News 8 WROC is a local news outlet in Rochester, NY.",
	url: "https://www.rochesterfirst.com/",
	logo: "https://www.rochesterfirst.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const rochesterFirst = {
	origin: "US",
	name: "Rochester First",
	description: "Rochester First is a local news outlet in Rochester, NY.",
	url: "https://www.rochesterfirst.com/",
	logo: "https://www.rochesterfirst.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const NEWS12 = {
	origin: "US",
	name: "News 12",
	description:
		"News 12 provides local news coverage in various regions of New York.",
	url: "https://brooklyn.news12.com/",
	logo: "https://www.news12.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const NEWS10 = {
	origin: "US",
	name: "News 10",
	description:
		"News 10 provides local news coverage in various regions of New York.",
	url: "https://www.news10.com/",
	logo: "https://www.news10.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const CBS6 = {
	origin: "US",
	name: "CBS 6 Albany",
	description: "CBS 6 Albany is a local news outlet in Albany, NY.",
	url: "https://cbs6albany.com/",
	logo: "https://cbs6albany.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const WNYT = {
	origin: "US",
	name: "WNYT",
	description: "WNYT is a local news outlet in Albany, NY.",
	url: "https://wnyt.com/",
	logo: "https://wnyt.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

const WENY = {
	origin: "US",
	name: "WENY",
	description: "WENY is a local news outlet in Elmira, NY.",
	url: "https://www.weny.com/",
	logo: "https://www.weny.com/favicon.ico",
	rating: 70,
	leaning: 0,
};

// this way is probably better on a per country/region basis etc
export const ny_sources = {
	SYRACUSE: "Syracuse",
	WKBW: "WKBW",
	WIVB: "WIVB",
	SPECTRUM: "Spectrum News",
	FOX5_NY: "Fox 5 NY",
	ABC7NY: "ABC 7 NY",
	PIX11: "PIX 11",
	WSYR: "WSYR",
	WHAM13: "13 WHAM",
	News8WROC: "News 8 WROC",
	RochesterFirst: "Rochester First",
	NEWS12: "News 12",
	NEWS10: "News 10",
	CBS6: "CBS 6 Albany",
	WNYT: "WNYT",
	WENY: "WENY",
};

export const ny_sourcesMap = new Map([
	[ny_sources.SYRACUSE, syracuse],
	[ny_sources.WKBW, wkbw],
	[ny_sources.WIVB, wivb],
	[ny_sources.SPECTRUM, spectrum],
	[ny_sources.FOX5_NY, fox5],
	[ny_sources.ABC7NY, abc7ny],
	[ny_sources.PIX11, pix11],
	[ny_sources.WSYR, wsyr],
	[ny_sources.WHAM13, wham13],
	[ny_sources.News8WROC, news8wroc],
	[ny_sources.RochesterFirst, rochesterFirst],
	[ny_sources.NEWS12, NEWS12],
	[ny_sources.NEWS10, NEWS10],
	[ny_sources.CBS6, CBS6],
	[ny_sources.WNYT, WNYT],
	[ny_sources.WENY, WENY],
]);
