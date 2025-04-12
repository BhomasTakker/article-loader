import { ComponentPropsObject } from "./component";

export type PageContainer = {
	containerType: "Stack" | "Grid";
	initData: object;
};

export type PageProps = object;

export type WithQuery = {
	provider: string;
	params: object;
	queryId: string;
};

export type With = {
	type: string;
	query: WithQuery;
};

export type PageComponent = {
	componentType: string;
	componentProps: ComponentPropsObject;
	_with: With;
};

export type PageComponents = Array<PageComponent>;

export type PageContent = {
	containerType: "Stack" | "Grid";
	props: PageProps;
	components: PageComponents;
};

export type PageProfile = {
	pageTitle?: string;
	pageTitleVariant?: string; //union
	showPageTitle?: boolean;
};

type CardData = {
	title: string;
	description: string;
	image: string;
	["image:alt"]: string;
	locale: string;
	site_name: string;
	url: string;
};

export type FavIcon = {
	favIcon: {
		rel: string;
		href: string;
		type: string;
		sizes: string;
	};
};
export type FavIcons = FavIcon[];
export type Metadata = {
	pageTitle: string;
	pageDescription: string;
	pageKeywords: string;
	pageImage: string;
	favIcons: FavIcons;
	showCardData: boolean;
	cardData: CardData;
};

// do better!
export type IPage = {
	meta: Metadata;
	style: object;
	profile: PageProfile;
	route: string;
	creator: ObjectId;

	createdAt: Date;
	updatedAt: Date;

	content: PageContent;
};
