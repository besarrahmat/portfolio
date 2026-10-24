// Insert-only seed from content/seed/*.json: `node src/server/db/seed.ts --local|--remote`.
// After launch D1 is the source of truth, so this refuses to run on a database that already has content.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getTableName } from "drizzle-orm";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { z } from "zod";

import * as s from "../../lib/schemas.ts";
import * as t from "./schema.ts";

const root = new URL("../../../", import.meta.url);

// Insert order follows foreign keys.
const tables = {
  skills: t.skills,
  experiences: t.experiences,
  profile: t.profile,
  education: t.education,
  certifications: t.certifications,
  projects: t.projects,
  projectSkills: t.projectSkills,
};

const camel = (row: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      k.replace(/_(\w)/g, (_, c: string) => c.toUpperCase()),
      v,
    ]),
  );

function rows<T>(schema: z.ZodType<T>, file: string) {
  const raw = JSON.parse(
    readFileSync(new URL(`content/seed/${file}.json`, root), "utf8"),
  );
  const parsed = z.array(schema).safeParse([raw].flat().map(camel));
  if (!parsed.success)
    throw new Error(`${file}.json: ${z.prettifyError(parsed.error)}`);
  return parsed.data;
}

export function loadSeed() {
  const seed = {
    skills: rows(s.skillSchema, "skills"),
    experiences: rows(s.experienceSchema, "experiences"),
    profile: rows(s.profileSchema, "profile"),
    education: rows(s.educationSchema, "education"),
    certifications: rows(s.certificationSchema, "certifications"),
    projects: rows(s.projectSchema, "projects"),
    projectSkills: rows(s.projectSkillSchema, "project_skills"),
  };
  // experiences.skills is a JSON list, so no foreign key catches a typo there.
  const known = new Set(seed.skills.map((k) => k.id));
  const unknown = seed.experiences.flatMap((e) =>
    e.skills.filter((id) => !known.has(id)),
  );
  if (unknown.length)
    throw new Error(
      `experiences.json: unknown skill ids ${unknown.join(", ")}`,
    );
  return seed;
}

// Drizzle builds each INSERT (same casing and JSON/boolean/date encoding as the app); wrangler only takes plain SQL, so params are inlined.
// The no-op batch callback is required: sqlite-proxy only reads `casing` from the third argument (drizzle-orm 0.45).
const builder = drizzle(
  async () => ({ rows: [] }),
  async () => [],
  { casing: "snake_case" },
);

const literal = (v: unknown) => {
  if (v === null) return "NULL";
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  if (typeof v === "string") return `'${v.replaceAll("'", "''")}'`;
  throw new Error(`Cannot inline seed value ${String(v)}`);
};

export function seedSql(seed: ReturnType<typeof loadSeed>) {
  return Object.entries(tables)
    .flatMap(([key, table]) =>
      seed[key as keyof typeof tables].map((row) => {
        const { sql, params } = builder.insert(table).values(row).toSQL();
        return `${sql.split("?").reduce((out, part, i) => out + literal(params[i - 1]) + part)};`;
      }),
    )
    .join("\n");
}

const countSql = `SELECT ${Object.values(tables)
  .map((table) => `(SELECT count(*) FROM ${getTableName(table)})`)
  .join(" + ")} AS n`;

// Reverse insert order, so foreign keys never block a delete.
export const cleanupSql = Object.values(tables)
  .reverse()
  .map((table) => `DELETE FROM ${getTableName(table)};`)
  .join(" ");

type Target = "--local" | "--remote";
type Run = (args: string[]) => string;

const wrangler: Run = (args) =>
  execFileSync("npx", ["wrangler", ...args], {
    encoding: "utf8",
    stdio: ["inherit", "pipe", "inherit"],
  });

export function seed(target: Target, run: Run = wrangler) {
  const data = loadSeed();
  const out = JSON.parse(
    run(["d1", "execute", "DB", target, "--json", "--command", countSql]),
  );
  const n = out?.[0]?.results?.[0]?.n;
  if (n !== 0)
    throw new Error(
      `Refusing to seed: ${n} content rows already exist. After launch D1 is the source of truth; edit content in the manage area.`,
    );

  const file = join(mkdtempSync(join(tmpdir(), "portfolio-seed-")), "seed.sql");
  writeFileSync(file, seedSql(data));
  const startedAt = new Date().toISOString();
  try {
    run(["d1", "execute", "DB", target, "--file", file, "--yes"]);
  } catch (writeError) {
    // D1 does not document the file import as atomic (it behaved atomically when tested on 24 Oct 2026). The tables were empty a moment ago,
    // so emptying them again removes only what this run wrote and the seed can be retried.
    try {
      run(["d1", "execute", "DB", target, "--command", cleanupSql, "--yes"]);
    } catch {
      throw new Error(
        `Seed failed and cleanup failed; restore with: wrangler d1 time-travel restore DB --timestamp=${startedAt}`,
        { cause: writeError },
      );
    }
    throw new Error(
      "Seed failed; the partial rows were removed, so it is safe to retry.",
      {
        cause: writeError,
      },
    );
  }

  const avatar = data.profile[0].avatarKey;
  if (avatar)
    run([
      "r2",
      "object",
      "put",
      `portfolio-media/${avatar}`,
      "--file",
      fileURLToPath(new URL("content/media/avatar.jpg", root)),
      "--content-type",
      "image/jpeg",
      target,
    ]);
}

if (import.meta.main) {
  const target = process.argv[2];
  if (target !== "--local" && target !== "--remote") {
    console.error("Usage: node src/server/db/seed.ts --local|--remote");
    process.exit(1);
  }
  try {
    seed(target);
    console.log(`Seeded D1 (${target}).`);
  } catch (e) {
    console.error((e as Error).message, (e as Error).cause ?? "");
    process.exit(1);
  }
}
