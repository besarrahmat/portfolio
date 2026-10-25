import type { Metadata } from "next";
import { Shell } from "@/components/shell/shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = {
  title: "Page not found",
};

// Every unmatched URL lands here (real 404 status), still inside the shell so the nav and CV stay in reach.
export default function NotFound() {
  return (
    <Shell>
      <div className="shell-page">
        <Heading level={1}>Page not found</Heading>
        <EmptyState
          title="Nothing is filed at this address"
          action={<Link href="/">Go to Overview</Link>}
        >
          The link may be old or mistyped. Pick a section from the menu, search
          for a project or skill, or start from the overview.
        </EmptyState>
      </div>
    </Shell>
  );
}
