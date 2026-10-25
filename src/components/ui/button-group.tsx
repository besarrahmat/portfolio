import type { ComponentProps } from "react";

// Related actions in one toolbar row; wraps on narrow screens instead of overflowing.
export function ButtonGroup({
  label,
  ...rest
}: ComponentProps<"div"> & { label: string }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a row of actions, not form fields; <fieldset> would imply a form.
    <div
      {...rest}
      role="group"
      aria-label={label}
      className="ui-button-group"
    />
  );
}
