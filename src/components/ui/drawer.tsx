import { Drawer as Base } from "@base-ui/react/drawer";
import type { ReactElement, ReactNode } from "react";
import { Icon } from "./icon";

type DrawerProps = {
  trigger: ReactElement;
  title: string;
  children: ReactNode;
  /** left = navigation sheet; bottom = filter sheet in thumb reach. Both can be swiped away. */
  side?: "left" | "bottom";
  /** Controlled open state, e.g. so the menu sheet closes after a link is followed. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// Sheet for navigation and filters on phones. Focus is trapped while open and returns to the trigger.
export function Drawer({
  trigger,
  title,
  children,
  side = "left",
  open,
  onOpenChange,
}: DrawerProps) {
  return (
    <Base.Root
      swipeDirection={side === "left" ? "left" : "down"}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Base.Trigger render={trigger} />
      <Base.Portal>
        <Base.Backdrop className="ui-backdrop ui-drawer-backdrop" />
        <Base.Viewport
          className={`ui-drawer-viewport ui-drawer-viewport--${side}`}
        >
          <Base.Popup className={`ui-drawer ui-drawer--${side}`}>
            <Base.Content className="ui-drawer__content">
              <div className="ui-modal__head">
                <Base.Title className="ui-modal__title">{title}</Base.Title>
                <Base.Close
                  className="ui-button ui-button--quiet ui-button--icon"
                  aria-label="Close"
                >
                  <Icon name="close" />
                </Base.Close>
              </div>
              {children}
            </Base.Content>
          </Base.Popup>
        </Base.Viewport>
      </Base.Portal>
    </Base.Root>
  );
}
