# Shape and elevation

Read this when you pick a corner radius, a spacing step, a shadow, a z-index, a size token, a floating-panel look, or the edge where content scrolls under something pinned.

## Radius

Every step is a multiple of `--radius` (`semantic.css`, `0.5rem` = 8px), defined in `styles/theme.css`, so one value rounds or squares the whole app. Never write `rounded-[Npx]`: it ignores `--radius`.

| Class | Factor | px | For |
|---|---|---|---|
| `rounded-xs` | 0.25 | 2 | hairline corners on tiny marks |
| `rounded-sm` | 0.5 | 4 | checkboxes; a row 4px inside an 8px field |
| `rounded-md` | 0.75 | 6 | small tags, tooltips |
| `rounded-lg` | 1 | 8 | controls 24 to 32 tall; the filled field (`FILLED_CONTROL_CLASS`) |
| `rounded-control` | 1.25 | 10 | controls 36 tall (Button, Input, `FILLED_ROW_CLASS`) |
| `rounded-xl` | 1.5 | 12 | controls 40 and 48 tall; cards, menu items, status pills |
| `rounded-tile` | 1.75 | 14 | controls 56 tall; phone cards |
| `rounded-2xl` | 2 | 16 | dialogs, tab wells, small picture tiles |
| `rounded-panel` | 2.5 | 20 | floating panels, popups, modals |
| `rounded-sheet` | 3 | 24 | a phone bottom sheet's top corners (`rounded-t-sheet`) |
| `rounded-3xl` | 3 | 24 | big picture blocks (bento tiles, Space cards, posters), large banners |
| `rounded-full` | | | dots, avatars, round icon buttons |
| `rounded-wobble` | | | the hand-cut corner of sticky notes and the Stage (`--sl-radius-wobble`, not tied to `--radius`) |

```
Which radius?
├── a control (button, input, trigger) . by height: ≤32 lg, 36 control, 40-48 xl, 56 tile
├── a card or menu item ................ xl
├── a dialog ........................... 2xl
├── a popup, popover, modal ............ panel
├── a picture block .................... 3xl (big) or 2xl (a row of small tiles); one per size on a page
└── something inside a rounded box ..... outer radius minus the inset (concentric)
```

**A control's corner follows its height** (`components/ui/button-variants.ts:66-80`, `components/ui/input.tsx:32-38`), so buttons and fields beside each other match. **Inner corners are concentric**: a box 4px inside an 8px corner is 4, 16px inside a 24 corner is 8, so the gap between the curves stays even.

```tsx
// Correct (lib/filled-control.ts, FILLED_ROW_ACTION_CLASS inside the rounded-lg FILLED_BOX_CLASS)
"m-1 flex h-9 cursor-pointer items-center gap-2 rounded-sm bg-accent/40 px-3 ..."
// Incorrect: a literal that ignores --radius
popupClassName="max-w-[560px] rounded-[20px] border-0"   // use rounded-panel
```

## Spacing

Screens use Tailwind's 4px scale (`p-6` = 24px, `gap-3` = 12px): it is the bulk of the code. Keep steps on the DS4 scale in `semantic.css`: 0, 4, 8, 12, 16, 20, 24, 32, 36, 48, 56, 64, 80, 96, 128, 160 px (Tailwind `0, 1, 2, 3, 4, 5, 6, 8, 9, 12, 14, 16, 20, 24, 32, 40`). A gap between two steps snaps to the larger one. `theme.css` adds one named step, `--spacing-30`: `pt-30` = 120px, the home sections' top gap. The `--spacing-*` tokens are px values, not Tailwind's scale; reach them as `gap-(--spacing-24)` (`components/home/home-section.tsx:50`) or inside `calc()`: `pb-[calc(var(--spacing-12)+env(safe-area-inset-bottom))]` (`components/ui/bottom-sheet.tsx:140`).

## Shadows

| Class | Value | For |
|---|---|---|
| `shadow-float` | dark `0 12px 32px -6px` neutral-950/0.55; light `-8px`, /0.18; **plus `0 0 0 1px --border`** | a panel or menu floating over content |
| `shadow-modal` | dark `0 24px 64px -12px` neutral-950/0.65; light /0.25; **plus `0 0 0 1px --border`** | modals, a picture lifted off the page |
| `shadow-panel` | `0 4px 24px 0 rgb(0 0 0 / 0.12)`, both themes | the popup panel (`POPUP_PANEL_CLASS`) |
| `shadow-drop` | `0 4px 0 0 --ground-drop`, flat, no blur | a contrasting card or paper ticket (grounds, colors.md) |
| `shadow-surface` | `0 12px 16px 0` media-scrim/0.02 | a resting surface (Studio composer) |
| `shadow-composer-pop` | `0 4px 12px 0 rgb(0 0 0 / 0.24)` | a panel popped above the Studio composer |
| `shadow-halo` | `0 0 0 1px --brand-accent` + `0 0 24px -4px --brand-accent-glow` | a running node |
| `shadow-brand-glow` | `0 0 12px --brand-accent` | the small live dot |
| `shadow-lip`, `-lip-lg`, `shadow-ink-lip`, `-ink-lip-lg`, `shadow-brand-lip`, `shadow-muted-lip`, `shadow-raised-lip` | inset bottom bands | pre-slab keycap lips; never on a `Button` |

- **`shadow-float` and `shadow-modal` carry a 1px `--border` ring**, so they already read as an edge: they need no `border` class.
- Float, modal, halo and lip sit in `@theme inline`, so inside a `data-theme="light"` island they re-read the light values.
- Never add `shadow-*` to a `Button`: the `keycap-slab` utility draws its lip as an inset `box-shadow`, and a call-site shadow fights it. Tailwind's `shadow-sm` / `-md` / `-lg` are off this system.

```tsx
// Correct (components/home/home-prompt.tsx:399)
<div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-float">
// Incorrect: a stock shadow that ignores the theme, plus a border shadow-float already draws
<div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg">
```

## Floating panels: `POPUP_PANEL_CLASS`

`lib/filled-control.ts` owns every floating list (select, menu, popover); `components/ui/popover.tsx` and `dropdown-menu.parts.tsx` read it.

```ts
POPUP_PANEL_CLASS = "popup-motion rounded-panel bg-popover text-popover-foreground shadow-panel ring-1 ring-inset ring-border outline-hidden"
POPUP_COMPACT_MENU_CLASS = "rounded-xl bg-muted"   // a small action menu (tile menus)
POPUP_FLOAT_CLASS = "shadow-float"                 // a panel floating over page content
MENU_ITEM_CLASS = "flex min-h-9 ... rounded-xl px-3 py-2 text-sm ... hover:bg-muted data-highlighted:bg-muted ..."
```

`popup-motion` scales from 0.96 and slides 4px from its side on `--motion-duration-enter` / `--motion-ease-out`. Below 768px the shared popups carry `phone-sheet` and become bottom sheets: full width, `--radius-sheet` top corners, `--layer-1` face, `--layer-scrim` behind, 44px rows.

## Phone sheet layers

`--layer-1..4` are the surface ladder for phone sheets and screens (`components/ui/bottom-sheet.tsx`), one step lighter per layer on dark.

| Layer | Dark | Light | For |
|---|---|---|---|
| `bg-layer-1` | `#141414` | `#FFFFFF` | the sheet face |
| `bg-layer-2` | `#1C1C1C` | `#F5F5F5` | rows and cards on it, pressed state |
| `bg-layer-3` | `#262626` | `#EAEAEA` | icon discs and chips on a row |
| `bg-layer-4` | `#303030` | `#D4D4D4` | the 38x5 drag handle |

Lines: `border-layer-line` (white/0.08 dark, `--border` light), `border-layer-line-strong` (sheet top edge). Dim text: `text-layer-dim`. Scrim: `bg-layer-scrim` (black/0.6 dark, `--drawer-overlay` light).

## Z-index

Tokens in `semantic.css`, used as `z-(--sl-z-modal)`. `z-40` and `z-50` in older code equal `--sl-z-sticky` and `--sl-z-dropdown`. Small values (`z-1` to `z-10`) stack parts inside one component. `--sl-z-surface` is a full-screen surface: over the page and its sticky bars, under every popup.

```
├── --sl-z-base 0       ├── --sl-z-modal 70
├── --sl-z-sticky 40    ├── --sl-z-toast 80
├── --sl-z-surface 45   ├── --sl-z-ink 85
├── --sl-z-dropdown 50  ├── --sl-z-pointer 90
├── --sl-z-sheet 60     └── --sl-z-tooltip 95
```

```tsx
// Correct (components/microdrama/make/full-view.tsx:147)
className="fixed inset-0 z-(--sl-z-surface) isolate flex ..."
// Incorrect: an arbitrary layer that drifts from the ladder
className="fixed inset-0 z-[45] isolate flex ..."
```

## Sizing tokens

| Token | Value | For |
|---|---|---|
| `--nav-h` | 61px (on `body`) | the navbar height; `h-screen-minus-nav`, `min-h-screen-minus-nav`, `min-h-screen-peek` subtract it |
| `--sl-tabbar-h` | 61px | the phone tab bar (`--sl-nav-h` is the same 61px) |
| `--shell-gutter` | 0, or `calc(50% - 960px)` from 1920px | content stops at 1920px, centred |
| `--sl-home-wrap` | 1504px | `max-w-home`, Explore's column |
| `--sl-jam-tray-w`, `--sl-jam-modal-w` | 440px, 600px | `w-jam-tray`, `w-jam-modal` |

## Anything that cuts blurs

Where content scrolls under something pinned (a sticky tab bar, a page header, a form's footer, a docked composer), it never meets a hard edge. Use `GradualBlur` (`components/ui/gradual-blur.tsx`) with a preset from `lib/card-interaction.ts`, never a one-off, so every cut looks the same.

```
├── under a sticky bar at the top ... TAB_BAR_BLUR, position="top", className="top-full h-8", shown once scrolled
├── over anything pinned at the foot  COMPOSER_BLUR (tintClassName for a card's grey)
└── a column scrolling inside a page  scroll-fade-y (theme.css): 3rem fade at the foot, 1.5rem at the top once scrolled
```

- `TAB_BAR_BLUR`: `strength: 1`, `tint: "page"`, `tintOpacity: 1`, ease-in ramp. `COMPOSER_BLUR`: `strength: 2`, `tint: "page"`, ramp `"transparent, black 80%"`.
- With 3 layers the blur radii are 0.125 / 0.1875 / 0.25rem times `strength`. `tint="scrim"` is black in both themes for bands over pictures; text on it is `text-on-blur`.
- Show or hide it with `layerClassName`, never opacity on a wrapper: a faded wrapper cuts the blur off from what is behind it.
- No flat translucent strips, no hard lines, no `bg-background/80 backdrop-blur` bars.

```tsx
// Correct (components/ai-influencer/maker.tsx:284)
<GradualBlur {...TAB_BAR_BLUR} position="top" className="top-full h-8"
  layerClassName={cn("transition-[opacity,visibility] ...", !scrolled && "invisible opacity-0")} />
// Incorrect: a translucent strip with a hard foot
<div className="sticky top-0 z-20 flex h-14 items-center gap-2 bg-background/90 px-4 backdrop-blur-md lg:hidden">
```
