import { cx } from "./cx";

type SkeletonProps = {
  /** Number of text lines to stand in for. */
  lines?: number;
  shape?: "text" | "card";
  /** What is loading, read once by screen readers. */
  label?: string;
};

// Placeholder with the shape of the content to come; it does not pulse under reduced motion.
export function Skeleton({
  lines = 3,
  shape = "text",
  label = "Loading",
}: SkeletonProps) {
  return (
    <div className={cx("ui-skeleton", shape === "card" && "ui-skeleton--card")}>
      <span className="ui-visually-hidden" role="status">
        {label}
      </span>
      {shape === "text" &&
        Array.from({ length: lines }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholder lines that never reorder.
          <span key={i} aria-hidden="true" />
        ))}
    </div>
  );
}
