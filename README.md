# Dynova Design System | سیستم طراحی دینووا

**Version:** 3.1 | **Updated:** 2026-02-25  
**Product:** Dynova MDM (Master Data Management) — Corporate Governance Platform  
**Language:** RTL-first, Persian (Yekan Bakh FaNum)  
**Accessibility baseline:** WCAG 2.1 AA (hard requirement), AAA where practical

---

## Quick Navigation | ناوبری سریع

| Document | Purpose | Audience |
|----------|---------|----------|
| **[Design Tokens](./01-design-tokens.md)** | Complete token reference (colors, typography, spacing, opacity, borders) | Designers & Developers |
| **[Component Catalog](./02-component-catalog.md)** | All available components with usage | Developers |
| **[Figma → Code Mapping](./03-figma-to-code.md)** | Maps Figma components to React components | Designers & Developers |
| **[Implementation Status](./04-implementation-status.md)** | Track implementation progress | All |
| **[Main Layout](./05-main-layout.md)** | Complete layout specification (sidebar, header, content) | Developers |
| **[Component Usage Guidelines](./06-component-usage-guidelines.md)** | When to use / when NOT to use each component | Designers & Developers |
| **[Future Backlog](./07-future-backlog.md)** | Planned design system items not yet implemented | All |
| **UX Discovery Process** | Phase 1.5 — user flows, screen inventory, wireframes before coding | Designers & Developers |

> **UX Discovery:** Before implementing new frontend screens, follow Phase 1.5 (UX Discovery) from the methodology.
> See `prompts/modules/15-ux-discovery.md` for the full guide and `templates/UX/UX_DISCOVERY.md` for the artifact template.

---

## Overview | نمای کلی

This directory contains the complete documentation for the **Dynova Design System**, extracted from Figma and implemented using **shadcn/ui** components with Dynova design tokens.

---

## Design Principles | اصول طراحی

These principles govern every decision in the system. When in conflict, they are prioritized in the order listed.

### 1. Accessibility first

WCAG 2.1 AA is the minimum compliance target for all UI. AAA is pursued where practical, particularly for touch targets (2.5.5) and color contrast (1.4.6). No component ships without meeting AA. Contrast and readability take precedence over aesthetics — this is data-heavy enterprise software used in long sessions.

### 2. Minimal viable options

If three variants cover all use cases, the system has three variants — not five. Every token, variant, and component must justify its existence against what already exists. Fewer options means less decision fatigue for designers and developers, and stronger consistency across the product.

### 3. Consistency over novelty

New additions must integrate with existing patterns. A new component uses existing tokens — it does not introduce new ones unless no existing token covers the need. If a pattern works, it is reused. Visual consistency across the product is more important than optimizing any single screen.

### 4. Enterprise-grade density

The product serves data stewards, data owners, and governance admins who work in long sessions with dense information. The system is optimized for: dense information display, long session ergonomics (8+ hour workdays), permission-aware states and role-based UI, and scannable data layouts (tables, forms, lists).

### 5. Semantic architecture

Components never reference primitive tokens directly. All component bindings go through the semantic layer. This ensures theme changes, dark mode, and rebasing are possible without touching component definitions.

**Token flow:**
```
Collection 1 (Primitives) → alias → Collection 2 (Semantic) → bind → Components
```

---

## Architecture | معماری

```
┌─────────────────────────────────────────────────────────────────┐
│                        Figma Design System                       │
│   https://www.figma.com/design/kBh6QuzFDcsY17YHpmL74u/          │
│                                                                   │
│   Collection 1 (Primitives)  →  Collection 2 (Semantic)          │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Design Tokens (CSS Variables)                │
│                    src/frontend/src/index.css                    │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Tailwind Configuration                        │
│                   src/frontend/tailwind.config.ts                │
└─────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│               shadcn/ui Components + Dynova Tokens               │
│                  src/frontend/src/components/ui/                 │
└─────────────────────────────────────────────────────────────────┘
```

### Core Principles | اصول اصلی

1. **Token-First Design** — All values use design tokens, never hardcoded
2. **Semantic Binding** — Components bind to Collection 2 (Semantic) tokens, never to primitives
3. **shadcn/ui Foundation** — Built on shadcn/ui, customized with Dynova tokens
4. **Bilingual Support** — RTL-first with Persian (فارسی) translations
5. **Consistent Patterns** — Unified API across all components

---

## Quick Start | شروع سریع

### For Developers | برای توسعه‌دهندگان

```bash
# 1. Add shadcn/ui components as needed
npx shadcn@latest add button input table badge

# 2. Customize with Dynova tokens in src/components/ui/

# 3. Use tokens in your components
```

```tsx
// ✅ GOOD - Using semantic design tokens
<Button variant="default">
  Submit
</Button>

// ❌ BAD - Hardcoded values
<button className="bg-[#155c84] px-[16px]">
  Submit
</button>

// ❌ BAD - Binding to primitives
<button className="bg-primary-500">
  Submit
</button>
```

### For Designers | برای طراحان

1. **Use Design System Library** — All components from Figma Design System
2. **Bind to Semantic tokens** — Never reference Collection 1 (Primitives) from components
3. **Follow Naming Convention** — `Component / Variant` format
4. **Document New Components** — Use the component request template

---

## Token Categories | دسته‌بندی توکن‌ها

### Colors | رنگ‌ها

The color system has two collections. Components bind to **Collection 2 (Semantic)** only.

| Category | Semantic Token Example | Resolved Hex |
|----------|------------------------|--------------|
| Background | `color/bg/default` | `#f3f4f6` |
| Background | `color/bg/subtle` | `#ffffff` |
| Text | `color/text/default` | `#111827` |
| Text | `color/text/subtle` | `#6b7280` |
| Interactive | `color/interactive/default` | `#155c84` |
| Border | `color/border/default` | `#d1d5db` |
| Border | `color/border/strong` | `#374151` |
| Status | `color/status/danger` | `#c41f47` |
| Status | `color/status/success` | `#0e7732` |
| Status | `color/status/warning` | `#b47818` |
| Status | `color/status/info` | `#5c1fc8` |

### Typography | تایپوگرافی

**Font:** Yekan Bakh FaNum (single family)  
**Weights:** 400 (Regular), 600 (SemiBold) — only two

| Style Token | Size | Weight | Use |
|-------------|------|--------|-----|
| `display-lg` | 32px | 600 | Hero titles |
| `display-md` | 28px | 600 | Page titles |
| `heading-lg` | 20px | 600 | Section headings, bottom sheet titles |
| `body-lg-regular` | 16px | 400 | Body text |
| `body-sm-semibold` | 14px | 600 | Button text, nav items |
| `label-lg-semibold` | 12px | 600 | Form labels, tags |

### Spacing | فاصله‌گذاری

All spacing values are multiples of 4px. Three tiers: component internal (`space/1–4`), between components (`space/5–6`), layout (`space/7–9`).

| Token | Value | Tier |
|-------|-------|------|
| `space/2` | 8px | Component internal |
| `space/4` | 16px | Component internal |
| `space/5` | 24px | Between components |
| `space/7` | 48px | Layout |
| `space/9` | 96px | Layout |

### Other Tokens

- **Radius:** 6 stops from `radius/none` (0px) to `radius/full` (999px)
- **Shadows:** 5 stops from `shadow/none` to `shadow/lg`
- **Opacity:** 7 tokens including `opacity/hover` (8%), `opacity/disabled` (40%), `opacity/scrim-subtle` (30%)
- **Border widths:** 4 tokens from `border/width/none` (0px) to `border/width/accent` (4px)

See [01-design-tokens.md](./01-design-tokens.md) for complete reference.

---

## Component Library | کتابخانه کامپوننت

**Foundation:** [shadcn/ui](https://ui.shadcn.com)  
**Location:** `src/frontend/src/components/ui/`

### Available Components | کامپوننت‌های موجود

| Component | Status | Command |
|-----------|--------|---------|
| Button | ✅ Installed | `npx shadcn@latest add button` |
| Input | ✅ Installed | `npx shadcn@latest add input` |
| Table | ✅ Installed | `npx shadcn@latest add table` |
| Badge | ✅ Installed | `npx shadcn@latest add badge` |
| Dialog | ❌ Deprecated | Use Bottom Sheet instead (exception: table filter dialogs) |
| IconButton | 🔄 Specified | Custom component — see [Component Catalog](./02-component-catalog.md) |
| Bottom Sheet | 🔄 Specified | Custom component — see [Component Catalog](./02-component-catalog.md) |
| Tooltip | 🔄 Specified | `npx shadcn@latest add tooltip` |
| Card | ⚠️ Add if needed | `npx shadcn@latest add card` |
| Select | ⚠️ Add if needed | `npx shadcn@latest add select` |
| Checkbox | ⚠️ Add if needed | `npx shadcn@latest add checkbox` |

See [Component Catalog](./02-component-catalog.md) for complete list.

---

## v0 + shadcn/ui Workflow | جریان کار v0

### When to Use v0.dev

| Scenario | Use v0? |
|----------|---------|
| New screen/page from scratch | ✅ Yes |
| Rapid prototyping | ✅ Yes |
| Bug fixes / minor changes | ❌ No |

### v0 → Production Checklist

- [ ] Replace hardcoded colors → Dynova semantic tokens (`color/interactive/default`)
- [ ] Replace generic components → shadcn/ui (`Button`, `Input`)
- [ ] Add RTL-safe CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`)
- [ ] Add TypeScript strict types
- [ ] Add Persian translations
- [ ] Verify WCAG 2.1 AA contrast on all text and interactive elements
- [ ] Write unit tests

---

## File Structure | ساختار فایل‌ها

```
doc/figma-design-system/
├── README.md                          # This file - Overview, principles & quick start
├── 01-design-tokens.md                # Complete token reference
├── 02-component-catalog.md            # All components with usage
├── 03-figma-to-code.md                # Figma → Code mapping
├── 04-implementation-status.md        # Implementation tracking
├── 05-main-layout.md                  # Main layout specification
├── 06-component-usage-guidelines.md   # When to use / NOT to use each component
└── 07-future-backlog.md               # Planned items not yet implemented
```

### Codebase Locations | محل‌های کدبیس

```
src/frontend/
├── tailwind.config.ts           # Tailwind + token configuration
├── src/
│   ├── index.css                # CSS variables (design tokens)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── layout/              # Layout components
│   ├── widgets/                 # Composite UI blocks
│   ├── features/                # Feature components
│   └── shared-app/              # Shared components
```

---

## External Links | لینک‌های خارجی

| Resource | URL |
|----------|-----|
| Figma Design System | https://www.figma.com/design/kBh6QuzFDcsY17YHpmL74u/Design-System |
| shadcn/ui Docs | https://ui.shadcn.com |
| v0.dev | https://v0.dev |
| Tailwind CSS | https://tailwindcss.com |

---

## Related Documentation | مستندات مرتبط

- **Master Prompt:** `prompts/master_prompt.md` (includes UI/UX Design Flow)
- **Frontend Architecture:** `doc/architecture/adr/0002-frontend-architecture.md`
- **Implementation Guides:** `prompts/modules/08-implementation-guides.md` (Storybook, shadcn/ui setup)
- **Cursor Rules:** `.cursor/rules/*/RULE.md`

---

## Contributing | مشارکت

When adding new components or tokens:

1. **Design in Figma** — Add to Design System library first; bind to Collection 2 (Semantic) tokens
2. **Add shadcn/ui component:** `npx shadcn@latest add <component>`
3. **Customize with Dynova tokens:** Modify in `src/components/ui/`
4. **Verify WCAG compliance** — Contrast ratios, touch targets, focus states
5. **Update documentation:**
   - Update [01-design-tokens.md](./01-design-tokens.md) for new tokens
   - Update [02-component-catalog.md](./02-component-catalog.md) for new components
   - Update [03-figma-to-code.md](./03-figma-to-code.md) for mapping
   - Update [04-implementation-status.md](./04-implementation-status.md) for status
   - Update [06-component-usage-guidelines.md](./06-component-usage-guidelines.md) for usage rules

---

*Last updated: 2026-02-25 | Version 3.1*
