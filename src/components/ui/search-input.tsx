import type { ComponentProps } from "react";
import { Icon } from "./icon";

type SearchInputProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
};

// Filter box for tables and the palette. The label is visible-equivalent: it is the placeholder's twin, never only a placeholder.
export function SearchInput({ label, id, ...rest }: SearchInputProps) {
  const inputId = id ?? `search-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className="ui-search-input">
      <label htmlFor={inputId} className="ui-visually-hidden">
        {label}
      </label>
      <Icon name="search" />
      <input
        {...rest}
        id={inputId}
        type="search"
        placeholder={rest.placeholder ?? label}
        enterKeyHint="search"
        autoComplete="off"
      />
    </div>
  );
}
