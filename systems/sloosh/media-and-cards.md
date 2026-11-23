# Media and cards

Read this when you put a picture or clip on screen, build or change a card, lay out a grid or row of cards, or draw an avatar or model logo.

Components are in `components/ui/`; the shared card classes are in `lib/card-interaction.ts`.

## Rules every card follows

1. **At rest a card is only its picture** (plus `CARD_IMAGE_EDGE`). Titles, pills, the maker or Sloosh eye, likes and actions come up on hover or keyboard focus: `CARD_ON_HOVER` for what you read, `CARD_REVEAL_CONTROL` for what you press, inside a `group/card`, because a busy grid at rest hides the pictures. Touch has no hover: the card stays its picture and a tap opens its preview. Exceptions, and only these: a card still being made keeps its status (`feedback-and-loading.md`); **Space cards** show the maker or eye and the title band at rest (`CardBand atRest`), hover adds only Run Space; `TemplateCard` keeps its output dots and run inputs; the homepage's feature cards keep their name and line; audio cards (`components/ui/audio/audio-card.tsx`) keep their length and voice pills, since a sound has no picture.
2. **Text over media is `media-scrim` + `on-media` in both themes**, because the picture doesn't change with the theme: `bg-media-scrim/<alpha>` under `text-on-media` / `text-on-media-muted`. On a `CardFade` band the pair is `text-on-blur` / `text-on-blur-muted` (the same white). Never `text-foreground` or `bg-background/80` on a picture.
3. **Doodles appear only in the footer and the bottom pills**: the footer's social cards (`components/home/home-footer.tsx:100`) and homepage B's link pills (`components/home/home-b.tsx:632`). Never on template, space or any other card; a card's hover is its reveal and 3% zoom.
4. **Avatars are light initials discs, never emoji or icons**: `Avatar tone`, a palette-100 disc with 700 letters, the same in both themes.
5. **Show all, scroll sideways.** Every item that exists shows, never a top N. When they don't fit, the row scrolls horizontally with the scrollbar hidden and the cut edge faded.

## Which card

```
A template (Explore, Studio, /templates, a space's Templates)? -> TemplateCard
A space (Spaces page, Signature spaces)?    -> copy components/spaces/list/space-card.tsx (CardMedia + CardFade strong + CardBand atRest)
A generation being made or done?           -> copy components/studio/generation-card.tsx
Any other picture card                     -> CardMedia + CardFade + the CARD_* classes below
```

## Horizontal rows

There is no shared row component in `components/ui/`. Three local ones exist; copy the closest, don't import across features: `MediaRow` (`prompt-composer.tsx:357`, composer only: wheel scrolls it sideways), `useRail` + `RailArrows` (`components/home/calm-rail.tsx`, home only: snap and Previous / Next), and the Settings chart scroller (`components/settings/column-chart.tsx:131`). The recipe: `flex gap-2 overflow-x-auto scrollbar-hide`, items `shrink-0` at a fixed width, pinned parts (an axis) outside the scroller.

## CardMedia (`media.tsx`)

1. The picture or clip on every card. The still paints first; a clip loads only when asked to play. Not for a hero video with sound or controls.
2. `play`: `"in-view" | "hover" | boolean`; `fit`: `"cover" | "natural"`; plus `media`, `sizes`, `priority`, `alt`, `hostRef`, `className`. Nothing else exists.
3. Defaults: `play={false}` (still only), `fit="cover"`. `"in-view"` for an autoplaying feed (Explore), `"hover"` for grids, a boolean when the card owns its hover. `"natural"` for masonry shots. Pass `sizes` for next/image; `priority` only on the first screen's lead cards. Put `CARD_ZOOM` on `className`.
4. Examples:
```tsx
// Correct: components/spaces/list/space-card.tsx:75
<CardMedia media={…} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" priority={priority} play="hover" hostRef={hostRef} className={CARD_ZOOM} />
// Incorrect: a raw <video autoPlay> on a card. It loads every clip at once and ignores reduced motion.
<video src={clip} autoPlay muted loop className="absolute inset-0 object-cover" />
```

## TemplateCard (`template-card.tsx`)

1. The one card for every template. Never build another template card.
2. Props: `template`, `onOpen`, `onRecreate`, `recreateLabel`, `slooshMark`, `defaultSaved`, `pinHover`, `play` `boolean | "hover"`, `sizes`, `ratio`, `className`. Helpers: `templateCardRatio`, `templateAt45`. Nothing else exists.
3. Defaults: `play="hover"`, its own picture ratio, no title on the card. `slooshMark` where community cards sit beside Sloosh ones (Studio, `/templates`). `ratio={4 / 5}` or `templateAt45` for an even grid. `pinHover` is for the `/cards` specimen only.
4. Examples:
```tsx
// Correct: components/studio/templates-pane.tsx:72
<TemplateCard template={t} slooshMark onRecreate={() => onRecreate(t)} />
// Incorrect: pinHover on a product screen. It shows every overlay at rest.
<TemplateCard template={t} pinHover onRecreate={…} />
```

## CardFade and CARD_FADE (`card-fade.tsx`)

1. The only overlay for text or hover actions on a card's picture: a blur that ramps to the edge under the media scrim. For a non-card wash (under a composer or a sticky bar) use `GradualBlur`.
2. `position`: `"bottom" | "top"`; plus `padding`, `strong`, `className`, `layerClassName`. Settings live in `CARD_FADE` (12px padding, strength 2, 3 layers, scrim 75% rising to 90% on hover) and `CARD_FADE_STRONG`. Nothing else exists.
3. Defaults: `bottom`, shown at rest. Reveal it on hover with `layerClassName={CARD_REVEAL}`, never opacity on a wrapper, because a faded ancestor cuts the blur off. `strong` only for text at rest (Space cards). `top` for a maker label. Controls inside need `pointer-events-auto` or `CARD_REVEAL_CONTROL`; the card clips to its radius with a `clip-path` because backdrop blur ignores `overflow-hidden` corners.
4. Examples:
```tsx
// Correct: components/spaces/list/space-card.tsx:90, the maker at rest on a Space card
<CardFade position="top" strong className="z-2">
// Incorrect: a page-coloured pill on a picture
<span className="absolute bottom-3 left-3 … bg-background/80 … text-foreground">
```

## CardBand (`card-band.tsx`)

1. A card's title and subtitle on a CardFade, opening a row for Run Space or Recreate on hover. For a template use TemplateCard (it has no title).
2. `action`: `"run-space" | "recreate"`; plus `title`, `subtitle`, `meta`, `actionLabel`, `atRest`, `className`. Nothing else exists.
3. Defaults: the whole band waits for hover and hides below 768px. `atRest` only on Space cards.
4. Examples:
```tsx
// Correct: components/spaces/list/space-card.tsx:110
<CardBand title={space.title} subtitle={space.subheading} meta={runs} action="run-space" atRest />
// Incorrect: atRest on a non-Space card, which breaks rule 1
<CardBand title={g.prompt} atRest />
```

## GradualBlur (`gradual-blur.tsx`)

1. A blur that fades in toward one edge, for washes that aren't on a card: under a docked composer, below a sticky bar. Cards use CardFade, which is built on it.
2. `position`: `"top" | "bottom" | "left" | "right"`; `tint`: `"scrim" | "page" | "none"`; plus `strength`, `layers`, `tintOpacity`, `tintRamp`, `curve`, `exponential`, `layerOpacity`, `tintClassName`, `className`, `layerClassName`, `style`. Nothing else exists.
3. Always spread a preset, never one-off numbers, so every cut looks alike: `COMPOSER_BLUR` over anything pinned at the foot, `TAB_BAR_BLUR` under a sticky top bar (32px tall, shown once the page scrolls).
4. Examples:
```tsx
// Correct: components/studio/composer/video-prompt-bar.tsx:129
{docked && <GradualBlur {...COMPOSER_BLUR} className="h-full" />}
// Incorrect: a flat translucent strip under a sticky bar
<div className="sticky top-0 bg-background/80 backdrop-blur" />
```

## Masonry (`masonry.tsx`)

1. A grid whose column count the user changes (Studio's size slider). A fixed responsive grid uses CSS `columns-2 lg:columns-3` or `grid`, which paints right on the server.
2. `Masonry`: `items` (`key`, `ratio`, `node`), `columns`, `className`, `columnClassName`, `rise`. `useMasonryColumns(columns, ssrColumns)` with `base`, `md`, `lg`, `xl`. Nothing else exists.
3. Defaults: `rise` on (cards rise as they scroll in). Pass `rise={false}` inside a `ShimmerRevealGroup`, or cards animate twice.
4. Examples:
```tsx
// Correct: components/studio/generations-grid.tsx:123
<Masonry columns={columns} className="gap-2 md:gap-3" columnClassName="gap-2 md:gap-3" rise={!inGroup} … />
// Incorrect: rise left on inside a reveal group
<ShimmerRevealGroup ready={!loading}><Masonry items={items} columns={4} /></ShimmerRevealGroup>
```

## ModelLogo (`model-logo.tsx`)

1. A model's mark, wherever a model is shown or picked. For a model Select use `ModelSelect`, which places it for you.
2. `variant`: `"chip" | "badge"`; `size` (badge): `20 | 24 | 28 | 32`; plus `logo`, `provider`, `label`, `className`. Nothing else exists.
3. Defaults: `chip` (bare mark, a ComposerChip's tile), `size={28}`. Badge 20 on a Select's button, 24 in its list, 28 in picker rows, 32 on feature cards. Size it with `size`, never a class, so the mark keeps its margin and corner.
4. Examples:
```tsx
// Correct: components/ui/model-select.tsx:70
<ModelLogo variant="badge" size={24} logo={o.logo} provider={o.provider} label={o.label} />
// Incorrect: sized with a class
<ModelLogo … variant="badge" className="size-8" />
```

## Avatar (`avatar.tsx`)

1. A person: initials, or their photo. A Sloosh-made thing uses `SlooshEyeMark`; a voice uses its orb (`VoiceAvatar`).
2. `Avatar tone`: `"blue" | "emerald" | "amber" | "violet" | "red" | "indigo"`; parts `AvatarImage`, `AvatarFallback`. Nothing else exists.
3. Default: no tone, a plain muted disc, 32px. A person in Settings is `PersonAvatar` (`components/settings/settings-parts.tsx:114`). Never the brand yellow, a saturated disc, an emoji or an icon.
4. Examples:
```tsx
// Correct: components/settings/settings-parts.tsx:124
<Avatar tone={tone} className={cn("size-10", className)}><AvatarFallback className="text-sm-strong">{initials(name)}</AvatarFallback></Avatar>
// Incorrect: a dark slate disc with white letters
<Avatar className="bg-avatar text-avatar-foreground">
```

## Small parts

| Part | Use | Not |
|---|---|---|
| `SlooshEyeMark` (`sloosh-eye-mark.tsx`) | The 24px eye with "Created by Sloosh" on Sloosh-made cards; `className` only. | A maker who is a person (`Avatar`). |
| `MaskMark` (`mask-mark.tsx`) | A one-colour logo painted in `currentColor` (`src`, `className`, sized with `size-*`). Real: `components/home/agent-connect.tsx:62`. | Multi-colour logos, model marks (`ModelLogo`). |
| `Tilt` (`tilt.tsx`) | One hero card that leans to the pointer (`max` degrees, default 10). Real: `components/ui/audio/clone-voice-dialog.tsx:533`. | Grids. |
| `HoverDoodles` (`hover-doodles.tsx`) | Footer social cards and bottom link pills only (rule 3). `n`, `size` `"md" \| "sm"`, `count`, `tone` `"colour" \| "silver"`; host needs `group/doodle relative`. | Any card. |

## Card classes (`lib/card-interaction.ts`)

| Class | Goes on |
|---|---|
| `CARD_ON_HOVER` (= `CARD_REVEAL`) | anything you read on the picture |
| `CARD_REVEAL_CONTROL` | a button on the picture: hidden, untappable at rest, still tabbable |
| `CARD_ZOOM`, `CARD_PRESS`, `CARD_FOCUS` | the media (3% zoom), the frame (98% press), the open target (inset ring) |
| `CARD_IMAGE_EDGE` | every card with a picture: an `outline-image-edge` hairline (white 10% on dark, black 10% on light) |
| `CARD_FRAME.xl` / `["2xl"]` / `["3xl"]`, `CARD_FRAME_EDGE`, `CARD_FRAME_EDGE_SOFT` | a framed picture: corner, matching clip-path and edge on one curve |
| `CARD_BAND_TITLE`, `CARD_BAND_SUBTITLE`, `CARD_TITLE`, `CARD_SUBTITLE`, `CARD_OVERLAY_TITLE` | text on a band or over a picture |
