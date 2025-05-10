import { NewsSources } from "../../../news/sources";

export const DIDDY_TRIAL = {
	categories: [],
	collectionType: "news",
	region: "UK",
	language: "en",
	sources: [
		{
			collectionTitle: "Bad Rap: The Case Against Diddy",
			name: NewsSources.ABC,
			src: "https://feeds.megaphone.fm/ESP8602094994",
		},
		{
			collectionTitle:
				"The Downfall Of Diddy | The Case Against Sean 'Puffy P Diddy' Combs",
			name: "Tony Brueski",
			src: "https://audioboom.com/channels/5125260.rss",
		},
		{
			collectionTitle: "The Trial of Diddy",
			name: "The Crime Desk",
			src: "https://feeds.megaphone.fm/NSR4427542940",
		},
		{
			collectionTitle: "Diddy On Trial",
			name: NewsSources.BBC,
			src: "https://podcasts.files.bbci.co.uk/p0k61syt.rss",
		},
	],
};
