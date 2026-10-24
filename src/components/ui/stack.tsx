import type { ComponentProps, ElementType } from "react";
import { cx } from "./cx";

type Gap = 1 | 2 | 4 | 6 | 8 | 12 | 16;

type StackProps = ComponentProps<"div"> & {
  as?: ElementType;
  gap?: Gap;
  direction?: "column" | "row";
  wrap?: boolean;
};

// Layout utility: one direction, one gap from the 4/8/16/24/32/48/64 scale.
export function Stack({
  as: Tag = "div",
  gap = 4,
  direction = "column",
  wrap,
  className,
  style,
  ...rest
}: StackProps) {
  return (
    <Tag
      {...rest}
      className={cx(
        "ui-stack",
        direction === "row" && "ui-stack--row",
        wrap && "ui-stack--wrap",
        className,
      )}
      style={{ gap: `calc(var(--spacing) * ${gap})`, ...style }}
    />
  );
}
