import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";
import { scotlandSources, scotlandSourcesMap } from "./scotland";

// split england, scotland, wales, northern ireland
// Probably do Ireland also
export const ukSources = {
	...birminghamUKSources,
	...liverpoolUKSources,
	...manchesterUKSources,
	...scotlandSources,
};

export const ukSourcesMap = new Map([
	...manchesterUKSourcesMap,
	...birminghamUKSourcesMap,
	...liverpoolUKSourcesMap,
	...scotlandSourcesMap,
]);
