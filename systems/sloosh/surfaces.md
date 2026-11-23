# Surfaces: containers and overlays

Read this when you open anything over the page (dialog, sheet, menu, popover, tooltip, banner) or box content in place.

All files are in `components/ui/`. Every overlay is Base UI. Never hand-build a floating panel: you lose focus trap, Escape, `popup-motion` and the phone sheet.

## Which overlay

```
Must the user finish or answer something (a form, steps, a confirm)?
  yes -> Modal (default export of dialog.tsx)
         already inside a dialog? -> swap your body in place, never a dialog on a dialog
Reference content beside the page on desktop (Studio's About)?      -> Sheet side="right"
A phone-only surface you open yourself (Camera setup, nav sheets)?  -> BottomSheet
A list of actions, or one pick from a short list, off a trigger?     -> Dropdown
Interactive content anchored to a trigger (search, filters, picker)? -> Popover
One line that names or explains a control, nothing to press?        -> Tooltip
A problem on this screen the user can act on?                       -> Notice
```

Popover, Dropdown and Select carry `phone-sheet`, so below 768px they become bottom sheets by themselves (`styles/theme.css`). Don't wrap them in a BottomSheet.

## Floating panel recipe

`POPUP_PANEL_CLASS` (`lib/filled-control.ts`): `popup-motion rounded-panel bg-popover text-popover-foreground shadow-panel ring-1 ring-inset ring-border outline-hidden`. Popover, Dropdown and Select already apply it. Use the constant directly only for a positioned panel that isn't a Base UI popup (`prompt-tile.tsx:369`).

| Add on top | When | Real use |
|---|---|---|
| `POPUP_COMPACT_MENU_CLASS` (`rounded-xl bg-muted`) | a card's small ⋯ menu | `template-card.tsx:232` |
| `POPUP_FLOAT_CLASS` (`shadow-float`) | a panel floating over page content | `spaces/list/spaces-filter-panel.tsx:104` |
| `MENU_ITEM_CLASS` | a hand-built row inside a panel: 36 tall, `rounded-xl` (20 panel minus `p-2`, so curves stay concentric), `bg-muted` highlight | `dropdown-menu.parts.tsx` |

## Modal (`dialog.tsx`, default export)

1. Every dialog. It is a centred dialog at 1024px and up and a drag-down drawer below, from one call. Not for menus (Dropdown) or side panels (Sheet).
2. Props: `trigger` or `open` + `onOpenChange` (both together, or it can't close), `title`, `description` (both sr-only), `popupClassName`, `sheetPopupClassName`, `layerClassName`, `backdropClassName`, `closeIconPosition` `"left" | "right"`, `showCloseButton`, `closeClassName`, `initialFocus`, `theme` `"dark" | "light"`. Nothing else exists.
3. Defaults: 514px wide, `max-h-[85vh]`, `rounded-2xl bg-card`, ✕ on the right, `z-50`. Raise `layerClassName` only over a full-screen surface. `theme="dark"` only for a dialog built on dark art.
4. Examples:
```tsx
// Correct: components/ui/audio/clone-voice-dialog.tsx:158
<Modal open={open} onOpenChange={onOpenChange} title={title} description="Upload clips or record yourself" popupClassName="max-w-xl" layerClassName={layerClassName}>
// Incorrect: a second Modal opened from inside a dialog. Swap CloneVoicePanel into the host's body instead.
<Modal open={cloneOpen} onOpenChange={setCloneOpen}><CloneVoicePanel /></Modal>
```

**Stepped dialogs copy Add my voice** (`components/ui/audio/clone-voice-dialog.tsx`), because a dialog that changes height between steps jumps. Body: `flex h-[min(28rem,85dvh)] flex-col gap-5 p-6` (line 285), for every step. Heading at the top in `text-text-20` with a ghost Back arrow once there is a step behind. The step fills the middle (`flex min-h-0 flex-1`). One full-width `Button variant="primary" size="48"` pinned at the foot (line 359), shown only once it can be used. An upload step shows `UploadTile size="lg"` first; tips go under it as one small strip. `components/microdrama/make/look-upload.tsx` follows it.

The compositional parts (`Dialog`, `DialogContent` with `landscape`, `hideDefaultClose`, `overlayClassName`, `container`; `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`) have one user, `components/jam/jam-modal.tsx`. They don't switch to a drawer on phones, so use them only when you own the phone layout.

## Sheet (`sheet.tsx`)

1. A desktop side panel of reference content the page stays behind. On phones use BottomSheet.
2. `SheetContent side`: `"top" | "bottom" | "left" | "right"`. Nothing else exists.
3. Default `"right"`, 3/4 width up to `sm:max-w-sm`, built-in ✕, strong overlay. Only `"right"` is used.
4. Examples:
```tsx
// Correct: components/studio/studio-about.tsx:30
<SheetContent side="right" className="flex w-full flex-col gap-6 overflow-y-auto sm:max-w-md">
// Incorrect: a Sheet as a phone picker. It has no drag or handle; use BottomSheet.
<SheetContent side="bottom">{ratioOptions}</SheetContent>
```

## BottomSheet (`bottom-sheet.tsx`)

1. A phone surface you open yourself: drag-to-dismiss, 60% scrim, 38x5 handle. Dialogs on phones are already drawers (Modal); menus already sheets (`phone-sheet`).
2. Props: `open`, `onOpenChange`, `title` (required), `description`, `showTitle`, `onBack`, `footer`, `className`, `bodyClassName`, `overlayClassName`, `dismissible`, `modal` `true | "trap-focus"`. Rows: `SHEET_ROW`, `SHEET_ROW_ICON`. Nothing else exists.
3. Defaults: handle only (title sr-only), dismissible, modal. A release past 110px or faster than 0.6px/ms closes it (`lib/sheet-drag.ts`). `dismissible={false}` only for a sheet that needs an answer. `"trap-focus"` drops the scrim and keeps the page usable.
4. Examples:
```tsx
// Correct: components/shell/mobile-nav-sheet.tsx:178
<BottomSheet open={open} onOpenChange={onOpenChange} title={title} showTitle bodyClassName="px-2 pb-2">
// Incorrect: a BottomSheet around a Dropdown on phones. Dropdown already turns into a sheet below 768px.
<BottomSheet open={open} onOpenChange={setOpen} title="Sort"><Dropdown.Root>…</Dropdown.Root></BottomSheet>
```

## Popover (`popover.tsx`)

1. Interactive content tied to a trigger: a search list, a filter panel, a picker. For a plain list of actions use Dropdown.
2. `Popover.Content` takes `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding`, `container`, `positionerClassName`, `positionerProps`. Parts: Root, Trigger, Portal, Positioner, Popup, Content, Close, Arrow, Title, Description. Nothing else exists.
3. Defaults: `side="bottom"`, `align="center"`, `sideOffset={4}`, `w-72 p-4`. Lists opened from a form float beside it: `side="right"`, `sideOffset` 28, `collisionPadding={16}`.
4. Examples:
```tsx
// Correct: components/ui/form-tile.tsx:531
<Popover.Content side="right" align="start" sideOffset={sideOffset} collisionPadding={16} className="flex w-60 flex-col gap-1 p-2">
// Incorrect: a hand-rolled panel with no focus handling or popup-motion
<div role="dialog" className="… rounded-2xl bg-popover p-3 shadow-panel ring-1 ring-border animate-enter-up">
```

## Dropdown (`dropdown-menu.tsx`, parts in `dropdown-menu.parts.tsx`)

1. A menu of actions or one radio pick from a trigger. Searchable or rich content goes in a Popover; a form value goes in a Select.
2. `Dropdown.Item variant`: `"default" | "destructive"`, plus `icon` and `unstyled`. Parts: Root, Trigger, Content, Item, LinkItem, Group, GroupLabel, Label, RadioGroup, RadioItem, CheckboxItem, SubmenuRoot, SubmenuTrigger, SubContent, Separator, Shortcut. Nothing else exists.
3. Defaults: `align="start"`, `sideOffset={4}`, `min-w-32 p-2`, scrolls past the available height. `destructive` only for delete or remove, after a `Dropdown.Separator`. A pick shows as a tick or dot, never a fill.
4. Examples:
```tsx
// Correct: components/ui/audio/voice-aura-card.tsx:256
<Dropdown.Separator />
<Dropdown.Item variant="destructive" onClick={onDelete}>
// Incorrect: red classes by hand instead of the variant
<Dropdown.Item className="text-destructive" onClick={onDelete}>
```

## Toolbar menus (`toolbar-menus.tsx`)

1. A grid toolbar's 36px icon keys that open radio menus (Assets, Studio's My Generations). For a single choice in a form use Select.
2. `MenuButton` (`label`, `icon`), `FilterMenu` (`count`, `label`), `RadioSection` (`label`, `value`, `onChange`, `options`), `KeyCount`, `TOOLBAR_KEY_CLASS`. Nothing else exists.
3. Views (Layout, Group) go in `MenuButton`; filters in `FilterMenu`, which shows a yellow count of what's applied. Both open `align="end"`, `w-56`.
4. Examples:
```tsx
// Correct: components/assets/assets-screen.tsx:410
<MenuButton label="Layout and grouping" icon={<MotionIcon icon={GridViewIcon} name="GridView" motion="context" size={18} />}>
// Incorrect: a key built from scratch next to them. Use TOOLBAR_KEY_CLASS so the row keeps one weight.
<Dropdown.Trigger className="size-9 rounded-lg bg-card">
```

## Tooltip (`tooltip.tsx`)

1. One short line naming an icon key or saying why a control is disabled. Anything with a link or a button is a Popover. Phones have no hover, so never put required information only in a tooltip.
2. `Tooltip`: `delay`, `grouped`. `TooltipContent`: `side`, `align`, `sideOffset`, `variant` `"default" | "paper"`, `showArrow`, `positionerClassName`. Nothing else exists.
3. Defaults: instant (`delay={0}`), `side="top"`, arrow on, up to 384px wide. `paper` (white in both themes) only over media or a coloured ground. `grouped` for a row of neighbouring keys, inside one `TooltipProvider`. Put z-index on `positionerClassName`.
4. Examples:
```tsx
// Correct: components/assets/asset-preview.tsx:539, tips over the full-screen picture
<TooltipContent side={side} variant="paper" positionerClassName={OVER}>
// Incorrect: the native title attribute, which skips the design and never shows on touch
<button title="Remove" aria-label="Remove">
```

## Notice (`notice.tsx`)

1. A banner over content: something on this screen needs you. Not for confirmations of what you just did (toast, `feedback-and-loading.md`).
2. `tone`: `"warning" | "danger"`, plus `title`, `line`, `children` (actions). Nothing else exists.
3. No default tone. `warning` (yellow) for a change you can act on or leave; `danger` (red) for something that stopped. One line at 14px that wraps and is never cut; actions at the far end, the main one last.
4. Examples:
```tsx
// Correct: components/microdrama/make/stage-episodes.tsx:422
<Notice tone="danger" title={…banner.failed(n)} line={…banner.failedLine}><ClipButton … /></Notice>
// Incorrect: a one-off grey box for a reason inside a view. Reuse Notice.
<div className="rounded-lg bg-muted p-3 text-sm">This clip failed. Try again.</div>
```

## Small primitives

| Component | Use | Not |
|---|---|---|
| `Card` (`card.tsx`) | A generic bordered text box (`rounded-xl border bg-card`) with Header, Title, Description, Content, Footer. No product screen uses it. | Picture cards: `media-and-cards.md`. |
| `Accordion` (`accordion.tsx`) | FAQs and stacked details. `type` `"single"` (default) or `"multiple"`; `icon` replaces the chevron. Real: `components/home-story/home-story.tsx:619`. | One panel that opens in place: `Collapse`. |
| `Collapse` (`collapse.tsx`) | One part that opens and shuts in place, its box easing to the new height (`open`, `className`). Real: `components/ui/prompt-composer.tsx:127`. | A list of sections: `Accordion`. |
| `ScrollArea`, `ScrollBar` (`scroll-area.tsx`) | A fixed box that scrolls with a thin themed bar. No product screen uses it; most scrollers are native `overflow-auto`. | Horizontal rows: `media-and-cards.md`. |
| `Separator` (`separator.tsx`) | A 1px `bg-border` line, `orientation` `"horizontal"` (default) or `"vertical"`. Inside a menu use `Dropdown.Separator`. | A hand-drawn `div className="h-px bg-border"` (`prototype-picker.tsx:118`). |
