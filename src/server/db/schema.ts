import { sql } from "drizzle-orm";
import {
  check,
  customType,
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import type {
  Experience,
  Profile,
  Project,
  ProjectMedia,
  Skill,
  Status,
} from "../../lib/schemas.ts";

// Fase 0 tracer table: proves D1 reads on Workers.
export const health = sqliteTable("health", {
  id: integer("id").primaryKey(),
  note: text("note").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

// Unlike text({ mode: "json" }), a corrupt value reads as null instead of throwing, so queries.ts can hide just that section.
const json = customType<{ data: unknown; driverData: string }>({
  dataType: () => "text",
  toDriver: (value) => JSON.stringify(value),
  fromDriver: (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
});

const status = () => text().$type<Status>().notNull().default("draft");
const updatedAt = () =>
  integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());

export const profile = sqliteTable(
  "profile",
  {
    id: integer().primaryKey().default(1),
    name: text().notNull(),
    shortName: text().notNull(),
    alternateNames: json().$type<Profile["alternateNames"]>().notNull(),
    headline: text().notNull(),
    tagline: text().notNull(),
    location: text().notNull(),
    summary: text().notNull(),
    avatarKey: text(),
    cvKey: text(),
    contactEmail: text(),
    links: json().$type<Profile["links"]>().notNull(),
    languages: json().$type<Profile["languages"]>().notNull(),
    availability: text(),
    updatedAt: updatedAt(),
  },
  (t) => [check("profile_singleton", sql`${t.id} = 1`)],
);

export const experiences = sqliteTable(
  "experiences",
  {
    id: text().primaryKey(),
    company: text().notNull(),
    role: text().notNull(),
    employmentType: text().$type<Experience["employmentType"]>().notNull(),
    location: text().notNull(),
    workMode: text().$type<Experience["workMode"]>().notNull(),
    start: text().notNull(),
    end: text(),
    summary: text().notNull(),
    highlights: json().$type<Experience["highlights"]>().notNull(),
    skills: json().$type<Experience["skills"]>().notNull(),
    disclosure: text().$type<Experience["disclosure"]>().notNull(),
    countsTowardExperience: integer({ mode: "boolean" }).notNull(),
    sortOrder: integer().notNull().default(0),
    status: status(),
    updatedAt: updatedAt(),
  },
  (t) => [index("experiences_status_sort").on(t.status, t.sortOrder)],
);

export const education = sqliteTable("education", {
  id: text().primaryKey(),
  institution: text().notNull(),
  degree: text().notNull(),
  field: text().notNull(),
  start: text().notNull(),
  end: text(),
  grade: text(),
  status: status(),
  updatedAt: updatedAt(),
});

export const certifications = sqliteTable("certifications", {
  id: text().primaryKey(),
  name: text().notNull(),
  issuer: text().notNull(),
  issuedAt: text().notNull(),
  expiresAt: text(),
  credentialId: text(),
  url: text(),
  status: status(),
  updatedAt: updatedAt(),
});

export const projects = sqliteTable(
  "projects",
  {
    id: text().primaryKey(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    tagline: text().notNull(),
    summary: text().notNull(),
    role: text().notNull(),
    experienceId: text().references(() => experiences.id),
    periodStart: text().notNull(),
    periodEnd: text(),
    kind: text().$type<Project["kind"]>().notNull(),
    links: json().$type<Project["links"]>().notNull(),
    state: text().$type<Project["state"]>().notNull(),
    status: status(),
    caseStudy: json().$type<Project["caseStudy"]>(),
    metrics: json().$type<Project["metrics"]>().notNull(),
    architecture: json().$type<Project["architecture"]>(),
    coverKey: text(),
    featured: integer({ mode: "boolean" }).notNull().default(false),
    sortOrder: integer().notNull().default(0),
    createdAt: integer({ mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: updatedAt(),
  },
  (t) => [index("projects_status_sort").on(t.status, t.sortOrder)],
);

export const projectMedia = sqliteTable(
  "project_media",
  {
    id: text().primaryKey(),
    projectId: text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    r2Key: text().notNull(),
    alt: text().notNull(),
    kind: text().$type<ProjectMedia["kind"]>().notNull(),
    sortOrder: integer().notNull().default(0),
  },
  (t) => [index("project_media_project_sort").on(t.projectId, t.sortOrder)],
);

// first_used / last_used are not stored: they come from project periods via project_skills (docs/WEBSITE.md).
export const skills = sqliteTable("skills", {
  id: text().primaryKey(),
  name: text().notNull(),
  category: text().$type<Skill["category"]>().notNull(),
  icon: text(),
  main: integer({ mode: "boolean" }).notNull().default(false),
  updatedAt: updatedAt(),
});

export const projectSkills = sqliteTable(
  "project_skills",
  {
    projectId: text()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    skillId: text()
      .notNull()
      .references(() => skills.id),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.skillId] }),
    index("project_skills_skill").on(t.skillId),
  ],
);

export const slugRedirects = sqliteTable("slug_redirects", {
  id: integer().primaryKey({ autoIncrement: true }),
  oldSlug: text().notNull().unique(),
  newSlug: text().notNull(),
  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});
