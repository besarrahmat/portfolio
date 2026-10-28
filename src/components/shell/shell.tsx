import NextLink from "next/link";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";
import { File } from "@/components/ui/file";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Navigation } from "@/components/ui/navigation";
import { SkipLink } from "@/components/ui/skip-link";
import { listSearchIndex } from "@/server/db/queries";
import profile from "../../../content/seed/profile.json";
import { CommandPalette } from "./command-palette";
import { MenuDrawer } from "./menu-drawer";
import { NAV, PAGES } from "./nav";
import { Crumbs, SiteNav } from "./site-nav";
import { ThemeControl } from "./theme";
import "./shell.css";

// shortcut: the CV fallback link comes from the seed, not D1, so the shell stays static HTML; edit both if the URL moves.
const linkedin = profile.links.find((l) => l.kind === "linkedin")?.url ?? "";

// The palette index is the only D1 read in the shell; it streams in, and a failure leaves pages-only search.
async function loadIndex() {
  await connection();
  return listSearchIndex().catch((error: unknown) => {
    console.error("Search index unavailable:", error);
    return undefined;
  });
}

async function IndexedPalette() {
  const index = await loadIndex();
  // Records without a page (no case study) are table rows only, so search leaves them out.
  return (
    <CommandPalette
      projects={index?.projects.filter((p) => p.hasPage)}
      skills={index?.skills}
    />
  );
}

// Same index: a project page's crumb shows its title instead of the slug (the slug stays the fallback).
async function IndexedCrumbs() {
  const index = await loadIndex();
  return (
    <Crumbs
      titles={Object.fromEntries(
        index?.projects.map((p) => [p.slug, p.title]) ?? [],
      )}
    />
  );
}

// The admin-panel frame around every public page (docs/DESIGN.md §6): sidebar on desktop, menu sheet
// and a bottom CV dock on phones. Everything a visitor needs to move around is server HTML.
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <SkipLink />
      <div className="shell-sidebar">
        <NextLink href="/" className="shell-owner">
          Rahmat
        </NextLink>
        {/* usePathname suspends on dynamic routes without static params (Fase 7); the fallback is the same nav unmarked. */}
        <Suspense fallback={<Navigation items={NAV} current="" label="Main" />}>
          <SiteNav />
        </Suspense>
        <ThemeControl />
      </div>
      <div className="shell-column">
        <Header
          start={
            <>
              <MenuDrawer />
              {/* Outer boundary: the fallback Crumbs reads usePathname, which must itself sit in Suspense. */}
              <Suspense>
                <Suspense fallback={<Crumbs />}>
                  <IndexedCrumbs />
                </Suspense>
              </Suspense>
            </>
          }
          end={
            <>
              <Suspense fallback={<CommandPalette />}>
                <IndexedPalette />
              </Suspense>
              <div className="shell-cv">
                <File
                  href="/cv"
                  filename="Besar-Rachmat-Ikhsan-Pambudi-CV.pdf"
                  format="PDF"
                  fallback={{ href: linkedin, label: "LinkedIn" }}
                />
              </div>
            </>
          }
        />
        <main id="main" className="shell-main">
          {children}
        </main>
        {/* Phones without JS cannot open the menu sheet; this list keeps every page reachable. */}
        <Footer>
          <Navigation items={PAGES} current="" label="All pages" />
          <span>Besar Rachmat Ikhsan Pambudi</span>
        </Footer>
      </div>
    </div>
  );
}
