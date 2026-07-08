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
  funding: z.string().default(""), // 지원기관
  ministry: z.string().default(""), // 주무부처
  role: z.string().default(""),
  pi: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  description: z.string().default(""),
  national: z.boolean().default(false), // 국가연구과제 여부 (노란 배지 + NTIS 링크)
  url: z.string().default(""), // 지정 시 NTIS 검색 링크보다 우선
});
export type Project = z.infer<typeof ProjectSchema>;

// ---------------------------------------------------------------------------
// Professor achievements (src/content/professor.yaml)
//
// Holds the professor's full publication/patent/award record shown on the
// Professor page. Kept separate from publications.yaml (the lab-wide selected
// publications list used by the Publications page).
// ---------------------------------------------------------------------------

// "first" = 제1저자, "corresponding" = 교신저자, "co" = 공동저자.
// null = 이력서에 저자 구분이 없는 항목 (배지 미표시).
const ProfessorAuthorRole = z
  .enum(["first", "corresponding", "co"])
  .nullable()
  .default(null);

export const ProfessorJournalSchema = z.object({
  title: z.string().min(1),
  venue: z.string().min(1),
  volume: z.string().default(""), // 권/호/쪽 e.g. "Vol.20, No.3, pp.383-393"
  date: z.string().min(1), // "YYYY.MM" — 최신순 정렬에 사용
  index: z.enum(["sci", "scopus", "kci"]), // sci = SCI/SCIE
  impactFactor: z.string().default(""), // e.g. "2.5"
  quartile: z.string().default(""), // e.g. "Q2", "Q1 (상위 4.3%)"
  authorRole: ProfessorAuthorRole,
  note: z.string().default(""), // e.g. "표지논문 선정"
  doi: z.string().default(""), // e.g. "10.3390/electronics10101158" — 있으면 카드 클릭 시 이동
  url: z.string().default(""), // 지정 시 doi보다 우선하는 원문 링크 (예: ResearchGate)
});
export type ProfessorJournal = z.infer<typeof ProfessorJournalSchema>;

export const ProfessorConferenceSchema = z.object({
  title: z.string().min(1),
  venue: z.string().min(1),
  volume: z.string().default(""),
  date: z.string().min(1),
  tier: z.enum(["top", "international", "domestic"]),
  authorRole: ProfessorAuthorRole,
  note: z.string().default(""), // e.g. "우수논문상", "Keynote 강연"
  doi: z.string().default(""), // 있으면 카드 클릭 시 이동
  url: z.string().default(""), // 지정 시 doi보다 우선하는 원문 링크
});
export type ProfessorConference = z.infer<typeof ProfessorConferenceSchema>;

export const ProfessorPatentSchema = z.object({
  title: z.string().min(1),
  kind: z.enum(["patent", "design"]).default("patent"),
  country: z.enum(["domestic", "international"]).default("domestic"), // 국제 특허면 "international"
  status: z.enum(["registered", "filed"]),
  applicationDate: z.string().default(""),
  applicationNumber: z.string().default(""),
  registrationDate: z.string().default(""),
  registrationNumber: z.string().default(""),
  note: z.string().default(""), // e.g. "기술이전"
  url: z.string().default(""), // 지정 시 자동 생성되는 Google Patents 링크보다 우선
});
export type ProfessorPatent = z.infer<typeof ProfessorPatentSchema>;

export const ProfessorAwardSchema = z.object({
  date: z.string().min(1),
  event: z.string().min(1), // 대회/기관명
  award: z.string().min(1), // 수상내역
  note: z.string().default(""),
});
export type ProfessorAward = z.infer<typeof ProfessorAwardSchema>;

export const ProfessorTechTransferSchema = z.object({
  title: z.string().min(1),
  year: z.number().int(),
  patentNumber: z.string().default(""),
  description: z.string().default(""),
});
export type ProfessorTechTransfer = z.infer<typeof ProfessorTechTransferSchema>;

export interface Professor {
  journals: ProfessorJournal[];
  conferences: ProfessorConference[];
  patents: ProfessorPatent[];
  awards: ProfessorAward[];
  techTransfers: ProfessorTechTransfer[];
}

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

export function loadProfessor(): Professor {
  const file = "src/content/professor.yaml";
  const data = readYaml(file);
  return {
    journals: parseList(ProfessorJournalSchema, data, "journals", file),
    conferences: parseList(ProfessorConferenceSchema, data, "conferences", file),
    patents: parseList(ProfessorPatentSchema, data, "patents", file),
    awards: parseList(ProfessorAwardSchema, data, "awards", file),
    techTransfers: parseList(ProfessorTechTransferSchema, data, "techTransfers", file),
  };
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

// Members page grouping:
//   대학원생 — 박사(Post-doc) / 박사과정생(Ph.D. + 석박통합) / 석사과정생(M.S.)
//   학부연구생 / 졸업생
export function partitionMembers(members: Member[]) {
  const active = members.filter((m) => !m.graduated);
  return {
    phds: active.filter((m) => m.role === "Post-doc"),
    phdStudents: active.filter(
      (m) => m.role === "Ph.D. Student" || m.role === "M.S./Ph.D. Integrated",
    ),
    msStudents: active.filter((m) => m.role === "M.S. Student"),
    undergrads: active.filter((m) => m.role === "학부연구생"),
    alumni: members.filter((m) => m.graduated),
  };
}
