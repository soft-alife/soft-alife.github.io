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

// Publications 페이지 News 탭. link가 있으면 외부 기사(원문으로 이동),
// 없으면 직접 작성한 글로 사이트 내 상세 페이지(/news/슬러그)에서 본문을 보여준다.
const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    source: z.string().optional().default(""), // 언론사/출처 (직접 쓴 글이면 "")
    link: z.string().optional().default(""), // 외부 기사 원문 URL (직접 쓴 글이면 "")
    summary: z.string().optional().default(""),
  }),
});

// Publications 페이지 Blog 탭. 규칙은 news와 동일 (직접 작성 글 → /blog/슬러그).
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().optional().default(""),
    link: z.string().optional().default(""),
    summary: z.string().optional().default(""),
  }),
});

// SALuv 사진 게시판. photos에 사진 여러 장을 넣으면 목록에서는 첫 사진이
// 썸네일로, 상세 페이지에서는 전체 사진이 표시된다.
const saluv = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    photos: z.array(z.string()).default([]),
    summary: z.string().optional().default(""),
  }),
});

export const collections = { seminars, notices, news, blog, saluv };
