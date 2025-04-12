import { UnknownObject } from "./utils";
import { PageComponent } from "./page";
import { VariantsOptions } from "@/components/content/components/article-collection/variant-map";

export type ComponentDataObject = {
	data: UnknownObject;
};

export type ComponentProps = {
	component: PageComponent;
	dataObject: ComponentDataObject;
};

export type ComponentProfileProps = {
	componentTitle: string;
	componentTitleLink: string;
	showComponentTitle: boolean;
};

// Joined with ComponentProfile but should extend?
export type ComponentPropsObject = {
	// this should be agiven no?
	variantType: VariantsOptions;
} & ComponentProfileProps &
	UnknownObject;
