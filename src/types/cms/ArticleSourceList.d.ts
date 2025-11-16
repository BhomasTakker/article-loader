import { ArticleSource } from "./ArticleSource";

export type ArticleSourceList = {
	title: string;
	variant: "article" | "audio" | "video";
	categories: string[];
	region: string[];
	coverage: string[];
	language: string;
	sources: ArticleSource[];
};
