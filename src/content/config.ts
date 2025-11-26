import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		// Support both local images and remote URLs
		heroImage: z.union([image(), z.string()]).optional(),		
		category: z.union([
			z.enum(['Học', 'Làm', 'Chơi', 'Khác']),
			z.array(z.enum(['Học', 'Làm', 'Chơi', 'Khác']))
		]).optional(),
		tags: z.array(z.string()).optional(),
		published: z.boolean().default(false),
	}),
});

export const collections = { blog };
