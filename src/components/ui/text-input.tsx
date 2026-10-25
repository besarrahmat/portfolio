import { Field } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { FieldError, Hint, Label } from "./label";

export type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  optional?: boolean;
  /** Server-side error for this field (from a form action); shows and marks the field invalid. */
  error?: string;
};

type TextInputProps = FieldProps &
  Omit<ComponentProps<"input">, "name"> & {
    /** Pick the right phone keyboard: email, url, numeric, tel… */
    inputMode?: ComponentProps<"input">["inputMode"];
  };

// One labelled text field. Visible label = accessible name; hint and error are linked to the input.
export function TextInput({
  label,
  name,
  hint,
  optional,
  error,
  required,
  ...rest
}: TextInputProps) {
  return (
    <Field.Root
      name={name}
      invalid={error ? true : undefined}
      className="ui-field"
    >
      <Label optional={optional}>{label}</Label>
      <Field.Control
        {...rest}
        required={required ?? !optional}
        className="ui-input"
      />
      {hint && <Hint>{hint}</Hint>}
      <FieldError>{error}</FieldError>
    </Field.Root>
  );
}
