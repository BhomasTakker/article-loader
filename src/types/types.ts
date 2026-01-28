import { UnknownObject } from "./article/item";
import { ArticleSource } from "./cms/ArticleSource";

// I guess just add to this ??
// and update the model?
// better than schema strict: false
export type SourceObject = {
	categories?: string[];
	region?: string | string[];
	coverage?: string[];
	language?: string;
	sources?: ArticleSource[];
	media?: UnknownObject;
};

export type ExtraData = Omit<SourceObject, "sources">;
