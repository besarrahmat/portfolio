import { Fieldset as Base } from "@base-ui/react/fieldset";
import type { ReactNode } from "react";

// Groups related fields (a period's start and end, a link's label and URL) under one legend.
export function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: ReactNode;
}) {
  return (
    <Base.Root className="ui-fieldset">
      <Base.Legend className="ui-fieldset__legend">{legend}</Base.Legend>
      {children}
    </Base.Root>
  );
}
