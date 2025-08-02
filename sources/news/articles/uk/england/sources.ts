import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";
import { yorkshireSources, yorkshireSourcesMap } from "./yorkshire";

// probably west mids, east mids, east anglia, south east, south west, north east, north west
export const englandSources = {
	...birminghamUKSources,
	...manchesterUKSources,
	...liverpoolUKSources,
	...yorkshireSources,
};
export const englandSourcesMap = new Map([
	...birminghamUKSourcesMap,
	...manchesterUKSourcesMap,
	...liverpoolUKSourcesMap,
	...yorkshireSourcesMap,
]);
