import type { ReactNode } from "react";

// Shell footer: who owns the page and when its data last changed. Links stay few.
export function Footer({ children }: { children: ReactNode }) {
  return <footer className="ui-footer">{children}</footer>;
}
