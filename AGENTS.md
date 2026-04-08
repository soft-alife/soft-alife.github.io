# Agent Instructions

This repository is maintained primarily by non-developers (a professor and graduate students) using AI coding assistants. The complete maintenance rules, schemas, recipes, and prohibitions live in **[`CLAUDE.md`](./CLAUDE.md)** in this directory.

**Read `CLAUDE.md` first, in full, before making any change.** Everything in it applies to you regardless of which AI tool is invoking you (Claude Code, Codex, Cursor, etc.).

## Quick reference

- **Safe to edit**: `src/content/*.yaml`, `src/content/notices/*.md`, `src/content/seminars/*.md`, `public/images/...`
- **Do not touch** without explicit user request: anything in `src/layouts/`, `src/components/`, `src/styles/`, `src/pages/*.astro`, `src/lib/content.ts`, `src/content/config.ts`, or any config file (`astro.config.mjs`, `tailwind.config.mjs`, `package.json`, etc.)
- **After every change**: run `npm run build`. Failure ⇒ fix or escalate. Never report success on a failing build.
- **Schemas**: defined in `src/lib/content.ts` using Zod. Build will reject invalid content with a clear file/index/field message.
- **Respond in Korean.** The users speak Korean.

For full recipes ("add a member", "graduate a student", "add a notice", etc.), schemas, and the complete list of prohibitions, see `CLAUDE.md` sections 5–9.
