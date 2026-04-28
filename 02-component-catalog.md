# Component Catalog | کاتالوگ کامپوننت‌ها

**Version:** 3.1 | **Updated:** 2026-02-25  
**Foundation:** [shadcn/ui](https://ui.shadcn.com)  
**Location:** `src/frontend/src/components/ui/`

---

## Overview | نمای کلی

All Dynova UI components are built on **shadcn/ui**, customized with Dynova design tokens. This catalog documents all available components, their variants, props, and usage examples.

> **For when-to-use / when-NOT-to-use guidance, see [06-component-usage-guidelines.md](./06-component-usage-guidelines.md).**

### Adding New Components

```bash
# Add individual shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add table

# Add multiple at once
npx shadcn@latest add button input table card badge
```

After adding, customize with Dynova semantic tokens in `src/components/ui/<component>.tsx`.

---

## Status Legend | راهنمای وضعیت

| Icon | Status | Description |
|------|--------|-------------|
| ✅ | Implemented | Component installed and customized |
| ⚠️ | Available | Available via shadcn/ui CLI |
| 🔄 | Specified | Spec finalized, implementation pending |
| ❌ | Deprecated | Replaced or no longer used |

---

## Core Components | کامپوننت‌های اصلی

### Button

**Status:** ✅ Implemented (requires v3.1 update)  
**Location:** `src/components/ui/button.tsx`

#### Overview

One size. Five types. **No size prop.**

#### Dimensions

| Property | Value | Token |
|----------|-------|-------|
| Height | 44px | — |
| Horizontal padding | 16px | `space/4` |
| Icon size | 20px | — |
| Icon-to-label gap | 8px | `space/2` |
| Typography | 14px SemiBold | `body-sm-semibold` |
| Border radius | 999px | `radius/full` |

**Why 44px:** Meets WCAG 2.5.5 AAA touch target, iOS HIG standard, and Material Design standard. The vertical math is clean: 12px padding (`space/3`) top and bottom on 14px text = 44px.

#### Types and Token Mapping

| Type | Fill | Text | Border | Hover | Pressed | Focus ring |
|------|------|------|--------|-------|---------|------------|
| `default` | `color/interactive/default` | `color/text/inverse` | — | `color/interactive/hover` | `color/interactive/active` | `color/interactive/focus` |
| `secondary` | `color/interactive/subtle` | `color/interactive/default` | — | + `opacity/hover` overlay | + `opacity/pressed` overlay | `color/interactive/focus` |
| `tertiary` | transparent | `color/text/default` | `color/border/strong` | `color/bg/default` + `color/border/strong` | `color/bg/muted` + `color/border/strong` | `color/interactive/focus` |
| `destructive` | `color/status/danger` | `color/text/inverse` | — | + `opacity/hover` overlay | + `opacity/pressed` overlay | `color/status/danger` |
| `ghost` | transparent | `color/text/link` | — | `color/interactive/subtle` | + `opacity/pressed` overlay | `color/interactive/focus` |
| all · disabled | `opacity/disabled` (40%) on entire component | — | — | — | — | — |

#### Tertiary button border rationale

The tertiary button's border is its only visual affordance — there is no fill or elevation. WCAG 1.4.11 requires 3:1 minimum contrast for non-text UI component boundaries. The resting border uses `color/border/strong` (`#374151`, 9.7:1) instead of `color/border/default` (`#d1d5db`, 1.6:1). The border stays constant across all states — the fill communicates hover/pressed.

#### Ghost vs. tertiary distinction

Ghost buttons have **no border in any state**. They are differentiated from tertiary by the complete absence of a border.

#### Focus Ring

All buttons: 2px white gap + 2px `color/interactive/focus` ring.  
Exception: Destructive type uses `color/status/danger` for the focus ring.

#### Type Hierarchy

1. **Default** — primary action on the page (one per view ideally)
2. **Secondary** — important but not primary
3. **Tertiary** — third-level actions, alternatives
4. **Destructive** — dangerous/irreversible actions
5. **Ghost** — minimal-weight actions, inline contexts

#### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "tertiary" | "destructive" | "ghost";
  asChild?: boolean;
}
```

#### Usage

```tsx
import { Button } from "@/components/ui/button"

// Types
<Button variant="default">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="tertiary">View Details</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Skip</Button>

// Disabled (applies opacity/disabled to entire component)
<Button disabled>Disabled</Button>
```

---

### IconButton

**Status:** 🔄 Specified  
**Location:** `src/components/ui/icon-button.tsx` (to be implemented)

#### Overview

Three sizes. Two types. **Tooltip is a required built-in property.**

Icon buttons are a **separate component** from labeled buttons (`<IconButton />`), not a size variant of `<Button />`.

#### Sizes

| Size | Container | Icon | Padding | Touch target |
|------|-----------|------|---------|--------------|
| `md` | 44 × 44px | 20px | 12px (`space/3`) | Native — meets 44px minimum |
| `sm` | 32 × 32px | 16px | 8px (`space/2`) | Requires 44px invisible hit area |
| `xs` | 24 × 24px | 14px | 5px | Always requires 44px invisible hit area |

**Touch target rule:** `sm` and `xs` require `min-width: 44px; min-height: 44px` on the wrapper element.

#### Types and Token Mapping

| Property | `filled` | `tertiary` |
|----------|----------|------------|
| Fill | `color/bg/default` | transparent |
| Icon | `color/icon/default` | `color/icon/default` |
| Border | — | `color/border/strong` + `border/width/default` |
| Hover fill | `color/bg/muted` at `opacity/hover` | `color/bg/default` |
| Hover border | — | `color/border/strong` |
| Pressed | `color/bg/muted` at `opacity/pressed` | `color/bg/muted` |
| Focus ring | `color/interactive/focus` | `color/interactive/focus` |
| Radius | `radius/full` | `radius/full` |

#### Tooltip (Required)

Every IconButton must have a tooltip. WCAG 1.1.1 requires a text alternative for all interactive icon elements.

#### Props

```typescript
interface IconButtonProps {
  variant: "filled" | "tertiary";
  size: "md" | "sm" | "xs";
  icon: React.ReactNode;           // required
  tooltipLabel: string;            // required — auto-binds to aria-label
  showTooltip?: boolean;           // default true
  tooltipPosition?: "top" | "bottom" | "left" | "right";  // default top
  disabled?: boolean;              // auto-suppresses tooltip
}
```

#### Usage

```tsx
import { IconButton } from "@/components/ui/icon-button"
import { Trash2, Edit, X } from "lucide-react"

<IconButton
  variant="filled"
  size="md"
  icon={<Edit />}
  tooltipLabel="Edit | ویرایش"
/>

<IconButton
  variant="tertiary"
  size="sm"
  icon={<Trash2 />}
  tooltipLabel="Delete | حذف"
/>

<IconButton
  variant="tertiary"
  size="xs"
  icon={<X />}
  tooltipLabel="Close | بستن"
/>
```

---

### Input

**Status:** ✅ Implemented (requires v3.1 update)  
**Location:** `src/components/ui/input.tsx`

#### Dimensions

| Property | Value | Token |
|----------|-------|-------|
| Height | 52px (fixed) | — |
| Border (resting) | 1px `color/border/strong` | `border/width/default` |
| Border (focus) | 2px `color/border/focus` | `border/width/emphasis` |
| Border (error) | 1px `color/status/danger` | `border/width/default` |
| Border radius | 12px | `radius/md` |
| Padding (horizontal) | 16px | `space/4` |
| Typography | `body-sm-regular` (14px / 400) | — |

#### Props

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // All standard input props
}
```

#### Usage

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Basic
<Input placeholder="Enter text" />

// With label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>

// States
<Input disabled placeholder="Disabled" />
<Input className="border-color-status-danger" /> {/* Error state */}

// Types
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="0" />
```

> **Note:** Inputs are typically wrapped in a Text Field Stacking pattern — see below.

---

### Text Field Stacking Pattern

**Status:** 🔄 Specified

#### The Problem

Text fields have optional subtext (error messages, hints) displayed below the input. Dynamic subtext causes layout shift — particularly jarring in bottom sheets.

#### The Solution: Reserved Space

Applies to **all form inputs** (text fields, dropdowns, textareas, date pickers).

| Property | Value |
|----------|-------|
| Input height | 52px (fixed) |
| Subtext region | 19px (reserved, always present) |
| Total wrapper height | 71px (fixed) |
| Gap between input and subtext | `space/1` (4px) |
| Gap between stacked field wrappers | `space/2` (8px) |

#### Behavior

- **No subtext present:** 19px region is empty. Visual gap to next input = 27px (19 + 8).
- **Subtext appears:** fills reserved space. Zero layout shift. Visual gap to next input = 8px.

#### Usage

```tsx
<div className="space-y-2"> {/* space/2 gap between wrappers */}
  <div className="h-[71px]"> {/* fixed wrapper height */}
    <Input className="h-[52px]" />
    <div className="h-[19px] mt-1 text-label-lg-regular text-color-status-danger">
      {error /* always rendered, empty if no error */}
    </div>
  </div>
  {/* Next field wrapper */}
</div>
```

---

### Label

**Status:** ✅ Implemented  
**Location:** `src/components/ui/label.tsx`

#### Typography

| State | Token |
|-------|-------|
| Default | `label-lg-semibold` (12px / 600) |
| Color | `color/text/default` |

#### Usage

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">Email Address</Label>
<Label className="text-color-text-subtle">Optional Label</Label>
```

---

### Bottom Sheet

**Status:** 🔄 Specified  
**Location:** `src/components/ui/bottom-sheet.tsx` (to be implemented)

#### Overview

The bottom sheet is the **primary overlay surface in Dynova**. There are no modals (except table filter dialogs). All overlay interactions use bottom sheets.

#### Dimensions

| Property | Value | Token |
|----------|-------|-------|
| Width | 8 grid columns (responsive) | — |
| Position | Centered on full viewport | — |
| Max height | Viewport height minus 40px top and 40px bottom | — |
| Inner padding | 16px all directions | `space/4` |
| Background | `color/bg/subtle` (`#ffffff`) | — |
| Radius | 20px on top corners, 0 on bottom | `radius/lg` top |
| Shadow | `shadow/lg` | — |
| Scrim | 30% on full viewport | `opacity/scrim-subtle` on `neutral/900` → `rgba(17,24,39,0.30)` |

#### Header

| Property | Value |
|----------|-------|
| Title | `heading-lg` (20px / 600) |
| Title position | Right-aligned (RTL) |
| Close button | IconButton `md` (44px) |
| Minimize button | IconButton `md` (44px), adjacent to close button |
| Breadcrumb | Supported for nested flows |

#### States

##### Open

- Full sheet visible with scrim
- User cannot interact with workspace or sidebar
- **Scrim click does NOT close the sheet**
- Close and minimize **only via dedicated header buttons**

##### Minimized

- Collapses to slim bar at viewport bottom
- Scrim removed — workspace fully interactive
- Close button hidden (prevents accidental closure of in-progress work)

##### Minimized Bar Spec

| Property | Value | Token |
|----------|-------|-------|
| Height | 52px | — |
| Width | Same as open sheet | — |
| Background | `color/bg/subtle` | `#ffffff` |
| Border | Top + left + right: `color/border/strong` (1px) | `#374151` |
| Radius | Top corners: `radius/lg` (20px), bottom: 0 | — |
| Shadow | `shadow/md` | — |
| Padding | Horizontal: `space/5` (24px) | — |
| Title | `body-sm-semibold` (14px/600) | — |
| Restore icon | 20px, `color/icon/interactive` | `#155c84` |

#### Scrolling

- Header: sticky at top
- Action row (CTA buttons): sticky at bottom
- Content between scrolls independently
- Scroll containment: `overscroll-behavior: contain` required

#### Props

```typescript
interface BottomSheetProps {
  open: boolean;
  state?: "open" | "minimized";
  onMinimize?: () => void;
  onClose?: () => void;
  title: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
  actions?: React.ReactNode; // sticky bottom action row
}
```

#### Usage

```tsx
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"

<BottomSheet
  open={isOpen}
  state={state}
  onMinimize={() => setState("minimized")}
  onClose={() => setIsOpen(false)}
  title="Edit Tenant | ویرایش تننت"
  actions={
    <>
      <Button variant="tertiary">Cancel | انصراف</Button>
      <Button variant="default">Save | ذخیره</Button>
    </>
  }
>
  {/* Form content */}
</BottomSheet>
```

---

### Tooltip

**Status:** 🔄 Specified  
**Command:** `npx shadcn@latest add tooltip`

#### Default Spec

System default tooltip spec, used by IconButton and collapsed sidebar items.

| Property | Value | Token |
|----------|-------|-------|
| Background | `neutral/900` | `#111827` |
| Text | `color/text/inverse` | `#ffffff` |
| Typography | `label-lg-regular` | 12px / 400 |
| Radius | `radius/sm` | 4px |
| Offset | `space/2` | 8px |
| Show delay | 300ms | — |
| Hide delay | 0ms | — |
| Position | top (default) | — |
| Disabled | Auto-suppressed | — |

#### Usage

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <IconButton icon={<Settings />} tooltipLabel="Settings | تنظیمات" />
    </TooltipTrigger>
    <TooltipContent>
      <p>Settings | تنظیمات</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### Table

**Status:** ✅ Implemented  
**Location:** `src/components/ui/table.tsx`

#### Sub-components

- `Table` — Root table element
- `TableHeader` — Header section
- `TableBody` — Body section
- `TableFooter` — Footer section
- `TableHead` — Header cell
- `TableRow` — Row element
- `TableCell` — Data cell
- `TableCaption` — Caption element

#### Usage

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of tenants | لیست تننت‌ها</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Code | کد</TableHead>
      <TableHead>Name | نام</TableHead>
      <TableHead>Status | وضعیت</TableHead>
      <TableHead className="text-end">Actions | عملیات</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">TEN001</TableCell>
      <TableCell>Acme Inc</TableCell>
      <TableCell><Badge variant="secondary">Active</Badge></TableCell>
      <TableCell className="text-end">
        <IconButton variant="tertiary" size="sm" icon={<Edit />} tooltipLabel="Edit" />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Badge

**Status:** ✅ Implemented (requires v3.1 token update)  
**Location:** `src/components/ui/badge.tsx`

#### Variants

| Variant | Background | Text | Use |
|---------|-----------|------|-----|
| `default` | `color/interactive/default` | `color/text/inverse` | Default badge |
| `secondary` | `color/bg/muted` | `color/text/default` | Muted badge |
| `success` | `color/status/success-bg` | `color/status/success` | Active, complete states |
| `danger` | `color/status/danger-bg` | `color/status/danger` | Error, blocked |
| `warning` | `color/status/warning-bg` | `color/status/warning` | Caution, pending |
| `info` | `color/status/info-bg` | `color/status/info` | Information |
| `outline` | transparent | `color/text/default` | Outlined style with `color/border/default` |

#### Usage

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="success">Active | فعال</Badge>
<Badge variant="danger">Error | خطا</Badge>
<Badge variant="warning">Pending | در انتظار</Badge>
<Badge variant="info">Info | اطلاع</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Deprecated Components | کامپوننت‌های منسوخ

### Dialog (Modal)

**Status:** ❌ Deprecated  
**Replaced by:** [Bottom Sheet](#bottom-sheet)

The Dialog component has been deprecated for almost all overlay use cases. **All overlay interactions in Dynova now use Bottom Sheet.**

**Single exception:** Table filter dialogs may continue to use a modal pattern.

For all confirmations, forms, wizards, pickers, and configuration panels, use Bottom Sheet instead.

---

## Available via CLI | موجود از طریق CLI

These components are available via shadcn/ui but not yet installed. Add them as needed.

### Card

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add card`

Token bindings (when implemented):
- Background: `color/bg/subtle`
- Border: `color/border/default` (1px)
- Radius: `radius/lg` (20px)
- Padding: `space/4` (16px)
- Shadow: `shadow/sm`

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Select

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add select`

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Checkbox

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add checkbox`

```tsx
import { Checkbox } from "@/components/ui/checkbox"

<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms | قبول شرایط</Label>
</div>
```

---

### Radio Group

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add radio-group`

```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

<RadioGroup defaultValue="option1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option1" id="r1" />
    <Label htmlFor="r1">Option 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option2" id="r2" />
    <Label htmlFor="r2">Option 2</Label>
  </div>
</RadioGroup>
```

---

### Textarea

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add textarea`

```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Enter your message" />
```

---

### Switch

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add switch`

```tsx
import { Switch } from "@/components/ui/switch"

<Switch id="airplane-mode" />
```

---

### Avatar

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add avatar`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

### Separator

**Status:** ⚠️ Add via CLI  
**Command:** `npx shadcn@latest add separator`

```tsx
import { Separator } from "@/components/ui/separator"

<div>
  <p>Content above</p>
  <Separator className="my-4" />
  <p>Content below</p>
</div>
```

---

## Layout Components | کامپوننت‌های چیدمان

> **📐 For complete layout specifications, see [05-main-layout.md](./05-main-layout.md)**

### MainLayout

**Status:** ✅ Implemented  
**Location:** `src/components/layout/MainLayout.tsx`

The main application layout with three zones: sidebar, header, and content area.

```
┌─────────────────────────────────────────────────────────────┐
│                     Header (64px)                            │
├─────┬───────────────────────────────────────────────────────┤
│ S   │              Main Content Area                         │
│ I   │                                                        │
│ D   │              (scrollable)                              │
│ E   │                                                        │
│ B   │                                                        │
│ A   │                                                        │
│ R   │                                                        │
└─────┴───────────────────────────────────────────────────────┘
```

#### Props

```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}
```

#### Usage

```tsx
import { MainLayout } from "@/components/layout"

<MainLayout>
  {/* Page content */}
</MainLayout>
```

---

### Sidebar

**Status:** ✅ Implemented (requires v3.1 update — major visual change)  
**Location:** `src/widgets/sidebar/ui/Sidebar.tsx`

Light collapsible navigation sidebar with logo, menu items, and user profile.

| State | Width | Background |
|-------|-------|------------|
| Expanded | 200px | `color/bg/subtle` (`#ffffff`) |
| Collapsed | 76px | `color/bg/subtle` (`#ffffff`) |

**No shadow.** 1px `color/border/default` on workspace-facing edge only.

#### Props

```typescript
interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}
```

#### Sections

1. **Logo Area** — Dynova logo at top
2. **Navigation Items** — 44px per item, icons + labels, `radius/full`
3. **Footer** — Company branding and version number, pinned to bottom

#### Navigation Item States

| State | Background | Text |
|-------|------------|------|
| Default | transparent | `color/text/default` |
| Hover | `color/bg/default` (`#f3f4f6`) | `color/text/default` |
| Active | `color/interactive/default` | `color/text/inverse` |

All collapsed nav items require tooltips.

#### Usage

```tsx
import { Sidebar } from "@/widgets/sidebar"

<Sidebar collapsed={isCollapsed} onToggle={handleToggle} />
```

---

### Header

**Status:** ✅ Implemented (flagged for future v3.1 refinement)  
**Location:** `src/widgets/header/ui/Header.tsx`

> **Note:** v3.1 does not redefine the header. Current spec is retained pending future refinement.

Light top header with toggle button, breadcrumb, search, and user menu.

| Property | Value |
|----------|-------|
| Height | 64px (`h-16`) |
| Background | `bg-white` |
| Border | `border-b border-color-border-default` |

#### Props

```typescript
interface HeaderProps {
  onMenuClick?: () => void;
}
```

#### Sections

1. **Toggle Button** — Menu icon (☰), opens/closes sidebar
2. **Breadcrumb** — Navigation path
3. **Search Input** — 240px width, rounded
4. **User Menu** — Avatar dropdown

#### Usage

```tsx
import { Header } from "@/widgets/header"

<Header onMenuClick={handleMenuClick} />
```

---

### Breadcrumb

**Status:** ✅ Implemented  
**Location:** `src/shared-app/breadcrumb/ui/Breadcrumb.tsx`

#### Props

```typescript
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}
```

#### Styling

| Element | Token |
|---------|-------|
| Separator | `ChevronRight` icon, `color/icon/subtle` |
| Link | `color/text/subtle`, hover: `color/text/default` |
| Current | `color/text/default` (font-weight: 600) |

#### Usage

```tsx
import { Breadcrumb } from "@/shared-app/breadcrumb"

<Breadcrumb items={[
  { label: "Home | خانه", href: "/" },
  { label: "Tenants | تننت‌ها", href: "/tenants" },
  { label: "Details | جزئیات" },
]} />
```

---

## Custom Components | کامپوننت‌های سفارشی

### Spinner

**Status:** ✅ Implemented  
**Location:** `src/components/ui/Spinner.tsx`

```typescript
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}
```

```tsx
import { Spinner } from "@/components/ui"

<Spinner size="md" />
```

---

### EmptyState

**Status:** ✅ Implemented  
**Location:** `src/components/ui/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

```tsx
import { EmptyState } from "@/components/ui"

<EmptyState
  title="No items found | موردی یافت نشد"
  description="Try adjusting your filters | فیلترها را تغییر دهید"
  action={<Button>Create Item | ایجاد مورد</Button>}
/>
```

---

### ErrorState

**Status:** ✅ Implemented  
**Location:** `src/components/ui/ErrorState.tsx`

```typescript
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}
```

```tsx
import { ErrorState } from "@/components/ui"

<ErrorState
  message="Something went wrong | مشکلی پیش آمد"
  onRetry={handleRetry}
/>
```

---

## Component Request Template | الگوی درخواست کامپوننت

When requesting a new component:

```markdown
## New Component Request

### Component Name
[Name from Figma]

### Figma Link
[Link to component in Figma]

### Variants Needed
- [ ] Variant 1
- [ ] Variant 2

### Props Required
- `prop1`: type - description
- `prop2`: type - description

### States Required
- [ ] Default
- [ ] Hover
- [ ] Focus
- [ ] Disabled
- [ ] Loading
- [ ] Error

### Accessibility Requirements
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Focus indicators (2px gap + 2px ring)
- [ ] ARIA attributes
- [ ] WCAG 2.1 AA contrast verified
- [ ] Touch target ≥ 44px or 44px invisible hit area

### Bilingual Support
- [ ] Persian labels included
- [ ] RTL layout tested

### Token Bindings
- [ ] Uses Collection 2 (Semantic) tokens only
- [ ] No primitive token references in component
```

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Token reference
- **[Figma → Code Mapping](./03-figma-to-code.md)** — Figma to code reference
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Main Layout](./05-main-layout.md)** — Complete layout specification
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
