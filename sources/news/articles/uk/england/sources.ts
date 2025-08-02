import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";

export const englandSources = {
	...birminghamUKSources,
	...manchesterUKSources,
	...liverpoolUKSources,
};
export const englandSourcesMap = new Map([
	...birminghamUKSourcesMap,
	...manchesterUKSourcesMap,
	...liverpoolUKSourcesMap,
]);
