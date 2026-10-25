import type { ComponentProps } from "react";

// A hairline rule between groups; decorative separators should stay plain spacing instead.
export function Separator(props: ComponentProps<"hr">) {
  return <hr {...props} className="ui-separator" />;
}
