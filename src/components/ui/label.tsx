import { Field } from "@base-ui/react/field";
import type { ReactNode } from "react";

// Label, hint and error of one form field. Base UI Field wires id, aria-describedby and aria-invalid.
export function Label({
  children,
  optional,
}: {
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <Field.Label className="ui-label">
      {children}
      {optional && <span className="ui-label__optional"> (optional)</span>}
    </Field.Label>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return <Field.Description className="ui-hint">{children}</Field.Description>;
}

// With a message (e.g. from the server) it always shows; without, it shows the browser's validity message.
export function FieldError({ children }: { children?: ReactNode }) {
  return (
    <Field.Error match={children ? true : undefined} className="ui-field-error">
      {children}
    </Field.Error>
  );
}
