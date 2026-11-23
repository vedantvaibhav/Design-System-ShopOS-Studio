# Buttons

Read this when you add or change a button, an icon button, or a link that looks like a button.

## Button and buttonVariants

Files: `components/ui/button.tsx` (the client `Button`, on Base UI) and `components/ui/button-variants.ts` (`buttonVariants`, a server-safe `cva`). Server Components import `buttonVariants` from `button-variants.ts`, because importing it through `button.tsx` turns it into a client reference and crashes the server caller.

### When to use it

- Use `Button` for every pressable action.
- Use `buttonVariants({ variant, size })` on a `next/link` `Link` (or an `<a>`, or a visual-only span) for navigation, so the link keeps native behaviour (new tab, prefetch).
- Use `ComposerGenerateButton` (`components/ui/prompt-composer.tsx:533`) for a composer's Generate, not a hand-sized primary.
- Use `PILL_CLASS`, `TabFilters`, `ChoicePill` or `ComposerChip` for pills and chips, not a small Button (see `pills-and-tags.md`).

### Variants

From `button-variants.ts:88-108`:

| variant | Look | Use it for |
|---|---|---|
| `primary` | Yellow slab | The one main action of a view. Every yellow CTA. |
| `default` | White slab (`--primary`) | A strong non-yellow action: Retry and Clone on an audio card (`audio-clip-card.tsx:294`), a banner CTA (`home/spacelab-banner.tsx:146`). |
| `secondary` | Grey slab (`bg-muted`) | Every other action, including Cancel beside a primary. |
| `outline` | Yellow 1px edge, `brand-accent-label` label (ink on light), no face | A yellow-weight action that is not the main one (`microdrama/carousel-tile.tsx:260`). |
| `ghost` | No face, no lip; muted label, foreground on hover, keyboard focus and while its menu is open | Quiet text actions (Clear all, Reset) and icon keys on the ground. |
| `ghost-fill` | Ghost plus the muted face on hover and while its menu is open | Navbar icon keys (`ui/offers.tsx:285`, `shell/sloosh-navbar.tsx:347`). |
| `tinted` | Yellow wash face, yellow label | Exists; no call site uses it. |
| `ink` | Black slab | A key on a yellow ground (`ui/offers.tsx:124`). |
| `silver` | Chrome slab | Only the AI Film Award's main action and Black Friday sale CTAs, in place of yellow (`pricing/sale-banner.tsx:45`). |
| `destructive` | Red slab | The confirm key of a delete dialog (`settings/cap-dialog.tsx:250`). |
| `destructive-subtle` | Red wash, red glyph | A delete icon key beside secondary keys (`spaces/micro-dramas/episode-panel.tsx:503`). |
| `destructive-outline` | Red edge and label | A destructive row action in Settings: Logout (`settings/profile-screen.tsx:69`). |
| `link` | Text, underline on hover | Exists; no call site uses it. |

Aliases, never written in new code: `brand` = `primary`, `muted-raised` = `secondary`, `raised` = `default`. Nothing else exists.

### Sizes

From `button-variants.ts:110-134`: `24`, `28`, `32`, `36`, `40`, `48`, `56`, and the square `icon-24`, `icon-28`, `icon-32`, `icon-36`, `icon-40`, `icon-48`, `icon-56`. Aliases, never written in new code: `xs` = 24, `sm` = 32, `default` = 36, `lg` = 40, `icon-xs` = icon-24, `icon-sm` = icon-28, `icon` = icon-36. Nothing else exists.

| Size | Height | Corner | Lip | Label |
|---|---|---|---|---|
| 24 | 24 | 8 | 2 | 12 semibold caps |
| 28 / 32 | 28 / 32 | 8 | 2 / 3 | 14 semibold |
| 36 | 36 | 10 | 3 | 14 semibold |
| 40 / 48 | 40 / 48 | 12 | 3 / 4 | 16 semibold |
| 56 | 56 | 14 | 4 | 20 semibold; a big banner's hero CTA, one per view |

Icon sizes are square with no lip; the glyph is 16 at `icon-24`, 20 from `icon-28` to `icon-48`, 24 at `icon-56`.

Other props (`button.tsx:17-28`): `isLoading` holds the key flush and takes no clicks (pass the busy label as children; no spinner). For a key whose job runs a while, use `disabled` with `Busy` inside (`components/ui/spinner.tsx`, rule 24); `isDone` sweeps the glint once and bursts rays; `data-glint="idle"` repeats the glint every 4s (hero Generate only).

### Default

`<Button>` with no props is `variant="default"` and `size="default"`: the white keycap at 36 (`button-variants.ts:136-139`). Always pass `variant` and a numeric `size`, because the bare default is white, not yellow, and `default` is an alias.

### The keycap-slab rule

Never add `shadow-*`, `transition-*`, `active:*`, `translate-*` or `opacity-*` to a `Button` or a `buttonVariants` call. The slab (`keycap-slab`, `styles/theme.css:845`) draws its lip as an inset `box-shadow` and lifts by animating `padding-bottom`, so a shadow class erases the lip and a transition class kills the lift. Hover, press, loading, disabled and focus are built in. Layout classes (`w-full`, `flex-1`, `shrink-0`, margins, `group`) are fine.

### Order in a group

The primary goes last (rightmost) in any button group, with one primary per view. Why: the eye and the Tab order both end on the action that commits. Secondary, ghost and Cancel come before it.

### Icon-only buttons

An icon button is `size="icon-*"` plus an `aria-label`, its glyph a `MotionIcon` with its registry name and motion. On the ground use `ghost` or `ghost-fill`: the glyph is `text-muted-foreground` at rest and `text-foreground` only on hover, keyboard focus, current page or open menu (DS rule 11). Both variants carry these states (`GHOST` and `GHOST_FILL` in `button-variants.ts`); `ghost-fill` also shows the muted face on hover and while open. Never add `text-foreground` to either. Filled keys (`secondary`, `primary`, `destructive-subtle`) and keys on media keep their own colours.

### Examples

```tsx
// Correct: ghost before primary, primary last (components/ui/facet-filter.tsx:126-131)
<Button type="button" variant="ghost" size="36" onClick={() => setDraft({})}>Clear all</Button>
<Button type="button" variant="primary" size="36" onClick={apply}>Apply ({count(draft)})</Button>

// Correct: a link styled as a key (components/home/upgrade-showcase.tsx:83-86)
<Link href={UPGRADE.cta.href} className={cn(buttonVariants({ variant: "primary", size: "48" }), "mt-8")}>

// Correct: an icon key on the ground (components/shell/sloosh-navbar.tsx:346-352)
<Button variant="ghost-fill" size="icon-32" aria-label="Notifications">
  <MotionIcon icon={Notification01Icon} name="Notification01" motion="context" size={16} className="size-4" />
</Button>

// Incorrect: a shadow on the slab erases its lip
<Button variant="secondary" size="icon-32" className="absolute right-3 bottom-3 z-10 shadow-float">

// Incorrect: a white glyph at rest breaks rule 11, and Icon does not animate
<Button variant="ghost" size="icon-28" className="text-foreground hover:bg-accent"><Icon icon={MinusSignIcon} /></Button>

// Incorrect: an alias size
<Button variant="outline" size="icon" aria-label="Settings" />  // write size="icon-36"
```

### Decision tree: which variant

1. Does it delete or destroy?
   - The confirm key in a delete dialog: `destructive`.
   - An icon key beside grey keys: `destructive-subtle`.
   - A row action in Settings (Logout): `destructive-outline`.
2. Is it the one main action of the view?
   - On a yellow ground (`data-ground="yellow"`): `ink`.
   - On the AI Film Award page or a Black Friday sale CTA: `silver`.
   - Anywhere else: `primary`.
3. Is it icon-only on the ground? `ghost` (`ghost-fill` when it opens a menu or sits in the navbar), with an `icon-*` size.
4. Is it a quiet text action in a toolbar or header (Clear all, Reset)? `ghost`.
5. Does it need more weight than grey but must not be yellow (Retry, a banner CTA on a dark picture)? `default`.
6. A second yellow-weight action next to content? `outline`.
7. Everything else, Cancel included: `secondary`.

Size: 36 is the standard CTA (`DESIGN_SYSTEM.md` classes table), 48 full-width at a stepped dialog's foot (DS rule 18), 56 only for a big banner's hero CTA, one per view (`button-variants.ts:17-18`).
