import { Checkbox as Base } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { Icon } from "./icon";

type CheckboxProps = {
  label: string;
  name: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  hint?: string;
};

// A 44 px tall row: the whole label is the hit target, the box is drawn, the state is the hidden native input.
export function Checkbox({
  label,
  name,
  defaultChecked,
  disabled,
  hint,
}: CheckboxProps) {
  return (
    <Field.Root name={name} disabled={disabled} className="ui-choice">
      <Field.Label className="ui-choice__label">
        <Base.Root defaultChecked={defaultChecked} className="ui-checkbox">
          <Base.Indicator className="ui-checkbox__indicator">
            <Icon name="check" size="sm" />
          </Base.Indicator>
        </Base.Root>
        {label}
      </Field.Label>
      {hint && (
        <Field.Description className="ui-hint ui-choice__hint">
          {hint}
        </Field.Description>
      )}
    </Field.Root>
  );
}
