import ArticleSourceListModel from "../../models/ArticleSourceList";
import ArticleSourceModel from "../../models/ArticleSource";
import { ArticleSourceList } from "../../types/cms/ArticleSourceList";

// Ensure ArticleSource model is registered before any populate operations
// This prevents "MissingSchemaError: Schema hasn't been registered for model 'ArticleSource'"
const _ = ArticleSourceModel;

/**
 * Load article source lists from the database by criteria
 */
export async function loadSourceListsFromDB(criteria: {
	titles?: string[];
	variant?: "article" | "audio" | "video";
	region?: string[];
	categories?: string[];
	language?: string;
}): Promise<any[]> {
	const query: any = {};

	if (criteria.titles && criteria.titles.length > 0) {
		query.title = { $in: criteria.titles };
	}
	if (criteria.variant) {
		query.variant = criteria.variant;
	}
	if (criteria.region && criteria.region.length > 0) {
		query.region = { $in: criteria.region };
	}
	if (criteria.categories && criteria.categories.length > 0) {
		query.categories = { $in: criteria.categories };
	}
	if (criteria.language) {
		query.language = criteria.language;
	}

	const sourceLists = await ArticleSourceListModel.find(query)
		.populate("sources")
		.lean<ArticleSourceList[]>();

	// Transform to the format expected by fetchRSS
	const transformedSources = sourceLists.map((list) => ({
		categories: list.categories,
		region: list.region,
		coverage: list.coverage,
		language: list.language,
		sources: list.sources.map((source) => ({
			name: source.name,
			src: source.src,
			...(source.collectionTitle && {
				collectionTitle: source.collectionTitle,
			}),
			...(source.source && { source: source.source }),
			...(source.mediaType && { mediaType: source.mediaType }),
		})),
	}));
	return transformedSources;
}

/**
 * Load a specific article source list by title
 */
export async function loadSourceListByTitle(
	title: string
): Promise<ArticleSourceList[]> {
	return loadSourceListsFromDB({ titles: [title] });
}

/**
 * Load multiple article source lists by titles
 */
export async function loadSourceListsByTitles(
	titles: string[]
): Promise<ArticleSourceList[]> {
	return loadSourceListsFromDB({ titles });
}
