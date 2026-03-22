import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    pubDate:     z.coerce.date(),
    week:        z.number().optional(),
    category:    z.enum(['automation', 'infrastructure', 'security', 'reflectie', 'algemeen']).default('algemeen'),
    tags:        z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
