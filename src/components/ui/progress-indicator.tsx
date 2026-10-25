import type { ReactNode } from "react";
import { formatDuration, spanMonths } from "@/lib/format";

export type TimelineEntry = {
  id: string;
  title: string;
  org?: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM", null = present */
  end: string | null;
  detail?: ReactNode;
};

// Progress indicator as a dated log: exact YYYY-MM stamps on one ruled baseline, duration computed, newest first.
export function Timeline({
  entries,
  now,
}: {
  entries: TimelineEntry[];
  now: string;
}) {
  return (
    <ol className="ui-timeline">
      {entries.map((e) => (
        <li key={e.id} aria-current={e.end === null ? "step" : undefined}>
          <p className="ui-timeline__stamp">
            <time dateTime={e.start}>{e.start}</time>
            <span aria-hidden="true"> – </span>
            <span className="ui-visually-hidden"> to </span>
            {e.end ? (
              <time dateTime={e.end}>{e.end}</time>
            ) : (
              <span>Present</span>
            )}
            <span className="ui-timeline__span">
              {formatDuration(spanMonths(e.start, e.end, now))}
            </span>
          </p>
          <div>
            <p className="ui-timeline__title">{e.title}</p>
            {e.org && <p className="ui-timeline__org">{e.org}</p>}
            {e.detail && <div className="ui-timeline__detail">{e.detail}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}
