import { Tooltip as Base } from "@base-ui/react/tooltip";
import type { ReactElement } from "react";

type TooltipProps = {
  /** The trigger element; it must already have its own accessible name (the tooltip only repeats it). */
  children: ReactElement;
  content: string;
};

// Names an icon button or reveals a truncated value on hover and focus. Never holds anything you must read.
export function Tooltip({ children, content }: TooltipProps) {
  return (
    <Base.Root>
      <Base.Trigger render={children} delay={400} />
      <Base.Portal>
        <Base.Positioner sideOffset={8} className="ui-popup-positioner">
          <Base.Popup className="ui-tooltip">{content}</Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
