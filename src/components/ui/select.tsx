import { Field } from "@base-ui/react/field";
import { Select as Base } from "@base-ui/react/select";
import { Icon } from "./icon";

export type Option = { value: string; label: string };

type SelectProps = {
  label: string;
  name: string;
  items: Option[];
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
};

// One choice from a list too long for radio buttons (issuer, project type). Type-ahead jumps to an option.
export function Select({
  label,
  name,
  items,
  defaultValue,
  placeholder = "Choose…",
  hint,
  disabled,
}: SelectProps) {
  return (
    <Field.Root name={name} disabled={disabled} className="ui-field">
      <Base.Root items={items} defaultValue={defaultValue} name={name}>
        <Base.Label className="ui-label">{label}</Base.Label>
        <Base.Trigger className="ui-input ui-select">
          <Base.Value className="ui-select__value" placeholder={placeholder} />
          <Base.Icon className="ui-select__icon">
            <Icon name="chevron-up-down" size="sm" />
          </Base.Icon>
        </Base.Trigger>
        <Base.Portal>
          <Base.Positioner
            sideOffset={4}
            alignItemWithTrigger={false}
            className="ui-popup-positioner"
          >
            <Base.Popup className="ui-menu ui-select__popup">
              <Base.List>
                {items.map((o) => (
                  <Base.Item
                    key={o.value}
                    value={o.value}
                    className="ui-menu__item"
                  >
                    <Base.ItemIndicator className="ui-menu__check" keepMounted>
                      <Icon name="check" size="sm" />
                    </Base.ItemIndicator>
                    <Base.ItemText>{o.label}</Base.ItemText>
                  </Base.Item>
                ))}
              </Base.List>
            </Base.Popup>
          </Base.Positioner>
        </Base.Portal>
      </Base.Root>
      {hint && (
        <Field.Description className="ui-hint">{hint}</Field.Description>
      )}
    </Field.Root>
  );
}
