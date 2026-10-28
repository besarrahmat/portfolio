import { cx } from "@/components/ui/cx";
import { Icon } from "@/components/ui/icon";
import { layers } from "@/lib/diagram";
import type { Project } from "@/lib/schemas";
import "./diagram.css";

type Architecture = NonNullable<Project["architecture"]>;

const NODE_KIND = {
  actor: "Person",
  service: "Service",
  database: "Database",
  storage: "Storage",
  library: "Library",
} as const;

// Drawn from the project's architecture JSON (src/lib/diagram.ts): records lying on the table, and between
// each layer a connector that names the hop. When one layer fans out to several nodes the connector
// brackets the group and says which node each arrow reaches. Screen readers get the same edges as a list.
export function Diagram({
  title,
  architecture,
  compact = false,
}: {
  title: string;
  architecture: Architecture;
  /** Printed rows for small surfaces (the back of the meishi): names only, no stock nodes or notes. */
  compact?: boolean;
}) {
  const label = new Map(architecture.nodes.map((n) => [n.id, n.label]));
  const cols = layers(architecture.nodes, architecture.edges);
  const colOf = new Map(cols.flatMap((c, i) => c.map((n) => [n.id, i])));
  return (
    // Four or more layers never fit side by side; they read top to bottom (always, in compact).
    <figure
      className={cx(
        "pd-diagram",
        compact && "pd-diagram--compact",
        !compact && cols.length <= 3 && "pd-diagram--row",
      )}
    >
      <ol
        className="pd-flow"
        aria-label={`${title} architecture, in order of the request`}
      >
        {cols.map((col, i) => {
          const out = architecture.edges.filter((e) => colOf.get(e.from) === i);
          const fan = (cols[i + 1]?.length ?? 0) > 1;
          return (
            <li key={col[0].id} className="pd-step">
              <ul className="pd-layer">
                {col.map((n) => (
                  <li key={n.id} className={`pd-node pd-node--${n.kind}`}>
                    <b>{n.label}</b>
                    <span>{NODE_KIND[n.kind]}</span>
                  </li>
                ))}
              </ul>
              {out.length > 0 && (
                <ul
                  className={fan ? "pd-link pd-link--fan" : "pd-link"}
                  aria-hidden="true"
                >
                  {out.map((e) => {
                    // Name the ends only where the picture alone is ambiguous.
                    const from = col.length > 1 ? label.get(e.from) : null;
                    const to =
                      fan || colOf.get(e.to) !== i + 1
                        ? `to ${label.get(e.to)}`
                        : null;
                    return (
                      <li key={`${e.from}-${e.to}`}>
                        <Icon name="arrow-right" size="sm" />
                        <span>
                          {e.label ?? "uses"}
                          {(from || to) && (
                            <small>
                              {[from, to].filter(Boolean).join(" ")}
                            </small>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      <figcaption className="ui-visually-hidden">
        Connections:
        <ul>
          {architecture.edges.map((e) => (
            <li key={`${e.from}-${e.to}`}>
              {label.get(e.from)} to {label.get(e.to)}
              {e.label && `: ${e.label}`}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
