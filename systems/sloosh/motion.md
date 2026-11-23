# Motion and sound

Read this when anything you build moves, arrives, answers a press or makes a sound.

The feel is snappy and natural, and the same every time: a motion that is sometimes smooth and sometimes janky is a bug. The principles are frozen; a new animation that cannot follow them does not ship.

## Tokens

All in `styles/tokens/semantic.css`, used as `duration-(--motion-duration-enter) ease-(--motion-ease-out)`. `MOTION` in `lib/motion.ts` mirrors them for Web Animations; change both or neither.

| Duration token | Value | For |
|---|---|---|
| `--motion-duration-instant` | 80ms | keycap press |
| `--motion-duration-fast` | 120ms | hover, colour |
| `--motion-duration-micro` | 150ms | pill colour, small fades |
| `--motion-duration-enter` / `-exit` | 200ms | popups, tabs, overlays, card reveal |
| `--motion-duration-arrive` / `-arrive-fade` | 300ms / 200ms | every arrival: move / fade |
| `--motion-duration-screen` | 280ms | full-screen view, dialog rise, tab highlight |
| `--motion-duration-sheet` | 320ms | phone sheets |
| `--motion-duration-pop` | 560ms | critter pop-in, bursts |

| Curve token | For |
|---|---|
| `--motion-ease-arrive` | arrivals and the card rise; no overshoot |
| `--motion-ease-out` | popups in, screens, sheets, card reveal, tab highlight |
| `--motion-ease-in` | exits |
| `--motion-ease-hop`, `--motion-spring-pop`, `--motion-spring-ui`, `--motion-spring-card` | play only: critters, title letters, toggles; never an arrival |

The rest (`-ring`, `-fly`, `-lazy`, `-draw`, `-write`, `--motion-ease-draw`, `-squash`, `-fly`) belong to the SlooshInk drawing engine and critters.

## Principles

1. Animate only for arrival, state change or a press; nothing on a keyboard shortcut or a hundred-times-a-day action. Hover is a colour change plus at most a small lift or a 3% image zoom.
2. One arrival language: from the edge it lives on, 12 to 16px over 300ms with a 200ms fade on `--motion-ease-arrive`; no overshoot, no scale. Marketing: 32px over 480ms, 280ms fade.
3. Surfaces first, then content, in reading order: the nav once per visit, a page's tabs with the page, a docked composer 80ms later, content after its surface. Stagger 40ms in the app, 60 to 80ms on marketing, 6 steps at most.
4. Never animate what is not ready: a card waits for its picture (300ms max) and an idle main thread (600ms max).
5. Off the main thread: only `transform`, `opacity` and `clip-path`, through CSS or Web Animations. No per-frame JavaScript (motion's `x` / `y` / `scale`, `layoutId`) for anything that can play during a load; no `transition-all`; never animate `width`, `height`, `top`, `left`, `margin` or `padding`.
6. Once per appearance: nothing replays, nothing hides and shows again, no timers that unhide.
7. Answer the click, not the page load: the nav highlight moves on click; a menu closes the moment you pick.
8. A sliding highlight sits behind every label (`TabTrack`, `components/motion/tab-track.tsx`); it never passes over a word.
9. Springs are for play (critters, title letters, a pricing hover lift), never for arrivals or system responses.
10. Popups grow from their trigger: 96% scale, 4px toward it (`popup-motion`); never from `scale(0)` or the centre (modals excepted). Exits are quicker than entrances.
11. Hover motion only on real pointers. A hover overlay reveals on its blur layers, never by fading a wrapper, which cuts the blur off.
12. Reduced motion keeps the meaning and drops the movement.

Anything over 300ms on a UI element (not a marketing block, title or critter) carries a comment saying why.

## Entrances

```
What is arriving?
├── the top nav or a page's tabs / toolbar → animate-enter-down
├── a docked composer → animate-enter-up [--enter-delay:80ms]
├── a left panel → animate-enter-right; a right panel → animate-enter-left [--enter-delay:60ms]
├── a card in a grid, rail or masonry → data-rise="" on its root (data-rise="sm" rises 8px)
├── a pricing or marketing block → Reveal (components/ui/reveal.tsx), data-rise="lg"
├── a hero's pieces dropping onto a shelf → animate-enter-drop (marketing scale)
└── a menu, select or popover popup → popup-motion (built into the ui popups)
```

- The `animate-enter-*` utilities live in `styles/theme.css` ("Entrances"); `--enter-delay` orders parts that arrive together; `animate-enter-fade` is the fade alone.
- `RiseObserver` (`components/motion/rise-observer.tsx`, mounted once in `app/layout.tsx`) raises every `[data-rise]` with `element.animate()`. `data-rise-delay` (ms) sets an order; `data-rise-after="<selector>"` on an ancestor makes its cards wait for that element's entrance. Never wrap a card in a motion component, never nest `data-rise`.
- Never write attributes or styles onto React-owned elements to drive motion; use `element.animate()`.
- On a phone, `Select`, `Dropdown` and `Popover` popups carry `phone-sheet` and become bottom sheets below 768px.

## Press feedback

- Buttons: the slab (`keycap-slab`) owns hover lift and press. Never add press, `transition-*` or `shadow-*` classes to a `Button`.
- Small hand-built controls: `PRESS` from `lib/press.ts` (colours ease on the enter timing, press scales to 0.97 under `motion-safe:`).
- A card's open target: `CARD_PRESS` from `lib/card-interaction.ts` (0.98). Its picture: `CARD_ZOOM` (3% on hover).

## Reduced motion

- `styles/theme.css` cuts every CSS animation and transition to 0.01ms app-wide, so `animate-enter-*` arrive in place at once.
- `popup-motion` keeps its opacity fade; `RiseObserver` fades cards with no movement; `TabTrack` jumps; icons stay still; `play()` stays silent.
- The drawing tokens (`-fast`, `-ring`, `-slow`, `-fly`, `-pop`, `-lazy`, `-draw`, `-write`) drop to 0ms in `semantic.css`.
- Gate any transform you write by hand with `motion-safe:` or `motion-reduce:`.

## Known exceptions to principle 5

One small element each; add no more: the keycap's `padding-bottom` lift (`keycap-slab`), the nav mega menu's glide (Base UI positioner), the plan-fit marker's `left` (`components/pricing/plan-fit.tsx`), the voice table's `height` between tabs (`components/ui/audio/voice-table.tsx`), `Collapse` (`components/ui/collapse.tsx`, the composer media row), `.sl-run-border` (one chip's conic angle), and the 404 forme engine (`components/not-found/forme-engine.js`, runs only after its drawing loads).

## Before shipping an animation

1. Does it need to move at all?
2. Does it use a pattern above, not its own curve or timing?
3. Does it move only `transform`, `opacity` or `clip-path`?
4. Is its content loaded and its surface landed when it plays?
5. Does it play once, and read right under reduced motion?
6. Does it look the same on a slow first load as on a warm reload?

## Sound

Every interface sound is `play(name)` from `lib/sound.ts`: twelve synthesized sounds, picked by pattern, never by screen. Primitives do not play for you: call it in the handler.

| `play(...)` | When |
|---|---|
| `"press"` | any button, card, banner, link or nav item that is not one of the cases below |
| `"tick"` (`{ off: true }` turning off) | a choice: tab, option, menu item, chip, checkbox, toggle |
| `"pop"` / `"close"` | a surface opens / closes: menu, popover, modal, sheet, drawer, full view |
| `"drop"` | a file arrived |
| `"detent"` | a value moved one step: slider, stepper, wheel |
| `"generate"` | a job that spends credits started |
| `"done"` / `"uh-oh"` | the result is ready / it did not go through, blocked clicks included |
| `"mode"`, `"snap"`, `"boing"` | only `ComposerModeRail`, Camera Setup's wheels, clickable critters |

Helpers: `surfaceSound(open)` plays pop or close; `toggleSound(on)` plays tick or the lower tick.

- Never on hover, scroll, typing or focus. One sound per action: within 80ms only the louder plays.
- The engine stays silent when the "Interface sounds" setting (localStorage `sl-sounds`) is not `"on"` (off by default), under reduced motion, before the first click or key, and while an unmuted video plays.
- Never create audio elsewhere: no `AudioContext`, `new Audio()` or `<audio>` outside `lib/sound.ts`. Voice previews use `speakPreview` through the audio playback store (`components/ui/audio/playback.ts`).
- `/design-system-sounds` plays every sound on the real components.

## Examples

```tsx
// Correct: a docked composer arrives after the surface (components/home/hero-box.tsx:163)
<div className="hb-composer animate-enter-up [--enter-delay:80ms]">

// Incorrect: JS-driven arrival with y and blur, its own 500ms curve and 50ms stagger
// (components/ui/tab-filters.tsx:111, the `animate` path, built on riseChild in lib/motion.ts)
<motion.div variants={staggerParent(0.05, 0.03)} initial="hidden" animate="show">
  <motion.div key={opt.value} variants={riseChild}>…</motion.div>
</motion.div>

// Correct: press feel on a hand-built key (components/ui/toolbar-menus.tsx:19)
export const TOOLBAR_KEY_CLASS = cn("relative flex size-9 … bg-muted text-muted-foreground …", PRESS, FOCUS);
// Incorrect: transition-all animating width
<span className={cn("h-1.5 rounded-full bg-foreground transition-all", n === at ? "w-5" : "w-1.5 opacity-30")} />

// Correct: a sheet opens with pop (components/shell/mobile-tab-bar.tsx:96)
onClick={() => { play("pop"); setSheet(t.sheet); }}
// Correct: a link presses (components/home/color-templates.tsx:191)
<Link href={TEMPLATES.browse.href} onPointerDown={() => play("press")} className={buttonVariants({ variant: "secondary", size: "40" })}>
```
