# Pills and tags

Read this when you show a short label, a count, a price, a status, a filter or a form answer as a small rounded shape.

## The one rule: pills have no border

A pill is a fill and its text, never an outline: no `border`, no `ring` (DS rule 16). Why: outlined pills read as buttons and clutter a heading. Its shape comes from its ground (`bg-muted`, a status wash, the yellow or white picked face). On a picture it is the media scrim (`bg-media-scrim/60 text-on-media`), never a wash. Three outlined pieces still exist and must not be copied: `ChoicePill` at rest, `QUIET_TAG_CLASS`, and `Tag`.

## Filters are one row

Filter pills sit on the left and pickers (a Select, `ModelSelect`, a range) on the right, on one line under the title (DS rule 22). Why: a picker up beside the title splits one control set in two. Use `SettingsFilters` (`components/settings/settings-parts.tsx:137`; its children are the pickers) or `TabFilters` (`components/ui/tab-filters.tsx`; `suffix` is the right side). On phones the pickers wrap under the pills.

```tsx
// Correct (components/settings/member-usage-chart.tsx:76-94)
<SettingsFilters label="Kind" options={TABS} value={tab} onChange={setTab}>
  <ModelSelect value={model} onChange={setModel} all={all} options={options} />
  <RangeSelect value={range} onChange={setRange} />
</SettingsFilters>
```

## Everything in `components/ui/pill.tsx`

| Name | Kind | Size and look | Props |
|---|---|---|---|
| `PILL_CLASS` + `PILL_ON_CLASS` | class | 28 tall, corner 8, muted text; on: `bg-muted text-foreground` | none |
| `PAGE_TAB_CLASS` | class | 36 tall (32 on phones) page tab over a `TabTrack`; current: `data-active` | none |
| `LABEL_PILL_CLASS` | class | full round, `bg-muted`, muted 14 semibold: a fact beside a heading | none |
| `LABEL_PILL_BRAND_CLASS` | class | the same on `bg-picked-pill`: a hero's one lead fact | none |
| `QUIET_TAG_CLASS` | class | 20 tall, outlined ("Soon"); don't copy | none |
| `ChoicePill` | component | 40 tall (36 on phones); `lg` 48 (44 on phones) | `on`, `emoji`, `tone`: `default` \| `brand`, `size`: `default` \| `lg` |
| `StatusPill` | component | 24 tall, dot + 12 semibold on a status wash | `tone`: `neutral` \| `paper` \| `info` \| `warning` \| `violet` \| `success`; `icon`, `caps`, `onMedia` |
| `CountPill` | component | 20 tall, tabular digits; `corner`: 16 tall, ringed in `--background` | `tone`: `neutral` \| `brand`; `corner` |
| `CreditPill` | component | 28 tall, yellow wash, credit glyph, `brand-accent-label` digits (yellow on dark, ink on light) | none |
| `SavingsPill` | component | the `bg-savings` (emerald) fill: "-20%", "$120" | none |
| `CostPill` | component | the price inside a key, credit glyph | `was` (struck-through old price) |
| `GenerationCreditPill` | component | 24 tall solid yellow, credits a generation used | `credits`, `quiet` |
| `GenerationModelPill` | component | 24 tall glass on media; muted with `ground` | `label`, `ground` |
| `GenerationProjectPill` | component | 24 tall glass, folder + project name | `name` |

`CARD_CORNER_CLASS` positions a card's top-left pills; its card must be `isolate` (DS rule 14). Nothing else exists. Defaults: `ChoicePill` `tone="default"` `size="default"`; `StatusPill` `tone="neutral"`; `CountPill` `tone="neutral"`, no corner.

### ChoicePill: the answer to a question in a form

Use it for one or many picked answers (`aria-pressed`). Use `PILL_CLASS` for filters and nav, `DropdownTile` for picking from a long list, `ModelSelect` for models. At rest (`pill.tsx:81`): transparent face, a 1px `border-border-strong` edge, `text-foreground-subtle` 14 semibold, corner 12 (10 on phones); hover turns the edge `border-muted-foreground` and the text `text-foreground`. Picked (`pill.tsx:83`): the white `--primary` face with `text-primary-foreground`; `tone="brand"` picks to the yellow face. Size it with `size`, never with height classes.

```tsx
// Correct (components/spacelab/publish/details-section.tsx:175-181)
<ChoicePill key={o.value} on={on} onClick={toggle} className="justify-center">{o.label}</ChoicePill>
// Incorrect: resized with classes
<ChoicePill on={mood === m} onClick={pick} className="h-8 px-3 text-sm">{m}</ChoicePill>
```

### StatusPill: where a job or ticket stands

Use it for a state (Received, In review, Final, Verifying). Use `CountPill` for a number, `LABEL_PILL_CLASS` for a fact. Tones as Jam and Microdrama use them: `info` received, `warning` in review, `neutral` closed or idle, `success` final, `paper` on a Jam ticket stub; `violet` has no call site. On a picture pass `onMedia`: the glass, the label alone, tone ignored.

```tsx
// Correct (components/spaces/micro-dramas/episode-panel.tsx:228; components/microdrama/make/look-upload.tsx:209)
<StatusPill tone={status.tone}>{status.label}</StatusPill>
<StatusPill onMedia className="absolute bottom-3 left-3 tabular-nums">
// Incorrect: a hand-built warning wash on a picture
<span className="absolute top-2 left-2 inline-flex h-6 rounded-xl bg-status-yellow px-2 ...">Closest match</span>
```

### CountPill: how many are waiting

Use it for a count inside a 32+ key (`neutral`) or on a key's corner (`tone="brand" corner`).

```tsx
// Correct (components/shell/sloosh-navbar.tsx:355)
<CountPill aria-hidden tone="brand" corner className="pointer-events-none absolute -top-1 -right-1">{n}</CountPill>
// Incorrect: a hand-built 18px count
<span className="absolute -top-1 -right-1 flex size-[18px] rounded-full bg-brand-accent ...">{count}</span>
```

### CreditPill, CostPill, SavingsPill: money

Every key that spends credits carries a `CostPill` inside it (DS rule 25). Why: the cost shows before the press. A credit figure on the ground is `CreditPill` (`CreditTag` in `components/microdrama/live/parts.tsx:172` is its 24-tall form). `SavingsPill` is for pricing savings only. A `CostPill` inside a disabled primary turns gold by itself; never ring it.

```tsx
// Correct (components/ai-influencer/maker.tsx:255-258)
<Button variant="primary" size="48" onClick={generate}>{COPY.update}<CostPill>{COPY.updateCost}</CostPill></Button>
// Incorrect: an outline on a pill
<CostPill className="py-1 group-aria-disabled:ring-1 group-aria-disabled:ring-inset group-aria-disabled:ring-accent">
```

## Badge (`components/ui/badge.tsx`)

`variant`: `default` | `secondary` | `destructive` | `outline`; default `default`. Nothing else exists. Only the design-system galleries use it; its base class has a `border` and `default` carries `shadow-xs`, both against rule 16. Don't use it in screens: use `StatusPill` for a state, `LABEL_PILL_CLASS` for a fact.

## Tag (`components/ui/tag.tsx`)

Props: `text`, `className`, `onClick`. No variants. A 32-tall outlined pill (`border border-border`), only in the galleries. Don't use it: use `LABEL_PILL_CLASS`, or `PILL_CLASS` when it is pressable.

## KeyTag (`components/ui/key-tag.tsx`)

"Runs on your key": 24 tall, `bg-muted`, the key glyph, then a price or owner; a 24 square when empty. Props: `children`, `className`. Use it only where a model runs on the user's own key: model picker rows, the model chip, Settings > Provider keys.

```tsx
// Correct (components/studio/composer/model-picker.tsx:267)
<KeyTag className="self-center">{credits}</KeyTag>
// Incorrect: resized with classes
<KeyTag className="ml-1.5 h-5 w-5 rounded-md align-middle" />
```

## ComposerChip (`components/ui/composer-chip.tsx`)

A filled 28-tall button (32 inside `PromptComposer size="lg"`): a 20px tile, then a label, on `bg-muted`, `hover:bg-accent`. Props: `tile` plus button props. Use it for every composer control that opens something (model, ratio, quality, voice). The tile holds a `ModelLogo`, a `MotionIcon` or a thumbnail.

```tsx
// Correct (components/studio/composer/model-picker.tsx:100-110)
<ComposerChip aria-label={`Model: ${selected.label}`} tile={<ModelLogo logo={selected.logo} provider={selected.provider} label={selected.label} />}>
// Incorrect: a static Icon in the tile, and resized by classes
<ComposerChip tile={<Icon icon={FileImportIcon} className="size-4" />} className="h-9 gap-2.5 ...">
```

## Decision tree

1. Is it in a composer and opens a control? `ComposerChip`.
2. Is it an answer to a form question? `ChoicePill`.
3. Is it a filter or a nav item? Inside a page's tab row: `PAGE_TAB_CLASS`. A filter set: `TabFilters` or `SettingsFilters`. A loose pill: `PILL_CLASS` + `PILL_ON_CLASS`.
4. Is it a price on a key? `CostPill`. Credits on the ground? `CreditPill`. Credits a generation used, on its card? `GenerationCreditPill`. A saving on pricing? `SavingsPill`.
5. Is it a state? `StatusPill` (`onMedia` on a picture).
6. Is it a count? `CountPill` (`corner` on a key's corner).
7. Is it the model or project on a generation card? `GenerationModelPill`, `GenerationProjectPill`.
8. Is it "runs on your key"? `KeyTag`.
9. A fact beside a heading? `LABEL_PILL_CLASS` (`LABEL_PILL_BRAND_CLASS` for a hero's lead fact).
10. Never `Badge`, `Tag` or `QUIET_TAG_CLASS` in new work.
