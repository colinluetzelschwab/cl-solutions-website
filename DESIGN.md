# CL Solutions — DESIGN.md (B&W Editorial v2026-04-20)
# References: Tom Carder × Lolo × Ravi Klaassens × Oryzo
# Light warm paper default, system-preference dark mode, ZERO chromatic UI accent.
# One rust-red moment reserved for hover underlines + the live dot.

## 1. Identity

Boutique studio — deliberate, quiet, editorial. Copy carries the design, not decoration.
Paper + ink + serif italic moments. Photography does the color lifting.

**Positioning:** International. Colin is stationed between Zurich and Helsinki. Copy
addresses founders anywhere — never Swiss-only.

**Sibling DNA audit** (must diverge from):
- lucasvision (black + yellow + Instrument Serif) → we use warm paper default
- veloscout (racing-red + Barlow Condensed) → no racing colors, serif display
- aariviiva (cold B&W editorial + Instrument Serif) → warm paper, inline-image signature, rust hover
- v0-portfolio (Fraunces + rust + moss) → different serif (Instrument), no moss
- clsolutions v1 porcelain+burgundy (retired) + v2 obsidian+cyan (retired)

## 2. Palette

**Paper surfaces** (warm concrete, light default):
- `--paper-dark` `oklch(0.96 0.008 85)` — page
- `--surface-1` `oklch(0.94 0.010 85)` — cards / slight lift
- `--surface-2` `oklch(0.91 0.012 85)` — hover / elevated

**Ink** (warm near-black, olive undertone):
- `--ink` `oklch(0.16 0.008 80)` — primary text + primary button
- `--ink-soft` `oklch(0.24 0.010 80)` — serif italic moments
- `--ink-muted` `oklch(0.46 0.012 80)` — body
- `--ink-faint` `oklch(0.62 0.010 80)` — eyebrows, metadata, tabular numbers

**Accent — rust red, RESERVED for:**
- hover-only link underlines (`.link-ghost::after` on hover)
- live dot indicator
- `chip-accent` (e.g. "Most picked")
- hero draw-underline on ONE italic word
- **Never** as solid button background, never as default text color, never on hover text
- `--accent` `oklch(0.46 0.16 30)`

**Dark mode** (system-preference driven, warm charcoal Ravi-path):
- Paper: `oklch(0.135 0.008 80)`
- Ink: `oklch(0.95 0.010 85)`
- Accent: `oklch(0.66 0.19 30)` (brighter rust for dark legibility)

## 3. Typography

**Families** (all wired in `app/layout.tsx`):
- **Display + italic moments: Instrument Serif** — the signature voice. Returns as display font.
- **Body + UI: Inter** — readable workhorse.
- **Eyebrows + tabular nums: IBM Plex Mono**.

**Rules:**
- `.display` class = **Instrument Serif** 400, letter-spacing -0.018em, line-height 1.02.
- `.display-sans` reserved for specific cases (big tabular numbers, technical labels).
- Italic moments strictly limited: **one serif italic word per section max**.
- The single hero italic gets a rust hand-drawn underline (via `.draw-underline`).
- Mono eyebrows: 11px, 0.22em tracking, uppercase, `--ink-faint`.
- Body: 15–18px Inter 400, line-height 1.55, `--ink-muted`.

**Never**: chromatic display headings, multiple italic words per section, all-caps display.

## 4. Layout & composition

- **Whitespace is the primary design element.** Generous section padding (py-24–40 on desktop).
- **Asymmetric editorial grid** — 12-column with broken lines like Ravi. Headlines span 7 cols, body spans 5.
- **Pagination markers** ("01 / 05") as Ravi-style chapter dividers.
- **Ledger-style pricing + process** — flat typography, minimal ornament, no cards with heavy borders.
- **Inline images** (Tom Carder signature) — small client-shot thumbnails embedded mid-headline.
- **Dual-image hover swap** (Ravi) — optional, available via `.dual-img` utility.

## 5. Motion

- Fade-up on scroll intersection (0.7s cubic-bezier(.22,1,.36,1))
- Word-by-word hero reveal (0.065s stride — slower than cyan draft for editorial pace)
- Scroll-linked parallax only on hero headline block (y: -60 max, subtle)
- Hand-drawn rust underline on hero italic word (draws in at 1.4s)
- `prefers-reduced-motion` honored everywhere
- **No magnetic buttons, no shine sweep, no shader, no gradient buttons.**

## 6. Buttons

- **`.btn-primary`** — ink slab, paper text. Firm editorial. Hover = translateY(-1px) + opacity 0.92.
- **`.btn-ghost`** — transparent, fine ink border. Hover = subtle surface lift.
- **`.chip-accent`** — rust red only for "Most picked" / "Available now" labels.
- **`.link-ghost`** — underline grows to full rust opacity on hover. The primary "link feel" across the site.

## 7. Anti-patterns (reject on sight)

- Emojis in UI (lucide icons or em-dashes)
- Cyan, violet, or any second chromatic color — rust is the only accent
- WebGL shaders, canvas backgrounds, 3D moments
- Magnetic buttons, shine sweeps, gradient button fills
- Multiple italic moments per section
- Sans-serif display headlines (serif carries the voice)
- Hardcoded colors — every color lives behind a CSS variable
- "Swiss studio" / "Switzerland only" positioning — international copy
- Centered body text (except one-statement CTA)

## 8. Signature moves (Tom Carder × Ravi × Oryzo)

1. **Inline image in headline** — small client-shot thumbnail embedded mid-sentence.
   Example: "We build quiet websites for [img] founders who would rather be understood."
   Utilities: `.inline-img`, `.inline-img-lg`, `.inline-img-xl`.
2. **Pagination markers** — "01 / 05 · ch. I — who we are" as chapter dividers.
3. **Tech-spec micro-readout** (Oryzo-inspired) — small mono `dl` block below CTAs:
   `ship: 3–5 d · price: fixed · reach: EU · remote`. Quiet honest decoration.
4. **Hand-drawn rust underline** on ONE hero italic word (drawn in, not painted).
5. **Dual-image hover** on project cards (Ravi) — base → swap on hover.

## 9. Validation gates (before ship)

1. `critique` skill — all founder-persona scores ≥ 8/10
2. `audit` skill — Lighthouse mobile ≥ 85, WCAG AA pass (paper+ink ratio ~15:1 → AAA)
3. `npx impeccable detect src/` — zero P0/P1 findings
4. Manual: scroll hero, hover links (rust underline), hover CTA, resize 375/768/1440, system-preference toggle dark mode
5. Pre-launch checklist in `_agency/CLAUDE.md`

## 10. Skill pipeline to hit this spec

1. `redesign-existing-projects` — audit current obsidian+cyan draft, flag slop
2. `distill` — strip shader, cyan, magnetic, gradients
3. `minimalist-skill` + `minimalist-ui` — primary taste
4. `typeset` — nail serif display hierarchy
5. `arrange` — asymmetric grid (Ravi-style broken composition)
6. `emil-design-eng` — Kowalski polish (cursor, underlines, focus rings)
7. `animate` — subtle micro-interactions only
8. `clarify` — copy to editorial narrative tone
9. `critique` + `audit` + `npx impeccable detect` + `polish` — QA gates
