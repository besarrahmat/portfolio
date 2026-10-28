import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "./cx";

type CardProps = {
  /** Serial number shown as "No. 001"; equals the row ID in tables. */
  serial: number;
  title: string;
  children?: ReactNode;
  /** Status badge in the top-right corner. */
  status?: ReactNode;
  href?: string;
  /** Desktop meishi proportion 91:55; phones always use content height. */
  ratio?: boolean;
  headingLevel?: 2 | 3;
};

export const formatSerial = (n: number) => `No. ${String(n).padStart(3, "0")}`;

// A record lying flat on the table; hover or focus picks it up (see .ui-card-spread for the dimming of the rest).
export function Card({
  serial,
  title,
  children,
  status,
  href,
  ratio,
  headingLevel = 3,
}: CardProps) {
  const H = `h${headingLevel}` as const;
  // Only the title is the link, so its accessible name is the record's name, not the whole card;
  // a stretched ::after keeps the full card clickable (critique, Fase 7).
  return (
    <article
      className={cx(
        "ui-card",
        ratio && "ui-card--ratio",
        href && "ui-card--link",
      )}
    >
      <span className="ui-card__top">
        <span>{formatSerial(serial)}</span>
        {status}
      </span>
      <H className="ui-card__title">
        {href ? (
          <Link href={href} className="ui-card__link">
            {title}
          </Link>
        ) : (
          title
        )}
      </H>
      {children && <div className="ui-card__body">{children}</div>}
    </article>
  );
}

// Wrap a group of cards so focus on one dims the others (Title-Card Wall discipline).
export function CardSpread({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3;
}) {
  return (
    <ul className={cx("ui-card-spread", columns === 2 && "ui-card-spread--2")}>
      {children}
    </ul>
  );
}
