---
target: admin shell
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:/Users/apple/GitHub/project-personal/portfolio/src/components/shell/shell.tsx"
target_fingerprint: "sha256:64b317b976cb1af83127998297541187188c3c1801f3e3b01e0c72bd4e43e6ce"
target_path: /Users/apple/GitHub/project-personal/portfolio/src/components/shell/shell.tsx
timestamp: 2026-10-25T01-46-11Z
slug: src-components-shell-shell-tsx
closed: true
---
⚠️ DEGRADED: single-context (session does not spawn sub-agents unless the user asks; A finished before detector output was read)

Target: admin shell — src/components/shell/, src/app/(public)/layout.tsx, not-found, error, loading. 390 and 1440 px, light and dark. Mode: Operate.

## Design Health Score
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | aria-current + crumb on every page; loading is a generic 4-line skeleton |
| 2 | Match system / real world | 3 | "Rahmat › Section" reads like a site trail; "Design system" label clear |
| 3 | User control and freedom | 3 | Esc closes palette, sheet closes on navigation, Back works |
| 4 | Consistency and standards | 3 | One NAV list feeds sidebar, sheet, footer, palette; 404 stays in the shell |
| 5 | Error prevention | 3 | ⌘K/Ctrl+K left alone while typing in fields |
| 6 | Recognition over recall | 3 | Text labels everywhere, visible search trigger |
| 7 | Flexibility and efficiency | 3 | ⌘K/Ctrl+K, skip link, keyboard-only path tested |
| 8 | Aesthetic and minimalist | 3 | Restrained meishi world; desktop footer is an almost empty band |
| 9 | Error recovery | 3 | 404 and error pages offer a way forward; CV falls back to LinkedIn |
| 10 | Help and documentation | 2 | Palette shows no Enter/Esc hint |
| Total | | 29/40 | Good |

## Design specificity
LLM: the shell carries the meishi world in restrained form (table ground, stock sheets, one 朱 action, hairline rules, BIZ UD type); it follows the approved Fase 3 sketch at 390 and 1440. Structurally it is a familiar admin layout by intent (Operate). Risk of shadcn-template look is low: no pills, no icon tiles, no gradient chrome.
Deterministic: `impeccable detect --json` on shell sources = [] (exit 0). Browser overlay on /no-such-page (390, light) and / (1440, dark): "No anti-patterns found".

## Fixed during the run
- React duplicate key "/" in the topbar crumbs on Overview (Rahmat and Overview both carried href "/"); regression test added and mutation-checked.
- Palette placeholder truncated at 390 px; shortened to "Pages, projects, skills" (accessible name unchanged).

## Priority issues (remaining)
1. [P2] Loading state is a generic 4-line skeleton, not the page's shape. Fix in Fase 7 with per-page loading. /impeccable harden
2. [P2] Palette has no Enter/Esc/arrow hint; first-time and screen-reader users discover keys by chance. Add a one-line footer "↑↓ to move · Enter to open · Esc to close" (arrows as SVG). /impeccable clarify
3. [P3] Desktop footer is a near-empty band (only the name, nav hidden). Either drop it on desktop or give it the data-freshness line the Footer component was meant for (Fase 7). /impeccable distill

## Persona red flags
- Hiring manager on a phone: CV dock always in thumb reach, good; dock costs ~76 px of reading height on every page (by contract).
- Keyboard power user: shortcut follows OS, hint shown only on pointer: fine; nothing broken.
- First-timer: search trigger says "Search projects, skills" while results also include pages (minor).

## Minor
- Until Fase 7, /projects/<slug> 404 marks Projects as current with a slug crumb (Fase 7 passes record titles).
- Next dev badge overlaps the System segment in dev only.

## Questions
- Should the palette teach its keys inline, or stay silent like the sketch?
- Does the desktop footer earn its space before Fase 7 gives it data?
