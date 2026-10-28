import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import type { Skill } from "@/lib/schemas";
import { listExperiences, listProjects, listSkills } from "@/server/db/queries";
import Loading from "../loading";
import "../pages.css";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "The main stack first, then every other technology with the projects that actually used it. No self-rated levels.",
};

const CATEGORY: Record<Skill["category"], string> = {
  language: "Languages",
  framework: "Frameworks",
  database: "Databases",
  infra: "Infrastructure",
  tool: "Tools",
  practice: "Practices",
};

export default function SkillsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SkillsContent />
    </Suspense>
  );
}

type Row = Awaited<ReturnType<typeof listSkills>>[number] & {
  used: Awaited<ReturnType<typeof listProjects>>;
  roles: { company: string; start: string; end: string | null }[];
};

// Operate (docs/PLAN.md §7): answers "does the stack fit our team?" with evidence, not star ratings.
// Years come from the periods of the projects that used each skill (first_used/last_used are not stored).
async function SkillsContent() {
  await connection();
  const [skills, projects, experiences] = await Promise.all([
    listSkills(),
    listProjects(),
    listExperiences(),
  ]);
  const rows: Row[] = skills.map((s) => ({
    ...s,
    used: projects.filter((p) => p.skills.some((ps) => ps.id === s.id)),
    roles: experiences
      .filter((e) => e.skills.includes(s.id))
      .map((e) => ({ company: e.company, start: e.start, end: e.end })),
  }));
  const main = rows.filter((s) => s.main);
  const rest = rows.filter((s) => !s.main && s.used.length > 0);

  return (
    <div className="shell-page pg">
      <Heading level={1}>Skills</Heading>
      <p className="pg-intro">
        The main stack is what Rahmat ships at work. Everything else is listed
        only because a published project used it; each count opens those
        projects.
      </p>
      {main.length > 0 && (
        <section aria-labelledby="main-stack" className="pg-section">
          <Heading level={2} id="main-stack">
            Main stack
          </Heading>
          <SkillList rows={main} />
        </section>
      )}
      {(Object.keys(CATEGORY) as Skill["category"][]).map((c) => {
        const group = rest.filter((s) => s.category === c);
        return (
          group.length > 0 && (
            <section
              key={c}
              aria-labelledby={`cat-${c}`}
              className="pg-section"
            >
              <Heading level={2} id={`cat-${c}`}>
                {CATEGORY[c]}
              </Heading>
              <SkillList rows={group} />
            </section>
          )
        );
      })}
    </div>
  );
}

function SkillList({ rows }: { rows: Row[] }) {
  return (
    <ul className="ui-list pg-skills">
      {rows.map((s) => {
        // Years come from the projects that used the skill; only a skill with no published project
        // (CodeIgniter: work under NDA) falls back to the roles, so no date is stretched past its evidence.
        const spans = s.used.length
          ? s.used.map((p) => ({ start: p.periodStart, end: p.periodEnd }))
          : s.roles;
        const periods = spans.flatMap((p) => [p.start, p.end ?? "Present"]);
        const first = spans.map((p) => p.start).sort()[0];
        const last = periods.includes("Present")
          ? "Present"
          : periods.sort().at(-1);
        return (
          <li key={s.id} id={s.id}>
            <div>
              <p className="ui-list__title">{s.name}</p>
              {(first || s.roles.length > 0) && (
                <p className="ui-list__detail">
                  {first && (
                    <span className="figure">
                      {first} – {last}
                    </span>
                  )}
                  {first && s.roles.length > 0 && " · "}
                  {s.roles.length > 0 &&
                    `at ${s.roles.map((r) => r.company).join(", ")}`}
                </p>
              )}
            </div>
            <p className="ui-list__meta">
              {s.used.length > 0 && (
                <Link href={`/projects?skill=${s.id}`}>
                  Used in {s.used.length}{" "}
                  {s.used.length === 1 ? "project" : "projects"}
                </Link>
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
