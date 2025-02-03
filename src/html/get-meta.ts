import jsdom from "jsdom";

const { JSDOM } = jsdom;
const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", () => {
	// No-op to skip console errors.
});
/////////////////////////////////////////////////

// Probably get meta data and split/get card data from it
export type MetaData = {
	description?: string | null;
	image?: string | null;
	imageAlt?: string | null;
	locale?: string | null;
	site_name?: string | null;
	title?: string | null;
	type?: string | null;
	url?: string | null;
};

// Move this kind  of junk
// We probably want to store raw meta data?
// Or form all the cdata we have into a single object
const getOGMetaDataFromHTML = async (document: Document): Promise<MetaData> => {
	return Promise.resolve({
		// We need to start doing way better
		// use og if not use twitter or fallback to something
		// We need to determine type of data
		// article or media, etc
		// or use description
		description: document.head
			?.querySelector('meta[property="og:description"]')
			?.getAttribute("content"),
		image: document.head
			?.querySelector('meta[property="og:image"]')
			?.getAttribute("content"),
		imageAlt: document.head
			?.querySelector('meta[property="og:imageAlt"]')
			?.getAttribute("content"),
		locale: document.head
			?.querySelector('meta[property="og:locale"]')
			?.getAttribute("content"),
		site_name: document.head
			?.querySelector('meta[property="og:site_name"]')
			?.getAttribute("content"),
		// or use title
		title: document.head
			?.querySelector('meta[property="og:title"]')
			?.getAttribute("content"),
		// If no given type we need to determinetype
		// article, video, etc
		// We can get video from site name for instance
		type: document.head
			?.querySelector('meta[property="og:type"]')
			?.getAttribute("content"),
		url: document.head
			?.querySelector('meta[property="og:url"]')
			?.getAttribute("content"),
	});
};

// get all meta data from a given url
// Then get whatevr you require off it
export const getMeta = async (src: string) => {
	if (!src) {
		console.log("null source");
		return null;
	}
	try {
		const response = await fetch(src);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const result = await response.text();

		const dom = new JSDOM(result, { virtualConsole });
		const meta = await getOGMetaDataFromHTML(dom.window.document);

		// Do this properly
		// set media type if possible - video/youtube
		if (!meta.type) {
			// We need to determine type of data
			// could check keywords - youtube but others?
			// Quick and dirty
			if (src.includes("youtube")) {
				meta.type = "video";
			}
		}

		return meta;
	} catch (error) {
		// console.warn("Error fetching meta data", error);
		console.log("src", src);
		return null;
	}
};
