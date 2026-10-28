import type { Project } from "@/lib/schemas";

// A record gets its own page only when there is a case study to read; thin records stay table rows
// (Fase 7 critique question, ✅ Rahmat). Every link to /projects/<slug> goes through this.
export const hasPage = (p: { caseStudy: unknown }) => Boolean(p.caseStudy);

export const KIND_LABEL: Record<Project["kind"], string> = {
  work: "Work",
  freelance: "Freelance",
  personal: "Personal",
  learning: "Learning",
  thesis: "Thesis",
};

// Exact YYYY-MM stamps (Daylight Section discipline); an open end reads "Present".
export function Period({
  project,
}: {
  project: Pick<Project, "periodStart" | "periodEnd">;
}) {
  return (
    <span className="figure">
      <time dateTime={project.periodStart}>{project.periodStart}</time>
      {" – "}
      {project.periodEnd ? (
        <time dateTime={project.periodEnd}>{project.periodEnd}</time>
      ) : (
        "Present"
      )}
    </span>
  );
}

// The Fit answer at a glance: main stack first in full ink, at most two others, then "+N"
// (the hidden rest is still read out by screen readers).
export function StackSummary({
  skills,
}: {
  skills: { id: string; name: string; main: boolean }[];
}) {
  const main = skills.filter((s) => s.main);
  const other = skills.filter((s) => !s.main);
  const shown = other.slice(0, 2);
  const rest = other.slice(2);
  return (
    <span className="pj-stack">
      {main.map((s) => (
        <b key={s.id}>{s.name}</b>
      ))}
      {shown.map((s) => (
        <span key={s.id}>{s.name}</span>
      ))}
      {rest.length > 0 && (
        <small>
          +{rest.length}
          <span className="ui-visually-hidden">
            : {rest.map((s) => s.name).join(", ")}
          </span>
        </small>
      )}
    </span>
  );
}
