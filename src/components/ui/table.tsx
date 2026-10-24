import type { ReactNode } from "react";
import { cx } from "./cx";

export type Column<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Fixed-pitch, right-aligned figures (IDs, dates, counts) so the column lines up. */
  figure?: boolean;
  /** Row header: the cell that names the record. */
  rowHeader?: boolean;
};

type TableProps<Row> = {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Shown in place of the body when there are no rows. */
  empty?: ReactNode;
};

// Data stays a real <table>. It scrolls sideways inside a labelled, focusable region instead of breaking the page.
export function Table<Row>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
}: TableProps<Row>) {
  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrollable region must be reachable by keyboard (WCAG 2.1.1).
    <section className="ui-table" aria-label={caption} tabIndex={0}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cx(c.figure && "figure ui-table__figure")}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && empty ? (
            <tr>
              <td colSpan={columns.length}>{empty}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((c) =>
                  c.rowHeader ? (
                    <th key={c.key} scope="row">
                      {c.cell(row)}
                    </th>
                  ) : (
                    <td
                      key={c.key}
                      className={cx(c.figure && "figure ui-table__figure")}
                    >
                      {c.cell(row)}
                    </td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
