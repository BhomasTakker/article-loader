import { edinburghSources } from "../edinburgh";
import { glasgowUKSources } from "../glasgow";

export const stv = {
	origin: "UK",
	name: "STV",
	description: "STV is a Scottish television channel.",
	url: "https://www.stv.tv/",
	logo: "https://news.stv.tv/wp-content/uploads/2021/03/bcfbe23dddc8774f69c08e90494dd008.jpg",
	rating: 85,
	leaning: 0.1,
};
export const heraldScotland = {
	origin: "UK",
	name: "Herald Scotland",
	description: "Herald Scotland is a Scottish newspaper.",
	url: "https://www.heraldscotland.com/",
	logo: "https://www.heraldscotland.com/resources/images/herald-logo.png",
	rating: 80,
	leaning: 0.1,
};
export const dailyRecord = {
	origin: "UK",
	name: "The Daily Record",
	description: "The Daily Record is a Scottish tabloid newspaper.",
	url: "https://www.dailyrecord.co.uk/",
	logo: "https://s2-prod.dailyrecord.co.uk/@trinitymirrordigital/chameleon-branding/publications/dailyrecord/img/logo-dailyrecord-social-sharing.png",
	rating: 80,
	leaning: 0,
};
export const theScotsman = {
	origin: "UK",
	name: "The Scotsman",
	description: "The Scotsman is a Scottish newspaper.",
	url: "https://www.scotsman.com/",
	logo: "https://www.scotsman.com/resources/images/scotsman-logo.png",
	rating: 80,
	leaning: 0.1,
};
export const theNational = {
	origin: "UK",
	name: "The National",
	description: "The National is a Scottish newspaper.",
	url: "https://www.thenational.scot/",
	logo: "https://www.thenational.scot/resources/images/thenational-logo.png",
	rating: 75,
	leaning: 0.1,
};

export const theScottishSun = {
	origin: "UK",
	name: "The Scottish Sun",
	description: "The Scottish Sun is a Scottish tabloid newspaper.",
	url: "https://www.thescottishsun.co.uk/",
	logo: "https://www.thescottishsun.co.uk/wp-content/uploads/sites/2/2020/03/cropped-TS-Logo-1.png",
	rating: 65,
	leaning: 0.4,
};

export const scotlandSources = {
	THE_NATIONAL: "The National",
	HERALD_SCOTLAND: "Herald Scotland",
	STV: "STV News",
	THE_SCOTSMAN: "The Scotsman",
	DAILY_RECORD: "Daily Record",
	THE_SCOTTISH_SUN: "Scottish Sun",
	...glasgowUKSources,
	...edinburghSources,
};

export const scotlandSourcesMap = new Map([
	[scotlandSources.THE_NATIONAL, theNational],
	[scotlandSources.HERALD_SCOTLAND, heraldScotland],
	[scotlandSources.STV, stv],
	[scotlandSources.THE_SCOTSMAN, theScotsman],
	[scotlandSources.DAILY_RECORD, dailyRecord],
	[scotlandSources.THE_SCOTTISH_SUN, theScottishSun],
]);
