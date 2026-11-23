# Icons

Read this when you add, swap or size an icon, or when a glyph you need is not in the registry yet.

Every icon is a Hugeicon from `@hugeicons/core-free-icons`, drawn 1.5px wide on screen at every size (`ICON_STROKE` in `components/ui/icon.tsx`, non-scaling). There is no per-icon stroke; where 1.5px reads wrong at a size, use a filled icon, never another stroke width. Colour always comes from `currentColor`.

## Which component

```
Is it a logo or brand mark (Sloosh logo, CreditIcon, model or social logos)?
├── yes → not an icon: draw the mark, never animate it (NOT_ICONS in the registry)
└── no → Is it Hd or AiChat02 (an icon with text inside)?
    ├── yes → FilledIcon at every size, with `motion` from the registry
    └── no → Does it sit inside anything you can hover, press or focus?
        ├── yes → MotionIcon (every new icon lands here)
        └── no → Icon, only for a glyph that never sits in a button, link, row, tab or label
```

`Icon` (`components/ui/icon.tsx`) is the static glyph, sized with a class (`className="size-4"`). It swaps in the filled Hd / AiChat02 and solid stars by itself. Every static icon in the app is already a `MotionIcon`; `Icon` remains only for those filled swaps and for icons picked at runtime from data (`icon={item.icon}`). A new data list that holds icons carries each icon's `name` and `motion` too, so it can render a `MotionIcon`.

## MotionIcon

`components/ui/icon-motion/motion-icon.tsx`

| Prop | Value |
|---|---|
| `icon` | the Hugeicons data, e.g. `LaptopIcon` |
| `name` | the registry `name`: the Hugeicons name without `Icon` (`"Laptop"`) |
| `motion` | the registry entry's `motion`, copied exactly |
| `size` | 14, 16 or 20 (default 20). Always size with this prop: the stroke maths reads it, so a class that renders another size draws the wrong stroke |
| `className` | colour and layout only (`text-muted-foreground`, `shrink-0`) |

How it plays: `IconMotionRuntime`, mounted once in `app/layout.tsx`, listens on the document. An icon plays when its nearest host is hovered with a mouse or pen, pressed, focused from the keyboard, or hit with Enter / Space. A host is `a`, `button`, `label`, `summary`, any `[role=button|tab|radio|switch|checkbox|menuitem|option]`, or an element you mark `data-im-host`. Touch hover never plays. Under reduced motion icons stay still. A running motion finishes; re-hovering does not restart it.

## The registry

`app/design-system-icons/registry.ts` lists every glyph in use (`ICONS`, about 167 entries), and `/design-system-icons` shows each at its sizes. An entry is an `IconEntry`:

| Field | Meaning |
|---|---|
| `name` | Hugeicons name without `Icon`; the `name` prop at call sites |
| `icon` | the imported Hugeicons data |
| `motion` | which motion family plays (table below) |
| `action` | for arrow, turn and context: what moves, in words |
| `sizes` | the `IconSize` values it renders at: `14 \| 16 \| 20` |
| `where` | where it appears, so the next agent finds its siblings |
| `source` | `"dev"` (dev.sloosh.ai) and / or `"explore"` |
| `found` | off-rule sizes seen on dev, to fix toward `sizes` |

## Motion kinds

The `Motion` union in `motion-icon.tsx`, with the rules from `MOTIONS` in the registry:

| `motion` | Use for | What it does |
|---|---|---|
| `draw` | the default, any plain icon | each stroke redraws, part after part, 440ms + 60ms a part; never rotates |
| `arrow-r`, `arrow-l`, `arrow-u`, `arrow-d`, `arrow-ur` | arrows | hover nudges 2.5px the way it points; press flies out and back in from the other side |
| `rotate` | only chevrons that open something | turns 180° while `aria-expanded` or `data-open`; not a hover effect |
| `turn` | refresh, repeat, undo, redo | turns once (refresh 180°, undo −30°, redo +30°) |
| `context` | an object with one obvious action | 0.4 to 0.7s, travel 2.5px or less, ends where it started; a container (circle, square, bubble, frame) stays still and its contents pop, rise or tick in |
| `brand` | logos | nothing; logos are not icons |

```
Picking a motion for a new glyph
├── it is an arrow → the arrow-* that matches its direction
├── it is a chevron that opens a menu, select or accordion → rotate
├── its meaning is going round → turn
├── its object has one obvious action you can say in one sentence → context
└── anything else → draw
```

## Sizes

| Size | Where | Real share |
|---|---|---|
| 20 | alone, and in icon keys `icon-36` / `icon-40`; the phone tab bar | 112 call sites |
| 16 | in a text button, field, row, menu item, and in icon keys `icon-28` / `icon-32` | 230 call sites |
| 14 | small marks beside text: ticks, select chevrons, lock and alert marks, a composer chip's tile | 68 call sites |

Never 12, 18 or 24 for a new icon: they are outside `IconSize` (23 older call sites use them; do not copy them).

## Filled icons and stars

- `FilledIcon` (`components/ui/filled-icons.tsx`) is Sloosh's own solid glyph, traced from the Hugeicon of the same name: `<FilledIcon name="Camera01" size={14} motion="context" />`. Pass `motion` from the registry, or it never plays. `name` must be a key of `FILLED_ICONS` (`components/ui/filled-icons-data.ts`): Video01, Sparkles, MagicWand01, Camera01, Volume02, CreditCard, SquareLock02, Image01, Library, Home07, Mortarboard01, Book02, Route01, FlowConnection, Saturn, Hd, AiChat02.
- At 14px, a glyph with a `FILLED_ICONS` entry is drawn filled, because 1.5px is too heavy for its detail. Line glyphs stay line at 14: chevrons, arrows, plus, minus, close, tick, search.
- Hd and AiChat02 are filled at every size (`FILLED_ALWAYS`): solid box, letters cut out as 1.5px lines.
- Stars and sparkles are solid at 16px and below (`STAR_FILL_MAX`): the star part is a fill, the rest stays line. `Icon` and `MotionIcon` both do this from `STAR_PARTS` in `components/ui/icon-stars.ts`. A new starred glyph gets an entry there.

## One glyph per idea

Link04 (link) · Upload01 / Download01 · AiChemistry02 (Spacelab) · Image01 and ImageAdd01 (no 02s) · PanelLeftOpen (sidebar) · Crown03 · Film02 · Music01 · FlowConnection (every workflow) · GridView (grid, dashboard) · Palette. Socials: Instagram, NewTwitter (X), Youtube. Search `ICONS` for the idea before importing anything new.

## Registering a new glyph

1. Search `ICONS` in `app/design-system-icons/registry.ts` for the idea. If a glyph covers it, use that one.
2. Import the Hugeicon there and add an entry: `name`, `icon`, `motion` (decision tree above), `action` for non-draw motions, `sizes`, `where`, `source`.
3. A `context` motion also needs keyframes in `components/ui/icon-motion/icon-motion.css` under `[data-icon="<name>"]`, and its run length in `RUN` in `motion-icon.tsx` when it is not 560ms. `draw` needs nothing else.
4. A glyph with a star or sparkle: add it to `STAR_PARTS` in `components/ui/icon-stars.ts`.
5. Check it on `/design-system-icons`, then use it at a call site with the same `name` and `motion`.

## Examples

```tsx
// Correct: a registered glyph, its registry motion, 16 in a row (components/spacelab/spacelab-screen.tsx:305)
<MotionIcon icon={LaptopIcon} name="Laptop" motion="draw" size={16} className="shrink-0 text-foreground" />

// Correct: 16 in a text button, 20 in an icon-36 key (components/ui/audio/voice-table.tsx:130-136)
<MotionIcon icon={AddCircleIcon} name="AddCircle" motion="context" size={16} />
<Button variant="ghost" size="icon-36" aria-label="Close">
  <MotionIcon icon={Cancel01Icon} name="Cancel01" motion="draw" size={20} />
</Button>

// Incorrect: a static Icon inside a close key, white at rest
<Icon icon={Cancel01Icon} className="h-5 w-5 text-foreground" />

// Incorrect: motion differs from the registry ("rotate") and 12 is not an IconSize
// (components/studio/audio/audio-intro-dialog.tsx:133)
<MotionIcon icon={ArrowDown01Icon} name="ArrowDown01" motion="context" size={12} />
```
