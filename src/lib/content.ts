/**
 * Centralized content loaders with Zod validation.
 *
 * Why this file exists:
 *   - Keeps all YAML reading + schema validation in one place.
 *   - When someone (human or AI) edits a content YAML with the wrong shape,
 *     `npm run build` fails with a clear error pointing at the bad field.
 *   - Pages just call e.g. `loadMembers()` and get a fully-typed array.
 *
 * If you are an AI assistant editing the site:
 *   - Do NOT change the schemas below unless the user explicitly asks you to
 *     add a new field. The schemas are the source of truth for what
 *     content/*.yaml files are allowed to contain.
 *   - To add a new field, update the schema here AND every YAML entry that
 *     needs it. The build will tell you if you missed any.
 */

import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "astro:content";

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const MemberSchema = z.object({
  name: z.string().min(1, "name is required"),
  nameEn: z.string().min(1, "nameEn is required"),
  role: z.enum([
    "M.S. Student",
    "Ph.D. Student",
    "M.S./Ph.D. Integrated",
    "학부연구생",
    "Post-doc",
  ]),
  photo: z.string(),
  research: z.array(z.string()).default([]),
  email: z.string().default(""),
  github: z.string().default(""),
  scholar: z.string().default(""),
  startYear: z.number().int(),
  graduated: z.boolean().default(false),
});
export type Member = z.infer<typeof MemberSchema>;

export const PublicationSchema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string()).min(1, "at least one author required"),
  venue: z.string().min(1),
  year: z.number().int(),
  type: z.enum(["journal", "conference"]),
  tags: z.array(z.string()).default([]),
  doi: z.string().default(""),
  pdf: z.string().default(""),
});
export type Publication = z.infer<typeof PublicationSchema>;

// Bilingual text helper: every editable string is `{ko: "...", en: "..."}`.
const Bilingual = z.object({
  ko: z.string(),
  en: z.string(),
});
export type BilingualText = z.infer<typeof Bilingual>;

export const SiteSchema = z.object({
  recruit: z.object({
    enabled: z.boolean().default(true),
    link: Bilingual,
    label: Bilingual,
    title: Bilingual,
    body: Bilingual,
    button: Bilingual,
  }),
});
export type Site = z.infer<typeof SiteSchema>;

export const ProjectSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().default(""),
  status: z.enum(["ongoing", "completed"]),
  period: z.string().min(1),
  funding: z.string().default(""),
  role: z.string().default(""),
  pi: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  description: z.string().default(""),
});
export type Project = z.infer<typeof ProjectSchema>;

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

function readYaml(relativePath: string): unknown {
  const fullPath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return yaml.load(raw);
}

function parseList<T>(
  schema: z.ZodType<T>,
  data: unknown,
  topKey: string,
  filePath: string,
): T[] {
  if (!data || typeof data !== "object" || !(topKey in data)) {
    throw new Error(
      `[content] ${filePath}: expected top-level key "${topKey}" containing an array`,
    );
  }
  const list = (data as Record<string, unknown>)[topKey];
  if (!Array.isArray(list)) {
    throw new Error(`[content] ${filePath}: "${topKey}" must be an array`);
  }
  return list.map((entry, i) => {
    const result = schema.safeParse(entry);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `    - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `[content] ${filePath}: entry #${i + 1} failed schema validation:\n${issues}`,
      );
    }
    return result.data;
  });
}

export function loadMembers(): Member[] {
  const file = "src/content/members.yaml";
  return parseList(MemberSchema, readYaml(file), "members", file);
}

export function loadPublications(): Publication[] {
  const file = "src/content/publications.yaml";
  return parseList(PublicationSchema, readYaml(file), "publications", file);
}

export function loadProjects(): Project[] {
  const file = "src/content/projects.yaml";
  return parseList(ProjectSchema, readYaml(file), "projects", file);
}

export function loadSite(): Site {
  const file = "src/content/site.yaml";
  const data = readYaml(file);
  const result = SiteSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `    - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`[content] ${file}: failed schema validation:\n${issues}`);
  }
  return result.data;
}

/** Pick the right language string from a bilingual field. */
export function t(field: BilingualText, lang: "ko" | "en" = "ko"): string {
  return field[lang];
}

// ---------------------------------------------------------------------------
// Convenience filters (used by multiple pages — keep behavior consistent)
// ---------------------------------------------------------------------------

const GRADUATE_ROLES = new Set([
  "M.S. Student",
  "Ph.D. Student",
  "M.S./Ph.D. Integrated",
]);

export function partitionMembers(members: Member[]) {
  return {
    graduates: members.filter((m) => !m.graduated && GRADUATE_ROLES.has(m.role)),
    undergrads: members.filter((m) => !m.graduated && m.role === "학부연구생"),
    alumni: members.filter((m) => m.graduated),
  };
}
