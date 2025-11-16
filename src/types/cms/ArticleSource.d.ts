export type ArticleSource = {
	categories: string[];
	region: string[];
	coverage: string[];
	language: string;
	articleType: "article" | "audio" | "video";
	variant: string;
	source?: string; // i.e. subStack, youtube

	collectionTitle?: string;
	name: string;
	src: string;
};
