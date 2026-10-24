import type { ReactNode } from "react";

type HeaderProps = {
  /** Left: menu button (phones) and the current location. */
  start: ReactNode;
  /** Right: search, then the CV dock. */
  end?: ReactNode;
};

// The topbar frame, 52 px on phones and 56 px on desktop; the shell fills it in Fase 6.
export function Header({ start, end }: HeaderProps) {
  return (
    <header className="ui-header">
      <div className="ui-header__start">{start}</div>
      {end && <div className="ui-header__end">{end}</div>}
    </header>
  );
}
