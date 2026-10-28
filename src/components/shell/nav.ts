import type { NavItem } from "@/components/ui/navigation";

// The site map (docs/PLAN.md §7). NAV is the main navigation (sidebar, drawer): the pages a visitor
// judging Rahmat needs. PAGES adds the Design system, which lives in the footer, the palette and the
// portfolio project record (critique, Fase 7) rather than beside Experience and Contact.
export const NAV: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
];
export const PAGES: NavItem[] = [
  ...NAV,
  { href: "/components", label: "Design system" },
];

// The nav item a path belongs to: exact for "/", by first segment for the rest (/projects/x → Projects).
export const sectionOf = (path: string) =>
  PAGES.find((i) =>
    i.href === "/"
      ? path === "/"
      : path === i.href || path.startsWith(`${i.href}/`),
  );
