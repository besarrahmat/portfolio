import type { ComponentProps } from "react";
import { type FieldProps, TextInput } from "./text-input";

// Month field for periods ("YYYY-MM", the format the data uses). A text field with a numeric keyboard
// works the same in every browser, unlike <input type="month">, which Safari and Firefox desktop lack.
export function DateInput(
  props: FieldProps & Omit<ComponentProps<"input">, "name" | "type">,
) {
  return (
    <TextInput
      hint="YYYY-MM, for example 2024-03"
      inputMode="numeric"
      pattern="\d{4}-(0[1-9]|1[0-2])"
      placeholder="YYYY-MM"
      maxLength={7}
      autoComplete="off"
      {...props}
    />
  );
}
