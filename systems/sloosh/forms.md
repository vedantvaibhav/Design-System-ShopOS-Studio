# Forms

Read this when you build anything a user types into, picks from, toggles, uploads to or prompts with.

## Pick the field

1. A space's form, or a full-page generate form (Synora, Microdrama, AI Influencer)? Use the tiles (below), one tile per field.
2. A floating generate box with Generate inside it? `PromptComposer`.
3. Otherwise (dialogs, Settings, panels), the plain fields:
   - One line: `Input` (`FormInput` adds a label and an error). Search: `SearchInput`. Several lines: `Textarea`.
   - Pick a model: `ModelSelect`. Pick from words: `Select`. One or many answers shown at once: `ChoicePill` (`pills-and-tags.md`).
   - Yes or no that applies at once: `Switch`. A check in a list or an agreement: `Checkbox`. A number on a range: `Slider`.
   - Files: `UploadTile` / `UploadBox`. Never a hand-made dashed box.
   - Grid zoom: `GridSizeSlider`. Grouped filters behind one key: `FacetFilter`.

## The field look (`lib/filled-control.ts`)

`Input`, `Textarea` and `Select.Trigger` build on these, so change a field's look here, never at a call site.

- `FILLED_CONTROL_CLASS`: `bg-muted`, corner 8, 14px text, muted placeholder, a transparent border. Focus is an inset 1px `--border-strong` ring, red with `aria-invalid`. Why inset: a parent's `overflow-hidden` never clips it and it adds no height.
- `BORDERED_CONTROL_CLASS`: a 1px `--border-strong` edge on `bg-background`.
- `FILLED_ROW_CLASS`: a 36 filled row for a trigger that is not a Select.
- `FILLED_BOX_CLASS`: a filled field that holds other parts; its focus edge draws on `focus-within`.
- `FILLED_ROW_ACTION_CLASS`: a 36 full-width action row along that box's foot, 4 in, corner 4.
- `POPUP_PANEL_CLASS`, `MENU_ITEM_CLASS`: every floating list and its 36 rows.

```tsx
// Correct: a bare Textarea and an action row inside one filled box (components/jam/jam-modal.tsx:196-212)
<div className={cn(FILLED_BOX_CLASS, dragOver && "ring-2 ring-ring ring-inset")}>
  <Textarea className="min-h-28 resize-none rounded-none bg-transparent focus-visible:ring-0" ... />
  <button type="button" onClick={attach} className={FILLED_ROW_ACTION_CLASS}>...</button>
</div>
```

## Plain fields

**Input, FormInput** (`components/ui/input.tsx`). `variant`: `filled` | `bordered`. `size`: `default` (44) | `sm` (36) | `32` | `36` | `40` | `48` | `64`. Nothing else exists. Default `filled` at 44. `bordered` sits on the page ground in a Settings row; `64` is the top-up amount (`billing/top-up.tsx:169`). The corner follows the height (8 at 32, 10 at 36, 12 at 40 and 48, 16 at 64), so never override `rounded-*`. `prefix` / `suffix` put the input in a wrapper. `FormInput` adds `label`, `error` (the label turns red) and needs `id`.
- Correct: `<Input variant="bordered" size="36" aria-label="Full name" className="w-56" />` (`settings/profile-screen.tsx:47-53`).
- Incorrect: `<Input size="36" className="rounded-xl" />` breaks the corner; `<Input className="bg-background" />` hand-builds `variant="bordered"` without its edge.

**Textarea** (`textarea.tsx`). No variants, no sizes: the filled field, min 80 tall, 12 padding. Nothing else exists. Use it for long text in dialogs and panels; use `PromptTile` in a tile form and `COMPOSER_TEXTAREA_CLASS` in a composer.
- Correct: `<Textarea id="pub-desc" className="field-sizing-content min-h-24 resize-none" />` (`spacelab/publish/details-section.tsx:137-143`).
- Incorrect: a raw `<textarea className="... bg-transparent text-sm outline-none">`.

**Select** (`select.tsx`, parts `Select.Root`, `Trigger`, `Value`, `Popup`, `Item`, `Group`, `GroupLabel`, `Separator`). Trigger `variant`: `default` (filled) | `ghost` (no fill, muted, for a toolbar or a dialog header). Trigger `size`: `sm` (32) | `default` (36) | `40` | `44`. Nothing else exists. Default `default` at 36. Use `ModelSelect` whenever the options are models.
- Correct: `<Select.Trigger aria-label="Category" size="40" className="w-full">` (`spacelab/publish/details-section.tsx:147`).
- Incorrect: `<Select.Trigger className="h-11! w-full">`; write `size="44"`.

**SearchInput** (`search-input.tsx`). `size`: `36` | `40` | `48`, default `36`. Nothing else exists. An `Input` with the search glyph, a clear button once there is text, and `setDebouncedSearch` 500ms after typing stops.
- Correct: `<SearchInput size="36" search={query} setSearch={setQuery} placeholder="Search voices" />` (`ui/audio/voice-table.tsx:126`).
- Incorrect: a `<label>` + `Icon` + raw `<input type="search">`.

**Label** (`label.tsx`). No variants: 14px text that dims beside a disabled `peer`. Use it over a plain field; `FormInput` and the tiles draw their own.

**Checkbox** (`checkbox.tsx`). No variants, no sizes: a 16 box with a 1px `--primary` edge, the white face and tick when checked. Nothing else exists.
- Correct: `<Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />` (`events/register-form.tsx:170`).
- Incorrect: `<Checkbox className="size-6" />`, the 16 tick stays 16 in a 24 box; a raw `<input type="checkbox">`.

**Switch** (`switch.tsx`). `size`: `default` (24 x 40) | `sm` (16 x 28, for 28 chips). `tone`: `default` (white when on) | `brand` (yellow track, ink thumb). Nothing else exists. Default `default` / `default`. Use it for a setting that takes effect at once; `brand` on publish options and Microdrama settings.
- Correct: `<Switch tone="brand" checked={asIs} onCheckedChange={onAsIs} />` (`ai-influencer/maker.tsx:510`).
- Incorrect: `className="data-checked:bg-brand-accent" thumbClassName="data-checked:bg-brand-accent-foreground"` rebuilds `tone="brand"`.

**Slider** (`slider.tsx`). Single or range (pass an array). `tone`: `default` | `brand` (yellow fill, ink thumb ringed in yellow). Nothing else exists. Default `default`; `brand` on pricing's calculator and spending limits.
- Correct: `<Slider tone="brand" min={0} max={s.max} step={s.step} value={n} />` (`pricing/plan-fit.tsx:195-201`).
- Incorrect: a raw `<input type="range">`.

**ModelSelect** (`model-select.tsx`) and **ModelLogo** (`model-logo.tsx`). Every model picker shows logos (DS rule 21). Why: models are told apart by their mark faster than by name. `ModelSelect` props: `value`, `onChange`, `options` (`value`, `label`, `logo`, `provider`), `all` (an "All ... models" row with a registry glyph). It shows a 20 badge on the button, 24 badges on 32-tall rows, and a list that stops at 288 and scrolls. `ModelLogo` `variant`: `chip` (default, the bare mark for a `ComposerChip` tile) | `badge`; badge `size`: `20` | `24` | `28` (default) | `32`. Nothing else exists. Size it with `size`, never a class.
- Correct: `<ModelSelect value={id} onChange={setModel} all={all} options={models} />` (`settings/member-usage-chart.tsx:86-91`).
- Incorrect: a plain `Select` of model names; model `ChoicePill`s with no logos.

**GridSizeSlider** (`grid-size-slider.tsx`). No variants: a 180 x 36 muted pill with the expand glyph. Props `columns`, `min`, `max`, `onChange`. Use it beside a grid whose column count the user changes; hide it below md (`className="max-md:hidden"`, `assets/assets-screen.tsx:405`).

**FacetFilter** (`facet-filter.tsx`). No variants. A 36 filter key with a yellow count, opening grouped checkboxes; picks are a draft until Apply. Props `title`, `groups`, `value`, `onApply`, `count`. Use it for filters in several groups; use `TabFilters` for one row of single picks.
- Correct: `<FacetFilter title="Filter templates" groups={TEMPLATE_FACETS} value={picks} onApply={setPicks} count={count} />` (`studio/studio-screen.tsx:337`).

## Space form tiles (`form-tile.tsx`, `prompt-tile.tsx`, `upload-tile.tsx`)

| They... | Use |
|---|---|
| type one line (a name, `type="url"`) | `TextTile` |
| type more than a line (brief, script); `max` counts, `tags` turns on @ tags | `PromptTile` |
| give a number between `min` and `max` | `NumberTile` |
| pick from words; options carry `sub` (a price), `image`, `lead` | `DropdownTile` |
| pick by look; `max` > 1 for several, `aspect` | `CardsTile` |
| say yes or no (`tone` as `Switch`) | `SwitchTile` |
| add files; `kind` `image` \| `video`, `multiple` + `max`, `maxSeconds` | `FileUploadTile` |

Every tile takes `label`, `required`, `help`, `error`, `readOnly`, `flash` (`TileFieldProps`, `form-tile.tsx:241`). Rules:
- One field is one tile: `bg-muted`, corner 12, 12 padding, 12 between name and value; a one-line tile is 72 tall; tiles sit 16 apart.
- The name sits on top, `--foreground` while empty, `--muted-foreground` once there is a value (the value is 16 foreground). Required shows a `--picked-ring` * that goes once done; every field has a `HelpTip` (i).
- Edge: none at rest, `--border-strong` on hover (rows) and focus, `--destructive` with one `FieldError` line when it needs fixing. Anything picked wears the 2px `--picked-ring`.
- Lists open beside the form, never inside it: `side="right"`, `sideOffset` 28, `collisionPadding` 16; a bottom sheet on phones (DS rule 1). Why: the list never covers the fields.
- Generate stays a flat grey `aria-disabled` keycap until the form is ready, its tooltip naming the first thing missing.
- Correct: `<PromptTile label={C.field} required value={story} onChange={setStory} max={C.max} />` (`microdrama/live/step-story.tsx:72`).

## Uploads (`upload-box.tsx`, `upload-tile.tsx`)

Every upload uses the one upload box (DS rule 19). `UploadTile` lives in `upload-box.tsx`; `size`: `xs` (58, the add square in a filled form) | `sm` (130, default, Studio) | `md` (full-width 130 form box) | `lg` (fills its parent, a stepped dialog's upload step). `UploadBox` `layout`: `row` (default, tile then a sideways-scrolling row) | `form`. `FileUploadTile` (`upload-tile.tsx`) is the tile-form field: it opens `AssetDrawer` and verifies each file. Nothing else exists.
- Correct: `<UploadTile size="lg" onClick={addClip} label={C.drop} hint={C.note} isDragOver={drop.isDragOver} />` (`microdrama/make/look-upload.tsx:110`).
- Incorrect: a hand-made `border border-dashed border-border-strong` box (`spacelab/publish/details-section.tsx:258`, and `DropZone` in `ui/audio/clone-voice-dialog.tsx:479`).

## Composer (`prompt-composer.tsx`, `composer-panel.tsx`)

`PromptComposer` slots: `rail`, `tabs`, `media`, `prompt`, `controls`, `generate`, `above`, `panel` (+ `panelBelow`). `size`: `sm` | `md` (default) | `lg` (16px prompt, 32 chips). `surface`: `card` (default) | `glass` (over a picture, inside `data-theme="dark"`). Nothing else exists. The prompt is a `<textarea>` with `COMPOSER_TEXTAREA_CLASS` (or `ComposerHint`); `generate` is `ComposerGenerateButton`. `ComposerPanel` (props `label`, `onClose`, `className`) is what a composer opens in place, as wide as the fold band (DS rule 13), passed as `panel`.
- Correct: `generate={<ComposerGenerateButton cost={fmt(s.cost)} disabledHint={s.blocker} onClick={generate} />}` (`studio/audio/audio-composer.tsx:193`).
- Incorrect: `className={cn(COMPOSER_TEXTAREA_CLASS, "text-base")}`; a bigger prompt is `size="lg"`.

## Stepped dialogs

Copy Add my voice: `CloneForm` in `components/ui/audio/clone-voice-dialog.tsx:183` (its shell at line 285) (`voice-dialogs.tsx` holds single-step dialogs). Shell: `flex h-[min(28rem,85dvh)] flex-col gap-5 p-6`, one height for every step so it never jumps. Heading `text-text-20` at the top with a ghost `icon-32` Back once there is a step to go back to; the step fills the middle (`flex min-h-0 flex-1`); one full-width `size="48"` primary pinned at the foot, shown only once usable. An upload step leads with `UploadTile size="lg"`; tips go under it as a one-line strip (`TipStrip`, line 401; DS rule 18; `microdrama/make/look-upload.tsx:93` follows it at `34rem`).
