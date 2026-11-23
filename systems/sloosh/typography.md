# Typography

Read this when you set any text: a title, body copy, a caption, a number, code or a screenplay.

## Faces

| Face | Tailwind | Stack (`styles/tokens/semantic.css`) | Loaded by | Use |
|---|---|---|---|---|
| Bricolage Grotesque | `font-display` (set by `text-display-*`) | `--sl-font-display`: Bricolage Grotesque, Inter, ui-sans-serif, system-ui | next/font in `app/layout.tsx` (`--font-display-raw`, variable, `opsz` axis) | display titles only |
| SF Pro stack | `font-sans` (on `<body>`) | `--sl-font-sans`: "SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Roboto, ui-sans-serif, system-ui | the system | everything else: body, labels, buttons, numbers |
| Caveat | `font-hand` (set by `text-hand-*`) | `--sl-font-hand`: Caveat, "Segoe Print", "Bradley Hand", "Comic Neue", cursive | next/font (`--font-caveat-raw`, 500 / 600 / 700) | handwritten asides and notes |
| Mono | `font-mono` (set by `text-code`) | `--sl-font-mono`: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas | the system (JetBrains Mono only if installed) | anything the reader copies |
| Courier Prime | none (set by `text-script`) | `--sl-font-script`: Courier Prime, "Courier New", Courier | next/font (`--font-script-raw`, 400 / 700) | a screenplay's text only, never interface |

## Scale

One scale for every face: **12 / 14 / 16 / 20 / 24 / 36 / 48 / 60** px. Titles and handwriting sit at 120% line height, everything else at 140%. Each class sets size, weight and line height together, so `text-sm` alone is 14px / 500 / 140%. A `font-*`, `leading-*` or `tracking-*` class next to it wins, because the utilities read `var(--tw-font-weight, …)` and `var(--tw-leading, …)`.

## Every text utility (`styles/theme.css`)

| Class | Face | Size | Weight | Line height | Extra |
|---|---|---|---|---|---|
| `text-caption` | sans | 12 | 500 | 1.4 | |
| `text-caption-strong` | sans | 12 | 600 | 1.4 | |
| `text-caption-caps` | sans | 12 | 600 | 1.4 | uppercase, tracking 0.04em |
| `text-sm` | sans | 14 | 500 | 1.4 | the UI default |
| `text-sm-strong` | sans | 14 | 600 | 1.4 | button labels 28 to 36 |
| `text-sm-num` | sans | 14 | 700 | 1.4 | tabular numbers |
| `text-base` | sans | 16 | 500 | 1.4 | |
| `text-base-strong` | sans | 16 | 600 | 1.4 | button labels 40 and 48 |
| `text-text-20` | sans | 20 | 600 | 1.2 | |
| `text-sans-24` | sans | 24 | 500 | 1.15 | tracking -0.02em |
| `text-sans-28` | sans | 28 | 600 | 1.15 | tracking -0.01em; off the scale: the Spaces category hero and onboarding only |
| `text-sans-36` | sans | 36 | 500 | 1.1 | tabular, tracking -0.02em |
| `text-sans-48` | sans | 48 | 500 | 1.05 | tracking -0.03em |
| `text-display-20` | Bricolage | 20 | 800 | 1.2 | tracking -0.02em |
| `text-display-24` | Bricolage | 24 | 800 | 1.2 | tracking -0.02em |
| `text-display-36` | Bricolage | 36 | 800 | 1.2 | tracking -0.03em |
| `text-display-48` | Bricolage | 48 | 800 | 1.2 | tracking -0.03em |
| `text-display-60` | Bricolage | 60 | 800 | 1.2 | tracking -0.03em |
| `text-hand-16`, `text-hand-20` | Caveat | 16, 20 | 600 | 1.2 | |
| `text-hand-24`, `-36`, `-48` | Caveat | 24, 36, 48 | 700 | 1.2 | |
| `text-code` | mono | 14 | 400 | 24px | |
| `text-script` | Courier Prime | 16 | 400 | 28px | |

Every display step sets `font-synthesis-weight: none`. Tailwind's own `text-xs`, `text-lg`, `text-xl`, `text-2xl` still compile but are off this system: use `text-caption` for 12px, and a step above for the rest.

For plain CSS, `semantic.css` has the same styles as `font` shorthands: `font: var(--sl-text-sm)`, `var(--sl-text-display-24)`, `var(--sl-text-code)`.

## Which text style

```
What is the text?
├── a section or page title, brand voice
│   ├── section title ................ <MotionTitle className="text-display-24 text-brand-accent-text">
│   ├── page or hero title ........... text-display-36 / -48 / -60 (step down at max-md)
│   └── small card or panel title .... text-display-20
├── a title in the product's voice ... text-sans-24 / -36 / -48
├── a row title, dialog heading, FAQ question .. text-text-20
├── body copy ........................ text-base (strong: text-base-strong)
├── UI text: labels, menu items, fields  text-sm (strong: text-sm-strong)
├── a caption, meta line, timestamp .. text-caption (strong: text-caption-strong)
├── an eyebrow or stamp-like tag ..... text-caption-caps
├── a price, count or figure ......... text-sm-num; a big product number: text-sans-36
├── anything the reader copies ....... text-code
├── a handwritten aside .............. text-hand-*
└── a screenplay's text .............. text-script
```

## Rules

**1. Section titles are `MotionTitle` at `text-display-24` in `text-brand-accent-text`.** `MotionTitle` (`components/ui/motion-title.tsx`) gives the title its loading animation. 24px clears the 20px floor for yellow text on light (colors.md, the yellow rule). A title on a picture uses `text-on-media` instead.

```tsx
// Correct (components/spaces/space-page/showcase/showcase-templates.tsx:75)
<MotionTitle as="p" className="text-display-24 text-brand-accent-text">
// Incorrect: plain heading, a weight class, and yellow text below display size
<h2 className="text-base font-bold text-brand-accent-text">
```

**2. No weight classes on display titles.** The step sets 800. `font-bold` resets `--tw-font-weight` to 700 and Bricolage is variable, so it renders a real, lighter 700 instead of the brand weight.

```tsx
// Correct (components/spaces/micro-dramas/intro.tsx:20)
<MotionTitle as="h1" now id="drama-intro-title" className="text-display-36 text-brand-accent-text max-md:text-display-24">
// Incorrect
<MotionTitle as="h1" className="text-display-36 font-bold text-brand-accent-text">
```

**3. Never below 12px, never an arbitrary size.** 12px is the floor for legibility on phones; arbitrary sizes break the one scale. Snap off-scale sizes to the nearest step: 10 and 11 to 12, 13 to 14, 15 and 17 to 16, 22 to 20. The one exception: the 404 numeral (`components/not-found/not-found-view.tsx:86`) is `text-display-60` resized with `clamp()` so the page never scrolls.

```tsx
// Correct
<span className="truncate text-caption text-foreground">{node.label}</span>
// Incorrect
<span className="truncate text-[10px] leading-none text-foreground">{node.label}</span>
```

**4. Switching a display title to sans at a breakpoint: add the face back.** The display utility sets `font-family`; a sans size class does not, so without `font-sans` you get Bricolage at body size.

```tsx
// Correct (components/ui/showcase-intro.tsx:69)
className="text-display-20 text-foreground max-md:font-sans max-md:text-base-strong"
// Incorrect: Bricolage Grotesque at 16px on phones
className="text-display-20 text-foreground max-md:text-base-strong"
```

**5. Step display titles down one or two sizes on phones**, display to display: `max-md:text-display-24` under a 36, `max-lg:text-display-36` under a 48 (`components/ui/faq-section.tsx:57`).

**6. Numbers that change or line up are tabular.** Use `text-sm-num` or `text-sans-36` (both tabular), or add `tabular-nums`, so digits do not shift as they count.

```tsx
// Correct (components/ui/pill.tsx:59, SAVINGS_PILL_CLASS)
"inline-flex shrink-0 items-center rounded-xl bg-savings px-2 py-1 text-sm-num text-savings-foreground"
// Incorrect: proportional digits jitter as a value changes
"... rounded-xl bg-savings px-2 py-1 text-sm font-bold text-savings-foreground"
```

**7. `text-code` for anything copyable; `text-script` for screenplays only.** Code is the one monospace style (commands, server addresses, messages to paste). Courier Prime marks a script, so it never appears in interface text (`components/microdrama/make/stage-script.tsx:202`).

**8. Yellow text on light is display size only** (`text-display-20` and up). A caption, label, price or link in yellow goes `text-foreground` or `text-muted-foreground`, or into a yellow fill. See colors.md.
