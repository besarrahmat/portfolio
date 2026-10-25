import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { FieldError, Hint, Label } from "./label";
import type { FieldProps } from "./text-input";

// Multi-line text (Markdown is allowed in summaries); grows with its content up to a cap, then scrolls.
export function Textarea({
  label,
  name,
  hint,
  optional,
  error,
  required,
  ...rest
}: FieldProps & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <Field.Root
      name={name}
      invalid={error ? true : undefined}
      className="ui-field"
    >
      <Label optional={optional}>{label}</Label>
      <Field.Control
        render={<textarea {...rest} />}
        required={required ?? !optional}
        className="ui-input ui-textarea"
      />
      {hint && <Hint>{hint}</Hint>}
      <FieldError>{error}</FieldError>
    </Field.Root>
  );
}
