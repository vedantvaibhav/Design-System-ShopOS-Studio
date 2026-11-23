# Feedback and loading

Read this when you tell the user something happened (toast, empty list, celebration), show progress or usage, or fill the gap while something loads or arrives.

All files are in `components/ui/`. Every loader respects reduced motion by itself; don't add your own.

## What do I show while something loads

```
The app moves to another section (a nav click)?   -> nothing: NavLoader already shows PageLoader
A paid thing is being made (image, video, audio)? -> the generating card: PixelLoad + credit pill + GeneratingTag
  inside Synora (its takes and videos)?           -> DotLoader + GeneratingTag on the same muted card
A grid of cards loads or switches tab (Studio)?   -> ShimmerRevealGroup + ShimmerReveal
A list or grid is settling (a search, a fetch)?   -> Skeleton in each card's shape
One step is working ("Reading your script")?      -> ShimmerText on that one line
A key's job runs (a second or more)?              -> disabled Button with <Busy>label</Busy> (ui/spinner.tsx)
Something small working inline (a key test)?      -> Spinner (ui/spinner.tsx)
Loaded, and the list is empty?                    -> EmptyState
```

Something being made is always a card in its place, never a full-screen loader or a separate step, because the user keeps working around it.

## Toaster (`toaster.tsx`)

1. A confirmation of what the user just did. A problem on screen that needs action is a `Notice` (`surfaces.md`); an empty list is `EmptyState`.
2. Call `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()` from `sonner`, with `description` and `action` as needed. `Toaster` is mounted once in `app/layout.tsx`. Nothing else exists.
3. One design: a card bottom right, always dismissible. Never pass `position`, so every toast lands in one place. **Two lines at most: what happened, then one consequence if it matters, in the fewest words.** No explanations, no how-it-works, no repeated names; the screen shows the rest.
4. Examples:
```tsx
// Correct: lib/mock/microdrama-make.ts:695, called at components/microdrama/make/stage-cast.tsx:209 with Undo
`${name} removed. Episodes that need it will flag it.`
// Incorrect: four lines that explain the checkout
toast(`${what}: taking you to Stripe`, { description: "Black Friday price applied, no code needed: {due} for your first {period}. On the live site this opens Stripe's payment page." });
// Fixed: toast(`${what}: taking you to Stripe`, { description: "Black Friday price applied." });
```

## EmptyState (`empty-state.tsx`)

1. **Every empty list of the user's own things**: a Jam critter, a headline, one line on what to do, a CTA named for the action. A search with no match stays one line, or uses EmptyState with Clear.
2. Props: `title`, `body`, `seed`, `actions`, `className`. Nothing else exists.
3. Defaults: `seed` is the title, so a state keeps its critter. Actions are secondary or ghost at 36, the primary last. No custom markup, no card around it, no shimmer or effect on its words.
4. Examples:
```tsx
// Correct: components/microdrama/live/home.tsx:171
<EmptyState title={S.emptyTitle} body={S.emptyLine} className="py-24 max-md:py-16" actions={<Button variant="primary" size="36" onClick={go}>…{S.newProject}</Button>} />
// Incorrect: two lines of hand-made markup and no CTA
<div className="flex min-h-[420px] flex-col items-center justify-center gap-1 text-center"><p>No generations yet</p>…</div>
```

## Generating card: PixelLoad (`pixel-load.tsx`) and DotLoader, GeneratingTag (`dot-loader.tsx`)

1. Anything being made: PixelLoad fills the card for image, video and audio takes; DotLoader, a ring of dots, sits centred in Synora. Not for page loads.
2. `PixelLoad`: `hold`, `onDone`, `className`. `DotLoader`: `seed`, `className`. `GeneratingTag`: `since`, `label`, `className`. `useNow()` is the shared clock. Nothing else exists.
3. Defaults: `hold` true (keeps waving until the run ends), `label` "Generating". The card is `bg-muted`; the credit pill and `GeneratingTag` ("Generating · 6s") sit in `CARD_CORNER_CLASS` (`pill.tsx`) and show at rest, the one exception to hover-only cards.
4. Examples:
```tsx
// Correct: components/studio/generation-card.tsx:260 and :310
<PixelLoad className="absolute inset-0 bg-muted" />
<span className={CARD_CORNER_CLASS}><GenerationCreditPill credits={generation.credits} /><GeneratingTag since={runStart(generation)} /></span>
// Incorrect: a pulse and a spinner pill instead of the generating card
<Skeleton className="absolute inset-0 rounded-none bg-muted" /><span className="… bg-background/80 …"><Icon icon={Loading03Icon} className="animate-spin" />Generating...</span>
```

## Skeleton (`skeleton.tsx`)

1. A grey placeholder in the shape of what is coming. Cards that reveal in place use ShimmerReveal, which draws the shimmer for you.
2. `shimmer` (boolean), plus div props. Nothing else exists.
3. Default: a pulse on `bg-muted`, `rounded-md`. `shimmer`: the band of light that crosses every loading card in sync. Match the real card's ratio and corner.
4. Examples:
```tsx
// Correct: components/spaces/explore/spaces-templates.tsx:102
<Skeleton key={i} className="aspect-4/5 rounded-xl" />
// Incorrect: the pulse rebuilt by hand
<span aria-hidden className={cn("block shrink-0 animate-pulse rounded-xl bg-muted", size)} />
```

## ShimmerReveal, ShimmerRevealGroup (`shimmer-reveal.tsx`)

1. Cards that load in place: each holds its shape as a shimmer, then cross-fades into itself, so the grid never jumps.
2. `ShimmerRevealGroup`: `ready`. `ShimmerReveal`: `className`, `skeletonClassName`. `useInRevealGroup()`. Nothing else exists.
3. Outside a group a card is simply there. Remount the group with a `key` to start over; a Masonry inside it takes `rise={false}`.
4. Examples:
```tsx
// Correct: components/studio/studio-screen.tsx:693 around components/studio/generations-grid.tsx:88
<ShimmerRevealGroup key={…} ready={!loading}>…<ShimmerReveal className="size-full"><GenerationCard … /></ShimmerReveal>
// Incorrect: a ShimmerReveal with no group around it. It never shimmers.
<ShimmerReveal><TemplateCard template={t} /></ShimmerReveal>
```

## ShimmerText (`shimmer-text.tsx`)

1. **Only a short working status line while something works** ("Reading your script"). Never on a title, an empty state, or anything at rest, because a light that never stops reads as broken.
2. `onMedia`, `className`. Nothing else exists.
3. Default: quiet colour with the full colour passing over. `onMedia` over a picture.
4. Examples:
```tsx
// Correct: components/microdrama/make/start.tsx:70
<ShimmerText onMedia>{lines[at]}</ShimmerText>
// Incorrect: a title that shimmers at rest
<p className="text-text-20"><ShimmerText>Your projects</ShimmerText></p>
```

## PageLoader (`page-loader.tsx`)

1. The section loader: two Sloosh eyes and "Slooshing it". `components/shell/nav-loader.tsx:47` already shows it on every section change; onboarding uses it once (`components/onboarding/onboarding-host.tsx:131`). Never for a generation.
2. `label`, `leaving`, `onLeft`, `className`. Nothing else exists.
3. Default `label` "Slooshing it". It fills its positioned parent; `leaving` plays the exit, then `onLeft` fires.
4. `// Incorrect:` `{generating && <PageLoader label="Generating" />}`. Use the generating card.

## MotionTitle (`motion-title.tsx`)

1. **Every display title** (Bricolage, `text-display-*`): its letters settle in once as it scrolls into view. Not for prices or numbers.
2. `as`: `"h1" | "h2" | "h3" | "p"`; plus `children` (a string), `parts`, `now`. Nothing else exists.
3. Default `h2`, plays on scroll-in. `now` for a title above the fold. `parts` for a title with a coloured piece.
4. Examples:
```tsx
// Correct: components/ui/faq-section.tsx:57
<MotionTitle as="h2" id={id} className="text-display-48 text-foreground max-lg:text-display-36" parts={[{ text: title }]} />
// Incorrect: a display title without it
<h2 className="text-display-24 text-pretty">{title}</h2>
```

## Small parts

| Part | Use | Not |
|---|---|---|
| `Reveal` (`reveal.tsx`) | A marketing block rising as it scrolls in: `size` `"sm" \| "md" \| "lg"` (default `lg`, 32px over 480ms), `delay` in seconds, `as` `"div" \| "li"`. Real: `components/pricing/outcomes.tsx:129`. | App cards: they take `data-rise` (Masonry items have it). Never nest it. |
| `UsageMeter` (`usage-meter.tsx`) | How much of a limit is spent: `value` 0 to 1, `tone` `"default" \| "warning" \| "danger"`, `label` (required). Real: `components/settings/team-usage-screen.tsx:140`. | A bar animated by `width`: it grows with `scaleX` only. |
| `celebrate()`, `ClaimCelebration`, `ClaimCat` (`claim-celebration.tsx`) | A claim moment only (an offer or free credits claimed): the done sound, two seconds of confetti, the cat on the toast. Real: `components/offers/offers-provider.tsx:258`. `ClaimCelebration` is mounted once. | Everyday saves and uploads. |
