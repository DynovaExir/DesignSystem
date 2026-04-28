# Figma → Code Mapping | نگاشت فیگما به کد

**Version:** 3.1 | **Updated:** 2026-02-25  
**Figma File:** [Design System](https://www.figma.com/design/kBh6QuzFDcsY17YHpmL74u/Design-System)  
**Component Library:** [shadcn/ui](https://ui.shadcn.com)

---

## Overview | نمای کلی

This document is the **source of truth** for mapping Figma design components to their React/shadcn/ui implementations. Use this reference when implementing designs from Figma.

> **For when-to-use / when-NOT-to-use guidance, see [06-component-usage-guidelines.md](./06-component-usage-guidelines.md).**

---

## Status Legend | راهنمای وضعیت

| Icon | Status | Action Required |
|------|--------|-----------------|
| ✅ | Implemented | Ready to use |
| ⚠️ | Available | Run `npx shadcn@latest add <component>` |
| 🔄 | Specified | Spec finalized, implementation pending |
| ❌ | Deprecated | Replaced — see replacement |

---

## Button Mappings | نگاشت دکمه‌ها

**shadcn/ui:** `npx shadcn@latest add button`

Buttons have **one size** (44px) and **five types**. There is no `size` prop.

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `Button / Default` | `<Button />` | `variant="default"` | ✅ |
| `Button / Secondary` | `<Button />` | `variant="secondary"` | ✅ |
| `Button / Tertiary` | `<Button />` | `variant="tertiary"` | ✅ |
| `Button / Destructive` | `<Button />` | `variant="destructive"` | ✅ |
| `Button / Ghost` | `<Button />` | `variant="ghost"` | ✅ |
| `Button / Disabled` | `<Button />` | `disabled={true}` | ✅ |

### Code Example

```tsx
import { Button } from "@/components/ui/button"

// Figma: Button / Default
<Button variant="default">Submit | ثبت</Button>

// Figma: Button / Secondary
<Button variant="secondary">Cancel | انصراف</Button>

// Figma: Button / Tertiary
<Button variant="tertiary">View Details | مشاهده جزئیات</Button>

// Figma: Button / Destructive
<Button variant="destructive">Delete | حذف</Button>

// Figma: Button / Ghost
<Button variant="ghost">Skip | رد کردن</Button>
```

---

## IconButton Mappings | نگاشت دکمه‌های آیکونی

**Component:** Custom (`src/components/ui/icon-button.tsx`)

IconButtons are a **separate component** from Button — not a size variant.

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `IconButton / Filled / Md` | `<IconButton />` | `variant="filled" size="md"` | 🔄 |
| `IconButton / Filled / Sm` | `<IconButton />` | `variant="filled" size="sm"` | 🔄 |
| `IconButton / Filled / Xs` | `<IconButton />` | `variant="filled" size="xs"` | 🔄 |
| `IconButton / Tertiary / Md` | `<IconButton />` | `variant="tertiary" size="md"` | 🔄 |
| `IconButton / Tertiary / Sm` | `<IconButton />` | `variant="tertiary" size="sm"` | 🔄 |
| `IconButton / Tertiary / Xs` | `<IconButton />` | `variant="tertiary" size="xs"` | 🔄 |

### Code Example

```tsx
import { IconButton } from "@/components/ui/icon-button"
import { Edit, Trash2, X } from "lucide-react"

// Figma: IconButton / Filled / Md
<IconButton
  variant="filled"
  size="md"
  icon={<Edit />}
  tooltipLabel="Edit | ویرایش"
/>

// Figma: IconButton / Tertiary / Sm
<IconButton
  variant="tertiary"
  size="sm"
  icon={<Trash2 />}
  tooltipLabel="Delete | حذف"
/>
```

**Required:** Every IconButton must have `tooltipLabel` (WCAG 1.1.1).

---

## Input Mappings | نگاشت ورودی‌ها

**shadcn/ui:** `npx shadcn@latest add input label`

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `Input / Default` | `<Input />` | — | ✅ |
| `Input / Disabled` | `<Input />` | `disabled={true}` | ✅ |
| `Input / Focus` | `<Input />` | CSS `:focus` state, 2px focus ring | ✅ |
| `Input / Error` | `<Input />` | `className="border-color-status-danger"` | ✅ |
| `TextField / With Label` | `<Label />` + `<Input />` | — | ✅ |
| `TextField / With Subtext` | Text Field Stacking pattern | — | 🔄 |

### Text Field Stacking

All form inputs use a 71px-tall wrapper with reserved 19px subtext region for zero layout shift. See [02-component-catalog.md](./02-component-catalog.md#text-field-stacking-pattern) for full spec.

### Code Example

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Figma: TextField / With Label
<div className="space-y-2">
  <Label htmlFor="email">Email | ایمیل</Label>
  <Input id="email" placeholder="Enter email" />
</div>

// Figma: Input / Error
<Input className="border-color-status-danger focus-visible:ring-color-status-danger" />

// Figma: TextField / With Subtext (Stacking pattern)
<div className="h-[71px]">
  <Input className="h-[52px]" />
  <div className="h-[19px] mt-1 text-label-lg-regular text-color-status-danger">
    {error}
  </div>
</div>
```

---

## Form Component Mappings | نگاشت فرم

| Figma Component | React Component | Command | Status |
|-----------------|-----------------|---------|--------|
| `Select / Default` | `<Select />` | `npx shadcn@latest add select` | ⚠️ |
| `Checkbox` | `<Checkbox />` | `npx shadcn@latest add checkbox` | ⚠️ |
| `Radio Group` | `<RadioGroup />` | `npx shadcn@latest add radio-group` | ⚠️ |
| `Textarea` | `<Textarea />` | `npx shadcn@latest add textarea` | ⚠️ |
| `Switch` | `<Switch />` | `npx shadcn@latest add switch` | ⚠️ |

All form components must use the Text Field Stacking pattern when displaying inline subtext.

---

## Bottom Sheet Mappings | نگاشت بازشوهای پایینی

**Component:** Custom (`src/components/ui/bottom-sheet.tsx`)

The Bottom Sheet is the **primary overlay surface** in Dynova. All confirmations, forms, wizards, pickers, and configuration panels use Bottom Sheet.

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `BottomSheet / Open` | `<BottomSheet />` | `state="open"` | 🔄 |
| `BottomSheet / Minimized` | `<BottomSheet />` | `state="minimized"` | 🔄 |
| `BottomSheet / With Header` | `<BottomSheet />` | `title="..."` | 🔄 |
| `BottomSheet / With Breadcrumb` | `<BottomSheet />` | `breadcrumb={[...]}` | 🔄 |
| `BottomSheet / With Actions` | `<BottomSheet />` | `actions={...}` | 🔄 |

### Code Example

```tsx
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Button } from "@/components/ui/button"

const [open, setOpen] = useState(false);
const [state, setState] = useState<"open" | "minimized">("open");

<BottomSheet
  open={open}
  state={state}
  onMinimize={() => setState("minimized")}
  onClose={() => setOpen(false)}
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

**Critical behavior:**
- Scrim click does **NOT** close the sheet
- Close and minimize **only via dedicated header buttons**
- Minimized state hides the close button

---

## Modal & Overlay Mappings (Deprecated) | نگاشت مودال (منسوخ)

| Figma Component | React Component | Status |
|-----------------|-----------------|--------|
| `Modal / Default` | — | ❌ Use Bottom Sheet |
| `Modal / With Header` | — | ❌ Use Bottom Sheet |
| `Modal / With Footer` | — | ❌ Use Bottom Sheet |
| `Modal / Small` | — | ❌ Use Bottom Sheet |
| `Modal / Medium` | — | ❌ Use Bottom Sheet |
| `Modal / Large` | — | ❌ Use Bottom Sheet |
| `Drawer / Right` | `<Drawer />` | ⚠️ Available |
| `Popover` | `<Popover />` | ⚠️ Available |
| `Tooltip` | `<Tooltip />` | 🔄 Specified — `npx shadcn@latest add tooltip` |

> **Exception:** Table filter dialogs may continue to use a modal pattern. All other overlay use cases must use Bottom Sheet.

---

## Tooltip Mappings | نگاشت تولتیپ

**shadcn/ui:** `npx shadcn@latest add tooltip`

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `Tooltip / Default` | `<Tooltip />` | — | 🔄 |
| `Tooltip / Top` | `<TooltipContent />` | `side="top"` (default) | 🔄 |
| `Tooltip / Bottom` | `<TooltipContent />` | `side="bottom"` | 🔄 |
| `Tooltip / Left` | `<TooltipContent />` | `side="left"` | 🔄 |
| `Tooltip / Right` | `<TooltipContent />` | `side="right"` | 🔄 |

### Code Example

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
      <IconButton icon={<Settings />} tooltipLabel="Settings" />
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>Settings | تنظیمات</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Table Mappings | نگاشت جدول

**shadcn/ui:** `npx shadcn@latest add table`

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `Table / Default` | `<Table />` | — | ✅ |
| `Table / With Sorting` | `<Table />` | Custom sorting logic | ✅ |
| `Table / Empty State` | `<EmptyState />` | — | ✅ |
| `Table Row / Default` | `<TableRow />` | — | ✅ |
| `Table Row / Selected` | `<TableRow />` | `data-state="selected"` (uses `color/selection/selected`) | ✅ |

### Code Example

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Figma: Table / With Sorting
<Table>
  <TableHeader>
    <TableRow>
      <TableHead onClick={() => handleSort("name")}>
        Name | نام
        <SortIcon direction={sortDirection} />
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Badge Mappings | نگاشت نشان‌ها

**shadcn/ui:** `npx shadcn@latest add badge`

| Figma Component | React Component | Props | Status |
|-----------------|-----------------|-------|--------|
| `Badge / Default` | `<Badge />` | `variant="default"` | ✅ |
| `Badge / Secondary` | `<Badge />` | `variant="secondary"` | ✅ |
| `Badge / Success` | `<Badge />` | `variant="success"` (uses `color/status/success-bg` + `color/status/success`) | ✅ |
| `Badge / Danger` | `<Badge />` | `variant="danger"` (uses `color/status/danger-bg` + `color/status/danger`) | ✅ |
| `Badge / Warning` | `<Badge />` | `variant="warning"` (uses `color/status/warning-bg` + `color/status/warning`) | ✅ |
| `Badge / Info` | `<Badge />` | `variant="info"` (uses `color/status/info-bg` + `color/status/info`) | ✅ |
| `Badge / Outline` | `<Badge />` | `variant="outline"` | ✅ |

---

## Feedback Component Mappings | نگاشت بازخوردها

| Figma Component | React Component | Command | Status |
|-----------------|-----------------|---------|--------|
| `Toast / Success` | `toast()` | `npx shadcn@latest add toast` | ⚠️ |
| `Toast / Error` | `toast()` | `variant: "destructive"` | ⚠️ |
| `Alert / Default` | `<Alert />` | `npx shadcn@latest add alert` | ⚠️ |
| `Alert / Error` | `<Alert />` | `variant="destructive"` | ⚠️ |
| `Progress` | `<Progress />` | `npx shadcn@latest add progress` | ⚠️ |
| `Skeleton` | `<Skeleton />` | `npx shadcn@latest add skeleton` (uses `opacity/skeleton`) | ⚠️ |
| `Spinner` | `<Spinner />` | Custom component | ✅ |

---

## Layout Component Mappings | نگاشت چیدمان

> **📐 For complete layout specifications, see [05-main-layout.md](./05-main-layout.md)**

| Figma Component | React Component | Location | Status |
|-----------------|-----------------|----------|--------|
| `Sidebar / Expanded` | `<Sidebar />` | `src/widgets/sidebar/` | ✅ |
| `Sidebar / Collapsed` | `<Sidebar />` | `collapsed={true}` | ✅ |
| `Header` | `<Header />` | `src/widgets/header/` | ✅ |
| `Breadcrumb` | `<Breadcrumb />` | `src/shared-app/breadcrumb/` | ✅ |
| `MainLayout` | `<MainLayout />` | `src/components/layout/` | ✅ |

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Header (64px)                            │
├─────┬───────────────────────────────────────────────────────┤
│     │                                                        │
│ S   │              Main Content Area                         │
│ I   │                                                        │
│ D   │              (flex-1, scrollable)                      │
│ E   │                                                        │
│ B   │                                                        │
│ A   │                                                        │
│ R   │                                                        │
│     │                                                        │
└─────┴───────────────────────────────────────────────────────┘
```

| Zone | Width | Background | Token |
|------|-------|------------|-------|
| Sidebar (expanded) | 200px | `#FFFFFF` | `color/bg/subtle` |
| Sidebar (collapsed) | 76px | `#FFFFFF` | `color/bg/subtle` |
| Header | 100% | `#FFFFFF` | `color/bg/subtle` |
| Content | flex-1 | `#F3F4F6` | `color/bg/default` |

**Sidebar edge:** 1px `color/border/default` on workspace-facing edge. **No shadow.**

---

## Card Mappings | نگاشت کارت‌ها

**shadcn/ui:** `npx shadcn@latest add card`

| Figma Component | React Component | Token Bindings | Status |
|-----------------|-----------------|----------------|--------|
| `Card / Default` | `<Card />` | bg: `color/bg/subtle`, border: `color/border/default`, radius: `radius/lg`, shadow: `shadow/sm` | ⚠️ |
| `Card / With Header` | `<Card />` | Use `<CardHeader>` | ⚠️ |
| `Card / With Footer` | `<Card />` | Use `<CardFooter>` | ⚠️ |

---

## Naming Conventions | قراردادهای نام‌گذاری

### Figma → Code Translation

| Figma Pattern | Code Pattern | Example |
|---------------|--------------|---------|
| `Component / Variant` | `<Component variant="variant" />` | `Button / Tertiary` → `<Button variant="tertiary" />` |
| `Component / Variant / Size` | `<Component variant size />` | `IconButton / Filled / Md` → `<IconButton variant="filled" size="md" />` |
| `Component / State` | `<Component state />` | `Input / Disabled` → `<Input disabled />` |
| `Component / With Feature` | `<Component feature />` | `BottomSheet / With Breadcrumb` → `<BottomSheet breadcrumb={[...]} />` |

### Size Mapping (IconButton & sized components only)

> **Note:** Buttons have a **single size** (44px) and do not use a size prop. Size mapping applies to IconButton and other components with sized variants.

| Figma Size | Component Prop |
|------------|----------------|
| Md (default) | `size="md"` |
| Sm | `size="sm"` |
| Xs | `size="xs"` |

### State Mapping

| Figma State | React Implementation |
|-------------|---------------------|
| Default | No additional props |
| Hover | `:hover` CSS pseudo-class |
| Focus | `:focus` CSS pseudo-class — 2px white gap + 2px focus ring |
| Active/Pressed | `:active` CSS pseudo-class — `opacity/pressed` overlay |
| Disabled | `disabled={true}` prop — applies `opacity/disabled` to entire component |
| Error | `color/status/danger` border or background |
| Loading | `loading={true}` prop |

---

## Page/Screen Mappings | نگاشت صفحات

### Frame Naming Convention

| Figma Frame | React Component | Route |
|-------------|-----------------|-------|
| `LoginPage / Default` | `LoginPage` | `/login` |
| `LoginPage / Loading` | `LoginPage` | With loading state |
| `LoginPage / Error` | `LoginPage` | With error state |
| `TenantsPage / Default` | `TenantsPage` | `/tenants` |
| `TenantsPage / Empty` | `TenantsPage` | With empty state |

---

## Token Mapping Quick Reference | مرجع سریع توکن

Components bind to **Collection 2 (Semantic)** tokens only — never to primitives.

| Figma Token | Tailwind Class / CSS Variable |
|-------------|-------------------------------|
| `color/interactive/default` | `bg-color-interactive-default` / `var(--color-interactive-default)` |
| `color/text/default` | `text-color-text-default` / `var(--color-text-default)` |
| `color/text/subtle` | `text-color-text-subtle` |
| `color/border/default` | `border-color-border-default` |
| `color/border/strong` | `border-color-border-strong` |
| `color/status/danger` | `bg-color-status-danger` / `text-color-status-danger` |
| `color/status/success` | `bg-color-status-success` / `text-color-status-success` |
| `radius/md` | `rounded-md` (12px) |
| `radius/lg` | `rounded-lg` (20px) |
| `radius/full` | `rounded-full` (999px) |
| `shadow/sm` | `shadow-sm` |
| `shadow/md` | `shadow-md` |
| `shadow/lg` | `shadow-lg` |
| `space/4` | `p-4` / `gap-4` (16px) |
| `space/5` | `p-5` / `gap-5` (24px) |
| `body-sm-semibold` | `text-body-sm-semibold` |
| `heading-lg` | `text-heading-lg` |

See [01-design-tokens.md](./01-design-tokens.md) for complete token reference.

---

## Adding New Mappings | افزودن نگاشت‌های جدید

When a new Figma component is designed:

1. **Check shadcn/ui** — Is there an existing component?
   ```bash
   npx shadcn@latest add <component>
   ```

2. **Verify Token Bindings** — Component must bind to Collection 2 (Semantic) tokens only

3. **Map Variants** — Document variant → prop mappings

4. **Map States** — Document state implementations

5. **Update This Document** — Add mapping entry

6. **Update Implementation Status** — Track in [04-implementation-status.md](./04-implementation-status.md)

7. **Add Usage Guidelines** — Add when-to-use rules in [06-component-usage-guidelines.md](./06-component-usage-guidelines.md)

---

## Related Documentation | مستندات مرتبط

- **[README](./README.md)** — Overview, principles & quick start
- **[Design Tokens](./01-design-tokens.md)** — Token reference
- **[Component Catalog](./02-component-catalog.md)** — All components with usage
- **[Implementation Status](./04-implementation-status.md)** — Progress tracking
- **[Main Layout](./05-main-layout.md)** — Complete layout specification
- **[Component Usage Guidelines](./06-component-usage-guidelines.md)** — When to use each component
- **[Future Backlog](./07-future-backlog.md)** — Planned but not yet implemented

---

*Last updated: 2026-02-25 | Version 3.1*
