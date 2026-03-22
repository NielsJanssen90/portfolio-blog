import { glob } from "astro/loaders";
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    week: z.number().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };