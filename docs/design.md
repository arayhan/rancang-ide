---
version: alpha
name: Rancang Ide — Engineered Futurism
description: Neo-brutalist structure with a futuristic blueprint language — cobalt on deep space, Clash Display caps, visible engineering.

colors:
  primary: "#1B44F0"
  primary-hover: "#3D5FF5"
  primary-pressed: "#1233C4"
  on-primary: "#FFFFFF"
  accent: "#6E8DFF"
  background: "#0A0E1A"
  surface: "#101624"
  surface-raised: "#151C2E"
  border: "#26304A"
  border-strong: "#3D5FF5"
  on-surface: "#E8ECF8"
  on-surface-muted: "#8B94AD"
  shadow: "#050810"
  success: "#12B76A"
  warning: "#F79009"
  error: "#F04438"
  info: "#6E8DFF"
  background-light: "#F2F5FF"
  surface-light: "#FFFFFF"
  on-surface-light: "#0A0E1A"
  on-surface-muted-light: "#4A5578"
  border-light: "#0A0E1A"
  shadow-light: "#0A0E1A"

typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontFeature: "uppercase"
  h1:
    fontFamily: "Space Grotesk"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  h2:
    fontFamily: "Space Grotesk"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
  h3:
    fontFamily: "Space Grotesk"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: "Inter"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  label-mono:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
    fontFeature: "uppercase"
  code:
    fontFamily: "JetBrains Mono"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  button-primary-disabled:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    height: 44px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: 48px
  input-focus:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: 48px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-hover:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  node-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  badge-verdict-strong:
    backgroundColor: "{colors.success}"
    textColor: "{colors.background}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  badge-verdict-weak:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  badge-verdict-pivot:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.background}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
  tab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  tab-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
---

# Rancang Ide Design System

## Direction update — Light Minimal edition (2026-07, supersedes dark)

The founder moved the product to a **light, minimal, whitespace-forward** look
with the **isometric blueprint** as the main visual interest. Light is now the
default theme (this doc is the source of truth):

- **Canvas:** white `#FFFFFF` background, deep-space `#0A0E1A` as text; generous
  whitespace; a **faint** blueprint grid (≈5% ink) and a soft cobalt **aura**
  wash only behind hero/auth surfaces. Borders are light hairlines `#E7EAF3`.
- **One accent:** cobalt `#1B44F0` / `#2F52E6` stays the single accent; semantic
  colors only for verdict/status. No second color.
- **Tactility, softened:** the hard neo-brutalist offset shadow is replaced by a
  modern **float-on-hover** (translateY(-3px) + a soft cobalt-tinted shadow) on
  cards/buttons — keeps the tactile feel without the poster weight.
- **Type:** **Space Grotesk** display (in place of self-hosted Clash Display),
  Inter body, JetBrains Mono for labels/code.
- **Signature motion (kept, calm):** animated **isometric blueprint SVG**
  (line-draw + node-pop + floating idea-cube), staggered **reveal-up** entrances,
  **scan-line** over streaming AI output, blinking **caret**, the **verdict
  stamp**, and **corner ticks** as a recurring accent.
- **Guardrails:** document areas (PRD/report bodies) stay quiet; motion is
  `transform`/`opacity` only and disabled under `prefers-reduced-motion`;
  WCAG AA contrast non-negotiable. Minimalism = whitespace + one accent + the
  iso illustration doing the heavy lifting.

## Overview

Rancang Ide is where Indonesian solo builders validate and blueprint their product ideas. The design must feel like an **honest engineer's workspace**: precise, structured, no fluff — mirroring the brand voice of "a sparring partner willing to say the idea is weak." The direction is **Engineered Futurism**: neo-brutalist structure (firm 2px borders, hard offset shadows, tactile press-down interactions) wrapped in a futuristic blueprint language (fine technical grid, uppercase mono labels, corner ticks, a scan-line while the AI works, a thin cobalt glow). Its aesthetic root is the founder's own Prima UI — "engineered minimalism, cobalt on ice, Clash Display caps, visible structure" — shifted to dark mode as the default. Primary anti-patterns: never become (1) a generic SaaS dashboard with purple gradients, (2) garish multi-color neo-brutalism à la a poster, (3) excessive sci-fi that sacrifices document readability.

## Colors

One color family: **cobalt `#1B44F0`** and its derivatives, over a dark-blue monochrome. `background #0A0E1A` is "deep space" with a blue undertone — not pure black — so the blueprint grid and cobalt glow feel unified. `surface` and `surface-raised` step up gradually for layering without soft shadows. `accent #6E8DFF` is an electric tint of cobalt for links, glow, and info — still in the blue family, not a second color. Semantics (success/warning/error) appear **sparingly**, almost exclusively for verdict badges and error states; they're seasoning, not the palette. Light mode flips to "ice" (`#F2F5FF`) with dense black-blue borders in classic brutalist fashion. Text contrast must be WCAG AA: `on-surface #E8ECF8` over all dark surfaces passes; text over `primary` is always white; never use `on-surface-muted` for long-form text.

## Typography

Three voices, three roles. **Clash Display** (500–600) for display/h1–h3 — a firm geometric display; the `display` level is always uppercase with tight tracking, carrying "Clash Display caps" from Prima UI. **Inter** for body — neutral and highly readable for long-form documents (the PRD is core content; readability is non-negotiable). **JetBrains Mono** has two jobs: `code` for spec/markdown output, and `label-mono` — small uppercase labels with wide tracking (`0.08em`) that become the system's _futuristic signature_: stage names ("VALIDATION"), status ("GENERATING…"), technical annotations ("— 24PX"), verdict badges. When unsure which font a small element uses: a label = mono, a sentence = Inter.

## Layout

A 4px-based spacing scale (`xs 4` → `3xl 64`). Density is **comfortable within components, generous between sections** — document content needs breathing room, but tree nodes may be tight. A blueprint grid (1px `border` lines at 24px intervals, low opacity) may appear as a background in the hero, empty states, and canvas/tree areas — it's environmental, not decoration everywhere. Document-content containers max out at ~720px for readability; work areas (tree, dashboard) may go full-width. Blueprint-style size annotations (tick lines + mono labels) are used in the style guide and marketing, not in everyday product UI.

## Elevation & Depth

No soft shadows. Depth is built from three tools: (1) **surface steps** — `background → surface → surface-raised`; (2) **2px borders** — `border` by default, lighting up to `border-strong`/`primary` when interactive; (3) **hard offset shadows** — `4px 4px 0 {colors.shadow}` for clickable elements, growing to `6px 6px 0` on hover (element lifts `translate(-2px,-2px)`), collapsing to `0 0 0` when pressed (element drops `translate(2px,2px)`) — this is the neo-brutalist tactility. A futuristic glow (`0 0 24px` `primary` at ~25% opacity) is only for AI moments: streaming, generating, verdict reveal. In light mode the shadow uses `shadow-light` (dense black-blue) — classic brutalism.

## Shapes

Small, firm radii: `sm 4px` for controls (button, input, badge, node), `md 8px` for cards/containers, `lg 12px` only for large modals/panels, `full` for avatars. No pill buttons — the pill shape is too friendly for an honest-firm brand. Sharp corners + thick borders are the identity; if an element feels "too soft," shrink its radius, don't enlarge it. Corner ticks (small L-shaped strokes at the corners of important cards, `accent` colored) are a blueprint accent — use on at most one or two elements per screen.

## Components

**Button:** primary cobalt with a hard shadow + full hover-lift/press-down cycle; secondary on a surface with a border that lights up on hover; disabled loses its shadow and drops contrast (but stays readable). Button text = `body-sm` weight 600. **Input:** surface + 2px border; focus swaps the border to `primary` plus a thin glow ring — no default browser outline. **Card:** `surface`, border, radius `md`; interactive cards use the same hover behavior as buttons. **Node-card** (feature tree): compact, radius `sm`, 2px `border` connector lines; a selected node has a `primary` border + corner ticks. **Verdict badge:** the only place semantic color appears in full — `label-mono`, entering with a stamp animation. **Tab (stage nav):** `label-mono` text, a 2px `primary` underline for the active one, not a background fill. For Tailwind: declare every token as a CSS custom property in `:root` (`globals.css`/`tokens.css`), then map to `theme.extend` (colors via `var(--color-*)`, fontFamily, borderRadius, spacing) — components use utilities that point at tokens, not hardcoded values; hover/press states via `transition` + `translate` utilities following the elevation recipe.

## Motion & Interaction

_(An extension beyond the standard design.md schema — motion tokens live as CSS variables.)_ Three durations: `--motion-fast 120ms` (press, toggle), `--motion-base 200ms` (hover, expand/collapse, fade), `--motion-slow 320ms` (panel, stamp, reveal). Default easing `cubic-bezier(0.2, 0.8, 0.2, 1)` — leaves fast, lands firm ("snap"); `linear` reserved for technical effects (scan-line, blink). Canonical micro-interactions: (1) **button press** — lift on hover, drop + shadow collapse on active; (2) **generating** — a thin `accent` scan-line moving over the output area + a blinking mono caret at the end of streaming text; (3) **verdict stamp** — the badge enters scale 1.15→1 with rotate -2°→0, slow duration, once only; (4) **tree expand** — height + fade `base`, chevron rotate; (5) **copy feedback** — the label changes to "COPIED ✓" for 1.2 seconds. Hard rules: animate only `transform`/`opacity` (GPU-friendly, no layout thrash); all non-essential motion off under `prefers-reduced-motion`; no looping animation in document-reading areas.

## Illustration & 3D

_(Extension.)_ Isometric 3D is an **illustration layer**, not a global UI style — its place is the landing hero, empty states, and onboarding. The style: **isometric blueprint wireframe** — extruded blocks/structures drawn as 2px `accent`/`primary` lines over a grid, like an engineering drawing being "built"; may carry a thin glow and a line-drawing animation (stroke-dashoffset). Medium: SVG or CSS 3D transforms (`rotateX(54.7deg) rotateZ(45deg)` for the iso projection) — **not three.js/WebGL in the MVP**; it's heavy and adds no value for a document-based product. Illustration never replaces content or slows time-to-interaction; if forced to choose, content wins.

## Do's and Don'ts

**Do:**

- Build depth from border + surface step + hard shadow; light the glow only when the AI is working.
- Use uppercase `label-mono` for all small labels, statuses, and technical annotations — this is the system's signature.
- Keep the hover-lift → press-down tactile cycle on all clickable elements.
- Keep document areas (PRD/report) as calm as possible: Inter, full contrast, no looping animation.
- Apply tokens via CSS variables → the Tailwind theme; one source of values for both agent and human.
- Respect `prefers-reduced-motion` on every micro-animation.

**Don't:**

- Don't add a second color outside the cobalt family; semantics only for verdict/status.
- Don't use soft/blur gray drop-shadows — that's generic SaaS language, not this system.
- Don't use pill buttons, radius > `lg`, or "friendly" corners.
- Don't animate `width`/`height`/`top`/`left` or anything that triggers layout reflow.
- Don't place the blueprint grid/iso illustration behind long-form text.
- Don't let neo-brutalism become an excuse for poor contrast — WCAG AA is non-negotiable.
