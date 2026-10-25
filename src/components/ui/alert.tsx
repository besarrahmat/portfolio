import type { ReactNode } from "react";
import { cx } from "./cx";
import { Icon } from "./icon";

type AlertProps = {
  tone?: "info" | "success" | "error";
  title: string;
  children?: ReactNode;
  /** Announce on arrival (results of an action); leave off for alerts present at page load. */
  live?: boolean;
};

const icons = { info: "info", success: "check", error: "warning" } as const;

// Inline message for the outcome of an action. Errors name the problem and the way out.
export function Alert({ tone = "info", title, children, live }: AlertProps) {
  return (
    <div
      className={cx("ui-alert", `ui-alert--${tone}`)}
      role={live ? (tone === "error" ? "alert" : "status") : undefined}
    >
      <Icon name={icons[tone]} />
      <div>
        <p className="ui-alert__title">{title}</p>
        {children && <div className="ui-alert__body">{children}</div>}
      </div>
    </div>
  );
}
