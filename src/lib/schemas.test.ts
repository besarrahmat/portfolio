import { describe, expect, it } from "vitest";
import projects from "../../content/seed/projects.json";
import {
  architectureSchema,
  certificationSchema,
  experienceSchema,
  projectLinkSchema,
  projectSchema,
  slugSchema,
} from "./schemas";

const project = {
  ...Object.fromEntries(
    Object.entries(projects[0]).map(([k, v]) => [
      k.replace(/_(\w)/g, (_, c: string) => c.toUpperCase()),
      v,
    ]),
  ),
};

const issues = (r: { success: boolean; error?: { issues: unknown[] } }) =>
  r.success ? [] : (r.error?.issues ?? []);

describe("schemas", () => {
  it("accepts a seed project", () => {
    expect(issues(projectSchema.safeParse(project))).toEqual([]);
  });

  it("rejects a private link that carries a url", () => {
    const r = projectLinkSchema.safeParse({
      label: "Repo",
      kind: "repo",
      visibility: "private",
      url: "https://github.com/x/y",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a public link without a url", () => {
    const r = projectLinkSchema.safeParse({
      label: "Repo",
      kind: "repo",
      visibility: "public",
    });
    expect(r.success).toBe(false);
  });

  it("rejects bad months and an end before the start", () => {
    expect(
      projectSchema.safeParse({ ...project, periodStart: "2024-13" }).success,
    ).toBe(false);
    const r = projectSchema.safeParse({
      ...project,
      periodStart: "2024-05",
      periodEnd: "2024-04",
    });
    expect(r.error?.issues[0].path).toEqual(["periodEnd"]);
  });

  it("rejects blank text, bad slugs and unknown enum values", () => {
    expect(projectSchema.safeParse({ ...project, title: "  " }).success).toBe(
      false,
    );
    for (const slug of ["", "Has Caps", "-lead", "a--b"])
      expect(slugSchema.safeParse(slug).success).toBe(false);
    expect(
      experienceSchema
        .safeParse({ workMode: "office" })
        .error?.issues.some((i) => i.path[0] === "workMode"),
    ).toBe(true);
  });

  it("rejects an architecture edge to a missing node", () => {
    const r = architectureSchema.safeParse({
      nodes: [{ id: "a", label: "A", kind: "service" }],
      edges: [{ from: "a", to: "ghost" }],
    });
    expect(r.success).toBe(false);
  });

  it("rejects a certification that expires before it is issued", () => {
    const r = certificationSchema.safeParse({
      id: "x",
      name: "X",
      issuer: "Y",
      issuedAt: "2024-05",
      expiresAt: "2023-05",
      credentialId: null,
      url: null,
      status: "published",
    });
    expect(r.error?.issues[0].path).toEqual(["expiresAt"]);
  });
});
