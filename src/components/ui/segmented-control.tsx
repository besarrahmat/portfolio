"use client";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { useState } from "react";

type SegmentedControlProps = {
  label: string;
  options: { value: string; label: string; count?: number }[];
  defaultValue: string;
  onChange?: (value: string) => void;
};

// Filter with exactly one segment pressed (All / Work / Personal). Pressing the active one keeps it on.
export function SegmentedControl({
  label,
  options,
  defaultValue,
  onChange,
}: SegmentedControlProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        if (!next[0]) return;
        setValue(next[0]);
        onChange?.(next[0]);
      }}
      className="ui-segmented"
    >
      {options.map((o) => (
        <Toggle key={o.value} value={o.value} className="ui-segmented__item">
          {o.label}
          {o.count !== undefined && (
            <span className="figure ui-segmented__count">{o.count}</span>
          )}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
