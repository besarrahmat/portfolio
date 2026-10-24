import type { ReactNode } from "react";

export type ListItem = {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  detail?: ReactNode;
};

// A ruled list of records (certifications, roles): title and detail left, meta (dates, issuer) right.
export function List({
  items,
  ordered,
}: {
  items: ListItem[];
  ordered?: boolean;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="ui-list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <p className="ui-list__title">{item.title}</p>
            {item.detail && (
              <div className="ui-list__detail">{item.detail}</div>
            )}
          </div>
          {item.meta && <div className="ui-list__meta">{item.meta}</div>}
        </li>
      ))}
    </Tag>
  );
}
