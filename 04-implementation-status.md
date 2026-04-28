# Implementation Status | وضعیت پیاده‌سازی

**Version:** 3.1 | **Updated:** 2026-02-25

---

## Overview | نمای کلی

This document tracks the implementation status of all design system components and tokens in the Dynova codebase.

---

## Status Legend | راهنمای وضعیت

| Icon | Status | Description |
|------|--------|-------------|
| ✅ | Complete | Fully implemented and tested |
| ⚠️ | Available | Available via shadcn/ui CLI, add when needed |
| 🔄 | In Progress | Currently being implemented or specified |
| ❌ | Deprecated | Replaced or no longer used |
| ⏸ | Blocked | Blocked by dependencies |

---

## Design Tokens Status | وضعیت توکن‌ها

### Collection 1 — Primitives | کالکشن ۱ — توکن‌های پایه

| Token Category | Status | Notes |
|----------------|--------|-------|
| Primary (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |
| Neutral (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |
| Success (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |
| Danger (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |
| Info (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |
| Warning (100/300/500/700/900) | 🔄 In Progress | Rebased to v3.1 values |

### Collection 2 — Semantic | کالکشن ۲ — توکن‌های معنایی

| Token Category | Status | Notes |
|----------------|--------|-------|
| `color/bg/*` (5 tokens) | 🔄 In Progress | New semantic layer |
| `color/text/*` (5 tokens) | 🔄 In Progress | New semantic layer |
| `color/interactive/*` (5 tokens) | 🔄 In Progress | New semantic layer |
| `color/border/*` (3 tokens) | 🔄 In Progress | Includes new `strong` and `focus` |
| `color/icon/*` (4 tokens) | 🔄 In Progress | Includes new `interactive` |
| `color/status/*` (8 tokens) | 🔄 In Progress | Includes new `*-bg` variants |
| `color/dataviz/*` (4 tokens) | 🔄 In Progress | New category |
| `color/selection/*` (2 tokens) | 🔄 In Progress | New category |

### Typography | تایپوگرافی

| Token Category | Status | Notes |
|----------------|--------|-------|
| Font Family (Yekan Bakh FaNum) | 🔄 In Progress | Single family — was two |
| Font Weights (400, 600) | 🔄 In Progress | Reduced from 4 weights to 2 |
| Type Scale (12 named tokens) | 🔄 In Progress | Replaces 9-step px scale |
| Line Heights (125% / 150%) | 🔄 In Progress | Differentiated by token tier |

### Spacing | فاصله‌گذاری

| Token Category | Status | Notes |
|----------------|--------|-------|
| Spacing Scale (`space/0`–`space/9`) | 🔄 In Progress | Renamed and restructured |
| Tier Rules (component / between / layout) | 🔄 In Progress | New conceptual model |
| Layout Offset Constants | 🔄 In Progress | New: `layout/offset/lg`, `layout/offset/md` |

### Other Tokens | سایر توکن‌ها

| Token Category | Status | Notes |
|----------------|--------|-------|
| Border Width Tokens (4 tokens) | 🔄 In Progress | New section |
| Border Radius (6 stops) | 🔄 In Progress | Values updated, `none` and `full` added |
| Box Shadows (5 tokens) | 🔄 In Progress | Reduced from 6, values changed |
| Opacity Tokens (7 tokens) | 🔄 In Progress | New section |

---

## Component Status | وضعیت کامپوننت‌ها

### Core UI Components (shadcn/ui) | کامپوننت‌های اصلی

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Button** | 🔄 In Progress | `src/components/ui/button.tsx` | Single size (44px), 5 types (default/secondary/tertiary/destructive/ghost) — needs v3.1 update |
| **Input** | 🔄 In Progress | `src/components/ui/input.tsx` | 52px fixed height, `color/border/strong` resting border — needs v3.1 update |
| **Label** | ✅ Complete | `src/components/ui/label.tsx` | — |
| **Table** | ✅ Complete | `src/components/ui/table.tsx` | All sub-components |
| **Badge** | 🔄 In Progress | `src/components/ui/badge.tsx` | New variants: success, danger, warning, info |
| **Dialog** | ❌ Deprecated | `src/components/ui/dialog.tsx` | Replaced by Bottom Sheet (exception: table filter dialogs) |
| **IconButton** | 🔄 Specified | — | New custom component, 3 sizes / 2 types, mandatory tooltip |
| **Bottom Sheet** | 🔄 Specified | — | New custom component, primary overlay surface |
| **Tooltip** | 🔄 Specified | — | `npx shadcn@latest add tooltip` — full spec defined |
| Card | ⚠️ Available | — | `npx shadcn@latest add card` |
| Select | ⚠️ Available | — | `npx shadcn@latest add select` |
| Checkbox | ⚠️ Available | — | `npx shadcn@latest add checkbox` |
| Radio Group | ⚠️ Available | — | `npx shadcn@latest add radio-group` |
| Textarea | ⚠️ Available | — | `npx shadcn@latest add textarea` |
| Switch | ⚠️ Available | — | `npx shadcn@latest add switch` |
| Toast | ⚠️ Available | — | `npx shadcn@latest add toast` |
| Alert | ⚠️ Available | — | `npx shadcn@latest add alert` |
| Progress | ⚠️ Available | — | `npx shadcn@latest add progress` |
| Skeleton | ⚠️ Available | — | `npx shadcn@latest add skeleton` |
| Drawer | ⚠️ Available | — | `npx shadcn@latest add drawer` |
| Popover | ⚠️ Available | — | `npx shadcn@latest add popover` |
| Avatar | ⚠️ Available | — | `npx shadcn@latest add avatar` |
| Separator | ⚠️ Available | — | `npx shadcn@latest add separator` |

### Patterns | الگوها

| Pattern | Status | Notes |
|---------|--------|-------|
| **Text Field Stacking** | 🔄 Specified | 71px wrapper, 19px reserved subtext region — zero layout shift |

### Custom Components | کامپوننت‌های سفارشی

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Spinner** | ✅ Complete | `src/components/ui/Spinner.tsx` | All sizes |
| **EmptyState** | ✅ Complete | `src/components/ui/EmptyState.tsx` | With icon, action |
| **ErrorState** | ✅ Complete | `src/components/ui/ErrorState.tsx` | With retry |

### Layout Components | کامپوننت‌های چیدمان

> **📐 For complete layout specifications, see [05-main-layout.md](./05-main-layout.md)**

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **MainLayout** | ✅ Complete | `src/components/layout/MainLayout.tsx` | Full app layout |
| **Sidebar** | 🔄 In Progress | `src/widgets/sidebar/ui/Sidebar.tsx` | v3.1 visual change: white bg (was dark), 200px/76px (was 256px/64px), no shadow, border edge |
| **Header** | ⏸ Future Refinement | `src/widgets/header/ui/Header.tsx` | v3.1 does not redefine header — flagged for future spec |
| **Breadcrumb** | ✅ Complete | `src/shared-app/breadcrumb/ui/Breadcrumb.tsx` | Navigation path |

---

## Feature Components Status | وضعیت کامپوننت‌های ویژگی

### Tenant Management | مدیریت تننت

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **TenantTable** | ✅ Complete | `src/features/tenants/ui/TenantTable.tsx` | Pagination, sorting |
| **CreateTenantForm** | 🔄 In Progress | `src/features/tenants/ui/CreateTenantForm.tsx` | Migrate to Bottom Sheet + Text Field Stacking |
| **TenantsPage** | ✅ Complete | `src/pages/tenants/index.tsx` | Full CRUD |

---

## Implementation Checklist | چک‌لیست پیاده‌سازی

### Design Tokens — v3.1 Migration

- [ ] Collection 1 — Primitives rebased (6 families × 5 stops)
- [ ] Collection 2 — Semantic layer (35 tokens)
- [ ] `color/bg/*` semantic tokens
- [ ] `color/text/*` semantic tokens
- [ ] `color/interactive/*` semantic tokens
- [ ] `color/border/*` semantic tokens (including `strong` and `focus`)
- [ ] `color/icon/*` semantic tokens (including `interactive`)
- [ ] `color/status/*` semantic tokens (including `*-bg` variants)
- [ ] `color/dataviz/*` semantic tokens
- [ ] `color/selection/*` semantic tokens
- [ ] Font family consolidated to `Yekan Bakh FaNum`
- [ ] Font weights reduced to 2 (400, 600)
- [ ] Type scale (12 named tokens)
- [ ] Line heights (125% display/heading, 150% body/label)
- [ ] Spacing scale `space/0`–`space/9`
- [ ] Spacing tier rules documented
- [ ] Layout offset constants (`layout/offset/lg`, `layout/offset/md`)
- [ ] Border width tokens (4 tokens)
- [ ] Border radius tokens (6 stops, including `none` and `full`)
- [ ] Shadow tokens (5 tokens, single-layer values)
- [ ] Opacity tokens (7 tokens)

### Core Components — v3.1 Migration

- [ ] Button — single size, 5 types, `radius/full`
- [ ] Input — 52px fixed, `color/border/strong` resting
- [ ] Label
- [ ] Badge — new variants (success, danger, warning, info)
- [ ] Table
- [ ] Spinner
- [ ] EmptyState
- [ ] ErrorState

### New Components

- [ ] IconButton — 3 sizes / 2 types / mandatory tooltip
- [ ] Bottom Sheet — open + minimized states
- [ ] Tooltip — default spec
- [ ] Text Field Stacking pattern wrapper

### Layout Components — v3.1 Migration

- [ ] Sidebar — light bg, 200px/76px, no shadow, border edge
- [ ] Sidebar — nav items at 44px, `radius/full`, new state colors
- [ ] Sidebar — collapsed mode tooltips on all items
- [ ] Sidebar — category separators (text headers / dividers)
- [ ] Sidebar — dropdown behavior, hover-to-expand
- [ ] Sidebar — footer with branding and version

### Deprecation Tasks

- [ ] Audit all Dialog usage and migrate to Bottom Sheet
- [ ] Document table filter dialogs as the single Dialog exception
- [ ] Remove old token references (`bg-primary-500`, `text-text-primary`, etc.)

### Infrastructure

- [x] CSS variables in `index.css`
- [x] Tailwind configuration
- [x] shadcn/ui setup
- [ ] CSS variables migrated to v3.1 token names
- [ ] Tailwind config updated for v3.1 tokens
- [ ] Storybook setup
- [ ] Visual regression testing
- [ ] Contrast ratio automated checks (WCAG 2.1 AA)

---

## Token Usage Compliance | انطباق استفاده از توکن

All implemented components must use design system tokens:

| Check | Status |
|-------|--------|
| No hardcoded colors | 🔄 Re-audit needed for v3.1 |
| No hardcoded spacing | 🔄 Re-audit needed for v3.1 |
| No hardcoded typography | 🔄 Re-audit needed for v3.1 |
| No primitive token references in components | 🔄 New rule — audit needed |
| Components bind to Collection 2 (Semantic) only | 🔄 New rule — audit needed |
| Using Tailwind classes | ✅ Compliant |
| Using CSS variables | ✅ Compliant |
| RTL-safe properties | ✅ Compliant |
| Bilingual labels | ✅ Compliant |
| WCAG 2.1 AA contrast (text and non-text) | 🔄 Re-audit needed for v3.1 |
| Touch targets ≥ 44px or 44px invisible hit area | 🔄 Re-audit needed for v3.1 |

---

## Next Steps | مراحل بعدی

### High Priority | اولویت بالا

| Task | Status | Notes |
|------|--------|-------|
| Migrate token system to v3.1 (Collection 1 + 2) | 🔄 In Progress | Foundation for all other work |
| Implement Bottom Sheet component | 🔄 Pending | Required to deprecate Dialog usage |
| Implement IconButton component | 🔄 Pending | Required for table actions, toolbars |
| Update Sidebar to v3.1 visual spec | 🔄 Pending | Major visual change |
| Implement Text Field Stacking pattern | 🔄 Pending | Form quality improvement |
| Update Button to single-size 5-type model | 🔄 Pending | API change |

### Medium Priority | اولویت متوسط

| Task | Status | Notes |
|------|--------|-------|
| Migrate existing forms to Bottom Sheet | ⏸ Pending | After Bottom Sheet is built |
| Set up Storybook | ⚠️ Pending | Component documentation |
| Add Tooltip component | ⚠️ Pending | Required by IconButton |
| Add Card component | ⚠️ Pending | For content blocks |

### Low Priority | اولویت پایین

| Task | Status | Notes |
|------|--------|-------|
| Visual regression tests | ⚠️ Pending | Prevent UI regressions |
| Accessibility audit | ⚠️ Pending | WCAG 2.1 AA compliance verification |
| Performance optimization | ⚠️ Pending | Bundle size analysis |
| Dark mode preparation | ⚠️ Pending | Semantic layer enables this |

---

## Future Backlog | برنامه‌های آینده

> **For full backlog details, see [07-future-backlog.md](./07-future-backlog.md)**

The following items are specified but deferred:

- Bottom Sheet vertical expand behavior
- Compact Bottom Sheet layout for confirmations
- Sub-item indentation connector line in expanded sidebar
- Scroll-triggered borders on Bottom Sheet
- Button compact variant (36px) for dense tables
- Global transition and animation timing rules
- Keyboard navigation and focus management (WCAG 2.4.3, 2.1.2)
- Header component v3.1 refinement

---

## Quick Add Commands | دستورات سریع افزودن

```bash
# Essential v3.1 components
npx shadcn@latest add tooltip toast alert skeleton

# Form components (use with Text Field Stacking pattern)
npx shadcn@latest add select checkbox radio-group textarea switch

# Data display
npx shadcn@latest add card avatar separator

# Overlays (most use cases now use Bottom Sheet, but available if needed)
npx shadcn@latest add drawer popover

# Add all at once
npx shadcn@latest add tooltip toast alert skeleton select checkbox radio-group textarea switch card avatar separator drawer popover
```

---

## Version History | تاریخچه نسخه

| Version | Date | Changes |
|---------|------|---------|
| 3.1 | 2026-02-25 | Two-collection token architecture, button/icon-button refactor, Bottom Sheet introduced, sidebar visual redesign, Dialog deprecated |
| 2.0 | 2025-01-10 | Restructured documentation, aligned status |
| 1.0 | 2025-01-10 | Initial status tracking |

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Token reference
- **[Component Catalog](./02-component-catalog.md)** — All components
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Figma to code reference
- **[Main Layout](./05-main-layout.md)** — Complete layout specification
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
