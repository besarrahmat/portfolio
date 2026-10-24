import { Tabs as Base } from "@base-ui/react/tabs";
import type { ReactNode } from "react";

export type Tab = { value: string; label: string; content: ReactNode };

// Views of one record (Overview, Architecture, Stack). The list scrolls sideways rather than wrapping on phones.
export function Tabs({
  tabs,
  label,
  defaultValue,
}: {
  tabs: Tab[];
  label: string;
  defaultValue?: string;
}) {
  return (
    <Base.Root
      defaultValue={defaultValue ?? tabs[0]?.value}
      className="ui-tabs"
    >
      <Base.List aria-label={label} className="ui-tabs__list">
        {tabs.map((t) => (
          <Base.Tab key={t.value} value={t.value} className="ui-tabs__tab">
            {t.label}
          </Base.Tab>
        ))}
        <Base.Indicator className="ui-tabs__indicator" />
      </Base.List>
      {tabs.map((t) => (
        <Base.Panel key={t.value} value={t.value} className="ui-tabs__panel">
          {t.content}
        </Base.Panel>
      ))}
    </Base.Root>
  );
}
