import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";

type RadioButtonsProps = {
  legend: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  defaultValue?: string;
};

// One choice from a short, visible list (status: draft, published, archived). Arrow keys move between options.
export function RadioButtons({
  legend,
  name,
  options,
  defaultValue,
}: RadioButtonsProps) {
  return (
    <Field.Root name={name} className="ui-field">
      <Fieldset.Root
        render={
          <RadioGroup defaultValue={defaultValue} className="ui-radio-group" />
        }
      >
        <Fieldset.Legend className="ui-label">{legend}</Fieldset.Legend>
        {options.map((o) => (
          <Field.Item key={o.value} className="ui-choice">
            <Field.Label className="ui-choice__label">
              <Radio.Root
                value={o.value}
                disabled={o.disabled}
                className="ui-radio"
              >
                <Radio.Indicator className="ui-radio__indicator" />
              </Radio.Root>
              {o.label}
            </Field.Label>
          </Field.Item>
        ))}
      </Fieldset.Root>
    </Field.Root>
  );
}
