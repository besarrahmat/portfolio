import { and, asc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";

import {
  architectureSchema,
  caseStudySchema,
  metricSchema,
  profileLinkSchema,
  projectLinkSchema,
} from "../../lib/schemas";

import { getDb } from "./index";
import {
  certifications,
  education,
  experiences,
  profile,
  projectSkills,
  projects,
  skills,
  slugRedirects,
} from "./schema";

// Public reads only; writes live in the manage Server Actions (Fase 8).
// shortcut: no 'use cache' / cacheTag / invalidate(entity) map while opennextjs-cloudflare#1464 is open (Fase 0), so every read hits D1; add them in Fase 8/11.

// A JSON section that fails validation is hidden and logged; the rest of the page still renders.
export function section<T>(
  schema: z.ZodType<T>,
  value: unknown,
  where: string,
) {
  const parsed = schema.safeParse(value);
  if (parsed.success) return parsed.data;
  console.error(`Hiding invalid ${where}:`, z.prettifyError(parsed.error));
  return null;
}

const list = <T>(schema: z.ZodType<T>, value: unknown, where: string) =>
  section(z.array(schema), value, where) ?? [];

export async function getProfile() {
  const row = await getDb().select().from(profile).get();
  if (!row) return null;
  return {
    ...row,
    alternateNames: list(
      z.string(),
      row.alternateNames,
      "profile.alternateNames",
    ),
    links: list(profileLinkSchema, row.links, "profile.links"),
    languages: list(
      z.object({ name: z.string(), level: z.string() }),
      row.languages,
      "profile.languages",
    ),
  };
}

type ProjectRow = typeof projects.$inferSelect;

async function withSkills(rows: ProjectRow[]) {
  const ids = rows.map((p) => p.id);
  const links = ids.length
    ? await getDb()
        .select({ projectId: projectSkills.projectId, skill: skills })
        .from(projectSkills)
        .innerJoin(skills, eq(projectSkills.skillId, skills.id))
        .where(inArray(projectSkills.projectId, ids))
        .orderBy(asc(skills.name))
    : [];
  return rows.map((p) => ({
    ...p,
    links: list(projectLinkSchema, p.links, `project ${p.id} links`),
    metrics: list(metricSchema, p.metrics, `project ${p.id} metrics`),
    caseStudy:
      p.caseStudy &&
      section(caseStudySchema, p.caseStudy, `project ${p.id} case study`),
    architecture:
      p.architecture &&
      section(
        architectureSchema,
        p.architecture,
        `project ${p.id} architecture`,
      ),
    skills: links.filter((l) => l.projectId === p.id).map((l) => l.skill),
  }));
}

export async function listProjects() {
  const rows = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.status, "published"))
    .orderBy(asc(projects.sortOrder));
  return withSkills(rows);
}

// A renamed project answers with its new slug so the page can issue a 308.
export async function getProject(slug: string) {
  const db = getDb();
  const row = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
    .get();
  if (row) return { project: (await withSkills([row]))[0] };
  const moved = await db
    .select({ to: slugRedirects.newSlug })
    .from(slugRedirects)
    .where(eq(slugRedirects.oldSlug, slug))
    .get();
  return moved ? { redirect: moved.to } : null;
}

export async function listExperiences() {
  const rows = await getDb()
    .select()
    .from(experiences)
    .where(eq(experiences.status, "published"))
    .orderBy(asc(experiences.sortOrder));
  return rows.map((e) => ({
    ...e,
    highlights: list(z.string(), e.highlights, `experience ${e.id} highlights`),
    skills: list(z.string(), e.skills, `experience ${e.id} skills`),
  }));
}

export const listEducation = () =>
  getDb().select().from(education).where(eq(education.status, "published"));

export const listCertifications = () =>
  getDb()
    .select()
    .from(certifications)
    .where(eq(certifications.status, "published"))
    .orderBy(asc(certifications.issuedAt));

// Skills with the published projects that use them ("used in N projects").
export async function listSkills() {
  const db = getDb();
  const [all, used] = await Promise.all([
    db.select().from(skills).orderBy(asc(skills.name)),
    db
      .select({ skillId: projectSkills.skillId, slug: projects.slug })
      .from(projectSkills)
      .innerJoin(projects, eq(projectSkills.projectId, projects.id))
      .where(eq(projects.status, "published")),
  ]);
  return all.map((s) => ({
    ...s,
    projects: used.filter((u) => u.skillId === s.id).map((u) => u.slug),
  }));
}

// The command palette's compact index: titles and keys only, sent with the shell on every page.
// Cached per request: the palette, the breadcrumb and project serials all read it.
export const listSearchIndex = cache(async () => {
  const db = getDb();
  const [projectRows, skillRows] = await Promise.all([
    db
      .select({ slug: projects.slug, title: projects.title })
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder)),
    db
      .select({ id: skills.id, name: skills.name })
      .from(skills)
      .orderBy(asc(skills.name)),
  ]);
  return { projects: projectRows, skills: skillRows };
});
