import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  children?: ReactNode;
  /** One way forward, e.g. a "Clear filter" button. */
  action?: ReactNode;
};

// An empty table or filter result: say what is missing and offer the next step, no illustration.
export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <p className="ui-empty-state__title">{title}</p>
      {children && <p className="ui-empty-state__body">{children}</p>}
      {action}
    </div>
  );
}
