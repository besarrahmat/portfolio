import { Menu } from "@base-ui/react/menu";
import type { ReactElement } from "react";

export type MenuAction = {
  label: string;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
};

type DropdownMenuProps = {
  trigger: ReactElement;
  items: MenuAction[];
  /** For radio-style menus (the theme menu): the value that is currently chosen. */
  checked?: string;
  onCheckedChange?: (value: string) => void;
};

// Row actions and the theme menu. Arrow keys, type-ahead and Esc come from Base UI Menu.
export function DropdownMenu({
  trigger,
  items,
  checked,
  onCheckedChange,
}: DropdownMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner
          sideOffset={4}
          align="end"
          className="ui-popup-positioner"
        >
          <Menu.Popup className="ui-menu">
            {checked !== undefined ? (
              <Menu.RadioGroup
                value={checked}
                onValueChange={(v) => onCheckedChange?.(String(v))}
              >
                {items.map((item) => (
                  <Menu.RadioItem
                    key={item.label}
                    value={item.label}
                    disabled={item.disabled}
                    className="ui-menu__item"
                  >
                    <Menu.RadioItemIndicator
                      className="ui-menu__indicator"
                      keepMounted
                    >
                      <span />
                    </Menu.RadioItemIndicator>
                    {item.label}
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            ) : (
              items.map((item) =>
                item.href ? (
                  <Menu.LinkItem
                    key={item.label}
                    href={item.href}
                    className="ui-menu__item"
                  >
                    {item.label}
                  </Menu.LinkItem>
                ) : (
                  <Menu.Item
                    key={item.label}
                    onClick={item.onSelect}
                    disabled={item.disabled}
                    className="ui-menu__item"
                  >
                    {item.label}
                  </Menu.Item>
                ),
              )
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
