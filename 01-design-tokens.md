# Design Tokens | توکن‌های طراحی

**Version:** 3.1 | **Updated:** 2026-02-25  
**Source:** [Figma Design System](https://www.figma.com/design/kBh6QuzFDcsY17YHpmL74u/Design-System)

---

## Overview | نمای کلی

Design tokens are the atomic building blocks of the Dynova Design System. They define colors, typography, spacing, shadows, opacity, borders, and other visual properties in a platform-agnostic format.

**Implementation:**
- **CSS Variables:** `src/frontend/src/index.css`
- **Tailwind Config:** `src/frontend/tailwind.config.ts`
- **JSON Export:** `design-tokens.json` (W3C DTCG format, compatible with [tweakcn.com](https://tweakcn.com/))

---

## Token Architecture | معماری توکن

The token system is organized into **two collections** in Figma:

- **Collection 1 — Primitives:** Raw color values organized by family and stop. Never referenced by components.
- **Collection 2 — Semantic:** Named by purpose and context. These are what components bind to.

**Rule:** Components always bind to Collection 2 tokens. Collection 1 exists as an internal implementation detail.

**Token flow:**
```
Collection 1 (Primitives) → alias → Collection 2 (Semantic) → bind → Components
```

This ensures theme changes, dark mode, and rebasing are possible without touching component definitions.

---

## Color System | سیستم رنگ

### Collection 1 — Primitives

6 families × 5 stops = 30 tokens.

Each family follows a consistent 5-stop structure:
- **100** = Subtle background
- **300** = Decorative, secondary
- **500** = Main / default
- **700** = Hover, emphasis
- **900** = Pressed, darkest

| Family | 100 | 300 | 500 | 700 | 900 |
|--------|-----|-----|-----|-----|-----|
| `primary` | `#ddeef7` | `#6aafd4` | `#155c84` | `#0c3a56` | `#061e2d` |
| `neutral` | `#f3f4f6` | `#d1d5db` | `#6b7280` | `#374151` | `#111827` |
| `success` | `#e9f9ef` | `#5ddc89` | `#0e7732` | `#094f21` | `#052a12` |
| `danger` | `#ffe9f0` | `#ff85a8` | `#c41f47` | `#5f0e22` | `#3b0815` |
| `info` | `#f3eefe` | `#bda4f8` | `#5c1fc8` | `#2f106b` | `#1c0942` |
| `warning` | `#fef3e2` | `#fbbf4a` | `#b47818` | `#6d4a0f` | `#3a2708` |

#### Contrast ratios (500 values on white)

| Family | Hex | Ratio on `#ffffff` | WCAG level |
|--------|-----|-------------------|------------|
| `primary/500` | `#155c84` | 6.3:1 | AA (text + non-text) |
| `neutral/500` | `#6b7280` | 4.8:1 | AA (text + non-text) |
| `success/500` | `#0e7732` | 6.1:1 | AA (text + non-text) |
| `danger/500` | `#c41f47` | 5.1:1 | AA (text + non-text) |
| `info/500` | `#5c1fc8` | 7.2:1 | AAA (text + non-text) |
| `warning/500` | `#b47818` | 4.6:1 | AA (text + non-text) |

---

### Collection 2 — Semantic Colors

35 tokens total. **These are what components use.**

#### color/bg

| Token | Aliases | Resolved | Use |
|-------|---------|----------|-----|
| `color/bg/default` | `neutral/100` | `#f3f4f6` | App background, page canvas |
| `color/bg/subtle` | — | `#ffffff` | Cards, panels, table rows |
| `color/bg/muted` | `neutral/300` | `#d1d5db` | Skeleton, divider as bg |
| `color/bg/elevated` | — | `#ffffff` | Modals, dropdowns |
| `color/bg/overlay` | `neutral/900` @ 50% | `rgba(17,24,39,0.5)` | Modal scrim (reserved) |

Note: `color/bg/subtle` and `color/bg/elevated` both resolve to `#ffffff`. The semantic distinction exists for dark mode support — they will diverge when dark mode is implemented.

#### color/text

| Token | Aliases | Resolved | Ratio on white | Use |
|-------|---------|----------|---------------|-----|
| `color/text/default` | `neutral/900` | `#111827` | 16.8:1 (AAA) | Body, headings, labels |
| `color/text/subtle` | `neutral/500` | `#6b7280` | 4.8:1 (AA) | Meta, timestamps, captions |
| `color/text/disabled` | `neutral/300` | `#d1d5db` | 1.8:1 (exempt) | Disabled labels |
| `color/text/inverse` | — | `#ffffff` | — | Text on dark/filled bg |
| `color/text/link` | `primary/500` | `#155c84` | 6.3:1 (AA) | Inline links |

Note: `color/text/disabled` at 1.8:1 is intentionally low. WCAG 1.4.3 exempts disabled controls. Disabled text should only appear on `color/bg/subtle` (#ffffff) backgrounds — never on `color/bg/default` (#f3f4f6) where contrast would drop further.

#### color/interactive

| Token | Aliases | Resolved | Use |
|-------|---------|----------|-----|
| `color/interactive/default` | `primary/500` | `#155c84` | Primary button, default state |
| `color/interactive/hover` | `primary/700` | `#0c3a56` | Button hover |
| `color/interactive/active` | `primary/900` | `#061e2d` | Button pressed |
| `color/interactive/subtle` | `primary/100` | `#ddeef7` | Ghost button bg, chip |
| `color/interactive/focus` | `primary/500` | `#155c84` | Focus ring color |

#### color/border

| Token | Aliases | Resolved | Ratio on white | Use |
|-------|---------|----------|---------------|-----|
| `color/border/default` | `neutral/300` | `#d1d5db` | 1.6:1 | Cards, dividers, decorative borders |
| `color/border/strong` | `neutral/700` | `#374151` | 9.7:1 (AAA) | Standalone input borders, tertiary button/icon-button borders, any border that is the sole visual indicator of a component boundary |
| `color/border/focus` | `primary/500` | `#155c84` | 6.3:1 (AA) | Focused input ring |

**Critical WCAG rule:** When a border is the sole indicator of a component boundary (no fill, no shadow), it must use `color/border/strong` to meet WCAG 1.4.11 non-text contrast (3:1 minimum). `color/border/default` at 1.6:1 fails this requirement and must only be used for decorative/supplementary borders.

#### color/icon

| Token | Aliases | Resolved | Ratio on white | Use |
|-------|---------|----------|---------------|-----|
| `color/icon/default` | `neutral/700` | `#374151` | 9.7:1 (AAA) | Standalone icons, nav |
| `color/icon/subtle` | `neutral/500` | `#6b7280` | 4.8:1 (AA) | Supporting icons |
| `color/icon/interactive` | `primary/500` | `#155c84` | 6.3:1 (AA) | Clickable icons |
| `color/icon/disabled` | `neutral/300` | `#d1d5db` | 1.8:1 (exempt) | Disabled icons |

#### color/status

| Token | Aliases | Resolved | Use |
|-------|---------|----------|-----|
| `color/status/success` | `success/500` | `#0e7732` | Success text, badge, icon |
| `color/status/success-bg` | `success/100` | `#e9f9ef` | Success alert background |
| `color/status/danger` | `danger/500` | `#c41f47` | Error text, destructive |
| `color/status/danger-bg` | `danger/100` | `#ffe9f0` | Error alert background |
| `color/status/info` | `info/500` | `#5c1fc8` | Info text, badge |
| `color/status/info-bg` | `info/100` | `#f3eefe` | Info alert background |
| `color/status/warning` | `warning/500` | `#b47818` | Warning text, badge, icon |
| `color/status/warning-bg` | `warning/100` | `#fef3e2` | Warning alert background |

#### color/dataviz

| Token | Aliases | Use |
|-------|---------|-----|
| `color/dataviz/1` | `primary/500` | Primary data series |
| `color/dataviz/2` | `primary/300` | Secondary data series |
| `color/dataviz/3` | `info/300` | Tertiary data series |
| `color/dataviz/4` | `neutral/500` | Background data |

#### color/selection

| Token | Resolved | Use |
|-------|----------|-----|
| `color/selection/selected` | `#ddeef7` | Selected row, active nav bg |
| `color/selection/highlighted` | `#fef3e2` | Search match, find-in-page |

Note: `color/selection/highlighted` is aligned to `warning/100` for palette consistency.

---

## Typography | تایپوگرافی

### Font Family

**Font:** Yekan Bakh FaNum

This is the sole font family in the system. It supports Persian script and Persian-style (Eastern Arabic) numerals natively.

| Token | CSS Variable | Tailwind Class | Value |
|-------|--------------|----------------|-------|
| Sans | `--font-sans` | `font-sans` | `"Yekan Bakh FaNum", system-ui, sans-serif` |

```typescript
// Tailwind config
fontFamily: {
  sans: ["Yekan Bakh FaNum", "system-ui", "sans-serif"],
}
```

### Font Weights

Only two weights are used in the entire system:

| Weight | Value | Name |
|--------|-------|------|
| Regular | 400 | Default body text |
| SemiBold | 600 | Emphasis, headings, labels |

**Why only two:** Persian text renders poorly at 300 (Light) at small sizes. 700 (Bold) creates visual noise in dense data layouts. Two weights provide sufficient hierarchy while maintaining readability across all sizes.

### Type Scale

12 styles total. Minimum size is 10px.

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `display-lg` | 32px | 600 | 125% | Hero titles |
| `display-md` | 28px | 600 | 125% | Page titles |
| `display-sm` | 24px | 600 | 125% | Section display |
| `heading-lg` | 20px | 600 | 125% | Primary headings, bottom sheet titles |
| `heading-sm` | 18px | 600 | 125% | Secondary headings |
| `body-lg-semibold` | 16px | 600 | 150% | Emphasized body |
| `body-lg-regular` | 16px | 400 | 150% | Body text |
| `body-sm-semibold` | 14px | 600 | 150% | Button text, active labels, nav items |
| `body-sm-regular` | 14px | 400 | 150% | Secondary body |
| `label-lg-semibold` | 12px | 600 | 150% | Form labels, tags |
| `label-lg-regular` | 12px | 400 | 150% | Supporting labels, tooltips |
| `label-sm-semibold` | 10px | 600 | 150% | Captions, badges |

```tsx
<h1 className="text-display-lg">Hero Title</h1>
<h2 className="text-heading-lg">Section Heading</h2>
<p className="text-body-lg-regular">Body text</p>
<label className="text-label-lg-semibold">Form Label</label>
```

#### Removed styles and rationale

- **9px** — below any reasonable readability threshold and below WCAG minimum.
- **18px body** — removed from body range. Retained only as `heading-sm` since it fell between heading and body territory without a clear body use case.
- **`label-sm-regular` (10px / 400)** — removed. At 10px, 400 weight in Persian script is borderline readable for long sessions. All 10px usage now goes through `label-sm-semibold`. Use `color/text/subtle` for visual subordination at 10px instead of weight reduction.

---

## Spacing | فاصله‌گذاری

### Base Unit

All spacing values are multiples of 4px.

### Scale

| Token | Value | Tier | Use |
|-------|-------|------|-----|
| `space/0` | 0px | — | Explicit zero |
| `space/1` | 4px | Component internal | Icon-to-label, badge padding |
| `space/2` | 8px | Component internal | Input vertical padding, list gap |
| `space/3` | 12px | Component internal | Button vertical padding |
| `space/4` | 16px | Component internal | Button horizontal padding, card inner, bottom sheet padding |
| `space/5` | 24px | Between components | Between form groups, card header, column gutters |
| `space/6` | 32px | Between components | Between panel sections, modal padding |
| `space/7` | 48px | Layout | Between major page sections |
| `space/8` | 64px | Layout | Page top padding, hero spacing |
| `space/9` | 96px | Layout | Max layout margin, full-bleed |

### Tier Rules

The spacing scale is divided into three tiers. Each tier has a defined scope. Crossing tiers signals a design error.

- **Component internal (`space/1–4`):** Used inside components — padding, icon gaps, internal element spacing.
- **Between components (`space/5–6`):** Used between sibling components — form field groups, card sections, panel gaps.
- **Layout (`space/7–9`):** Used for page-level structure — section spacing, page margins, hero areas.

**Rule:** Never use a layout-tier value (`space/7–9`) inside a component. Never use a component-internal value (`space/1–4`) as the gap between page sections. If you find yourself crossing tiers, the layout structure needs reconsidering.

### Layout Offset Constants

These are layout-specific values that sit **outside** the spacing token scale. They define the relationship between the sidebar navigation and the content region.

| Token | Value | Context |
|-------|-------|---------|
| `layout/offset/lg` | 40px | Content margin at 1440px viewport |
| `layout/offset/md` | 20px | Content margin at 1280px viewport |

These are not part of the `space/*` collection. They exist as layout constants and should not be used for component or between-component spacing.

---

## Elevation / Shadows | سایه‌ها

### Shadow Tokens

Defined as Figma Effect Styles (not Variables). Spread is always 0. Color is always `#000000`. Maximum opacity is 12%.

| Token | Value | Use |
|-------|-------|-----|
| `shadow/none` | `none` | Flat, explicitly removes elevation |
| `shadow/xs` | `0 1px 2px rgba(0,0,0,0.06)` | Inputs, small buttons |
| `shadow/sm` | `0 2px 8px rgba(0,0,0,0.08)` | Default card elevation |
| `shadow/md` | `0 4px 16px rgba(0,0,0,0.10)` | Dropdowns, popovers, minimized bottom sheet bar |
| `shadow/lg` | `0 8px 32px rgba(0,0,0,0.12)` | Bottom sheets (open state), drawers |

### Elevation Hierarchy

The elevation order is **strict** and must never be skipped or reversed:

```
page background (flat) → cards (shadow/sm) → dropdowns/popovers (shadow/md) → bottom sheets (shadow/lg)
```

**Rule:** A card cannot use `shadow/md`. A dropdown cannot use `shadow/lg`. Each surface type has one correct shadow level.

```tsx
<div className="shadow-xs rounded-md p-2">Input shadow</div>
<div className="shadow-sm rounded-lg p-4">Card shadow</div>
<div className="shadow-md rounded-md">Dropdown shadow</div>
<div className="shadow-lg rounded-lg">Bottom sheet shadow</div>
```

---

## Borders | حاشیه‌ها

### Border Width Tokens

| Token | Value | Use |
|-------|-------|-----|
| `border/width/none` | 0px | Ghost elements, borderless |
| `border/width/default` | 1px | Inputs, cards, dividers, sidebar edge |
| `border/width/emphasis` | 2px | Focus rings, selected states |
| `border/width/accent` | 4px | Alert strips, active sidebar indicator |

### Border Color Tokens

See [color/border](#colorborder) in the Color System section. Three tokens:

- `color/border/default` (`#d1d5db`) — decorative, supplementary borders
- `color/border/strong` (`#374151`) — accessibility-critical borders (sole boundary indicator)
- `color/border/focus` (`#155c84`) — focus rings

### Usage Rules

- When a border is the **sole visual indicator** of a component boundary (no fill, no shadow differentiating it from surroundings), use `color/border/strong`. This is a WCAG 1.4.11 requirement (3:1 minimum for non-text contrast).
- Card borders use `color/border/default` because cards also have fill and shadow distinguishing them. The border is supplementary.
- Input borders in resting state use `color/border/strong` because the border is the primary boundary indicator.
- Sidebar edge uses `color/border/default` because the background color difference between sidebar and workspace provides supplementary contrast.

---

## Border Radius | شعاع گوشه

### Radius Tokens

6 stops.

| Token | Value | Use |
|-------|-------|-----|
| `radius/none` | 0px | Dividers, full-bleed elements |
| `radius/sm` | 4px | Tooltips, small tags |
| `radius/md` | 12px | Inputs, dropdowns |
| `radius/lg` | 20px | Cards, modals, sidebars, bottom sheet top corners |
| `radius/xl` | 32px | Hero panels, large page containers |
| `radius/full` | 999px | Buttons, chips, badges, pills, nav items |

### Nested Radius Rule

When an element is nested inside a rounded container, the inner element's radius must account for the padding gap:

```
inner radius = outer radius − padding
```

**Example:** A card at `radius/xl` (32px) with 16px padding → inner element uses `radius/md` (12px).

When the computed value doesn't match a token exactly, use the nearest token value below the computed result. Do not introduce one-off radius values.

---

## Opacity | شفافیت

### Opacity Tokens

| Token | Value | Use |
|-------|-------|-----|
| `opacity/0` | 0% | Invisible, transition start/end |
| `opacity/hover` | 8% | Hover overlay on filled components |
| `opacity/pressed` | 16% | Pressed overlay |
| `opacity/disabled` | 40% | Entire disabled component |
| `opacity/scrim-subtle` | 30% | Bottom sheet backdrop |
| `opacity/skeleton` | 60% | Skeleton loading |
| `opacity/scrim` | 50% | Full modal backdrop (reserved) |

### Overlay Technique

Instead of maintaining separate hover/pressed fill colors for every component, the system uses a universal overlay approach:

1. The component's fill stays at its default color token
2. A white or black layer at `opacity/hover` (8%) or `opacity/pressed` (16%) is placed on top
3. This technique works for all filled components universally
4. Dark mode becomes trivially achievable — just change the overlay color

### Disabled State Rule

`opacity/disabled` (40%) is applied to the **entire component frame**, with `aria-disabled="true"` and `pointer-events: none`. Never apply disabled opacity to individual child elements inside a component.

### Scrim Usage

- **`opacity/scrim-subtle` (30%):** Used for bottom sheet backdrops. Applied to `neutral/900` (`#111827`), resolving to `rgba(17,24,39,0.30)`. Keeps the workspace legible behind the sheet.
- **`opacity/scrim` (50%):** Reserved for full-screen modal backdrops if ever needed. Applied to `neutral/900`, resolving to `rgba(17,24,39,0.50)`.

---

## Migration Guide | راهنمای مهاجرت

### From Hardcoded Values to Semantic Tokens

```tsx
// ❌ BAD - Hardcoded values
<div className="bg-[#155c84] text-[#111827] rounded-[12px] p-[16px]">
  Content
</div>

// ❌ BAD - Binding to primitives
<div className="bg-primary-500 text-neutral-900 rounded-md p-4">
  Content
</div>

// ✅ GOOD - Semantic tokens
<div className="bg-color-interactive-default text-color-text-inverse rounded-md p-4">
  Content
</div>
```

### v2.0 → v3.1 Common Mappings

| v2.0 Token | v3.1 Semantic Token |
|------------|---------------------|
| `bg-primary-500` (#2093d1) | `color/interactive/default` (#155c84) |
| `text-text-primary` (#4b5563) | `color/text/default` (#111827) |
| `text-text-secondary` | `color/text/subtle` |
| `text-text-disabled` | `color/text/disabled` |
| `text-text-link` | `color/text/link` |
| `border-border-default` (#e5e7eb) | `color/border/default` (#d1d5db) |
| `bg-success-500` (#17c653) | `color/status/success` (#0e7732) |
| `bg-danger-500` (#f8285a) | `color/status/danger` (#c41f47) |
| `bg-warning-500` (#f6b100) | `color/status/warning` (#b47818) |
| `bg-info-500` (#7239ea) | `color/status/info` (#5c1fc8) |
| `rounded-sm` (8px) | `radius/sm` (4px) — value changed |
| `rounded-md` (12px) | `radius/md` (12px) |
| `rounded-lg` (16px) | `radius/lg` (20px) — value changed |
| `shadow-3` | `shadow/sm` |
| `shadow-4` | `shadow/md` |
| `text-display-xl` | `display-md` |
| `text-heading-lg` | `heading-lg` |
| `text-body-md` | `body-sm-regular` |
| `text-label-sm` | `label-lg-regular` |

---

## CSS Variable Reference | مرجع متغیرهای CSS

All tokens are defined in `src/frontend/src/index.css`:

```css
:root {
  /* === Collection 1: Primitives === */

  /* Primary */
  --primary-100: #ddeef7;
  --primary-300: #6aafd4;
  --primary-500: #155c84;
  --primary-700: #0c3a56;
  --primary-900: #061e2d;

  /* Neutral */
  --neutral-100: #f3f4f6;
  --neutral-300: #d1d5db;
  --neutral-500: #6b7280;
  --neutral-700: #374151;
  --neutral-900: #111827;

  /* Success */
  --success-100: #e9f9ef;
  --success-300: #5ddc89;
  --success-500: #0e7732;
  --success-700: #094f21;
  --success-900: #052a12;

  /* Danger */
  --danger-100: #ffe9f0;
  --danger-300: #ff85a8;
  --danger-500: #c41f47;
  --danger-700: #5f0e22;
  --danger-900: #3b0815;

  /* Info */
  --info-100: #f3eefe;
  --info-300: #bda4f8;
  --info-500: #5c1fc8;
  --info-700: #2f106b;
  --info-900: #1c0942;

  /* Warning */
  --warning-100: #fef3e2;
  --warning-300: #fbbf4a;
  --warning-500: #b47818;
  --warning-700: #6d4a0f;
  --warning-900: #3a2708;

  /* === Collection 2: Semantic === */

  /* Background */
  --color-bg-default: var(--neutral-100);
  --color-bg-subtle: #ffffff;
  --color-bg-muted: var(--neutral-300);
  --color-bg-elevated: #ffffff;
  --color-bg-overlay: rgba(17, 24, 39, 0.5);

  /* Text */
  --color-text-default: var(--neutral-900);
  --color-text-subtle: var(--neutral-500);
  --color-text-disabled: var(--neutral-300);
  --color-text-inverse: #ffffff;
  --color-text-link: var(--primary-500);

  /* Interactive */
  --color-interactive-default: var(--primary-500);
  --color-interactive-hover: var(--primary-700);
  --color-interactive-active: var(--primary-900);
  --color-interactive-subtle: var(--primary-100);
  --color-interactive-focus: var(--primary-500);

  /* Border */
  --color-border-default: var(--neutral-300);
  --color-border-strong: var(--neutral-700);
  --color-border-focus: var(--primary-500);

  /* Icon */
  --color-icon-default: var(--neutral-700);
  --color-icon-subtle: var(--neutral-500);
  --color-icon-interactive: var(--primary-500);
  --color-icon-disabled: var(--neutral-300);

  /* Status */
  --color-status-success: var(--success-500);
  --color-status-success-bg: var(--success-100);
  --color-status-danger: var(--danger-500);
  --color-status-danger-bg: var(--danger-100);
  --color-status-info: var(--info-500);
  --color-status-info-bg: var(--info-100);
  --color-status-warning: var(--warning-500);
  --color-status-warning-bg: var(--warning-100);

  /* Spacing */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  /* Layout offsets */
  --layout-offset-lg: 40px;
  --layout-offset-md: 20px;

  /* Border Width */
  --border-width-none: 0px;
  --border-width-default: 1px;
  --border-width-emphasis: 2px;
  --border-width-accent: 4px;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;
  --radius-full: 999px;

  /* Shadow */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.10);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);

  /* Opacity */
  --opacity-0: 0;
  --opacity-hover: 0.08;
  --opacity-pressed: 0.16;
  --opacity-disabled: 0.4;
  --opacity-scrim-subtle: 0.3;
  --opacity-skeleton: 0.6;
  --opacity-scrim: 0.5;
}
```

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Component Catalog](./02-component-catalog.md)** — All components
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Figma to code reference
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
