export type ArticleSource = {
	name: string;
	src: string;
};

// I guess just add to this ??
// and update the model?
// better than schema strict: false
export type SourceObject = {
	categories: string[];
	region: string;
	language: string;
	collectionType: string;
	sources: ArticleSource[];
};

export type ExtraData = Omit<SourceObject, "sources">;
