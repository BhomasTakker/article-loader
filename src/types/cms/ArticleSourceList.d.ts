import { ArticleSource } from "./ArticleSource";

export type ArticleSourceList = {
	title: string;
	articleType: "article" | "audio" | "video";
	categories: string[];
	region: string[];
	coverage: string[];
	language: string;
	sources: ArticleSource[];
};
