import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { edinburghSources, edinburghSourcesMap } from "./edinburgh";
import { glasgowUKSources, glasgowUKSourcesMap } from "./glasgow";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";

// split england, scotland, wales, northern ireland
// Probably do Ireland also
export const ukSources = {
	...birminghamUKSources,
	...glasgowUKSources,
	...edinburghSources,
	...liverpoolUKSources,
	...manchesterUKSources,
};

export const ukSourcesMap = new Map([
	...manchesterUKSourcesMap,
	...glasgowUKSourcesMap,
	...edinburghSourcesMap,
	...birminghamUKSourcesMap,
	...liverpoolUKSourcesMap,
]);
