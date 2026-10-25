import Link from "next/link";

export type NavItem = { href: string; label: string };

type NavigationProps = {
  items: NavItem[];
  /** The href of the page being shown; it gets aria-current. */
  current: string;
  label?: string;
  layout?: "sidebar" | "bar";
  /** Called when a link is followed, even to the current page (closes the menu sheet). */
  onNavigate?: () => void;
};

// Text labels on every item (no mystery-meat icons); the current page is marked for sight and for screen readers.
export function Navigation({
  items,
  current,
  label = "Sections",
  layout = "sidebar",
  onNavigate,
}: NavigationProps) {
  return (
    <nav
      aria-label={label}
      className={`ui-navigation ui-navigation--${layout}`}
    >
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.href === current ? "page" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
