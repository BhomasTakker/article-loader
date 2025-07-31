import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";

export const ukSources = {
	...birminghamUKSources,
	...liverpoolUKSources,
	...manchesterUKSources,
};

export const ukSourcesMap = new Map([
	...manchesterUKSourcesMap,
	...birminghamUKSourcesMap,
	...liverpoolUKSourcesMap,
]);
