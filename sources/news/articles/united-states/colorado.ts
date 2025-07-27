import { NewsSources } from "../../sources";

export const COLORADO_ARTICLES = {
	categories: ["news"],
	region: ["North America", "US", "Colorado"],
	coverage: ["regional", "local"],
	sources: [
		{
			name: NewsSources.DENVER_POST,
			src: "https://www.denverpost.com/feed/",
			coverage: ["local"],
			region: ["Colorado", "Denver"],
		},
		{
			name: NewsSources.DENVER_POST,
			src: "https://www.denverpost.com/news/colorado/feed/",
			coverage: ["regional"],
			region: ["Colorado"],
		},
	],
};
