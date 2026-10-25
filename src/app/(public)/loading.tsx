import { Skeleton } from "@/components/ui/skeleton";

// The shape every shell page shares: a page heading, a short intro, then records on the table.
// The frame around it (nav, search, CV) is already usable while this shows.
export default function Loading() {
  return (
    <div className="shell-page shell-loading">
      <Skeleton lines={3} label="Loading page" />
      <div className="shell-loading__records" aria-hidden="true">
        {["a", "b", "c"].map((k) => (
          <span key={k} className="ui-skeleton--card" />
        ))}
      </div>
    </div>
  );
}
