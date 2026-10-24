import type { ComponentProps } from "react";

// Read by screen readers, not drawn. Use for labels that the layout already implies.
export function VisuallyHidden(props: ComponentProps<"span">) {
  return <span {...props} className="ui-visually-hidden" />;
}
