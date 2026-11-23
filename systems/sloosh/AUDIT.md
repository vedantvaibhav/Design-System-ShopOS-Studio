# Design-system audit

Read this when you want to know where the code still breaks the rules, and which questions are waiting on the designer.

First scanned 23 Nov 2026 on `claude/design-system-audit`; fixed and re-scanned on `claude/design-system-fixes`. Scope: `components/`, `app/`, `lib/`, excluding `legacy/`, `node_modules/`, `public/vendor/`, `public/docs/`, `.next/` and the specimen pages (`app/design-system*`). Sanctioned exceptions are listed in [rules.md](rules.md).

## Verdict

The code now follows the rules. Every static icon animates, every empty list is `EmptyState`, nothing outside the sanctioned exceptions uses a gradient fill, no screen writes yellow text below display size, and there are no raw palette classes, no stock shadows on product UI and no lint warnings. What remains is a short list of judgment calls and a few open design decisions, below.

## Scorecard

| # | Check | Before | After |
|---|---|---|---|
| 1 | Hex / `rgb()` / `hsl()` outside exceptions | 134 | 9, all sanctioned or legitimate (SVG mask fills, canvas colours) |
| 2 | Raw palette classes (`text-white`, `black/10`...) | 0 in screens, 3 in shared code | 0 |
| 3 | Arbitrary radius / type / shadow | 3 / 3 / 2 | 3, each kept on purpose (see below) |
| 4 | Gradient fills outside exceptions | 22 | 0 (the 17 remaining hits are alpha masks, dot grids, the shimmer, scrim fades and the sale bar) |
| 5a | Plain `Icon` instead of `MotionIcon` | 489 | 50: icons picked at runtime from data, the filled HD swap, one labelled icon |
| 5b | `MotionIcon` names missing from the registry | 2 | 0 (32 glyphs registered) |
| 6 | Hand-made yellow controls | 5 | 2, kept on purpose (see below) |
| 7 | Slab-fighting classes on `Button` | 3 | 0 |
| 8 | Yellow text at 12 to 16px | 14 | 0 (new `--brand-accent-label`) |
| 9 | Ground tokens over media | 1 | 0 |
| 10 | Weight classes on display titles | 0 | 0 |
| 11 | Empty lists not using `EmptyState` | 16 | 0 (`EmptyState` used in 22 files, was 5) |
| 12 | Feature folders duplicating `components/ui/` | 18 | 9 (step indicators and two tablists, see below) |
| 13 | `pnpm lint` warnings | 4 | 0 |

`pnpm lint`, `npx tsc --noEmit` and `pnpm build` pass.

## What changed in the system itself

- **`--brand-accent-label`** (`text-brand-accent-label`): yellow at label size. Yellow on dark, ink on light and on yellow grounds. `CreditPill`, the `outline` and `tinted` keys, facet counts, model badges and the phone tab bar's active label use it.
- **`--image-edge`** (`outline-image-edge`, `ring-image-edge`): the hairline inside every picture card, in place of `black/10 dark:white/10`.
- **Ghost keys** light on keyboard focus and while their menu is open, like `ghost-fill` (rule 11). The dialog close key is grey at rest.
- **`Spinner` and `Busy`** live in `components/ui/spinner.tsx` (rule 24).
- **`KeyCount`** is the cornered brand `CountPill`.
- **Unused `--app-tile-*-top`** gradient tokens removed; app tiles are flat.
- **`DESIGN_SYSTEM.md`** corrected where it disagreed with the code: the phone tab bar, the theme toggle, radius by control height, `ds2.css`, CardFade, TemplateCard, loaders, icons, reduced motion, press timing, focus routes, and more.

## Left, on purpose

- **50 plain `Icon`s.** Icons chosen from data (`icon={item.icon}`) can't be converted by name. Rule: a new data list that holds icons carries each icon's `name` and `motion` too. `Hd` and `AiChat02` stay `Icon` because only `Icon` swaps in their filled form.
- **3 arbitrary values.** `ui/dialog.tsx:208` (a transparent shadow the drawer animates through), `studio/composer/field-pill.tsx:154` `rounded-[1px]` (the corner of an 8px aspect-ratio glyph), `spacelab/draft-graph.tsx:58` `text-[10px]` (labels inside an aria-hidden miniature graph thumbnail).
- **2 yellow fills that aren't buttons.** `ui/faq-section.tsx` (the accordion's open disc, an indicator) and `ui/offers.tsx` (an offer card drawn as a keycap).
- **Literal colours** in `components/mcp/story/story.css` and `components/home/mm/mcp-motion.css`: other apps' colours in mock app windows, now listed as exceptions like `app-graphics.css`.
- **31 colour tokens nothing reads** (`sidebar-*`, `chart-2..5`, `surface-*`, `raised*`...). Kept because token names match production.
- **Two tablists** (`ai-influencer/maker.tsx`, `mcp/connect-card.tsx`): `ui/tabs` is a different look (a dark well, 28 to 36px). The maker row matches `PAGE_TAB_CLASS` + `TabTrack` if you want it moved.
- **`ui/audio/clone-voice-dialog.tsx`** model picker: a `Select` that now shows logos. A straight `ModelSelect` swap needs `variant`, `align` and `positionerClassName` props on `ModelSelect`.
- **Not visually checked:** `components/microdrama/flow/*`, `microdrama/series-screen.tsx`, `spaces/micro-dramas/micro-dramas-home.tsx` and `microdrama/cast-grid.tsx` aren't rendered by any route today. Their fixes pass type-check and lint.

## Decisions only the designer can make

1. Is the linear fade to `media-scrim` over pictures allowed for good (`CardFade` and about 16 others), or must scrims be flat? The docs allow it for now.
2. `shadow-float` and `shadow-modal` already draw a 1px ring; many sites add `ring-1 ring-inset ring-border` too (a 2px edge). Keep one, drop which?
3. `ChoicePill`, `Tag`, `Badge` and `QUIET_TAG_CLASS` are outlined. Exceptions to "pills have no border", or make them fills?
4. The avatar rule says a light 100 disc with 700 letters; the navbar avatar is slate-700 with white letters. Which wins?
5. HoverDoodles on the /mcp tool tiles: allowed, or footer and bottom pills only?
6. In a vertical stack of full-width buttons, does the primary go first or last? Two screens put it first.
7. Seven step indicators have no shared part and disagree on the current step (a yellow ring in `microdrama/create-drama.tsx`, a white fill in `microdrama/flow/flow-screen.tsx`). Which look becomes the `components/ui/` part?
8. Gallery-only components (`TabFilters`, `IconSegmentedSwitch`, `Card`, `ScrollArea`, `Separator`, `Badge`, `Tag`, `Label`, `GridSizeSlider`, `FacetFilter`): delete them, or move screens onto them?
9. TemplateCard caps its output dots at 7 and inputs at 3, against "show all". Keep the caps on cards?
10. Micro-dramas studio's "Making Episode N" is now an `EmptyState`. Should it be the generating card instead?
