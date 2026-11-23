# Colours

Read this when you pick any background, text, border or ring colour, work on light / dark, or recreate the Sloosh palette in another codebase.

## Two layers

1. **Primitives** (`styles/tokens/primitives.css`): raw ramps as HSL triples (`--neutral-900: 0 0% 9%`), not full colours, so a role can add alpha where it is used. Ramps: `neutral`, `creative-gen-accent` (the Sloosh yellow), `yellow` (Tailwind's status yellow, a different colour), `red`, `amber`, `emerald`, `green`, `blue`, `violet`, `indigo`, one `slate-700`.
2. **Semantic roles** (`styles/tokens/semantic.css`): what a colour is for (`--card: var(--neutral-900)`). `styles/theme.css` maps each role to a Tailwind colour: `--color-card: hsl(var(--card))` gives `bg-card`, `text-card`, `border-card`, `ring-card`.

**The rule:** screens use semantic classes only. Never hex, `rgb()`, `hsl()`, raw palette classes (`text-white`, `bg-black/40`, `bg-neutral-800`, `text-yellow-400`) or arbitrary colour values, because only roles follow the theme, islands and grounds. Alpha on a role is fine: `bg-muted/60`, `bg-media-scrim/40`.

```tsx
// Correct (components/ui/asset-picker.tsx:581)
<span className="... rounded-full bg-media-scrim/70 px-2 text-caption leading-4.5 text-on-media">
// Incorrect: the same badge with raw palette classes
<span className="... rounded-full bg-black/70 px-2 text-caption leading-4.5 text-white">
```

## Semantic roles and their classes

| Role | Class | Use |
|---|---|---|
| Page ground | `bg-background` | already on `<html>`; also the "page colour" wash |
| Card surface | `bg-card` + `text-card-foreground` | cards, dialogs, panels |
| Floating surface | `bg-popover` + `text-popover-foreground` | menus, popovers, selects, tooltips |
| Filled control, its hover | `bg-muted`, `hover:bg-accent` | inputs, chips, the active nav pill, menu-item highlight |
| Keycap faces | `bg-primary`, `bg-secondary`, `bg-ink` (+ `-foreground`) | Button `default`, `secondary`, `ink` own them |
| Raised key on a muted tile | `bg-key-face`, `hover:bg-key-face-hover` | stepper `-` / `+`, upload discs |
| Disabled | `bg-surface-disabled`, `text-disabled-foreground`, `border-disabled-border` | |
| Text: body, secondary, tertiary | `text-foreground`, `text-foreground-subtle`, `text-muted-foreground` | tertiary: captions, idle links, placeholders, icons at rest |
| Hairline, hover / selected edge | `border-border`, `border-border-strong` | strong is also the focused field's inset ring |
| Focus outline | `outline-ring` / `ring-ring` | `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` |
| Yellow fill | `bg-brand-accent` + `text-brand-accent-foreground` | via Button `variant="primary"` only |
| Yellow text, icon, ring on the ground | `text-brand-accent-text`, `ring-brand-accent-text` | see the yellow rule |
| Yellow at label size (12 to 16px: a count, a credit figure, a picked tab's label) | `text-brand-accent-label` | yellow on dark, ink on light and on yellow grounds |
| The hairline inside a picture card's frame | `outline-image-edge`, `ring-image-edge` | white 10% on dark, black 10% on light |
| Yellow wash | `bg-brand-accent-subtle` (hover `-subtle-hover`) | selected item, tinted button |
| A pick: pill, ring, required `*` | `bg-picked-pill` + `text-picked-pill-foreground`, `ring-picked-ring`, `text-picked-ring` | ink text and deeper gold on light |
| Text over a picture; on a blur band | `text-on-media`, `text-on-media-muted`; `text-on-blur`, `text-on-blur-muted` | same in both themes, because the picture does not change |
| Dark over a picture | `bg-media-scrim/<alpha>` | pure black, always with alpha |
| Phone sheets | `bg-layer-1..4`, `border-layer-line`, `text-layer-dim`, `bg-layer-scrim` | see shape-and-elevation.md |
| Contrasting card | `bg-ground`, `bg-ground-panel`, `bg-ground-chip`, `border-ground-line`, `text-ground-faint`, `text-ground-mark` | see Grounds |
| Paper (ticket) | `bg-paper`, `text-paper-foreground`, `text-paper-muted`, `border-paper-line`, `bg-paper-tag`, `ring-paper-edge` | light in both themes |
| Model logo tile | `bg-model-badge` + `text-model-badge-foreground` | light in both themes |
| Avatar disc | `bg-avatar-<tone>` + `text-avatar-<tone>-foreground` | tones: blue, emerald, amber, violet, red, indigo |

## Which background

```
├── the page ........................ bg-background
├── a card, dialog, panel ........... bg-card
├── a menu, popover, select, tooltip  bg-popover (use POPUP_PANEL_CLASS)
├── a filled control or chip ........ bg-muted, hover bg-accent
├── a key on a muted tile ........... bg-key-face
├── a phone sheet ................... bg-layer-1; rows bg-layer-2; controls bg-layer-3
├── a card on a contrasting colour .. data-ground / data-theme, then bg-ground
├── a loading placeholder ........... Skeleton (components/ui/skeleton.tsx), never a hand-made grey
└── over a photo or video ........... bg-media-scrim/<alpha>
```

## Which text colour

```
├── over a photo or video ........... text-on-media; secondary text-on-media-muted
├── on the yellow fill .............. text-brand-accent-foreground
├── a title or line that must read .. text-foreground
├── secondary ....................... text-foreground-subtle
├── captions, hints, idle icons ..... text-muted-foreground
├── disabled ........................ text-disabled-foreground
├── error ........................... text-destructive (on a wash: text-destructive-subtle-foreground)
├── a yellow display title .......... text-brand-accent-text (20px and up on light)
└── a yellow label, 12 to 16px ...... text-brand-accent-label (turns ink on light)
```

## Which border or ring

```
├── a hairline edge or separator .... border-border (or ring-1 ring-inset ring-border)
├── hover or selected edge .......... border-border-strong
├── focus on a field ................ focus-visible:ring-1 ring-inset ring-border-strong (FILLED_FOCUS_CLASS)
├── focus on anything else .......... focus-visible:outline-2 outline-offset-2 outline-ring
├── error ........................... border-destructive (fields: aria-invalid does it)
├── phone sheet hairline ............ border-layer-line
├── inside a data-ground card ....... border-ground-line
└── a picked card or option ......... ring-2 ring-picked-ring
```

On light, `--border` and `--border-strong` are both `#D4D4D4`, so a hover edge on light shows no change; pair it with a fill change.

## Text or scrim over a photo or video

```
├── a badge or pill on a picture .... bg-media-scrim/60 or /70 + text-on-media
├── a title band at a card's foot ... CardFade (components/ui/card-fade.tsx), text-on-blur
├── a full-card hover dim ........... bg-media-scrim/55
└── a fade at an edge ............... GradualBlur tint="scrim", never a gradient fill
```

```tsx
// Correct (components/ui/pill.tsx:165)
onMedia ? "bg-media-scrim/60 text-on-media backdrop-blur-xs" : STATUS_TONE[tone]
// Incorrect: page tokens on a picture turn to black-on-white in light
"bg-background/60 text-foreground"
```

## The yellow rule

- **Fills** (`bg-brand-accent`, `#FECC15`) are the same in both themes. A yellow call to action is always `<Button variant="primary">` or `buttonVariants({ variant: "primary" })`, never a hand-made yellow box, because the keycap owns the lip, hover and glint.
- **Yellow text, icons, rings and lines on the ground** use `*-brand-accent-text`. It is the same `#FECC15` in both themes, which is about 1.5:1 on white. On light it is for display-size titles (`text-display-20` and up) and accents only, never body, captions, labels, prices or links.
- **Yellow at label size** (a count, a credit figure, the outline key's label, a picked tab's label) is `text-brand-accent-label`: the yellow on dark, `--neutral-950` on light and on yellow grounds. Why: it keeps the brand on dark and stays readable on white without a second rule at each call site.
- Small text that needs the brand goes in a fill: `bg-picked-pill text-picked-pill-foreground` (ink text on light).
- On `data-ground="yellow"`, `--brand-accent-text` turns `--neutral-950` by itself, because yellow cannot sit on yellow.
- `--yellow-*` and `bg-status-yellow` are Tailwind's status yellow, never the brand.

```tsx
// Correct (components/spaces/space-page/showcase/showcase-templates.tsx:75)
<MotionTitle as="p" className="text-display-24 text-brand-accent-text">
// Correct (components/ui/pill.tsx, CREDIT_PILL_CLASS): 12px yellow on dark, ink on light
"... bg-brand-accent-subtle px-3 text-caption tabular-nums text-brand-accent-label"
// Incorrect: 12px yellow text through the display token, 1.5:1 on light
<span className="text-caption text-brand-accent-text">{n}</span>
```

## Light and dark

- One switch: `data-theme` on `<html>`. `:root` and `[data-theme="dark"]` hold dark (the default); `:root[data-theme="light"]` and `[data-theme="light"]` hold light. `lib/theme.ts` sets it, keeps the `dark` class in step for `dark:` variants, sets `color-scheme` and stores the choice in `localStorage` under `sl-theme`. Light values live in `semantic.css` "LIGHT THEME" block 1; block 2 ("Light page only") holds `--critter-line` alone. `THEME_SCRIPT` runs in `<head>` (`app/layout.tsx`) so a light visit never flashes dark.
- From React: `useTheme()` (`hooks/use-theme.ts`) returns `[theme, setTheme]`; `useDarkOnly()` holds a page dark while it is open; the switch is `ThemeToggle` (`components/ui/theme-toggle.tsx`).
- **Islands:** `data-theme="dark"` or `"light"` on an element keeps it in that theme whatever the page is (`components/home/news-banner.tsx:86` is a dark island, `components/home/home-b.tsx:165` a light one). A popup portaled under `<body>` leaves the island and takes the page theme. On the light page, `data-band="light"` turns a white band light grey so its edges show.
- **Theme-independent** (no light override): `--on-media*`, `--media-scrim`, `--blur-scrim`, `--on-blur*`, `--brand-accent`, `--brand-accent-foreground`, `--brand-accent-edge`, `--brand-accent-text`, `--ink*`, `--savings*`, `--agents-*`, `--switch-thumb`, `--keycap-shine`, `--model-badge*`, `--avatar-*`, `--app-tile-*`, `--toast` (the card stays white).

## Grounds

A card or band on a contrasting colour. Tag it, then every token inside (`text-foreground`, `border-border`...) follows that ground. Parts: `bg-ground` (face), `bg-ground-panel` (a box inset in it), `bg-ground-chip` (a control in that box), `border-ground-line` (rules), `text-ground-faint` (struck prices, "not included"), `text-ground-mark` (ticks), `shadow-drop` (the flat 4px band under it, colour `--ground-drop`).

```
├── (none) .................. the page's own values
├── data-theme="light" ...... white card (on dark or light)
├── data-theme="dark" ....... black card on a light page
├── data-ground="yellow" .... the Sloosh yellow
└── data-ground="ink" ....... black, inside a yellow ground
```

```tsx
// Correct (components/offers/pricing-offers.tsx:139)
<section data-ground="yellow" className={cn(SLIDE_CLASS, "bg-ground text-foreground", className)}>
// Incorrect: a raw yellow face; the text, borders and titles inside stay dark-theme
<section className="bg-brand-accent text-brand-accent-foreground">
```

## Status colours

Each status has a wash, a foreground and a border: `bg-success` / `text-success-foreground` / `border-success-border`, the same for `warning`, `info`, `violet` and `status-yellow`. `--destructive` is a solid red fill (`bg-destructive text-destructive-foreground`); its wash is `bg-destructive-subtle text-destructive-subtle-foreground`; error text is `text-destructive`. Dark washes are the ramp's 950 with 400 text; light washes are its 50 with 700 text. For a status chip use `StatusPill tone=` (`components/ui/pill.tsx`). Never use the wash as text: `text-success` is `#022C22` on dark.

```tsx
// Correct (components/ui/pill.tsx:134, StatusPill tone="success")
success: "bg-success text-success-foreground",
// Incorrect: the wash as text, unreadable on dark
"... bg-success/15 px-3 text-caption-strong text-success"
```

## If a colour is missing

1. Add a role to the dark block of `semantic.css`, pointing at a primitive: `--on-media: var(--neutral-0);`. If light differs, add it to "LIGHT THEME" block 1.
2. Add one mapping line to the `@theme inline` block in `theme.css`: `--color-on-media: hsl(var(--on-media));`. A role written as a full colour (alpha built in, commented "Full colour") maps without `hsl()`: `--color-brand-accent-subtle: var(--brand-accent-subtle);`.
3. Use `bg-on-media` / `text-on-media`. Never point a screen at the primitive.

## Core values

Each hex is resolved from the primitive the role points at (`primitives.css`), converted with the standard CSS HSL to sRGB formula and each channel rounded to the nearest integer; every result matches the hex comment in `primitives.css`.

| Token | Dark (primitive) | Dark hex | Light (primitive) | Light hex |
|---|---|---|---|---|
| `--background` | neutral-950 | `#0A0A0A` | neutral-0 | `#FFFFFF` |
| `--foreground` | neutral-50 | `#FAFAFA` | neutral-950 | `#0A0A0A` |
| `--card` | neutral-900 | `#171717` | neutral-100 | `#F5F5F5` |
| `--popover` | neutral-900 | `#171717` | neutral-0 | `#FFFFFF` |
| `--muted` | neutral-800 | `#262626` | neutral-150 | `#EAEAEA` |
| `--muted-foreground` | neutral-400 | `#A3A3A3` | neutral-600 | `#525252` |
| `--accent` | neutral-700 | `#404040` | neutral-300 | `#D4D4D4` |
| `--border` | neutral-800 | `#262626` | neutral-300 | `#D4D4D4` |
| `--border-strong` | neutral-700 | `#404040` | neutral-300 | `#D4D4D4` |
| `--ring` | neutral-300 | `#D4D4D4` | neutral-950 | `#0A0A0A` |
| `--brand-accent` | creative-gen-accent-500 | `#FECC15` | same | `#FECC15` |
| `--brand-accent-foreground` | neutral-950 | `#0A0A0A` | same | `#0A0A0A` |
| `--brand-accent-edge` | creative-gen-accent-700 | `#AF8705` | same | `#AF8705` |
| `--brand-accent-text` | creative-gen-accent-500 | `#FECC15` | same | `#FECC15` |
| `--primary` | neutral-50 | `#FAFAFA` | neutral-950 | `#0A0A0A` |
| `--destructive` | red-600 | `#DC2626` | red-600 | `#DC2626` |
| `--success` / `-foreground` | emerald-950 / 400 | `#022C22` / `#34D399` | emerald-50 / 700 | `#ECFDF5` / `#047857` |
| `--warning` / `-foreground` | amber-950 / 400 | `#451A03` / `#FBBF24` | amber-50 / 700 | `#FFFBEB` / `#B45309` |
| `--info` / `-foreground` | blue-950 / 400 | `#172554` / `#60A5FA` | blue-50 / 700 | `#EFF6FF` / `#1D4ED8` |
| `--on-media` | neutral-0 | `#FFFFFF` | same | `#FFFFFF` |
| `--media-scrim` | literal `0 0% 0%` | `#000000` | same | `#000000` |

The yellow ramp for recreating fills and hovers: 50 `#FFFCE8`, 100 `#FEF3BA`, 200 `#FEE982`, 300 `#FEE050`, 400 `#FED42D` (`--brand-accent-hover`), 500 `#FECC15`, 600 `#D9AA0A`, 700 `#AF8705`, 800 `#826202`.
