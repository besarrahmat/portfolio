import type { Project } from "@/lib/schemas";

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
