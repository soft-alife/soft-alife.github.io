import { defineCollection, z } from "astro:content";

const seminars = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    presenter: z.string(),
    affiliation: z.string().optional().default(""),
    category: z.enum(["지능시스템", "인공생명", "기계학습", "최적화 이론", "기타"]),
    tags: z.array(z.string()).default([]),
    pdf: z.string().optional().default(""),
    slides: z.string().optional().default(""),
    summary: z.string().optional().default(""),
  }),
});

const notices = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(["모집", "일반", "학술", "행사"]),
    pinned: z.boolean().default(false),
  }),
});

export const collections = { seminars, notices };
