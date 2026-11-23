# Sloosh design-system rules

Read this when you build or change any screen, and before you accept a request: a request that breaks a rule gets flagged first, then either the rule changes here or the request bends.

Numbers 1 to 27 are the repo's own ("DS rule 11" means rule 11 below). The foundation rules have no number.

## Foundation rules

- **Tokens only.** No hex, `hsl()`, `rgb()`, raw palette classes (`text-white`, `bg-black/40`, `bg-neutral-800`) or arbitrary colour, px size or radius values in `components/` or `app/`. A missing colour is a new token in `styles/tokens/semantic.css` plus a mapping in `styles/theme.css`. Why: one edit restyles every screen in both themes.
- **Two themes, always.** Every change must read right in dark (default) and light (`lib/theme.ts`). Why: the light theme is live behind the navbar sun / moon.
- **The yellow rule.** Yellow fills (`bg-brand-accent text-brand-accent-foreground`) are the same in both themes. Yellow text, icons, rings and lines on the ground use `*-brand-accent-text`; on light, yellow text is for display-size titles (20px and up) and accents only, never a caption, label, price or link. Why: yellow on white is about 1.5:1, below AA.
- **Overlays on media.** Text, badges and dims on a photo or video are `bg-media-scrim/*` with `text-on-media` / `text-on-media-muted`, never `bg-background/*` or `text-foreground`. Why: the picture does not change with the theme, so its overlay must not either.
- **Yellow CTAs are keycaps.** Every yellow call to action is `<Button variant="primary">` or `buttonVariants({ variant: "primary", size })`; no hand-made yellow buttons and no opacity on a shown button or its parent. Why: the slab lip, hover and glint live in the variant.
- **Buttons are slabs.** Lip, hover and glint come from `keycap-slab` (`styles/theme.css`) and the per-style edge tokens. Never add `shadow-*`, `transition-*`, press classes or a radius to a `Button` at the call site. Why: they fight the slab's own motion.
- **Primary CTA last.** In any row of buttons (bar, band, card, dialog foot) the `variant="primary"` key sits on the right, after secondary or white; a row's one main action beside a hint sits on the right too. Why: the eye ends where the main action is.
- **No gradients.** Flat colours only: no `bg-linear-*`, `bg-radial-*`, `from-` / `via-` fills, gradient text or glows. Why: Sloosh is flat; gradients read as generated. The only exceptions, each locked to its file:
  - Alpha masks that fade an edge: `mask-image`, `GradualBlur` (`components/ui/gradual-blur.tsx`), `scroll-fade-y` (`styles/theme.css`), plus the dot grid and artwork (`components/shell/sloosh-logo-art.ts`, image files).
  - Creator Pass foil, glare and glow: `components/creator-pass/creator-pass.css`, `--pass-*` tokens.
  - Loading light: `.skeleton-shimmer` (`styles/theme.css`) through `Skeleton shimmer` and `ShimmerReveal`; `ShimmerText` (`components/ui/shimmer-text.tsx`) on one short status line only, never titles or copy at rest.
  - AI Film Award metal type, `silver` keycap and CRT: `components/ai-film-award/metal.ts`, `tv.tsx`, `award.css`.
  - Black Friday sale surfaces (bar, pricing banner, pop-up; never plan cards): `components/sale/sale.css`, `--sale-*` tokens.
  - Microdrama's first screen: a radial `--media-scrim` wash and a fade into the ground, `components/microdrama/make/start.tsx`.
  - Audio's running border on the composer mode chip: `.sl-run-border` (`styles/theme.css`).
- **Doodles only in two places.** `HoverDoodles` (`components/ui/hover-doodles.tsx`) goes on the footer's social cards (`components/home/home-footer.tsx`) and the homepage's bottom link pills (`components/home/home-b.tsx`), never on template, space or any other card. Why: on cards they read as noise; a card's flourish is its normal hover.
- **Show all, scroll sideways.** Never cap a row or chart to a top N. Every item shows; when they overflow, the row scrolls horizontally (`overflow-x-auto`, hidden scrollbar, as the composer's `MediaRow`) with a faded cut edge, and pinned parts (an axis) stay outside the scroller. Why: a hidden item looks like missing data.
- **Avatars are light initials.** A person is initials on a light disc of their tone, `--avatar-<tone>` with `--avatar-<tone>-foreground` (`AvatarTone` in `components/ui/avatar.tsx`: blue, emerald, amber, violet, red, indigo), the same in both themes. Never an emoji, an icon, a saturated disc or the brand yellow. Why: emoji and solid discs look cheap.
- **Every icon animates.** See `icons.md`. Why: icons answer hover and press the same way everywhere.

## Numbered rules

1. **Form pickers float beside the form.** A list opened from a form on a form + showcase screen opens beside the form card on the showcase side: `side="right"`, `sideOffset` 28, `collisionPadding` 16; on phones it is a bottom sheet (`phone-sheet`, built into `Dropdown`). Why: opening inside the form hides the fields it belongs to.
2. **Nested corners are concentric.** Inner radius = outer radius minus the padding between them: a menu is `rounded-panel` (20) with `p-2` (8), so its items are `rounded-xl` (12); a label 4px in from a `rounded-xl` tile is `rounded-lg`, 6px in is `rounded-md`. A card whose layers blur clips to its radius with `[clip-path:inset(0_round_var(--radius-xl))]`. Why: mismatched curves look bitten; backdrop blur ignores `overflow-hidden` corners.
3. **Form rows are one size.** Every row in a form column has one height and padding (AI Influencer: `rounded-panel` sections, 52px rows, 12px padding, tiles 3 across 8px apart), and a row in a scrolling column is `shrink-0`. Why: a flex column squeezes rows that are not `shrink-0`.
4. **Picked states.** A pick shown as a pill is `bg-picked-pill text-picked-pill-foreground`; in a menu or list the pick is a tick only, no fill; picked photo tiles wear `--picked-ring`. Why: one picked look per surface type, and it passes the yellow rule on light.
5. **Cards are clean at rest; hover brings everything at once.** At rest a card is only its picture plus `CARD_IMAGE_EDGE`; title band, badges, pills, maker, like, dots, tags and actions come on hover or keyboard focus via `CARD_ON_HOVER` (read) and `CARD_REVEAL_CONTROL` (press) inside a `group/card` (`lib/card-interaction.ts`); touch shows only the picture and a tap opens the preview. Why: the picture is the product; overlays at rest clutter every grid. Exceptions:
   - Cards still being made keep their status at rest (rule 8).
   - Space cards show the maker or Sloosh eye and the title band at rest (`CardBand atRest`, `components/spaces/list/space-card.tsx`); hover adds only Run Space.
   - Homepage feature cards (AI Influencer, Synora, Calypso, Retake) show name and line at rest; homepage B's cards carry their words under the picture (`components/home/home-b.tsx`).
   - Audio cards show length and voice tags as pills at rest; play waits for hover (`components/ui/audio/audio-card.tsx`).
6. **Showcase tabs stay put.** A showcase's tab bar is sticky at the top of its scroll on the page's own ground, with the rule 7 fade under it; the panel hairline is an `after:` ring at `z-20` above the scroll. Why: the tabs are the showcase's navigation.
7. **Anything that cuts blurs.** Content that scrolls under something pinned meets a `GradualBlur` preset, never a hard edge: `TAB_BAR_BLUR` under top bars (`h-8`, shown once scrolled), `COMPOSER_BLUR` over anything pinned at the foot (`lib/card-interaction.ts`). No flat translucent bands, no `bg-background/80 backdrop-blur` strips. A column scrolling inside a page uses `scroll-fade-y`. Why: a hard cut slices cards mid-picture. Exception: the Spaces page's pinned bar ends in a 1px `--border` line once scrolled (`components/spaces/list/spaces-list-screen.tsx`).
8. **Generating cards are one card.** Anything being made is the studio's generating card: `PixelLoad` (`components/ui/pixel-load.tsx`) on the muted card, the credit pill and `GeneratingTag` in `CARD_CORNER_CLASS`. Never a full-screen loader or a separate step. Why: the result lands where it was asked for.
9. **Reset sits in the form's header.** Reset is a labelled ghost button in the form header after Surprise me, disabled until something changed, resetting every field. Never beside the primary, never a bare Undo icon. Why: it is destructive, so it stays away from Generate.
10. **Full-page flows open with one intro.** `ShowcaseIntro` (`components/ui/showcase-intro.tsx`) sits above a full-page flow's templates: three silent examples, a `text-display-20` line, a two-line `text-sm` description, and Learn how it works (32 tall). Why: one way in for every flow.
11. **Icon buttons are grey until hovered.** An icon-only key on the ground is `text-muted-foreground` at rest and `text-foreground` only on hover, keyboard focus, current page or menu open; use `variant="ghost"` or `"ghost-fill"`. Filled keys and `text-on-media` icons keep their own colours. Why: white glyphs at rest shout over the content.
12. **One edge per curve.** A piece flush in a card's corner never draws the card's exact curve: set its curve 1px outside (`-top-px -right-px`, same radius) or inset it 4px or more with a concentric radius. Why: two anti-aliased edges leave a hairline of the shape underneath.
13. **A composer's panels are as wide as its band.** A panel a composer opens is exactly the fold band's width (16px in from each card edge), placed by the composer (`ComposerPanel`, `components/ui/composer-panel.tsx`). Why: a panel at its own width looks detached from the composer.
14. **Cards scroll under what's pinned.** A card root is `isolate`, and a grid under a sticky bar is `isolate`. Never raise the bar's z-index to fix an overlap. Why: the next card layer would beat a raised bar again.
15. **A framed picture keeps one clean curve.** Never a CSS `border` under a `clip-path` on the same edge; clip the picture and draw the edge on top with `CARD_FRAME_EDGE` (2px) or `CARD_FRAME_EDGE_SOFT` (1px, many pictures). Big blocks are `rounded-3xl`, small tiles `rounded-2xl`, one radius per size per page. Why: a clipped border looks bitten at the corner.
16. **Pills have no border.** A pill is a fill (`bg-muted`, `bg-card`, a status wash, the picked face) and text, never `border` or `ring`; on a picture it is `bg-media-scrim/60 text-on-media`. `ChoicePill` at rest and `QUIET_TAG_CLASS` (`components/ui/pill.tsx`) are still outlined: do not copy them. Why: outlined pills read as buttons.
17. **Never the purple-blue "AI" gradient.** No magenta, violet or blue sweep, rainbow conic or purple-blue pill, as fill, rim, glow or text. Colour light comes from a real picture; metal is chrome or silver (`--sale-chrome`, `--sale-silver`, `--award-metal`). Why: it reads as generated slop.
18. **A stepped window is one height, upload first.** A stepped dialog keeps one height for every step (`flex h-[min(28rem,85dvh)] flex-col gap-5 p-6`), heading on top with a ghost Back, one full-width `size="48"` action pinned at the foot; an upload step leads with `UploadTile size="lg"`. Reference: `components/ui/audio/clone-voice-dialog.tsx`. Why: a window that changes height jumps under the pointer.
19. **A new surface starts from one we have.** Before building a dialog, upload, picker, full view or card, copy the closest existing one: stepped dialogs `clone-voice-dialog.tsx`, uploads `UploadTile` / `UploadBox` (`components/ui/upload-box.tsx`), full screen `AssetPreview` (`components/assets/asset-preview.tsx`), being made rule 8; a new page section copies its sibling sections. If nothing fits, say so and name the base first. Why: invented layouts read as a different product.
20. **Empty states are `EmptyState`.** An empty list shows `EmptyState` (`components/ui/empty-state.tsx`: critter, `title`, `body`, `actions` with the CTA named for the action). No new markup, no card around it, no shimmer, never a bare line. A search with no match may stay one line. Reference: `EmptyProjects` in `components/microdrama/live/home.tsx`. Why: every empty state points the way in the same way.
21. **A model is always picked by its logo.** Every model option and the closed control show `ModelLogo`; a Select is `ModelSelect` (`components/ui/model-select.tsx`: 32px rows, list capped at 288px, opens under its button). Why: text-only lists overlap their trigger and models are recognised by mark.
22. **Tabs and pickers share one line (Settings).** Pill tabs (`PAGE_TAB_CLASS` over `TabTrack`) on the left, pickers on the right, one row under the section title, all 36 tall (`SettingsFilters`, `components/settings/settings-parts.tsx`); on phones the pickers wrap under the tabs. Outside Settings, flag before changing. Why: a picker beside the title splits one control set in two.
23. **A toast is two lines at most.** What just happened plus, if it matters, one consequence, in the fewest words; no explanations, no repeated names. Why: the screen already shows the rest.
24. **A working key is dimmed, with a spinner.** While its job runs, the key is disabled with the flow's `Spinner` before its words (`Busy`, `Spinner` in `components/ui/spinner.tsx`); a page's main key says what is happening ("Making clips · 2 of 3"). Why: a dimmed key without a spinner looks broken.
25. **Credits are yellow, and a key that spends says how much.** A price on a key is `CostPill`; a credit figure on the ground is `CreditTag` (`components/microdrama/live/parts.tsx`); never a bare number. Every charged key, retries included, carries its price. Why: no one should spend credits blind.
26. **A large view is where its thing is worked on.** A thing opened large (`FullView`, `components/microdrama/make/full-view.tsx`) opens with the caret in its prompt, runs its actions in place, sits under every popup, traps focus and returns it on close. Why: sending people back to the page to see a result breaks the loop.
27. **A banner is one short line.** `Notice` (`components/ui/notice.tsx`): 14px, `title` then a quieter `line`, actions at the far end with the main one last; `tone` is `warning` or `danger`; it wraps, never truncates. Why: a banner that needs two sentences has too many words.

## Examples from the code

```tsx
// Correct: primary last (components/mcp/connected-accordion.tsx:254)
<div className="flex justify-end gap-3 px-6 py-4">
  <Button variant="secondary" size="40" onClick={onDone}>Cancel</Button>
  <Button variant="primary" size="40" disabled={!changed}>Save Changes</Button>
</div>

// Correct: the empty state (components/microdrama/live/home.tsx:171)
<EmptyState title={S.emptyTitle} body={S.emptyLine} actions={<Button variant="primary" size="36">…</Button>} />
// Incorrect: custom empty markup and copy in the component
<div className="flex min-h-[420px] flex-col …"><p>No generations yet</p>…</div>

// Correct: a pinned bar's edge (components/ai-influencer/maker.tsx:285)
<GradualBlur {...TAB_BAR_BLUR} position="top" className="top-full h-8" />
// Incorrect: a translucent strip with a hard line
<div className="fixed … border-t border-border bg-background/90 backdrop-blur-md">

// Correct: overlay on media (components/ui/template-card.tsx:81)
"… rounded-lg bg-media-scrim/70 text-on-media …"
// Incorrect: raw palette in a ring
"after:ring-black/10 dark:after:ring-white/10"

// Correct: icon key grey at rest (components/ui/theme-toggle.tsx:39)
<Button variant="ghost" size={size} aria-label={label}>…</Button>
// Incorrect: white glyph at rest in a close key
<Icon icon={Cancel01Icon} className="h-5 w-5 text-foreground" />

// Correct: a borderless label pill (components/spaces/explore/category-hero.tsx:44)
<p className={LABEL_PILL_BRAND_CLASS}>…</p>
// Incorrect: an outlined pill
"… ring-1 ring-border-strong ring-inset"

// Incorrect: a gradient fill outside the exceptions
<div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-(--page-bg)" />
```
