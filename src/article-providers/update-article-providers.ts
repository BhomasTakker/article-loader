import { newsSourcesMap } from "../../sources/news/sources";
import { saveOrCreateArticleProviderByName } from "../lib/mongo/actions/article-provider";

export const updateArticleProviders = async () => {
	const promises: Promise<any>[] = [];

	newsSourcesMap.forEach(async (value, key) => {
		try {
			// const provider = map.get(key);
			if (!value) {
				console.error(`No provider found for ${key}`);
				return;
			}
			console.log("value", value);
			console.log("key", key);
			// should return status log if updated issue etc
			// don't await here await the full promise
			promises.push(saveOrCreateArticleProviderByName(value));
		} catch (err) {
			console.error(err);
		}
	});

	await Promise.all(promises)
		.then((data) => {
			console.log("We have added all providers");
		})
		.catch((error) => {
			console.error("Error adding providers", error);
		})
		.finally(() => {
			console.log("Error or successful completion. Reset fetch");
		});

	return {
		message:
			"Updated all article providers. We should proivide updated and errors details.",
	};
};
