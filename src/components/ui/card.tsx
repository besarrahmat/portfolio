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
  const body = (
    <>
      <span className="ui-card__top">
        <span>{formatSerial(serial)}</span>
        {status}
      </span>
      <H className="ui-card__title">{title}</H>
      {children && <div className="ui-card__body">{children}</div>}
    </>
  );
  const className = cx(
    "ui-card",
    ratio && "ui-card--ratio",
    href && "ui-card--link",
  );
  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
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
