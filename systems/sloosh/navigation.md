# Navigation

Read this when you add a tab row, a segmented switch, a link in the navbar or phone tab bar, the theme switch, or a prototype-only picker.

Switches are in `components/ui/`; the app shell is in `components/shell/`. The sliding highlight under any pill row is `TabTrack` (`components/motion/tab-track.tsx`), because a clip-path transition on the compositor never stutters while the next page loads.

## Which switch

```
Changing what a page or panel shows?
  First level of a page, on a rule across the screen?   -> Tabs, TabsList variant="line"
  A row of categories or pill tabs under it?            -> PAGE_TAB_CLASS buttons over <TabTrack />
  Two or three views inside a popover or dialog?        -> Tabs, TabsList (default well)
Picking one of 2 to 4 short settings in words (billing cycle)? -> TextSegmentedSwitch
Picking one of 2 to 4 views shown as glyphs (grid / list)?     -> IconSegmentedSwitch
Filter pills that must collapse to a Select below 1024px?      -> TabFilters
Going to another page?                                         -> a Link: NAV_ITEMS, or the phone tab bar
```

Two levels of tabs look different: line tabs first, pill tabs (`PAGE_TAB_CLASS`) under them, so the hierarchy reads at a glance. In a bar, tabs sit left and controls right, all 36 tall.

## Pill tabs: `PAGE_TAB_CLASS` + `TabTrack`

The product's pill row (Studio, Settings, Templates, Spaces). `PAGE_TAB_CLASS` (`components/ui/pill.tsx:34`) is 36 tall (32 on phones). Put `<TabTrack />` first in a `relative` row; mark the current tab `data-active`, `aria-current="page"` or `aria-selected="true"`. `TabTrack variant`: `"pill" | "line"`. In Settings, pills go left and pickers right on one row (`SettingsFilters`).
```tsx
// Correct: components/settings/settings-parts.tsx:156
<div className="scrollbar-hide relative flex min-w-0 gap-1 overflow-x-auto" role="group" aria-label={label}><TabTrack />{…<button data-active={…} className={PAGE_TAB_CLASS}>}
// Incorrect: a fill swapped per button. It jumps instead of sliding and can cover a label.
<button className={cn(PAGE_TAB_CLASS, on && "bg-muted")}>
```

## Tabs (`tabs.tsx`)

1. Base UI tabs with panels: the first level of a page (`line`) or views inside a panel (`default`). Pill rows use `PAGE_TAB_CLASS`.
2. `TabsList variant`: `"default" | "line"`. Parts: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants`. `TabsListUnderline` and `TabsTriggerUnderline` are old aliases for `line`; don't use them. Nothing else exists.
3. Default `default`: a dark well (`bg-background`, 36 tall, `rounded-xl`), the picked tab a muted fill, never yellow. `line`: a 2px foreground bar under the picked tab.
4. Examples:
```tsx
// Correct: components/templates/templates-screen.tsx:134, a page's first level
<TabsList variant="line" aria-label="Template source" className="h-14 gap-2 p-0 max-md:h-12 max-md:w-full">
// Incorrect: the default well for a page's category row, which reads as a control, not a tab level
<TabsList>{categories.map((c) => <TabsTrigger value={c.id}>{c.label}</TabsTrigger>)}</TabsList>
```

## TextSegmentedSwitch (`text-segmented-switch.tsx`)

1. One of 2 to 4 short word options that changes a setting in place, with a sliding pill. It is not navigation and not a filter row.
2. `size`: `"default" | "lg"`; options `{ value, label, disabled }`; plus `value`, `defaultValue`, `onValueChange`, `placeholder`, `disabled`, `aria-label`. Nothing else exists.
3. Default: 36 tall, 14px, on `bg-card`. `lg` (44 tall, 16px) only for the pricing billing switch. Below 768px it becomes a ghost Select by itself.
4. Examples:
```tsx
// Correct: components/pricing/hero.tsx:48
<TextSegmentedSwitch<Cycle> aria-label="Billing cycle" size="lg" value={cycle} onValueChange={(v) => setCycle(v)} options={[…]} />
// Incorrect: a new section's switch where its sibling sections use pills and a Select. Copy the siblings.
<TextSegmentedSwitch aria-label="Range" options={ranges} />
```

## IconSegmentedSwitch (`icon-segmented-switch.tsx`)

1. One of 2 to 4 views shown as glyphs (grid or list). Words go in TextSegmentedSwitch. No product screen uses it yet; the gallery shows it.
2. `variant`: `"default" | "sidebar"`; `size`: `"sm" | "default" | "pill"`; options `{ value, icon, text, label, tooltipLabel }`. Nothing else exists.
3. Default `default` / `sm`. `sidebar` on a card-coloured panel. `pill` (24 tall) when options carry `text`. Give every option `tooltipLabel` so the glyph is named.
4. Examples:
```tsx
// Correct: app/design-system/component-gallery.tsx:551
<IconSegmentedSwitch variant={variant} size={size} value={view} onValueChange={(v) => setView(String(v))} options={…} />
// Incorrect: glyph keys hand-built from Buttons, with no shared indicator or arrow-key support
<Button variant="ghost" size="icon-28" onClick={() => setView("grid")}><GridIcon /></Button>
```

## TabFilters (`tab-filters.tsx`)

1. A row of 28px filter pills that becomes a Select below 1024px. No product screen uses it; product filter rows are `PAGE_TAB_CLASS` + `TabTrack`. Use it only where the Select collapse is wanted.
2. Props: `value`, `onChange`, `options` `{ value, label, icon }`, `isLoading`, `loadingCount`, `suffix`, `pill`, `animate`. Nothing else exists.
3. Defaults: 8px corners, `loadingCount` 5. `pill` for fully round pills. `suffix` sits at the row's far right.
4. Examples:
```tsx
// Correct: app/design-system/component-gallery.tsx:572
<TabFilters value={filter} onChange={setFilter} options={filterOptions} />
// Incorrect: animate on a screen. It staggers with JavaScript motion, which stalls during a page load.
<TabFilters value={filter} onChange={setFilter} options={filterOptions} animate />
```

## ThemeToggle (`theme-toggle.tsx`)

1. The light / dark switch: a ghost icon key, sun while dark, moon while light, with a tooltip. The only way the theme changes is `setTheme` (`hooks/use-theme.ts`, `lib/theme.ts`).
2. `size`: `"icon-28" | "icon-32" | "icon-36"`; plus `className`. `ThemeSync` is mounted once in `app/layout.tsx:91`. Nothing else exists.
3. Default `icon-36`. In the navbar it shows signed out only (`sloosh-navbar.tsx:341`); signed in, the switch is an item in the account menu (`account-menu.tsx:125`).
4. Examples:
```tsx
// Correct: components/shell/sloosh-navbar.tsx:341
{!signedIn && <ThemeToggle />}
// Incorrect: setting the attribute yourself. It skips localStorage and the `dark` class.
document.documentElement.dataset.theme = "light";
```

## PrototypePicker (`prototype-picker.tsx`)

1. Prototype-only: a dashed key pinned bottom right that switches versions of something on a page. Dashed so it never reads as product. Every new prototype switch uses it.
2. Props: `title`, `options` `{ id, label, disabled, note }`, `value`, `onChange`, `action` `{ label, onClick }`, `className`. Store: `createPrototypeChoice(key, ids, fallback)` returns `read`, `set`, `subscribe`, `notify`, `useChoice`. Nothing else exists.
3. Default: fixed `right-4 bottom-4`, raised to `bottom-24` on phones to clear the tab bar. `className` only to move it.
4. Examples:
```tsx
// Correct: components/spaces/explore/spaces-intro-picker.tsx:21
<PrototypePicker title={C.card} options={MODES} value={mode} onChange={…} />
// Incorrect: its own fixed "States" button and panel
<div className="fixed bottom-4 left-4 …">{open && <div role="dialog" …>}</div>
```

## App shell (`components/shell/`)

**Navbar** (`sloosh-navbar.tsx`): 61px (60 on phones). Left: the logo (it is the way to Explore, `/`; there is no Explore tab), the Beta chip from 1024px, then `NAV_ITEMS` as plain text: muted, the current page or open menu in foreground, no pill. Right, in order: Docs and Assets (ghost 32, labels from 1600px), a rule, the credits chip and Upgrade, the offers gift, notifications (`ghost-fill` icon-32 with a brand `CountPill`), then the account avatar, or Login (`secondary` 28) and Sign up (`primary` 28, last). Icon keys are muted until hover. Below 768px the tabs hide and the phone tab bar takes over.

**Tabs** (`nav-items.ts`): `NAV_ITEMS` is the one list. Today: Studio, Spaces, Spacelab (from 1024px), Creator, Popular (`tag: "Hot"`), MCP (from 1280px), Creator Pass (`isNew`, `spotlight`, from 1280px). Add a tab here, never in the navbar markup. `from` hides it below a width so the row always fits; `spotlight` marks the bar's one new-feature spot, one item at a time. `activeNavKey(pathname)` picks the current tab; `isFocusedPhoneRoute` hides navbar and tab bar on phones (a space's page, Synora, Calypso, Microdrama's studio); `isEditorRoute` lets Spacelab draw its own top row.

**Menus** (`nav-menu.tsx`): Spaces, Spacelab, Creator and Popular (`MENU_ORDER`) open one panel under the bar on hover (80ms in, 180ms grace out), dimming the page; ArrowDown opens it from the keyboard, Escape closes it. Every row is a 40px tile, a title and a one-line note, on one grid. Two columns below 1024px; hidden below 768px.

**Phone tab bar** (`mobile-tab-bar.tsx:49`): 5 tabs, below 768px only: Explore (`/`), Studio (`/studio`), Spaces (`/spaces`), Creator (opens a sheet), More (opens a sheet). The active tab is yellow, the rest muted; each cell is at least 44px tall. A section with no tab lights More.

**Phone sheets** (`mobile-nav-sheet.tsx`, on `BottomSheet`): Creator holds two groups, Creator (AI Influencer, Synora) and Popular (Calypso, the editor). More holds Assets and Upgrade, then Creator Pass (New), then Build with Sloosh: Spacelab, MCP, Docs. **Spacelab lives in More** (`mobile-nav-sheet.tsx:111`), not the tab bar, because its canvas wants a desktop screen. Rows copy the desktop menu's row (40px tile, title, note).
```tsx
// Correct: a new phone destination goes in a SHEETS group (mobile-nav-sheet.tsx)
{ href: "/mcp", glyph: [Plug01Icon, "Plug01", "context"], title: "MCP", note: "Sloosh inside your AI agent" },
// Incorrect: a sixth TABS entry in mobile-tab-bar.tsx. The bar is five equal columns.
{ key: "spacelab", label: "Spacelab", href: SPACELAB_HREF, icon: … },
```
