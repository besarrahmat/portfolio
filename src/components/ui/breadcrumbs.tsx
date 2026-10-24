import Link from "next/link";
import { Icon } from "./icon";

type Crumb = { label: string; href?: string };

// Trail to the current record; the last crumb is the current page and is not a link.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="ui-breadcrumbs">
      <ol>
        {items.map((item, i) => {
          const current = i === items.length - 1;
          return (
            <li key={item.href ?? item.label}>
              {current || !item.href ? (
                <span aria-current={current ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {!current && <Icon name="chevron-right" size="sm" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
