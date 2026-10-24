import type { ComponentProps } from "react";
import { cx } from "./cx";

type HeadingProps = ComponentProps<"h1"> & {
  level: 1 | 2 | 3 | 4;
  /** Visual size, independent of document level. */
  size?: "page" | "section" | "record" | "label";
};

const defaultSize = {
  1: "page",
  2: "section",
  3: "record",
  4: "label",
} as const;

// Hierarchy by scale contrast only: no eyebrow, no icon tile, no section number.
export function Heading({ level, size, className, ...rest }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      {...rest}
      className={cx(
        `ui-heading ui-heading--${size ?? defaultSize[level]}`,
        className,
      )}
    />
  );
}
