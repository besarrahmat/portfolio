import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import profile from "../../../../../content/seed/profile.json";

// shortcut: LinkedIn URL from the seed (like the shell), so this page stays static even when D1 is down.
const linkedin = profile.links.find((l) => l.kind === "linkedin")?.url ?? "";

export const metadata: Metadata = {
  title: "CV unavailable",
  robots: { index: false },
};

// Where /cv sends people when R2 has no file: say so and hand over LinkedIn (decision: CV falls back to LinkedIn).
export default function CvUnavailable() {
  return (
    <div className="shell-page">
      <Heading level={1}>The CV is not available right now</Heading>
      <EmptyState
        title="The file could not be found"
        action={
          <Link href={linkedin} external="LinkedIn">
            View the profile on LinkedIn
          </Link>
        }
      >
        The same work history is on LinkedIn. The CV will be back here soon.
      </EmptyState>
    </div>
  );
}
