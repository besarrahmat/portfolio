"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Navigation } from "@/components/ui/navigation";
import { NAV, sectionOf } from "./nav";

// Primary navigation with the current section marked (aria-current) for sight and screen readers.
export function SiteNav({ onNavigate }: { onNavigate?: () => void }) {
  const current = sectionOf(usePathname())?.href ?? "";
  return (
    <Navigation
      items={NAV}
      current={current}
      label="Main"
      onNavigate={onNavigate}
    />
  );
}

// Topbar trail: site → section → record. "Rahmat" is the site ID on phones, where the sidebar is hidden.
export function Crumbs() {
  const path = usePathname();
  const section = sectionOf(path);
  const record = section && path !== section.href && path.split("/").at(-1);
  return (
    <div className="shell-crumbs">
      <Breadcrumbs
        items={[
          { label: "Rahmat", href: "/" },
          // The current crumb is not a link (and on "/" its href would repeat Rahmat's).
          section
            ? { label: section.label, href: record ? section.href : undefined }
            : { label: "Not found" },
          // shortcut: the record crumb shows the URL segment; Fase 7 detail pages pass the record title.
          ...(record ? [{ label: decodeURIComponent(record) }] : []),
        ]}
      />
    </div>
  );
}
