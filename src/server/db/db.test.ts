import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as schema from "./schema";
import { cleanupSql, loadSeed, seed, seedSql } from "./seed";

// The real migrations and seed SQL run on node:sqlite, so schema, seed and queries are checked together without wrangler.
const state = vi.hoisted(() => ({ db: null as unknown }));
vi.mock("./index", () => ({ getDb: () => state.db }));
const q = await import("./queries");

const data = loadSeed();
let sqlite: DatabaseSync;

beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec("PRAGMA foreign_keys = ON"); // D1 enforces foreign keys
  const dir = join(__dirname, "../../../drizzle");
  for (const f of readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort())
    for (const stmt of readFileSync(join(dir, f), "utf8").split(
      "--> statement-breakpoint",
    ))
      sqlite.exec(stmt);
  sqlite.exec(seedSql(data));
  state.db = drizzle(
    async (sql, params, method) => {
      const stmt = sqlite.prepare(sql);
      if (method === "run") {
        stmt.run(...(params as never[]));
        return { rows: [] };
      }
      stmt.setReturnArrays(true);
      const rows =
        method === "get"
          ? stmt.get(...(params as never[]))
          : stmt.all(...(params as never[]));
      return { rows: rows as never };
    },
    async () => [], // see seed.ts: casing is only read from the third argument
    { schema, casing: "snake_case" },
  );
});

const count = (table: string) =>
  (sqlite.prepare(`SELECT count(*) AS n FROM ${table}`).get() as { n: number })
    .n;

describe("seed", () => {
  it("loads every seed row into the migrated schema", () => {
    expect(count("projects")).toBe(data.projects.length);
    expect(count("project_skills")).toBe(data.projectSkills.length);
    expect(count("skills")).toBe(data.skills.length);
    expect(count("profile")).toBe(1);
  });

  it("refuses to run when the database already has content", () => {
    const calls: string[][] = [];
    const run = (args: string[]) => {
      calls.push(args);
      return JSON.stringify([{ results: [{ n: 7 }] }]);
    };
    expect(() => seed("--remote", run)).toThrow(/Refusing to seed: 7/);
    expect(calls).toHaveLength(1); // only the count query; nothing was written
  });

  it("refuses when the count cannot be read", () => {
    expect(() => seed("--local", () => "[]")).toThrow(/Refusing/);
  });

  it("writes the SQL then the avatar and the CV on an empty database", () => {
    const calls: string[][] = [];
    seed("--local", (args) => {
      calls.push(args);
      return JSON.stringify([{ results: [{ n: 0 }] }]);
    });
    expect(calls.map((c) => c.slice(0, 2))).toEqual([
      ["d1", "execute"],
      ["d1", "execute"],
      ["r2", "object"],
      ["r2", "object"],
    ]);
    expect(calls.every((c) => c.includes("--local"))).toBe(true);
    expect(calls.at(-1)).toContain("application/pdf");
  });

  it("removes partial rows when the write fails, and uploads nothing", () => {
    const calls: string[][] = [];
    const run = (args: string[]) => {
      calls.push(args);
      if (args.includes("--file")) throw new Error("network dropped");
      return JSON.stringify([{ results: [{ n: 0 }] }]);
    };
    expect(() => seed("--remote", run)).toThrow(/partial rows were removed/);
    expect(calls.at(-1)).toContain(cleanupSql);
    expect(calls.some((c) => c[0] === "r2")).toBe(false);
  });

  it("names a Time Travel restore when the cleanup fails too", () => {
    const run = (args: string[]) => {
      if (args.includes("--json"))
        return JSON.stringify([{ results: [{ n: 0 }] }]);
      throw new Error("offline");
    };
    expect(() => seed("--remote", run)).toThrow(
      /time-travel restore DB --timestamp=/,
    );
  });

  it("cleanup empties every seeded table despite foreign keys", () => {
    sqlite.exec(cleanupSql);
    for (const table of [
      "profile",
      "experiences",
      "projects",
      "skills",
      "project_skills",
    ])
      expect(count(table)).toBe(0);
  });

  it("never overwrites: a second run of the SQL fails on the primary keys", () => {
    expect(() => sqlite.exec(seedSql(data))).toThrow(/UNIQUE/);
  });
});

describe("queries", () => {
  it("reads published projects in sort order with their skills", async () => {
    const projects = await q.listProjects();
    expect(projects.map((p) => p.id)).toEqual(
      data.projects
        .filter((p) => p.status === "published")
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => p.id),
    );
    expect(projects[0].skills.length).toBeGreaterThan(0);
    expect(projects[0].featured).toBe(true);
  });

  it("hides drafts", async () => {
    sqlite.exec("UPDATE projects SET status = 'draft' WHERE id = 'wedding'");
    expect((await q.listProjects()).some((p) => p.id === "wedding")).toBe(
      false,
    );
    expect(await q.getProject("wedding-invitation")).toBeNull();
  });

  it("answers an old slug with a redirect", async () => {
    sqlite.exec(
      "INSERT INTO slug_redirects (old_slug, new_slug, created_at) VALUES ('wedding', 'wedding-invitation', 0)",
    );
    expect(await q.getProject("wedding")).toEqual({
      redirect: "wedding-invitation",
    });
    expect((await q.getProject("wedding-invitation"))?.project?.title).toBe(
      "Wedding Invitation",
    );
    expect(await q.getProject("nope")).toBeNull();
  });

  it("hides a corrupt JSON section and keeps the rest", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    sqlite.exec(
      `UPDATE projects SET metrics = '{broken', architecture = '{"nodes":[]}' WHERE id = 'sobat-ps'`,
    );
    const p = (await q.getProject("sobat-ps"))?.project;
    expect(p?.metrics).toEqual([]);
    expect(p?.architecture).toBeNull();
    expect(p?.links.length).toBeGreaterThan(0);
    expect(log).toHaveBeenCalledTimes(2);
    log.mockRestore();
  });

  it("reads the profile, experiences, education, certifications and skills", async () => {
    const profile = await q.getProfile();
    expect(profile?.name).toBe("Besar Rachmat Ikhsan Pambudi");
    expect(profile?.links.map((l) => l.kind)).toContain("linkedin");
    expect((await q.listExperiences()).map((e) => e.id)).toEqual([
      "gct",
      "minori",
      "htsi",
      "dishut-kaltara",
    ]);
    expect(await q.listEducation()).toHaveLength(1);
    expect(await q.listCertifications()).toHaveLength(
      data.certifications.length,
    );
    const laravel = (await q.listSkills()).find((s) => s.id === "laravel");
    expect(laravel?.projects.length).toBeGreaterThan(0);
  });
});
