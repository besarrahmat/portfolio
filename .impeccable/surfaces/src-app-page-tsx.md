---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/layout.tsx"]
---

# Surface brief: Overview `/` + admin shell

## Scope and mode

- Overview `/` is **Persuade**: the visitor decides whether to interview and downloads the CV.
- The admin shell (topbar, sidebar or bottom nav, ⌘K) wraps every page and is **Operate**; it carries the same world in restrained form.
- Fidelity for Fase 3: direction, tokens, first-viewport sketches at 390 px and 1440 px. Build happens in Fase 5–7.

## Audience, job, action, proof, constraints

- Tech lead or hiring manager at a Japan-linked software company, often on a phone between tasks, deciding in minutes (PRODUCT.md).
- Primary action: **Download CV**, one per viewport; then LinkedIn, then email.
- Proof on hand: SOBAT-PS live on a provincial government domain, PolicySemVer on GitHub Marketplace and npm (v1.0.1), this site as a running system, 54 months of experience computed at render. No invented numbers.
- Theme follows the device; both themes must be equally strong. Native scroll. Motion: lean, plus one signature moment, reduced-motion safe.
- Anti-goals (Rahmat): looking like a shadcn template; anything artsy that slows scanning.

## Direction contract

THESIS: The site introduces Rahmat the way a Japanese business meeting starts: one meishi handed over facing the reader, whose back is the system that serves it. It refuses the category default of a dashboard hero over a row of KPI tiles.

OWN-WORLD: The meeting table is the ground (cool 鼠 gray-blue in light, deep 藍 indigo in dark) and owns most of the surface. Content sits on 91:55 card stock with hairline trim, a short lift shadow and no rounded pills. Ink is sumi near-black on stock. One 朱 vermilion signal, used only for Download CV and the Live state. Type is Morisawa BIZ UD: proportional Gothic for words, fixed-pitch Gothic for IDs, dates and figures. Serial numbers (No. 001) mark every record.

STORY: In five seconds the visitor knows who this is and what he builds. Turning the card shows the architecture of this very site, and the cards already on the table (SOBAT-PS live, PolicySemVer published) prove it ships. They download the CV or pick up a project card.

FIRST VIEWPORT: Mobile 390: 52 px topbar (menu, OVERVIEW, search). The meishi spans the width minus 16 px gutters at 91:55 (taller only if its content needs it): the full name two lines at card scale, then the role, the affiliation (Software Engineer, Global Collabo Tech) and location, a rule, LinkedIn left and the vermilion Download CV · PDF right, on the card. Under it a "Turn the card over" control, the one-liner set on the table, a three-column ledger of fixed-pitch stamps (4 yrs 6 mo, 6, v1.0.1), and the SOBAT-PS record inside the first viewport. Desktop 1440: sidebar left; the card at roughly 560 px wide left of center, floating above records that lie flat; the one-liner and ledger to its right; three 91:55 record cards in a row below.

FORM: The Meishi Exchange, position 5 of 7 on the ordered list; seed:80a40aaf8476870a. Raises kept from declined challengers: exact tabular date stamps on one ruled baseline (Daylight Section); one signal colour for the single live action (Chromatophore Skin); hierarchy by scale contrast, no icon tiles (Type Specimen); a closed palette where every tone has a job (Four-Shade Field); focus lifts one record card and dims the rest (Title-Card Wall).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

The card flip: "Turn the card over" (or the phrase "architecture diagram" in the one-liner) rotates the meishi once in 3D and its back is a data-rendered diagram of this site (Browser → Cloudflare Worker with Next.js + Hono → D1 and R2). Under reduced motion it cross-fades. The front must work without ever being turned, and the back carries Download CV too.

## Open decisions

- Exact token values and contrast are approved in Fase 3 (`docs/DESIGN.md`); component anatomy in Fase 5.
- Resolved in Fase 3: Download CV lives on both faces of the card; a CV dock appears only while the card is out of view (bottom of the screen on phones, topbar on desktop).
- JA locale: same BIZ UD faces with Japanese slices; not scheduled.
