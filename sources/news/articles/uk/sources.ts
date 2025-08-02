import { englandSources, englandSourcesMap } from "./england";
import { ukNationalSources, ukNationalSourcesMap } from "./national/sources";
import {
	northernIrelandSources,
	northernIrelandSourcesMap,
} from "./northern-ireland/sources";
import { scotlandSources, scotlandSourcesMap } from "./scotland";
import { walesSourceMap, walesSources } from "./wales";

// split england, scotland, wales, northern ireland
// Probably do Ireland also
export const ukSources = {
	...englandSources,
	...scotlandSources,
	...walesSources,
	...northernIrelandSources,
	...ukNationalSources,
};

export const ukSourcesMap = new Map([
	...englandSourcesMap,
	...scotlandSourcesMap,
	...walesSourceMap,
	...northernIrelandSourcesMap,
	...ukNationalSourcesMap,
]);
