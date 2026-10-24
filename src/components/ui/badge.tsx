import type { ComponentProps } from "react";
import { cx } from "./cx";

type BadgeProps = ComponentProps<"span"> & {
  /** live = the single signal state (朱 + dot); expired = struck through meta; tag = stack chip. */
  tone?: "neutral" | "live" | "expired" | "tag";
};

// Status is text first: colour only marks Live, so meaning survives grayscale and forced colours.
export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={cx("ui-badge", `ui-badge--${tone}`, className)}
    />
  );
}
