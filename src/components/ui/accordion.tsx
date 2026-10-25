import { Accordion as Base } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import { Icon } from "./icon";

export type AccordionItem = { id: string; title: string; content: ReactNode };

// Sections that fold on phones (project detail, manage FAQ). Each trigger is a real button inside a heading.
export function Accordion({
  items,
  multiple = true,
}: {
  items: AccordionItem[];
  multiple?: boolean;
}) {
  return (
    <Base.Root multiple={multiple} className="ui-accordion">
      {items.map((item) => (
        <Base.Item key={item.id} value={item.id} className="ui-accordion__item">
          <Base.Header className="ui-accordion__header">
            <Base.Trigger className="ui-accordion__trigger">
              {item.title}
              <Icon name="chevron-down" />
            </Base.Trigger>
          </Base.Header>
          <Base.Panel className="ui-accordion__panel">
            <div className="ui-accordion__content">{item.content}</div>
          </Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  );
}
