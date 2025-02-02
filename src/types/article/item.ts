export type UnknownObject = Record<string, unknown>;

export type BaseInfo = {
	title: string;
	src: string; // URL format
	description: string;
	guid: string;
	variant: string; // union
};

export type Details = {
	docs?: string[];
	categories?: string[];
	authors?: string[];
	publishers?: string[];
	published?: Date | string;
	modified?: Date | string;
};

export type Media = UnknownObject;

export type Avatar = {
	src: string;
	alt: string;
};

export type Pagination = {
	results: number;
};

export type CollectionItem = BaseInfo & {
	details?: Details;
	avatar?: Avatar;
};
