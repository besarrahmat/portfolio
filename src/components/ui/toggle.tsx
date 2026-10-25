import { Field } from "@base-ui/react/field";
import { Switch } from "@base-ui/react/switch";

type ToggleProps = {
  label: string;
  name?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  hint?: string;
};

// An on/off setting that applies at once (featured, published). The label says what "on" means.
export function Toggle({
  label,
  name,
  defaultChecked,
  disabled,
  hint,
}: ToggleProps) {
  return (
    <Field.Root name={name} disabled={disabled} className="ui-choice">
      <Field.Label className="ui-choice__label ui-choice__label--switch">
        {label}
        <Switch.Root defaultChecked={defaultChecked} className="ui-switch">
          <Switch.Thumb className="ui-switch__thumb" />
        </Switch.Root>
      </Field.Label>
      {hint && (
        <Field.Description className="ui-hint ui-choice__hint">
          {hint}
        </Field.Description>
      )}
    </Field.Root>
  );
}
