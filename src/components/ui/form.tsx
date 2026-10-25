import { Form as Base } from "@base-ui/react/form";
import type { ComponentProps } from "react";

// Native form with Base UI validation: errors appear on submit, focus moves to the first invalid field.
export function Form(props: ComponentProps<typeof Base>) {
  return <Base {...props} className="ui-form" />;
}
