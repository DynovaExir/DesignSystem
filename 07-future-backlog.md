# Future Backlog | برنامه‌های آینده

**Version:** 3.1 | **Updated:** 2026-02-25

---

## Overview | نمای کلی

This document tracks design system items that are **specified but not yet implemented**, or that have been identified as future work during the v3.1 design refinement process.

Items here are not yet part of the active design system. They are documented to:
- Preserve design intent across iterations
- Provide visibility into planned work
- Prevent ad-hoc reinvention when these items come up in implementation

When an item is implemented, it should be moved to the appropriate active documentation file and removed from this backlog.

---

## Status Legend | راهنمای وضعیت

| Icon | Status | Description |
|------|--------|-------------|
| 📋 | Specified | Spec exists, awaiting implementation |
| 💡 | Concept | Idea documented, full spec not yet drafted |
| ⏸ | Blocked | Specified but blocked by dependency |

---

## Bottom Sheet — Expand Behavior

**Status:** 📋 Specified  
**Related:** [02-component-catalog.md — Bottom Sheet](./02-component-catalog.md#bottom-sheet)

### Spec

The Bottom Sheet should support **vertical expansion** for complex content — tabbed panels, multi-step wizards, forms with 4+ fields. The sheet grows to near-full viewport height.

### When it would apply

- Tabbed panels with multiple sections
- Multi-step wizards
- Forms with 4 or more fields
- Detailed configuration panels

### When it would NOT apply

- Confirmations
- Simple pickers
- Single-step actions

### Why deferred

Frontend constraints in current implementation. Requires layout system updates that are out of scope for v3.1.

---

## Bottom Sheet — Compact Layout for Confirmations

**Status:** 📋 Specified  
**Related:** [02-component-catalog.md — Bottom Sheet](./02-component-catalog.md#bottom-sheet)

### Spec

A **content pattern** (not a component variant) for tight confirmation dialogs within Bottom Sheet. Same container width as standard Bottom Sheet, but content hugs naturally to its minimum height.

### When it would apply

- "Are you sure?" confirmations
- Small picker interactions
- Brief acknowledgments

### Why deferred

Pattern emerged late in v3.1 refinement. Needs validation against real confirmation flows before formalization.

---

## Sidebar — Sub-item Indentation Connector Line

**Status:** 💡 Concept  
**Related:** [05-main-layout.md — Sidebar](./05-main-layout.md#sidebar)

### Spec

A **vertical connecting line** (`color/border/default`, 1px) in the expanded sidebar between a parent nav item and its child items. Visually clarifies the parent-child relationship in nested navigation.

### Current behavior

Indentation only is used to show child items.

### Why deferred

Indentation has been sufficient in current usage. Connector line is a polish enhancement, not a critical fix.

---

## Bottom Sheet — Scroll-Triggered Borders

**Status:** 💡 Concept  
**Related:** [02-component-catalog.md — Bottom Sheet](./02-component-catalog.md#bottom-sheet)

### Spec

When content scrolls beneath the sticky header of a Bottom Sheet, a **1px `color/border/default`** appears on the bottom edge of the header. The same border appears on the top edge of the action row when content scrolls beneath it.

### Why valuable

Provides a subtle visual cue that more content exists above or below the visible area.

### Why deferred

Requires scroll position observation logic. Not blocking core Bottom Sheet implementation.

---

## Button — Compact Variant (36px)

**Status:** 📋 Specified  
**Related:** [02-component-catalog.md — Button](./02-component-catalog.md#button)

### Spec

| Property | Value |
|----------|-------|
| Height | 36px |
| Horizontal padding | `space/3` (12px) |
| Icon size | 16px |
| Touch target | 44px invisible hit area required |

### When it would apply

- **Dense tables and toolbars only.** Not a general-purpose variant.

### Why deferred

The single 44px button covers all current use cases. Adding a compact variant should wait until dense table contexts demonstrate clear need — to honor the **minimal viable options** principle.

---

## Transition and Animation Timing

**Status:** 💡 Concept

### Spec

Global rules for:
- **Duration tokens** (e.g., `transition/fast` 150ms, `transition/base` 250ms, `transition/slow` 400ms)
- **Easing curves** (e.g., standard, decelerate, accelerate, emphasized)
- **When to animate** (state changes, panel open/close, page transitions)
- **When NOT to animate** (data updates in tables, form validation feedback)

### Why deferred

Animation system has not been formally discussed. Current usage is inconsistent across components. A holistic spec is needed before piecemeal additions.

---

## Keyboard Navigation and Focus Management

**Status:** 📋 Specified (partial)  
**WCAG references:** 2.4.3, 2.1.2

### Bottom Sheet Focus Trapping

- **On open:** Focus moves to the first focusable element inside the sheet (typically the first input or the close button if no inputs).
- **While open:** Focus is trapped inside the sheet — Tab cycles through focusable elements within the sheet only.
- **On close:** Focus returns to the element that triggered the sheet.
- **Escape key:** Closes the sheet — but in v3.1, scrim click does NOT close, so Escape behavior needs careful design (suggest: Escape minimizes; explicit close button still required for full close).

### Global Focus Indicators

- 2px transparent gap + 2px focus ring (`color/interactive/focus`, or `color/status/danger` for destructive)
- Visible on all interactive elements
- Never removed via `outline: none` without replacement

### Why deferred

Focus management touches every interactive component. Needs comprehensive audit and consistent implementation strategy. Currently inconsistent across components.

---

## Header — v3.1 Refinement

**Status:** ⏸ Blocked  
**Related:** [05-main-layout.md — Header](./05-main-layout.md#header)

### Why on backlog

The v3.1 design refinement did not redefine the header component. Current spec is retained from v2.0 with token references updated to v3.1 semantic tokens.

### What needs refinement

- Validation that 64px height fits new sidebar dimensions and grid system
- Search input integration with v3.1 styling
- User menu dropdown alignment with new design language
- Possible Bottom Sheet integration for user menu (mobile/dense contexts)
- Notification system alignment with Toast/Alert patterns

### Why deferred

Header has not been a priority pain point. Sidebar redesign and Bottom Sheet introduction take precedence.

---

## Dark Mode

**Status:** 💡 Concept (architectural readiness only)

### Architectural Readiness

The v3.1 token architecture **explicitly enables** dark mode through:
- Two-collection system (Primitives → Semantic)
- Components binding to Semantic only
- Universal overlay technique using `opacity/hover` and `opacity/pressed` (overlay color flips for dark mode)
- Separation of `color/bg/subtle` and `color/bg/elevated` (currently both `#ffffff`, will diverge in dark mode)

### What is NOT yet specified

- Dark mode color values for any token
- When/how users toggle dark mode
- System preference detection behavior
- Component-specific dark mode adjustments (e.g., shadow visibility)

### Why deferred

Dark mode is an enhancement, not a requirement for the current MDM product. Architectural enablement is the v3.1 contribution; full implementation is future work.

---

## Component Backlog Summary | خلاصه کامپوننت‌های در صف

| Item | Type | Status | Priority |
|------|------|--------|----------|
| Bottom Sheet expand behavior | Component enhancement | 📋 Specified | Medium |
| Bottom Sheet compact layout | Pattern | 📋 Specified | Low |
| Sidebar connector line | Component enhancement | 💡 Concept | Low |
| Bottom Sheet scroll borders | Component enhancement | 💡 Concept | Low |
| Button compact variant (36px) | Component variant | 📋 Specified | Low |
| Transition/animation tokens | Token system | 💡 Concept | Medium |
| Focus management spec | Pattern | 📋 Specified | High |
| Header v3.1 refinement | Component refinement | ⏸ Blocked | Medium |
| Dark mode | System feature | 💡 Concept | Low |

---

## Adding to Backlog | افزودن به صف

When a design decision is made but implementation is deferred:

1. **Document the spec** in this file under an appropriate section
2. **Note the related component or system** with cross-reference
3. **Explain why it's deferred** — context for future decision-making
4. **Flag the originating documentation** with a note pointing to this file

When a backlog item is implemented:

1. **Move the spec** to the appropriate active documentation file
2. **Update implementation status** in [04-implementation-status.md](./04-implementation-status.md)
3. **Update usage guidelines** in [06-component-usage-guidelines.md](./06-component-usage-guidelines.md) if applicable
4. **Remove the entry** from this backlog

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Token reference
- **[Component Catalog](./02-component-catalog.md)** — Component specs and code examples
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Figma to code reference
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Main Layout](./05-main-layout.md)** — Complete layout specification
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component

---

*Last updated: 2026-02-25 | Version 3.1*
