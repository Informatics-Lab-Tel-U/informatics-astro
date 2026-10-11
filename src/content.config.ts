import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const announcements = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/announcements" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const tugasPendahuluan = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/tugas-pendahuluan" }),
  schema: z.object({
    title: z.string(),
    deadline: z.date(),
    module: z.number(),
  }),
});

export const collections = {
  announcements: announcements,
  "tugas-pendahuluan": tugasPendahuluan,
};
