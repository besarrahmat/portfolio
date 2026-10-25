"use client";

import { Combobox as Base } from "@base-ui/react/combobox";
import { useId } from "react";
import { Icon } from "./icon";
import type { Option } from "./select";

type ComboboxProps = {
  label: string;
  items: Option[];
  placeholder?: string;
  /** Several choices as removable chips (skills on a project); otherwise one. */
  multiple?: boolean;
  defaultValue?: Option[];
  emptyText?: string;
};

// Options reach the client as copies (and again on every server refresh), so match by value, not identity.
const sameOption = (item: Option, value: Option) => item.value === value.value;

// Type to filter a long list (the ⌘K palette, skills in manage). The list is announced as you type.
export function Combobox({
  label,
  items,
  placeholder,
  multiple,
  defaultValue,
  emptyText = "No matches",
}: ComboboxProps) {
  const id = useId();
  const popup = (
    <Base.Portal>
      <Base.Positioner sideOffset={4} className="ui-popup-positioner">
        <Base.Popup className="ui-menu ui-combobox__popup">
          <Base.Empty className="ui-combobox__empty">{emptyText}</Base.Empty>
          <Base.List>
            {(item: Option) => (
              <Base.Item
                key={item.value}
                value={item}
                className="ui-menu__item"
              >
                <Base.ItemIndicator className="ui-menu__check" keepMounted>
                  <Icon name="check" size="sm" />
                </Base.ItemIndicator>
                {item.label}
              </Base.Item>
            )}
          </Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );

  if (multiple)
    return (
      <Base.Root
        items={items}
        multiple
        defaultValue={defaultValue}
        isItemEqualToValue={sameOption}
      >
        <div className="ui-field">
          <label htmlFor={id} className="ui-label">
            {label}
          </label>
          <Base.Chips className="ui-input ui-combobox ui-combobox--chips">
            <Base.Value>
              {(value: Option[]) =>
                value.map((v) => (
                  <Base.Chip
                    key={v.value}
                    className="ui-badge ui-badge--tag ui-combobox__chip"
                    aria-label={v.label}
                  >
                    {v.label}
                    <Base.ChipRemove
                      className="ui-combobox__chip-remove"
                      aria-label={`Remove ${v.label}`}
                    >
                      <Icon name="close" size="sm" />
                    </Base.ChipRemove>
                  </Base.Chip>
                ))
              }
            </Base.Value>
            <Base.Input
              id={id}
              placeholder={placeholder}
              className="ui-combobox__input"
            />
          </Base.Chips>
        </div>
        {popup}
      </Base.Root>
    );

  return (
    <Base.Root
      items={items}
      defaultValue={defaultValue?.[0]}
      isItemEqualToValue={sameOption}
    >
      <div className="ui-field">
        <label htmlFor={id} className="ui-label">
          {label}
        </label>
        <Base.InputGroup className="ui-input ui-combobox">
          <Icon name="search" size="sm" className="ui-combobox__icon" />
          <Base.Input
            id={id}
            placeholder={placeholder}
            className="ui-combobox__input"
          />
          <Base.Clear className="ui-combobox__action" aria-label="Clear">
            <Icon name="close" size="sm" />
          </Base.Clear>
          <Base.Trigger
            className="ui-combobox__action"
            aria-label={`Show all ${label.toLowerCase()}`}
          >
            <Icon name="chevron-down" size="sm" />
          </Base.Trigger>
        </Base.InputGroup>
      </div>
      {popup}
    </Base.Root>
  );
}
