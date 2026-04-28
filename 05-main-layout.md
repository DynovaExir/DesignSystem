# Main Layout Design | طراحی چیدمان اصلی

**Version:** 3.1 | **Updated:** 2026-02-25  
**Figma Source:** [Designs File](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs)

---

## Overview | نمای کلی

The Dynova application uses a **three-zone layout** consisting of a collapsible sidebar, top header, and main content area. This document provides the complete specification for implementing the main layout.

> **Note:** Header spec is unchanged from v2.0 and **flagged for future v3.1 refinement**. All other layout specs have been updated to v3.1.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Header (64px)                               │
│  ☰  │  Home / Tenants / Details          🔍 Search              👤 User │
├─────┬───────────────────────────────────────────────────────────────────┤
│     │                                                                    │
│  S  │                                                                    │
│  I  │                        Main Content Area                           │
│  D  │                                                                    │
│  E  │                        (Dynamic Content)                           │
│  B  │                                                                    │
│  A  │                                                                    │
│  R  │                                                                    │
│     │                                                                    │
└─────┴───────────────────────────────────────────────────────────────────┘
```

---

## Layout Specifications | مشخصات چیدمان

### Overall Layout

| Property | Expanded | Collapsed | CSS/Tailwind |
|----------|----------|-----------|--------------|
| **Total Width** | 100vw | 100vw | `w-screen` |
| **Total Height** | 100vh | 100vh | `h-screen` |
| **Background** | `#F3F4F6` | `#F3F4F6` | `bg-color-bg-default` |

### Grid System

```tsx
// Layout structure
<div className="flex h-screen w-screen bg-color-bg-default" dir="rtl">
  {/* Sidebar */}
  <aside className={cn(
    "flex flex-col h-full bg-color-bg-subtle transition-all duration-300",
    "border-e border-color-border-default", // workspace-facing edge in RTL
    collapsed ? "w-[76px]" : "w-[200px]"
  )}>
    {/* Sidebar content */}
  </aside>
  
  {/* Main Container */}
  <div className="flex flex-col flex-1 overflow-hidden">
    {/* Header */}
    <header className="h-16 bg-color-bg-subtle border-b border-color-border-default">
      {/* Header content */}
    </header>
    
    {/* Content Area */}
    <main className="flex-1 overflow-auto p-5">
      {/* Page content */}
    </main>
  </div>
</div>
```

---

## Layout Grid | شبکه چیدمان

### Breakpoints

Minimum supported viewport: **1280px**.

| Viewport | Sidebar default state |
|----------|----------------------|
| 1440px+ | Open (expanded with labels) |
| 1280–1439px | Closed (collapsed to icons) |

Sidebar state is user-controllable at any breakpoint.

### Grid Specifications

| Property | 1440 sidebar open | 1440 sidebar closed | 1280 sidebar open | 1280 sidebar closed |
|----------|-------------------|---------------------|-------------------|---------------------|
| Columns | 12 | 12 | 12 | 12 |
| Column width | 74px | 84px | 64px | 74px |
| Gutter | 24px | 24px | 24px | 24px |
| Offset | 40px (`layout/offset/lg`) | 40px | 20px (`layout/offset/md`) | 20px |

### Layout Offset Constants

These define the relationship between the sidebar and content region. They are layout-specific and sit **outside** the spacing token scale.

| Token | Value | Context |
|-------|-------|---------|
| `layout/offset/lg` | 40px | Content margin at 1440px viewport |
| `layout/offset/md` | 20px | Content margin at 1280px viewport |

Do not use these tokens for component or between-component spacing.

---

## Sidebar | نوار کناری

### Specifications

| Property | Expanded | Collapsed | Token/Class |
|----------|----------|-----------|-------------|
| **Width** | 200px | 76px | `w-[200px]` / `w-[76px]` |
| **Background** | `#FFFFFF` | `#FFFFFF` | `color/bg/subtle` |
| **Text Color** | `#111827` | — | `color/text/default` |
| **Edge Treatment** | 1px `color/border/default` on workspace-facing edge | Same | `border-e border-color-border-default` (RTL) |
| **Shadow** | None | None | — |
| **Inner Horizontal Padding** | 8px | 8px | `space/2` |
| **Transition** | 300ms | 300ms | `transition-all duration-300` |

**Why no shadow:** The sidebar is at page elevation — not floating above anything. Shadow would contradict the elevation hierarchy.

### Structure

```
┌──────────────────────────────┐
│         LOGO AREA            │  ← Top
│    [Dynova Logo]             │
├──────────────────────────────┤
│                              │
│      NAVIGATION ITEMS        │  ← flex-1 (fills space, scrolls)
│                              │
│   🏠 Dashboard               │
│                              │
│   ── Category ──             │  ← Category separator (text)
│                              │
│   📋 Modules                 │
│   👥 Users                   │
│   ⚙️ Settings                │
│                              │
├──────────────────────────────┤
│         FOOTER               │  ← Pinned to bottom
│  Company Branding · v1.0     │
└──────────────────────────────┘
```

### Nav Item (Expanded)

| Property | Value | Token |
|----------|-------|-------|
| Height | 44px | — |
| Icon size | 20px | — |
| Icon-to-label gap | 8px | `space/2` |
| Label typography | 14px / 600 | `body-sm-semibold` |
| Radius | 999px | `radius/full` |
| Default state | transparent bg, `color/text/default` text | — |
| Hover | `color/bg/default` (`#f3f4f6`) fill | — |
| Active | `color/interactive/default` fill, `color/text/inverse` text | — |

```tsx
// Navigation item component
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
}

<Link
  to={href}
  className={cn(
    "flex items-center h-11 px-3 gap-2 rounded-full transition-colors",
    "text-color-text-default body-sm-semibold",
    "hover:bg-color-bg-default",
    active && "bg-color-interactive-default text-color-text-inverse"
  )}
>
  <span className="w-5 h-5">{icon}</span>
  {!collapsed && <span>{label}</span>}
</Link>
```

### Nav Item (Collapsed)

| Property | Value |
|----------|-------|
| Container | 44 × 44px, centered in 76px width |
| Icon size | 20px |
| Active state | Same fill treatment as expanded |
| Tooltip | **Required** on all collapsed items (uses default Tooltip spec) |

### Category Separators

- **Expanded:** Non-interactive text headers that organize nav groups.
- **Collapsed:** 1px horizontal divider using `color/border/default`, with `space/2` (8px) vertical margin above and below.

### Dropdown Behavior

- Clicking the chevron expands/collapses to show sub-items. Does **not** navigate.
- When sidebar is collapsed while a dropdown is open, the dropdown closes automatically.

```tsx
// Expandable navigation group
<div className="py-2">
  <button
    onClick={() => setExpanded(!expanded)}
    className={cn(
      "w-full flex items-center justify-between h-11 px-3 rounded-full",
      "text-color-text-default body-sm-semibold",
      "hover:bg-color-bg-default"
    )}
  >
    <div className="flex items-center gap-2">
      <ModulesIcon className="w-5 h-5" />
      {!collapsed && <span>Modules</span>}
    </div>
    {!collapsed && (
      <ChevronDown className={cn(
        "w-4 h-4 transition-transform duration-200",
        expanded && "rotate-180"
      )} />
    )}
  </button>
  
  {expanded && !collapsed && (
    <div className="mt-1">
      <NavItem href="/mdm" label="MDM" collapsed={collapsed} />
      <NavItem href="/epm" label="EPM" collapsed={collapsed} />
    </div>
  )}
</div>
```

### Sidebar Toggle

- A dedicated button triggers expand/collapse.
- In collapsed mode, hovering on the sidebar **expands it temporarily**.

### Active State in Collapsed Mode

When the active page is a child of a dropdown parent, the parent icon shows the active treatment. The user sees which section they are in, not which specific child page. Full specificity is available by expanding.

### Footer

Company branding and version number are pinned to the bottom. Nav area scrolls independently when items overflow.

```tsx
// Sidebar footer
<div className="px-2 py-3 border-t border-color-border-default">
  {!collapsed ? (
    <div className="text-label-lg-regular text-color-text-subtle">
      Dynova · v1.0.0
    </div>
  ) : (
    <div className="text-label-sm-semibold text-color-text-subtle text-center">
      v1.0.0
    </div>
  )}
</div>
```

---

## Header | سربرگ

> **Note:** v3.1 does not redefine the header. The current spec below is retained from v2.0 and **flagged for future v3.1 refinement**. Token references have been updated to v3.1 semantic tokens for consistency.

### Specifications

| Property | Value | Token/Class |
|----------|-------|-------------|
| **Height** | 64px | `h-16` |
| **Background** | `#FFFFFF` | `color/bg/subtle` |
| **Border Bottom** | 1px `color/border/default` | `border-b border-color-border-default` |
| **Padding X** | 24px | `space/5` |
| **Shadow** | subtle | `shadow/xs` |

### Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ☰  │  🏠 Home  /  📋 Tenants  /  Details     │   🔍 Search   │   👤    │
│ (1) │              (2)                         │     (3)       │   (4)   │
└──────────────────────────────────────────────────────────────────────────┘

(1) Toggle Button - 40px
(2) Breadcrumb - flex-1
(3) Search - 240px
(4) User Menu - 40px
```

### Toggle Button

| Property | Value | Token/Class |
|----------|-------|-------------|
| **Size** | 40px × 40px | `w-10 h-10` |
| **Icon Size** | 20px | `w-5 h-5` |
| **Background** | transparent | — |

### Breadcrumb

| Property | Value | Token |
|----------|-------|-------|
| Separator icon | 16px, `color/icon/subtle` | — |
| Link text | `body-sm-regular`, `color/text/subtle` | — |
| Link hover | `color/text/default` | — |
| Current page | `body-sm-semibold`, `color/text/default` | — |

### Search Input

| Property | Value | Token |
|----------|-------|-------|
| Width | 240px | — |
| Height | 40px | — |
| Background | `color/bg/default` | — |
| Border | none | — |
| Radius | `radius/md` (12px) | — |
| Placeholder | `body-sm-regular`, `color/text/subtle` | — |

### User Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Avatar className="w-8 h-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>
          {user.initials}
        </AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile | پروفایل</DropdownMenuItem>
    <DropdownMenuItem>Settings | تنظیمات</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-color-status-danger">
      Logout | خروج
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Main Content Area | محتوای اصلی

### Specifications

| Property | Value | Token/Class |
|----------|-------|-------------|
| **Background** | `#F3F4F6` | `color/bg/default` |
| **Padding** | 24px | `space/5` |
| **Overflow** | auto (scrollable) | `overflow-auto` |
| **Max Width** | none (fills space) | `flex-1` |

### Page Header Pattern

| Property | Value | Token/Class |
|----------|-------|-------------|
| **Margin Bottom** | 24px | `space/5` |
| **Title** | 28px / 600 | `display-md` |
| **Title Color** | `#111827` | `color/text/default` |
| **Subtitle** | 14px / 400 | `body-sm-regular` |
| **Subtitle Color** | `#6b7280` | `color/text/subtle` |

```tsx
// Page header pattern
<div className="flex items-center justify-between mb-5">
  <div>
    <h1 className="text-display-md text-color-text-default">
      Tenants | تننت‌ها
    </h1>
    <p className="text-body-sm-regular text-color-text-subtle mt-1">
      Manage all tenants | مدیریت همه تننت‌ها
    </p>
  </div>
  <div className="flex items-center gap-3">
    <Button variant="tertiary">Export | صادرات</Button>
    <Button variant="default">
      <Plus className="w-5 h-5 me-2" />
      Add Tenant | افزودن تننت
    </Button>
  </div>
</div>
```

### Content Cards

| Property | Value | Token/Class |
|----------|-------|-------------|
| **Background** | `#FFFFFF` | `color/bg/subtle` |
| **Border** | 1px `color/border/default` | — |
| **Border Radius** | 20px | `radius/lg` |
| **Padding** | 16px | `space/4` |
| **Shadow** | `shadow/sm` | — |

```tsx
// Content card
<div className="bg-color-bg-subtle border border-color-border-default rounded-lg p-4 shadow-sm">
  {/* Card content */}
</div>
```

---

## Responsive Behavior | رفتار واکنش‌گرا

> **Note:** v3.1 specifies 1280px minimum viewport. The mobile responsive spec below is retained from v2.0 for legacy support and is not part of the v3.1 minimum target.

### Breakpoints

| Breakpoint | Sidebar | Header | Action |
|------------|---------|--------|--------|
| **≥1440px** | Expanded (200px) | Full | Desktop view (default open) |
| **1280-1439px** | Collapsed (76px) | Full | Desktop view (default closed) |
| **1024-1279px** (lg) | Collapsed (76px) | Full | Below v3.1 minimum — legacy |
| **768-1023px** (md) | Hidden (overlay) | Full | Below v3.1 minimum — legacy |
| **<768px** (sm) | Hidden (overlay) | Compact | Below v3.1 minimum — legacy |

### Mobile Sidebar (Overlay) — Legacy

```tsx
// Mobile sidebar overlay (below v3.1 minimum viewport)
{isMobile && sidebarOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-color-bg-overlay z-40"
      onClick={() => setSidebarOpen(false)}
    />
    {/* Sidebar */}
    <aside className="fixed inset-y-0 start-0 z-50 w-[200px] bg-color-bg-subtle">
      {/* Sidebar content */}
    </aside>
  </>
)}
```

---

## Complete Layout Implementation | پیاده‌سازی کامل

```tsx
// src/components/layout/MainLayout.tsx
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sidebar } from "@/widgets/sidebar";
import { Header } from "@/widgets/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-color-bg-default" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## Figma Node References | مراجع نود فیگما

| Screen | Node ID | URL |
|--------|---------|-----|
| Dashboard | `98:11940` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=98-11940) |
| Users List | `139:8536` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=139-8536) |
| User Details | `139:7581` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=139-7581) |
| Settings | `139:8451` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=139-8451) |
| Form Page | `139:7904` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=139-7904) |
| Modal View | `139:7828` | [View in Figma](https://www.figma.com/design/W21dYmDGd8p312VfiGOBA5/Designs?node-id=139-7828) |

---

## Design Tokens Used | توکن‌های استفاده شده

### Colors

| Component | Token | Resolved | Usage |
|-----------|-------|----------|-------|
| Sidebar BG | `color/bg/subtle` | `#FFFFFF` | Sidebar background |
| Sidebar Active | `color/interactive/default` | `#155C84` | Active nav item |
| Sidebar Hover | `color/bg/default` | `#F3F4F6` | Hover state |
| Sidebar Edge | `color/border/default` | `#D1D5DB` | Workspace-facing edge |
| Header BG | `color/bg/subtle` | `#FFFFFF` | Header background |
| Content BG | `color/bg/default` | `#F3F4F6` | Main content background |
| Card BG | `color/bg/subtle` | `#FFFFFF` | Content cards |
| Card Border | `color/border/default` | `#D1D5DB` | Card borders |
| Text Primary | `color/text/default` | `#111827` | Primary text |
| Text Secondary | `color/text/subtle` | `#6B7280` | Secondary text |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space/2` | 8px | Sidebar inner padding, nav icon-label gap |
| `space/4` | 16px | Card inner padding |
| `space/5` | 24px | Content padding, page header margin, header padding |
| `layout/offset/lg` | 40px | Content margin at 1440px |
| `layout/offset/md` | 20px | Content margin at 1280px |

### Other

| Token | Value | Usage |
|-------|-------|-------|
| `radius/full` | 999px | Nav items, buttons |
| `radius/lg` | 20px | Cards |
| `radius/md` | 12px | Search input |
| `shadow/sm` | `0 2px 8px rgba(0,0,0,0.08)` | Cards |
| `shadow/xs` | `0 1px 2px rgba(0,0,0,0.06)` | Header (subtle) |

---

## Accessibility | دسترسی‌پذیری

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between focusable elements |
| `Enter/Space` | Activate buttons and links |
| `Escape` | Close mobile sidebar overlay (legacy) |
| `Arrow Keys` | Navigate within dropdown menus |

### ARIA Attributes

```tsx
// Sidebar toggle
<button
  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
  aria-expanded={!collapsed}
  aria-controls="sidebar"
>

// Navigation landmark
<nav aria-label="Main navigation">

// Breadcrumb
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2">
    <li><a href="/">Home</a></li>
    <li aria-current="page">Current Page</li>
  </ol>
</nav>
```

### Touch Targets

All interactive elements must meet WCAG 2.5.5 (44 × 44px minimum):
- Sidebar toggle: 40px × 40px (with 44px invisible hit area)
- Nav items: 44px height (native compliance)
- User menu trigger: 40px × 40px (with 44px invisible hit area)
- All IconButtons in header/sidebar: see [02-component-catalog.md](./02-component-catalog.md#iconbutton)

---

## RTL Support | پشتیبانی RTL

The layout uses **logical properties** for RTL/LTR compatibility:

| Physical | Logical | Usage |
|----------|---------|-------|
| `left` | `start` | Sidebar position |
| `right` | `end` | User menu alignment |
| `padding-left` | `ps-*` | Icon indentation |
| `padding-right` | `pe-*` | Content padding |
| `margin-left` | `ms-*` | Text after icons |
| `margin-right` | `me-*` | Icons before text |
| `border-left` | `border-s-*` | Sidebar workspace edge (LTR) |
| `border-right` | `border-e-*` | Sidebar workspace edge (RTL) |

```tsx
// RTL-safe layout
<div className="flex" dir="rtl">
  <aside className="order-first border-e border-color-border-default">
    Sidebar
  </aside>
  <main className="flex-1">Content</main>
</div>

// RTL-safe spacing
<span className="ms-2">Text after icon</span>  {/* margin-start */}
<Button className="me-2">Before text</Button>  {/* margin-end */}
```

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Complete token reference
- **[Component Catalog](./02-component-catalog.md)** — UI components
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Component mapping
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
