import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/schemas";

export const STATE_LABEL: Record<Project["state"], string> = {
  live: "Live",
  in_progress: "In progress",
  archived: "Archived",
  scrapped: "Scrapped",
};

// Only Live carries the signal colour (docs/DESIGN.md §1).
export function StateBadge({ state }: { state: Project["state"] }) {
  return (
    <Badge tone={state === "live" ? "live" : "neutral"}>
      {STATE_LABEL[state]}
    </Badge>
  );
}
