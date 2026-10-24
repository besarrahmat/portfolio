import { Popover as Base } from "@base-ui/react/popover";
import type { ReactElement, ReactNode } from "react";

type PopoverProps = {
  /** A button; the popover opens on press, not on hover, so it works on touch. */
  trigger: ReactElement;
  title: string;
  children: ReactNode;
};

// Short extra facts next to a table value (how a number was computed). Esc or a press outside closes it.
export function Popover({ trigger, title, children }: PopoverProps) {
  return (
    <Base.Root>
      <Base.Trigger render={trigger} />
      <Base.Portal>
        <Base.Positioner sideOffset={8} className="ui-popup-positioner">
          <Base.Popup className="ui-popover">
            <Base.Title className="ui-popover__title">{title}</Base.Title>
            <div className="ui-popover__body">{children}</div>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
