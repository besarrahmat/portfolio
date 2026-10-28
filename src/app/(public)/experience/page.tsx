import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Timeline } from "@/components/ui/progress-indicator";
import { experienceMonths } from "@/lib/experience";
import { currentMonth, formatDuration } from "@/lib/format";
import type { Experience } from "@/lib/schemas";
import { listExperiences, listProjects, listSkills } from "@/server/db/queries";
import Loading from "../loading";
import { hasPage } from "../projects/record";
import "../pages.css";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Where and how long: every role with exact start and end months, computed durations and the projects built there.",
};

const TYPE: Record<Experience["employmentType"], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  freelance: "Freelance",
  internship: "Internship",
};
const MODE: Record<Experience["workMode"], string> = {
  on_site: "on-site",
  hybrid: "hybrid",
  remote: "remote",
};

// Each page brings its own boundary so client navigation stays instant (see the Overview page).
export default function ExperiencePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ExperienceContent />
    </Suspense>
  );
}

// Read mode (docs/PLAN.md §7): "where and for how long", as a dated log with exact YYYY-MM stamps.
async function ExperienceContent() {
  await connection();
  const [experiences, projects, skills] = await Promise.all([
    listExperiences(),
    listProjects(),
    listSkills(),
  ]);
  const now = currentMonth(new Date());
  const counted = experiences.filter((e) => e.countsTowardExperience);
  const skillName = new Map(skills.map((s) => [s.id, s.name]));

  return (
    <div className="shell-page pg">
      <Heading level={1}>Experience</Heading>
      {counted.length > 0 && (
        <p className="pg-intro">
          <span className="pg-nowrap">
            {formatDuration(experienceMonths(counted, now))}
          </span>{" "}
          of shipped work since{" "}
          <span className="pg-nowrap">
            {counted.map((e) => e.start).sort()[0]}
          </span>
          , overlapping roles counted once. Client names stay private; the
          projects that can be shown are linked under each role.
        </p>
      )}
      <Timeline
        now={now}
        entries={experiences.map((e, i) => {
          const built = projects.filter((p) => p.experienceId === e.id);
          return {
            id: e.id,
            serial: i + 1,
            title: e.role,
            start: e.start,
            end: e.end,
            org: `${e.company} · ${e.location}, ${MODE[e.workMode]} · ${TYPE[e.employmentType]}`,
            detail:
              e.disclosure === "hidden" ? null : (
                <div className="pg-detail">
                  <p>{e.summary}</p>
                  {e.highlights.length > 0 && (
                    <ul>
                      {e.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                  {e.skills.length > 0 && (
                    <ul
                      className="pg-tags"
                      aria-label={`Stack at ${e.company}`}
                    >
                      {e.skills.map((id) => (
                        <li key={id}>
                          <Badge tone="tag">{skillName.get(id) ?? id}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                  {built.length > 0 && (
                    <p>
                      Built here:{" "}
                      {built.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ", "}
                          {hasPage(p) ? (
                            <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                          ) : (
                            p.title
                          )}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ),
          };
        })}
      />
    </div>
  );
}
