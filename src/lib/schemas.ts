import { z } from "zod";

// One schema per entity, shared by the seed, the manage forms (Fase 8) and Hono (Fase 9).
const text = z.string().trim().min(1, "Required");
const id = text.max(64);
const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM, for example 2024-03");
const status = z.enum(["draft", "published", "archived"]);
// "YYYY-MM" strings sort by date, so a plain comparison is enough.
const ordered = (start: string, end: string | null) => !end || end >= start;
const endBeforeStart = "End month is before the start month";

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(-[a-z0-9]+)*$/,
    "Use lowercase letters, digits and single dashes",
  );

export const profileLinkSchema = z.object({
  label: text,
  url: z.url(),
  kind: text,
});

export const profileSchema = z.object({
  name: text,
  shortName: text,
  alternateNames: z.array(text),
  headline: text,
  tagline: text,
  location: text,
  summary: text,
  avatarKey: text.nullable(),
  cvKey: text.nullable(),
  contactEmail: z.email().nullable(),
  links: z.array(profileLinkSchema),
  languages: z.array(z.object({ name: text, level: text })),
  availability: text.nullable(),
});

export const experienceSchema = z
  .object({
    id,
    company: text,
    role: text,
    employmentType: z.enum([
      "full_time",
      "part_time",
      "contract",
      "freelance",
      "internship",
    ]),
    location: text,
    workMode: z.enum(["on_site", "hybrid", "remote"]),
    start: month,
    end: month.nullable(),
    summary: text,
    highlights: z.array(text),
    skills: z.array(id),
    disclosure: z.enum(["public", "general", "hidden"]),
    countsTowardExperience: z.boolean(),
    sortOrder: z.int(),
    status,
  })
  .refine((e) => ordered(e.start, e.end), {
    message: endBeforeStart,
    path: ["end"],
  });

export const educationSchema = z
  .object({
    id,
    institution: text,
    degree: text,
    field: text,
    start: month,
    end: month.nullable(),
    grade: text.nullable(),
    status,
  })
  .refine((e) => ordered(e.start, e.end), {
    message: endBeforeStart,
    path: ["end"],
  });

export const certificationSchema = z
  .object({
    id,
    name: text,
    issuer: text,
    issuedAt: month,
    expiresAt: month.nullable(),
    credentialId: text.nullable(),
    url: z.url().nullable(),
    status,
  })
  .refine((c) => ordered(c.issuedAt, c.expiresAt), {
    message: "Expiry month is before the issue month",
    path: ["expiresAt"],
  });

// A private repo never carries a url (Fase 2 rule, also guarded by seed.test.ts).
export const projectLinkSchema = z.discriminatedUnion("visibility", [
  z.object({
    label: text,
    url: z.url(),
    kind: z.enum(["repo", "live", "docs", "package"]),
    visibility: z.literal("public"),
  }),
  z.strictObject({
    label: text,
    kind: z.enum(["repo", "live", "docs", "package"]),
    visibility: z.literal("private"),
  }),
]);

export const metricSchema = z.object({
  label: text,
  value: z.union([z.number(), text]),
  unit: text.nullable(),
  source: text,
});

export const architectureSchema = z
  .object({
    nodes: z
      .array(
        z.object({
          id: text,
          label: text,
          kind: z.enum(["actor", "service", "database", "storage", "library"]),
        }),
      )
      .min(1),
    edges: z.array(z.object({ from: text, to: text, label: text.optional() })),
  })
  .refine(
    (a) => {
      const ids = new Set(a.nodes.map((n) => n.id));
      return a.edges.every((e) => ids.has(e.from) && ids.has(e.to));
    },
    { message: "Every edge must connect two existing nodes", path: ["edges"] },
  );

export const caseStudySchema = z.object({
  problem: text,
  role: text,
  decisions: z.array(text),
  outcome: text,
});

export const projectSchema = z
  .object({
    id,
    slug: slugSchema,
    title: text,
    tagline: text,
    summary: text,
    role: text,
    experienceId: id.nullable(),
    periodStart: month,
    periodEnd: month.nullable(),
    kind: z.enum(["work", "freelance", "personal", "learning", "thesis"]),
    links: z.array(projectLinkSchema),
    state: z.enum(["live", "archived", "in_progress", "scrapped"]),
    status,
    caseStudy: caseStudySchema.nullable(),
    metrics: z.array(metricSchema),
    architecture: architectureSchema.nullable(),
    coverKey: text.nullable().default(null),
    featured: z.boolean(),
    sortOrder: z.int(),
  })
  .refine((p) => ordered(p.periodStart, p.periodEnd), {
    message: endBeforeStart,
    path: ["periodEnd"],
  });

export const projectMediaSchema = z.object({
  id,
  projectId: id,
  r2Key: text,
  alt: text,
  kind: z.enum(["screenshot", "diagram"]),
  sortOrder: z.int(),
});

export const skillSchema = z.object({
  id,
  name: text,
  category: z.enum([
    "language",
    "framework",
    "database",
    "infra",
    "tool",
    "practice",
  ]),
  icon: text.nullable(),
  main: z.boolean(),
});

export const projectSkillSchema = z.object({ projectId: id, skillId: id });

export type Status = z.infer<typeof status>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
export type Skill = z.infer<typeof skillSchema>;
