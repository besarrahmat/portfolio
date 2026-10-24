"use client";

import type { ComponentProps } from "react";
import { cx } from "./cx";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  /** Busy state: keeps focus and width, blocks repeat presses, announces nothing extra (label the action). */
  loading?: boolean;
  /** Square 44 px button whose only content is an icon; pass aria-label. */
  icon?: boolean;
};

// 朱 is not a variant on purpose: the signal colour belongs to Download CV (see File) and the Live badge only.
export function Button({
  variant = "secondary",
  loading,
  icon,
  className,
  children,
  disabled,
  onClick,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      className={cx(
        "ui-button",
        `ui-button--${variant}`,
        icon && "ui-button--icon",
        className,
      )}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
