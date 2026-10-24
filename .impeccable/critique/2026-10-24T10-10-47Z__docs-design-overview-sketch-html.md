---
target: Overview first-viewport sketch
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/apple/GitHub/project-personal/portfolio/docs/design/overview-sketch.html"
target_fingerprint: "sha256:77df08035616fdb1bf4dc9deede8f87b878836949aba7f69620c275ec619d9fe"
target_path: /Users/apple/GitHub/project-personal/portfolio/docs/design/overview-sketch.html
timestamp: 2026-10-24T10-10-47Z
slug: docs-design-overview-sketch-html
---
Method: dual-agent (A: design review sub-agent · B: detector + browser sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No cue for which face of the card is showing beyond the content |
| 2 | Match System / Real World | 3 | "54 months" vs years; "6 systems on the table" over a table of 3; two "No. 001" |
| 3 | User Control and Freedom | 3 | Flip is reversible, but turning the card removes Download CV |
| 4 | Consistency and Standards | 2 | Meishi claims theme-invariant but inherits page tokens; ⌘K on phones; search aria-label ≠ visible label |
| 5 | Error Prevention | 3 | CV gives no format/size; flip hides CV without notice |
| 6 | Recognition Rather Than Recall | 3 | Rotate icon reads as reload; "Components" opaque; PolicySemVer named before introduced |
| 7 | Flexibility and Efficiency | n/a | One-visit Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | Name twice at desktop; v1.0.1 twice; empty bands in 91:55 records |
| 9 | Error Recovery | 2 | No designed fallback for failed CV download or missing computed figure |
| 10 | Help and Documentation | n/a | Persuasion page; "How it's built" covers curiosity |
| **Total** | | **22/32** | **Good (69%, borderline Acceptable)** |

## Design Specificity Verdict

LLM assessment: authored, not category-interchangeable; ~70% of the page lives in the world. The 91:55 meishi, BIZ UD type, nezumi/ai/shu palette with one signal, and the card back drawing this site's architecture are specific. Below the card the page slips back to "hero → stats row → 3-up card grid"; the desktop shell is generic admin chrome; in light mode the meishi and records share stock/shadow so the hero is only "the biggest card".

Deterministic scan: 1 finding (tight-leading on p.line, line-height 1.2 on a 4–6 line display sentence) — fixed to 1.3 after the run; rescan `[]`. Live overlay (light and dark): "No anti-patterns found."

## Priority Issues

- [P1] Signature moment removes the conversion: turned card makes the front inert, no CV left in the viewport; back offers only "How it's built". Fix: CV on the back foot or topbar CV whenever the card's CV is not interactive. /impeccable harden
- [P1] Meishi not theme-invariant; dark focus ring on the card is 1.70:1 (verified). Fix: scope --focus ai-500, --line-strong nezumi-500, --rule on .meishi (6.69:1). /impeccable audit
- [P2] Ledger misses its contract (proportional face, wraps at 1440), "6 systems on the table" vs 3 shown, "54 months" vs years, v1.0.1 repeated. /impeccable typeset
- [P2] Light theme weaker than dark: meishi and records same stock/shadow on mid-gray table. /impeccable bolder
- [P2] Mobile: SOBAT-PS proof below the fold; 91:55 records waste ~700 px. Fix: drop aspect-ratio on mobile records. /impeccable layout

## Persona Red Flags

- Jordan: never flips (reload-style icon, low weight), so never sees the promised proof; "6 systems on the table" confuses.
- Casey: CV top-right of the card, out of thumb reach; no CV after scrolling; 36 px search with useless ⌘K.
- Sam: dark focus ring invisible on the meishi; search label mismatch (WCAG 2.5.3); back face precedes the toggle in DOM.
- Japanese tech lead: native read of the card is a trust signal; but no affiliation (所属) reads as freelance; "54 months" makes them compute; imperative one-liner may feel brash after a polite exchange.

## Minor Observations

Headline at 14 px under a 52 px name; duplicate "No. 001"; ⌘K hidden on coarse pointers; focus to back h2 after flip; back-face flow vertical at 390; sidebar shows short name; rename "Components"; CV format/size; LinkedIn external affordance; turn icon rotation under reduced motion.

## Questions to Consider

1. Should reading "architecture diagram" be the act that turns the card?
2. Confident or confrontational for a Japanese tech lead just handed a meishi?
3. Is the missing affiliation a privacy choice or an omission?
