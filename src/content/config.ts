import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    category: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    date: z.date().optional(),
    featured: z.boolean().optional(),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    features: z.array(z.string()).optional(),
    pricing: z.string().optional(),
    category: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'services': servicesCollection,
};
