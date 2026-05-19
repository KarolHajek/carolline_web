import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		seoTitle: z.string().optional(),
		description: z.string(),
		heroEyebrow: z.string(),
		heroLead: z.string(),
		highlights: z.array(z.string()).default([]),
	}),
});

const services = defineCollection({
	loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		shortTitle: z.string().optional(),
		description: z.string(),
		heroEyebrow: z.string(),
		heroLead: z.string(),
		heroImage: z.string().url(),
		audience: z.string(),
		deliverables: z.array(z.string()),
		benefits: z.array(
			z.object({
				title: z.string(),
				text: z.string(),
			}),
		),
		process: z.array(z.string()).default([]),
		relatedProductLines: z.array(z.string()).default([]),
		featured: z.boolean().default(false),
	}),
});

const productLines = defineCollection({
	loader: glob({ base: './src/content/product-lines', pattern: '**/*.md' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		description: z.string(),
		audience: z.string(),
		ctaLabel: z.string(),
		featuredBrands: z.array(z.string()),
		useCases: z.array(z.string()),
		benefits: z.array(z.string()),
	}),
});

const brands = defineCollection({
	loader: glob({ base: './src/content/brands', pattern: '**/*.md' }),
	schema: z.object({
		slug: z.string(),
		name: z.string(),
		title: z.string(),
		description: z.string(),
		heroEyebrow: z.string(),
		heroLead: z.string(),
		logoLabel: z.string(),
		productFocus: z.array(z.string()),
		strengths: z.array(z.string()),
		ctaLabel: z.string(),
	}),
});

const references = defineCollection({
	loader: glob({ base: './src/content/references', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		client: z.string(),
		category: z.string(),
		description: z.string(),
		image: z.string().url(),
		tags: z.array(z.string()),
		featured: z.boolean().default(false),
	}),
});

const settings = defineCollection({
	loader: glob({ base: './src/content/settings', pattern: '**/*.json' }),
	schema: z.object({
		company: z.object({
			name: z.string(),
			tradingName: z.string(),
			phone: z.string(),
			email: z.string().email(),
			primaryAddress: z.object({
				label: z.string(),
				street: z.string(),
				postalCode: z.string(),
				city: z.string(),
			}),
			secondaryAddress: z.object({
				label: z.string(),
				street: z.string(),
				postalCode: z.string(),
				city: z.string(),
			}),
			workingHours: z.string(),
			ico: z.string(),
			dic: z.string(),
			icDph: z.string(),
		}),
		navigation: z.array(
			z.object({
				label: z.string(),
				href: z.string(),
			}),
		),
		heroStats: z.array(
			z.object({
				value: z.string(),
				label: z.string(),
			}),
		),
		trustBadges: z.array(z.string()),
	}),
});

export const collections = { pages, services, productLines, brands, references, settings };
