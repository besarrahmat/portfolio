import type { NavItem } from "@/components/ui/navigation";

// The site map (docs/PLAN.md §7). One list feeds the sidebar, the drawer, the footer and the palette.
export const NAV: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
  { href: "/components", label: "Design system" },
];

// The nav item a path belongs to: exact for "/", by first segment for the rest (/projects/x → Projects).
export const sectionOf = (path: string) =>
  NAV.find((i) =>
    i.href === "/"
      ? path === "/"
      : path === i.href || path.startsWith(`${i.href}/`),
  );
