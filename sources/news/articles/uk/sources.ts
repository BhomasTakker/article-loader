import { birminghamUKSources, birminghamUKSourcesMap } from "./birmingham";
import { liverpoolUKSources, liverpoolUKSourcesMap } from "./liverpool";
import { manchesterUKSources, manchesterUKSourcesMap } from "./manchester";
import {
	northernIrelandSources,
	northernIrelandSourcesMap,
} from "./northern-ireland/sources";
import { scotlandSources, scotlandSourcesMap } from "./scotland";
import { walesSourceMap, walesSources } from "./wales";

// split england, scotland, wales, northern ireland
// Probably do Ireland also
export const ukSources = {
	...birminghamUKSources,
	...liverpoolUKSources,
	...manchesterUKSources,
	...scotlandSources,
	...walesSources,
	...northernIrelandSources,
};

export const ukSourcesMap = new Map([
	...manchesterUKSourcesMap,
	...birminghamUKSourcesMap,
	...liverpoolUKSourcesMap,
	...scotlandSourcesMap,
	...walesSourceMap,
	...northernIrelandSourcesMap,
]);
