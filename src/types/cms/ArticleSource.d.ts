export type ArticleSource = {
	categories: string[];
	region: string[];
	coverage: string[];
	language: string;
	variant: "article" | "audio" | "video";
	source?: string; // i.e. subStack, youtube
	mediaType?: string; // i.e. 24/7, live

	collectionTitle?: string;
	name: string;
	src: string;
};
