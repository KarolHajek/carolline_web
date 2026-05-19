import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export async function getSiteSettings() {
	const settings = await getEntry('settings', 'site');

	if (!settings) {
		throw new Error('Missing settings/site.json entry.');
	}

	return settings.data;
}

export async function getFeaturedServices() {
	const services = await getCollection('services');
	return services.filter((service) => service.data.featured);
}

export async function getFeaturedReferences() {
	const references = await getCollection('references');
	return references.filter((reference) => reference.data.featured);
}

export function sortByTitle<T extends CollectionEntry<'brands'> | CollectionEntry<'services'>>(items: T[]) {
	return items.sort((a, b) => a.data.title.localeCompare(b.data.title, 'sk'));
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.item,
		})),
	};
}
