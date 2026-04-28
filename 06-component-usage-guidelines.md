# Component Usage Guidelines | راهنمای استفاده از کامپوننت‌ها

**Version:** 3.1 | **Updated:** 2026-02-25

---

## Overview | نمای کلی

This document defines **when to use** and **when NOT to use** each component in the Dynova design system. For component specs, props, and code examples, see [02-component-catalog.md](./02-component-catalog.md).

These rules exist to enforce consistency and prevent component misuse. When in doubt, refer back to the [Design Principles](./README.md#design-principles) — particularly **minimal viable options** and **consistency over novelty**.

---

## Button | دکمه

### When to use

- Any action that changes state, submits data, or navigates as a result of an action
- Form submissions, confirmations, cancellations
- Triggers for opening Bottom Sheets, dropdowns, dialogs
- Any user-initiated interaction that produces a side effect

### When NOT to use

- **Navigation without action** → Use `<a>` links instead
- **Icon-only interactions** → Use [IconButton](#icon-button) instead
- **State toggles** (on/off) → Use `<Switch />` instead
- **Selection between multiple options** → Use `<RadioGroup />` or `<Select />`

### Constraints

- **One `default` button per logical action group.** Multiple `default` buttons in the same view dilute the primary action.
- **Destructive actions always have an adjacent cancel option.** Never display a `destructive` button without a way to back out.
- **Single size (44px).** No size variants exist for Button — do not attempt to override.
- **Five types only:** `default`, `secondary`, `tertiary`, `destructive`, `ghost`. Do not introduce new variants.
- **Type hierarchy must be respected:**
  1. `default` — primary action on the page
  2. `secondary` — important but not primary
  3. `tertiary` — alternatives, third-level actions
  4. `destructive` — dangerous/irreversible
  5. `ghost` — minimal-weight, inline contexts

---

## Icon Button | دکمه آیکونی

### When to use

- Actions where the icon is **universally understood** (edit, delete, close, settings)
- Toolbars and table row actions where horizontal space is constrained
- Toggle actions (favorite, expand, collapse)
- Header utility actions (search, notifications, user menu)

### When NOT to use

- **Ambiguous actions** without an established icon convention → Use a labeled Button
- **Primary page actions** that need full prominence → Use a labeled `default` Button
- **Navigation links** in main content → Use a regular link or labeled Button
- **Actions where the user might not recognize the icon** → Add a label

### Constraints

- **Every IconButton must have `tooltipLabel`.** No exceptions. WCAG 1.1.1 requires text alternatives for all interactive icons.
- **The `xs` size (24×24px) should be used sparingly.** Reserve for highly dense contexts like inline table cells. Always pair with the 44px invisible hit area.
- **Icons in `xs` and `sm` sizes require 44px invisible hit area** wrappers for WCAG 2.5.5 compliance.
- **Two types only:** `filled`, `tertiary`. Do not create new variants.
- **No size variants of `<Button />`.** IconButton is its own component — never use Button with an icon-only label.

---

## Bottom Sheet | بازشوی پایینی

### When to use

- **All overlay interactions** — confirmations, forms, wizards, pickers, configuration panels
- Any flow where the user needs to perform a contained task before returning to the workspace
- Multi-step processes where minimize-and-resume is valuable
- Any context where a Dialog/Modal would have been used in v2.0

### When NOT to use

- **Inline page content** that is part of the main flow → Render directly on the page
- **Persistent UI** that is always present → Use sidebar, header, or page layout
- **Toast notifications** or transient feedback → Use Toast/Alert
- **Tooltips and hints** → Use Tooltip/Popover

### Single Exception

**Table filter dialogs** may use a modal pattern instead of Bottom Sheet. This is the only case where Dialog usage is permitted.

### Constraints

- **Scrim click does NOT close the sheet.** Users must use the close or minimize buttons explicitly.
- **Close and minimize only via header buttons.** No other dismissal mechanism (no Escape key dismissal in default behavior — see [Future Backlog](./07-future-backlog.md) for keyboard navigation roadmap).
- **Minimize hides the close button.** This prevents accidental closure of in-progress work.
- **Sticky header and sticky action row.** Content scrolls between them; header and actions never scroll out of view.
- **`overscroll-behavior: contain`** is required to prevent scroll chaining to the workspace.
- **One Bottom Sheet at a time.** Do not stack Bottom Sheets — use breadcrumbs within a single sheet for nested flows.

---

## Sidebar | نوار کناری

### When to use

- **Primary navigation on every page.** The sidebar is a global, persistent navigation component.

### When NOT to use

- The sidebar is the only navigation pattern. There are no alternative use cases for this component.

### Constraints

- **All collapsed nav items require tooltips.** Without labels, users cannot identify destinations. Tooltip uses the system default Tooltip spec.
- **Category separators become dividers in collapsed mode.** Text headers cannot render at 76px width — they convert to 1px horizontal dividers using `color/border/default`.
- **No shadow.** The sidebar is at page elevation. A shadow would imply it floats above the workspace, contradicting the elevation hierarchy.
- **1px `color/border/default` only on the workspace-facing edge.** No top, bottom, or outer-edge borders.
- **Background is always `color/bg/subtle` (#FFFFFF).** Do not theme the sidebar separately from the rest of the app.
- **Active state propagates to dropdown parents in collapsed mode.** When viewing a child page in a collapsed sidebar, the parent icon shows the active treatment.
- **Hover-to-expand temporarily expands a collapsed sidebar.** This is a discoverability feature — collapse returns automatically when the cursor leaves.

---

## Tooltip | تولتیپ

### When to use

- **Required label for every IconButton.** This is non-optional.
- Required label for collapsed sidebar nav items.
- Supplementary information for elements where a visible label would add clutter (e.g., truncated table cells, abbreviated metadata).
- Definitions for technical terms or jargon in dense contexts.

### When NOT to use

- **Critical information that affects user decisions.** Tooltips are only visible on hover/focus and may be missed. Display critical info inline.
- **Long-form content.** Tooltips should be a single short line. For longer content, use a Popover.
- **Mobile contexts.** Tooltips do not appear on touch devices. Plan UI accordingly.
- **Replacing a label that should always be visible.** If users need the information at a glance, show it always.

### Constraints

- **Single source of truth:** the system default Tooltip spec from [02-component-catalog.md](./02-component-catalog.md#tooltip). Do not create variant tooltips.
- **Show delay: 300ms. Hide delay: 0ms.** Do not adjust per-component.
- **Auto-suppressed when the trigger is disabled.** Do not display tooltips on disabled elements.
- **Default position: top.** Override only when collision detection requires it.

---

## Input / Text Field | ورودی متنی

### When to use

- Free-form text entry: names, emails, descriptions, search queries
- Numeric entry (use `type="number"`)
- Password entry (use `type="password"`)

### When NOT to use

- **Selection from a fixed list of options** → Use `<Select />`
- **Boolean toggle** → Use `<Switch />` or `<Checkbox />`
- **Multi-line free-form text** → Use `<Textarea />`
- **Date entry** → Use date picker component (when available)

### Constraints

- **Always wrap in the Text Field Stacking pattern** when subtext (errors, hints) may appear. Reserves 19px below the input for zero layout shift.
- **52px fixed height.** Do not override.
- **Resting border uses `color/border/strong`.** This is the WCAG 1.4.11 requirement — the border is the sole visual indicator of the input boundary.
- **Error state uses `color/status/danger`** for both border and subtext.
- **Always pair with a `<Label />`.** Placeholder text is not a substitute for a label.

---

## Badge | نشان

### When to use

- Status indicators (Active, Pending, Failed)
- Counts (notification count, item count)
- Categorical tags (governance category, role)
- Inline metadata that benefits from visual distinction

### When NOT to use

- **As a button.** Badges are non-interactive. Use a Button or chip pattern for clickable elements.
- **For dense numeric data.** Use a number directly or a more appropriate data display.
- **As primary content.** Badges are supplementary — they decorate, not lead.

### Constraints

- **Match semantic intent to variant:** success → success, error → danger, caution → warning, neutral info → info.
- **Use `outline` variant when no semantic meaning is needed** — purely categorical tags.
- **Do not stack many badges in one cell or area.** If you need more than 2-3, reconsider the layout.

---

## Table | جدول

### When to use

- Tabular data with multiple columns and rows
- Sortable, filterable lists of records
- Data that benefits from row-level actions

### When NOT to use

- **Layout grids.** Tables are for data, not layout.
- **Single-column lists.** Use a simple `<ul>` or list component.
- **Card-based collections.** Use a grid of Cards instead.

### Constraints

- **Use IconButton for row actions** (edit, delete, view) — not labeled Buttons. Space is precious.
- **Selected rows use `color/selection/selected`** as the background.
- **Empty state must use `<EmptyState />`** — do not leave the table body blank.
- **Filter dialogs are the single Dialog exception.** All other table-related overlays should use Bottom Sheet.

---

## Spinner / EmptyState / ErrorState

### When to use

- **Spinner:** Brief loading states (< 2 seconds expected). For longer loads, prefer Skeleton.
- **EmptyState:** When a list, table, or container has no data — and the user could potentially add some.
- **ErrorState:** When a fetch or operation has failed and the user needs to retry or be informed.

### When NOT to use

- **Spinner for long-running operations** → Use Progress or Skeleton instead
- **EmptyState for filtered results returning nothing** → Use a more contextual "No results match your filter" message inline
- **ErrorState for form validation errors** → Use Text Field Stacking subtext

---

## General Rules | قوانین عمومی

### Composition

- **Components compose. Do not nest interactive components inside other interactive components.** A Button inside a Button, a clickable Card containing a Button — these create accessibility issues.
- **Use semantic HTML.** Use `<nav>`, `<main>`, `<header>`, `<aside>`, `<section>` appropriately.

### Token Usage

- **Components bind only to Collection 2 (Semantic) tokens.** Never reference primitives (`primary/500`, `neutral/700`) directly from a component.
- **No hardcoded values.** No `#hex`, no `12px`, no inline styles for design properties.
- **Use Tailwind utility classes mapped to semantic tokens** wherever possible.

### Accessibility

- **WCAG 2.1 AA is the minimum.** No exceptions.
- **Touch targets ≥ 44×44px** or 44×44px invisible hit area for smaller visible elements.
- **Focus rings on all interactive elements:** 2px white gap + 2px focus ring color.
- **Every IconButton has a tooltip.** Every input has a label. Every image has alt text.
- **Disabled states** use `opacity/disabled` (40%) + `aria-disabled="true"` + `pointer-events: none`.

### Internationalization

- **Bilingual labels** (English | Persian) on user-facing text.
- **Logical CSS properties** (`ms-*`, `me-*`, `ps-*`, `pe-*`, `border-s-*`, `border-e-*`) for RTL support.
- **`dir="rtl"`** on root layout.

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Token reference
- **[Component Catalog](./02-component-catalog.md)** — Component specs and code examples
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Figma to code reference
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Main Layout](./05-main-layout.md)** — Complete layout specification
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
