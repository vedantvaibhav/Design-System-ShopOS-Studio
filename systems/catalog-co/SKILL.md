---
name: catalog-co
description: The ShopOS Studio design system in one file. Use it for any ShopOS Studio screen, component or review, in any stack. It holds every rule from the owner's design reviews (1 to 38), the resolved tokens for light and dark as copy-paste CSS, the motion system with its code, component recipes, screen patterns, fonts and icons, and a checklist. Follow it exactly; where your own taste disagrees, this file wins.
---

# ShopOS Studio design system (agent edition)

ShopOS Studio is the client portal for ShopOS customers (sample client: "The Bear House"). This file
is the whole design system. You need nothing else to follow it. A fuller package exists (component
gallery, the original Figma specs, and the approved clickable prototype); if you have it, treat it as
the reference implementation, and this file as the law.

## How to work from this file

1. **Order of authority:** the rules below, then the token values, then the component recipes, then
   your judgement. Never invent a colour, size, radius, shadow, font or motion: every value you need
   is in "Tokens" below.
2. **Start every stylesheet with the Tokens block, unchanged.** Style everything through the
   variables (`var(--bg-primary)`), never raw values, so dark mode works by itself.
3. **Build a screen from the patterns:** page header, one row of button tabs, then the content as
   table blocks, picture-card grids or fill tiles. Copy the recipes in "Components" and rename the
   classes to your stack if needed; keep the values.
4. **Before you call it done, run the checklist at the end.**

Names in parentheses inside the rules (such as `.tblwrap`, `kpiCards()`, `js/router.js`,
`css/screens.css`) point at the prototype's code. You don't need those files to follow a rule; the
recipes below carry the same values.

## Where the look comes from

Three decisions change it from the source:

1. **North star: the ElevenLabs app.** Values come from its app CSS and a measured screenshot (Nov 2026).
   Surfaces and lines take Apple's light system greys (cool, slightly blue); text is warm brown in
   four tones (rule 15). Hairlines are Apple's separator ink at 13% (`--border-secondary`), control
   borders at 18% (`--border-primary`), fills step #f2f2f7, #e9e9ee, #e5e5ea. The page is ONE white
   surface (`--bg-primary`); the sidebar (`--bg-frame`) and side panels (`--bg-panel`), both
   #f2f2f7, sit behind it, and the page casts a
   soft shadow onto them (rule 16). The one main button is ink: the darkest text tone with white text
   (`--cta-solid`, `--cta-fg`). Secondary: a 10% hairline and no fill. Tertiary: no fill, grey on
   hover. Colour appears only in photos, status, label accents and calendar blocks (rules 3, 4, 24).
   `--brand-*` and `--secondary-*` are unused spares.
2. **One grey: the neutral scale.** `--gray-*` is 25 #fcfcfc · 50 #fafafa · 100 #f5f5f5 · 200 #e5e5e5 ·
   300 #d4d4d4 · 400 #a3a3a3 · 500 #737373 · 600 #525252 · 700 #404040 · 800 #262626 · 900 #171717 ·
   950 #0a0a0a. Prefer the semantic tokens: in light, lines are black at an alpha, so they sit
   correctly on any surface, and text reads the four tones, not the grey scale.
3. **Eleven colour families, not thirty.** Kept: base, gray, error, warning, success, four accents
   (indigo, purple, pink, orange) and two spares nothing uses (brand, secondary). Dropped families map
   like this when a spec names them: Blue / Blue light / Blue dark → indigo when it is a label accent,
   otherwise the neutral semantic token · Gray blue and every other gray → gray · Green → success ·
   Yellow → warning · Fuchsia → pink · Orange dark → orange · Cyan, Teal, Moss, Green light, Violet,
   Rosé → don't use. Every `--utility-brand-*` token resolves to its `--utility-gray-*` twin.

## Rules

1. **Tokens only.** No hex, rgb or named colours in page or component CSS. Use semantic tokens
   (`--text-*`, `--fg-*`, `--bg-*`, `--border-*`, `--utility-*`, component tokens). Primitives
   (`--gray-500`, `--indigo-600`) only inside tokens.css, or for a chart series with no semantic token.
2. **Ink is for the one main action.** The main button is the dark ink CTA: `ds-btn--primary`, fill
   `--cta-solid`, text `--cta-fg` (white on near-black in light, black on white in dark). One per
   view or section: Submit, Approve, Agree plan, Start review. Everything else is secondary, tertiary
   or a link. The brand colour (`--brand-*`) is not used for buttons or for selected states. A
   selected or current item (tab, chip, nav item) takes the grey fill `--bg-quaternary` (rule 19); a
   checked box, radio or toggle is ink (`--bg-brand-solid`, an alias of `--cta-solid`).
3. **Status colours mean status.** Green (success) = done, approved, delivered, a good change. Red
   (error) = failed, destructive, blocking, a bad change. Yellow (warning) = needs attention, due
   soon, waiting on the user. Never decorative. The one exception is the calendar, whose blocks
   carry category colours (rule 24).
4. **Accents are for labels only:** badges, tags, avatar initials, chart series, category markers
   and calendar blocks. The accents are indigo, purple, pink and orange. Pick a fixed accent per
   category and keep it. The calendar also uses the yellow and green tints for two of its
   categories (rule 24); it is the only place those two mean a category and not a status.
5. **Text colours by role:** `--text-primary` headings and key values · `--text-secondary` body and
   labels · `--text-tertiary` supporting text (`--text-quaternary` is the same tone) ·
   `--text-placeholder` hints and placeholders. Links are ink and underlined, never coloured
   (`--text-brand-secondary`). Icons use the matching `--fg-*`.
6. **Surfaces:** page `--bg-primary`; behind the page `--bg-frame` (sidebar) and `--bg-panel` (side
   panels); fill tiles and the first card step `--bg-secondary`; muted fill `--bg-tertiary`; selected
   or current `--bg-quaternary`. Hover steps the fill one grey (rule 25). Lines: `--border-secondary`
   for hairlines (dividers, cards, table blocks), `--border-primary` for control borders (fields,
   outlined buttons, filter chips).
7. **Focus is always visible, and it is `--ring` everywhere:**
   `:focus-visible{outline:none;box-shadow:var(--ring)}`, a 1.5px ink ring with a 2px gap in the page
   colour, on every control. An invalid field swaps in `--ring-error`. The one control that draws no
   ring of its own is a text area inside a prompt or composer (rule 27): the card around it shows focus.
8. **Dark mode comes free.** tokens.css switches on the OS setting and on `data-theme="dark|light"`
   on `<html>`. Don't write per-theme colours in components; if something looks wrong in dark, the
   wrong token is in use. The dark values are in rule 15.
9. **Use the type scale, not ad-hoc sizes.** Only the sizes in Typography below. Weights: 400 for
   body; 500 for labels, buttons, names and titles; 600 only for large display numbers. No monospace
   anywhere: numbers that must line up use `font-variant-numeric:tabular-nums`.
10. **Build from components.css first;** if a component isn't there, implement it from its spec in the
    references and add it to components.css (with a gallery entry) rather than styling it inline.
    Its sizes, corners and shadows come from rule 13, not from the Figma numbers.
11. **Everything enters with a slight ease.** New content fades in and rises 6px
    (`--motion-duration-appear` 360ms, `--motion-ease-out`); siblings follow one another 45ms apart.
    Use `.ds-appear` on one element or `.ds-appear-stagger` on a parent. Play it when content
    arrives (a page opens, a tab or filter swaps its pane, a panel or list loads), never when the
    page only redraws in place (typing, a toggle, ticking a box), or the page flickers. Rule 36 says
    which controls trigger it and how. Overlays (modal, menu, command bar, slideout, toast, tooltip)
    ease in with their own short pop or slide. Exits are quick or instant.
12. **Icons are Lucide and generated.** Never hand-draw an icon or paste SVG by hand: add it to
    `scripts/build-icons.mjs` (Lucide name plus a motion family) and regenerate `js/icons.js`. Every
    icon has a family: `draw` (strokes redraw), `bob`, `hop`, `pulse`, `tilt`, `ring`, `spin`, `rock`,
    `nudge`, `nudge-up`, `shuffle`. On first paint an icon group draws in once (`.ds-icons-appear` on
    its container, removed after). An icon's family is the only movement an icon may ever have, and
    the Motion block of components.css is the one place that turns a family on. As of Nov 2026 it
    turns none on for hover or focus, so after drawing in, icons stay still (rule 25).
13. **Sizes, corners and shadows are ElevenLabs'.** Controls: 28 / 32 / 36 (default) / 40px tall with
    12 / 12 / 13 / 14px corners, one roundness (about 35% of the height, set by the 40px quick-start
    tile) for every button, icon button, tab, field and nav item (`--size-control-xs`, `--size-control-sm`,
    `--size-control`, `--size-control-lg`; `--radius-control-sm`, `--radius-control`, `--radius-tile`);
    icons 16px; cards 16px corners (`--radius-card`) with a hairline or a fill (rule 18) and NO shadow;
    rail 56px, top bar 48px. Shadows are their "natural" stack, a 1px ring plus tiny tight drops:
    `--shadow-elevation-1` (tiles, the prompt), `-2` (menus, focus), `-3` (floating panels), `-high`
    (modals). Never a heavy or coloured shadow, never a border plus a ring on the same edge. Circles are
    true circles (`.ds-btn--round`, `.ds-avatar`: `aspect-ratio:1`, `border-radius:50%`, `flex:none`) and
    every icon-only control has an `aria-label` and a `title`. Focus: `--ring` (rule 7).
14. **Reduced motion: nothing moves except loading spinners, which slow down.** Under
    `prefers-reduced-motion` no entrance, overlay, icon or transition plays; content is simply there.
    A loading spinner keeps turning, slowed to one turn in 2.4s, because it is the only sign that
    work is still going. Every keyframe starts and ends at rest, so stopping never jumps.
15. **Text is brown, in four tones.** Light mode sets `--tone-1` #1c1410 (headings, key values, the
    primary button) · `--tone-2` #42352c (body, nav labels) · `--tone-3` #6e6055 (supporting text, group
    labels, icons at rest) · `--tone-4` #8c7e72 (placeholders). Every `--text-*` / `--fg-*` token reads
    them, so never set a text colour by hex; to retune the whole app change the four tones. Don't name a
    new variable `--ink-*`: the old screens' stylesheet owns that name and the two form a loop.
    Dark mode uses the iOS greys with the page as the grey: `--bg-primary` #1c1c1e, and everything
    behind it (sidebar, Messages panel, `--bg-frame` / `--bg-panel`) black; cards on the page step up
    #2c2c2e, #3a3a3c, #48484a (`--bg-secondary`, `--bg-tertiary`, `--bg-quaternary`); separators
    #303032, control borders #3e3e41; text is neutral (#ffffff, #d1d1d6, #98989f, #636366), not the
    warm light-mode browns; the primary button is white with black text. Nothing on the page is
    darker than the page. Never write a fixed light colour (#fff, a beige, a blue link) in page CSS:
    it breaks dark.
16. **A side panel docks; it doesn't float.** Messages opens as a 352px panel on `--bg-panel`, full
    height on the right: it slides in and the page makes room (`body.msgs-open .app{padding-right}`).
    The panel is flat (no shadow). On desktop the page is one card that scrolls inside itself
    (`.shell-main` is the scroller, the window never scrolls). It always rounds its left corners
    (20px, `--radius-banner`) beside the sidebar, open or closed, as ChatGPT does, and its right
    corners beside the Messages panel. The card has no border: its fill against the
    frame is its edge (rule 18). It casts a soft shadow onto the sidebar (`--shadow-page-edge-l`) and, with
    Messages open, onto the panel (`--shadow-page-edge`), so both read as behind it. The sidebar is
    transparent over the body's frame colour and sits above the page, so its tooltips and menu stay on top. The top bar has a bottom
    hairline and no side border. Scroll the page
    with `pageScroller()` / `pageScrollTo()` (`js/router.js`), never `window.scrollTo`: on a phone the
    window scrolls, on desktop the card does. Inside: a
    48px header (title, close, back in a thread), a list, and the composer as a floating card
    (16px corners, `--shadow-elevation-3`). On a phone it takes the whole screen, no corners. Use this
    for any secondary surface that stays open beside the page; a modal only for a task that must finish.
17. **Older screens are restyled in one place.** `css/screens.css` brings every screen built on the old
    `css/styles.css` classes (`.btn`, `.tab`, `.pill`, `.inp`, `.stat`, tables, cards, the calendar) to this
    system: sentence-case labels (no uppercase, no letter-spacing), no monospace (numbers use
    `tabular-nums`), 36/32px controls with 13/12px corners, one dark primary button per view (Approve
    included; green is for status only), grey fill for the selected chip, dark toggles, hairline cards
    with no hover lift. Change a shared piece there, not per screen. New screens use `ds-` components.
18. **Fill or border, never both, at rest.** A control or card in its default state has either a fill
    or a hairline. A fill is a tint that differs from the page; a background in the page colour
    (`--bg-primary`) is not a fill, so a hairline card may sit on it. Fill: avatars, badges, count
    badges, the selected chip or nav item, notes, keyboard keys, status pills (also over photos),
    fill tiles (bento, upload). Hairline, no fill: outlined (secondary) buttons, fields and the search
    box, filter chips, cards, table blocks. Hover, pressed and selected states may add a fill.
    Floating surfaces (menus, dialogs, toasts, the composer card, the Home prompt and tiles) are
    exempt: their edge is a shadow. A 2px cut-out ring around a badge that overlaps an icon is a gap,
    not a border.
19. **Tabs: one level is buttons; two levels are an underline over buttons.** A single row of tabs
    (Home's To do · In progress · Delivered) is buttons: 32px, 12px corners, the selected one
    filled (`--bg-quaternary`), the rest plain text that fills on hover. When tabs nest, the outer level
    is underline tabs and the inner level is buttons. Never two rows of the same style. Two
    relatives: a filter chip is outlined at rest (rule 18) and takes the same `--bg-quaternary` fill
    when selected; a segmented switch (Week · Month · Quarter) is a `--bg-tertiary` track whose
    current segment is a raised `--bg-primary` thumb with `--shadow-elevation-1`.
20. **The top bar's profile is a rounded square, not a circle.** It matches the icon buttons beside it:
    32px with 12px corners, a fill and no border. People avatars elsewhere (messages, rows) stay round.
21. **New request is the app's one primary button.** It lives in the top bar on every page. Page
    headers carry secondary buttons only (Add a plan, Import, Invite teammate, New moodboard) and never
    repeat New request. A primary inside the page is for the decision that page exists for (Approve,
    Agree plan, Send). No second floating New request: on a phone the tab bar's + is that button.
22. **No counting subtext over a page title.** Counts go where they filter: on the filter tabs
    ("Marketing 6"), not in a grey line above the heading.
23. **Picture cards put the words outside.** Idea cards and campaign cards are the picture alone (16px
    corners, no border); kicker, title and footer sit below it. Status and progress ride on the picture
    as pills ("Waiting on you" "2/6"), never a step bar.
24. **Calendar page: the calendar first, then Coming up.** The calendar follows the scheduling-app
    pattern: underline tabs to filter (level one), then the period and Today on the left, the Week ·
    Month · Quarter switch (segmented, level two) and the date range on the right; a gutter column,
    today's column tinted, weekends hatched, entries as soft colour blocks with their dates over a
    dashed rule. Quarter is a column per month. The blocks are coloured by category: indigo
    marketing, yellow catalogue, green delivered, lilac plans. This is the documented exception to
    rules 3 and 4. Coming up sits below the calendar: four picture cards (what starts next).
25. **On hover, text and icon go to the primary colour and the fill steps one grey.** Any non-primary
    button, tab, pill or icon button turns its text and icon to `--text-primary` / `--fg-primary`
    (near-black light, white dark) and its fill moves one step up the greys (none → `--bg-tertiary`;
    `--bg-secondary` → `--bg-tertiary`; `--bg-tertiary` → `--bg-quaternary`). The dark primary button
    keeps `--cta-fg` and goes to `--cta-solid-hover`. Nothing moves on hover: no lift, scale or
    slide. The only exception would be an icon's motion family, where components.css turns one on
    (rule 12).
26. **3D icons, sparingly (Airbnb).** A small clay-style 3D icon (`ICON3D` in `js/home.js`: soft gradient,
    top-left highlight, contact shadow) may stand in for a flat icon at most once per surface, e.g.
    the message row on Home. It stands on the page with no tile or fill behind it. Never in nav,
    buttons or dense lists.
27. **Text areas inside a prompt or composer draw no focus box.** The pill or card around them shows
    focus; the caret is the only mark inside.
28. **Collections (Library): filters on the right, actions on the picture.** Kind as button tabs on the
    left; other filters (format, campaign, date) as outlined selects on the right. Cards show no file
    details. A picture opens a preview; its three-dot menu downloads; ticking pictures raises a floating
    bar at the bottom ("2 selected · Download 2 · ×"). No disabled Download in the page header.
29. **Several sections on a page become tabs, not a two-column layout of cards.** Brand memory (Look,
    Voice, Products and audience, Learned, Moodboards, Sources) and Performance (Campaigns, Suggestions,
    Creatives, Reports) show one row of button tabs and one section at a time. Facts are label/value rows
    on hairlines, not boxed cards. A page-level number row (Performance KPIs) may sit above the tabs, and
    a period switch sits top right as a segmented control.
30. **An overview tab is a bento of fill tiles.** Brand memory opens on Overview: tiles on a 12-column
    grid, `--bg-secondary` fill, 16px corners, no borders, each with a small title and an arrow to its
    tab. Pills inside tiles are outlined. Lists of records (rules learned, sources) are tables; looks and
    voice are cards, never label rows. An "add" card is a soft fill with a 3D icon, never a dashed border.
31. **Number cards have a hairline all round, never dividers between them.** `kpiCards()`: label, the
    figure, the change in green (good) or red (bad) with "vs previous period", and a sparkline in the
    same colour with a soft area under it; Billing's cards carry a usage bar instead. Good and bad
    follow the metric (a rising cost per purchase is red).
32. **Tables sit in their own block.** A hairline all round (a border, so no fill), `--radius-card`,
    rows padded in from the edge. (App class `.tblwrap` in `css/screens.css`.)
33. **Review is a list first and a focused preview second.** The Review page lists each campaign
    as a heading (its name, with Review all beside it) over a table block of its batches; the heading
    sits outside the table block, never inside it. Opening a batch or a whole campaign goes to a full-screen
    preview with no sidebar and no top bar: items on the left, the creative in the middle with its
    frames or versions under it, notes on the right, and one bar under the creative with Send back
    and Approve. Approve is the only primary button in that mode (the top bar and its New request
    are not on screen there), so the "one primary button" rule still holds. (App: `css/review.css`;
    `.rvl` is the list, `.rvp` the preview.)
34. **A collapsed sidebar turns group headings into rules.** When the sidebar is collapsed, each
    group heading becomes a short hairline centred in the gap between two groups of icons, in
    `--border-primary`. (App class `.shell-nav__heading` in `css/shell.css`.)
35. **Uploading is a fill tile, never a dashed drop zone.** A place to add files is one fill tile
    (title plus one button); dropped or picked files appear in the list below it. (App class
    `.bm-drop` in `css/screens.css`.)
36. **Everything that comes on screen eases in.** Going to a page staggers its blocks
    (`.ds-appear-stagger` on `.page`), and inside them each grid, list and table staggers its own cards
    and rows, starting when its block does (`--appear-base`). A tab, filter or stepper click does the
    same for the part of the page it changes: put `data-enter="<selector>"` on the control or its
    tablist, or mark the pane `role="tabpanel"`. Dialogs and menus pop (`ds-pop`), the Messages panel
    and the Review preview's side columns slide in, a new note, pin or uploaded row rises in. The code
    is `enterGroups` / `enterAfter` / `enterNext` in `js/router.js`. Nothing replays when the page
    only redraws (typing, toggles), and none of it plays under reduced motion (rule 14).
37. **On a phone the tab bar is the navigation, and nothing may widen the page.** Up to 820px the
    sidebar and top bar are gone; a fixed bottom tab bar (Home, Campaigns, the + for New request,
    Review, More) replaces them and the Messages button floats above it. The page card drops its
    stacking layer there (`z-index:auto`), or it covers the tab bar. A phone zooms out to fit
    anything wider than the screen, which pushes the tab bar off it, so: every table lives in
    `.tblwrap` (a `position:relative` scroller, so hidden labels are clipped with it); a table with
    five or more columns keeps a minimum width and scrolls sideways; short tables hide columns
    instead (Review keeps Batch and Status); tab rows scroll with no scrollbar; grids drop to one or
    two columns. Test at 375px by checking `innerWidth` stays 375 on every screen and tab.
38. **Every screen you can get into has a visible way back.** A screen reached from a list or a
    choice (a campaign, a moodboard, the request form, the Review preview) shows its way back top
    left: a quiet back link with the arrow icon above the title, or a close button in a full-screen
    mode. When two screens are alternatives (describe the request, or fill the form), each carries a
    secondary button to the other in the same spot ("Fill the form instead" / "Describe it
    instead"). New request opens on the prompt: three prints fanned above it, the prompt, then a
    Suggestions table whose rows fill the prompt or start a calendar plan. The form's kinds
    (Marketing campaign, Catalogue products, Performance) are button tabs under the title (rule 19).

## Tokens (copy this block first, unchanged)

Resolved from the approved build in light and dark. Light mode is white pages on Apple's system greys
with warm brown text; dark mode is Apple's iOS greys with the page as the grey and black behind it.

```css
:root{
  /* type */
  --display-xs:24px;
  --display-xs--lh:32px;
  --font-body:"Manrope",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  --font-bold:700;
  --font-display:"Manrope",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  --font-medium:500;
  --font-regular:400;
  --font-semibold:600;
  --text-brand-secondary:#1c1410;
  --text-error-primary:#d92d20;
  --text-lg:18px;
  --text-lg--lh:28px;
  --text-md:16px;
  --text-md--lh:24px;
  --text-placeholder:#8c7e72;
  --text-primary:#1c1410;
  --text-quaternary:#6e6055;
  --text-secondary:#42352c;
  --text-secondary_hover:#1c1410;
  --text-sm:13px;
  --text-sm--lh:20px;
  --text-success-primary:#079455;
  --text-tertiary:#6e6055;
  --text-warning-primary:#dc6803;
  --text-xl:20px;
  --text-xl--lh:30px;
  --text-xs:11px;
  --text-xs--lh:16px;
  --display-sm:30px;
  --display-sm--lh:38px;
  --display-md:36px;
  --display-md--lh:44px;
  /* text and icon tones */
  --fg-disabled:#a3a3a3;
  --fg-error-primary:#d92d20;
  --fg-primary:#1c1410;
  --fg-quaternary:#6e6055;
  --fg-quaternary_hover:#1c1410;
  --fg-quinary:#8c7e72;
  --fg-secondary:#42352c;
  --fg-secondary_hover:#1c1410;
  --fg-success-primary:#079455;
  --fg-tertiary:#6e6055;
  --fg-warning-primary:#dc6803;
  --tone-1:#1c1410;
  --tone-2:#42352c;
  --tone-3:#6e6055;
  --tone-4:#8c7e72;
  --fg-error-secondary:#f04438;
  --fg-warning-secondary:#f79009;
  --fg-success-secondary:#17b26a;
  /* surfaces */
  --bg-active:#e9e9ee;
  --bg-brand-solid:#1c1410;
  --bg-disabled:#f5f5f5;
  --bg-error-primary:#fef3f2;
  --bg-error-solid:#d92d20;
  --bg-frame:#f2f2f7;
  --bg-overlay:#0a0a0a;
  --bg-panel:#f2f2f7;
  --bg-primary:#ffffff;
  --bg-primary_alt:#ffffff;
  --bg-primary_hover:#f2f2f7;
  --bg-quaternary:#e5e5ea;
  --bg-secondary:#f2f2f7;
  --bg-secondary_alt:#f2f2f7;
  --bg-secondary_hover:#e9e9ee;
  --bg-secondary_subtle:#f7f7fa;
  --bg-success-primary:#ecfdf3;
  --bg-tertiary:#e9e9ee;
  --bg-warning-primary:#fffaeb;
  /* lines */
  --border-brand:#1c1410;
  --border-error:#f04438;
  --border-primary:rgb(60 60 67 / 0.18);
  --border-secondary:rgb(60 60 67 / 0.13);
  --border-tertiary:rgb(60 60 67 / 0.08);
  /* main and secondary buttons */
  --button-secondary-bg:transparent;
  --button-secondary-bg_hover:#e9e9ee;
  --button-secondary-border:rgb(60 60 67 / 0.18);
  --button-secondary-fg:#1c1410;
  --cta-fg:#ffffff;
  --cta-solid:#1c1410;
  --cta-solid-hover:#42352c;
  /* focus */
  --focus-ring:#1c1410;
  --ring:0 0 0 2px #ffffff, 0 0 0 3.5px #1c1410;
  --ring-error:0 0 0 2px #ffffff,0 0 0 4px #f04438;
  /* label colours (badges, tags, chart series, calendar) */
  --utility-gray-50:#fafafa;
  --utility-gray-200:#e5e5e5;
  --utility-gray-700:#404040;
  --utility-error-50:#fef3f2;
  --utility-error-200:#fecdca;
  --utility-error-700:#b42318;
  --utility-warning-50:#fffaeb;
  --utility-warning-200:#fedf89;
  --utility-warning-700:#b54708;
  --utility-success-50:#ecfdf3;
  --utility-success-200:#abefc6;
  --utility-success-700:#067647;
  --utility-indigo-50:#eef4ff;
  --utility-indigo-200:#c7d7fe;
  --utility-indigo-700:#3538cd;
  --utility-purple-50:#f4f3ff;
  --utility-purple-200:#d9d6fe;
  --utility-purple-700:#5925dc;
  --utility-pink-50:#fdf2fa;
  --utility-pink-200:#fcceee;
  --utility-pink-700:#c11574;
  --utility-orange-50:#fef6ee;
  --utility-orange-200:#f9dbaf;
  --utility-orange-700:#b93815;
  /* size */
  --paragraph-max-width:720px;
  --radius-banner:20px;
  --radius-card:16px;
  --radius-control:13px;
  --radius-control-sm:12px;
  --radius-full:9999px;
  --radius-tile:14px;
  --size-control:36px;
  --size-control-lg:40px;
  --size-control-sm:32px;
  --size-control-xs:28px;
  --size-icon:16px;
  --size-rail:56px;
  --size-topbar:48px;
  --spacing-xxs:2px;
  --spacing-4:4px;
  --spacing-sm:6px;
  --spacing-8:8px;
  --spacing-12:12px;
  --spacing-16:16px;
  --spacing-20:20px;
  --spacing-24:24px;
  --spacing-32:32px;
  --spacing-36:36px;
  --spacing-40:40px;
  --spacing-48:48px;
  --spacing-56:56px;
  --spacing-64:64px;
  --spacing-80:80px;
  --spacing-96:96px;
  /* shadow and blur */
  --backdrop-blur-md:blur(16px);
  --backdrop-blur-sm:blur(8px);
  --shadow-elevation-1:0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 1px -0.5px rgb(0 0 0 / 0.06), 0 3px 3px -1.5px rgb(0 0 0 / 0.06);
  --shadow-elevation-2:0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 1px -0.5px rgb(0 0 0 / 0.06), 0 3px 3px -1.5px rgb(0 0 0 / 0.06), 0 6px 6px -3px rgb(0 0 0 / 0.06), 0 12px 12px -6px rgb(0 0 0 / 0.02);
  --shadow-elevation-3:0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 1px -0.5px rgb(0 0 0 / 0.06), 0 3px 3px -1.5px rgb(0 0 0 / 0.06), 0 6px 6px -3px rgb(0 0 0 / 0.06), 0 12px 12px -6px rgb(0 0 0 / 0.02), 0 24px 24px -12px rgb(0 0 0 / 0.04);
  --shadow-elevation-high:0 0 0 1px rgb(0 0 0 / 0.06), 0 16px 48px rgb(0 0 0 / 0.16);
  --shadow-page-edge:6px 0 12px -4px rgb(0 0 0 / 0.07);
  --shadow-page-edge-l:-6px 0 12px -4px rgb(0 0 0 / 0.07);
  /* motion */
  --motion-appear-distance:6px;
  --motion-duration-appear:360ms;
  --motion-duration-base:200ms;
  --motion-duration-fast:120ms;
  --motion-duration-icon:440ms;
  --motion-duration-instant:80ms;
  --motion-ease-hop:cubic-bezier(0.34, 1.56, 0.64, 1);
  --motion-ease-in-out:cubic-bezier(0.65, 0, 0.35, 1);
  --motion-ease-out:cubic-bezier(0.23, 1, 0.32, 1);
  --motion-ease-standard:cubic-bezier(0.2, 0, 0, 1);
  --motion-icon-loop:1600ms;
  --motion-stagger:45ms;
  /* toast */
  --toast-bg:#ffffff;
  --toast-fg:#1c1410;
}
/* dark: the OS setting, unless the page forces light; or forced with data-theme="dark" on <html>.
   Keep the two blocks identical. */
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
  /* type */
  --text-brand-secondary:#ffffff;
  --text-error-primary:#f97066;
  --text-placeholder:#636366;
  --text-primary:#ffffff;
  --text-quaternary:#98989f;
  --text-secondary:#d1d1d6;
  --text-secondary_hover:#ffffff;
  --text-success-primary:#47cd89;
  --text-tertiary:#98989f;
  --text-warning-primary:#fdb022;
  /* text and icon tones */
  --fg-disabled:#737373;
  --fg-error-primary:#f04438;
  --fg-primary:#ffffff;
  --fg-quaternary:#98989f;
  --fg-quaternary_hover:#ffffff;
  --fg-quinary:#636366;
  --fg-secondary:#d1d1d6;
  --fg-secondary_hover:#ffffff;
  --fg-success-primary:#17b26a;
  --fg-tertiary:#98989f;
  --fg-warning-primary:#f79009;
  --tone-1:#ffffff;
  --tone-2:#d1d1d6;
  --tone-3:#98989f;
  --tone-4:#636366;
  --fg-error-secondary:#f97066;
  --fg-warning-secondary:#fdb022;
  --fg-success-secondary:#47cd89;
  /* surfaces */
  --bg-active:#3a3a3c;
  --bg-brand-solid:#ffffff;
  --bg-disabled:#262626;
  --bg-error-primary:#55160c;
  --bg-frame:#000000;
  --bg-overlay:#262626;
  --bg-panel:#000000;
  --bg-primary:#1c1c1e;
  --bg-primary_alt:#2c2c2e;
  --bg-primary_hover:#2c2c2e;
  --bg-quaternary:#48484a;
  --bg-secondary:#2c2c2e;
  --bg-secondary_alt:#2c2c2e;
  --bg-secondary_hover:#3a3a3c;
  --bg-secondary_subtle:#2c2c2e;
  --bg-success-primary:#053321;
  --bg-tertiary:#3a3a3c;
  --bg-warning-primary:#4e1d09;
  /* lines */
  --border-brand:#ffffff;
  --border-error:#f97066;
  --border-primary:#3e3e41;
  --border-secondary:#303032;
  --border-tertiary:#262628;
  /* main and secondary buttons */
  --button-secondary-bg_hover:#3a3a3c;
  --button-secondary-border:#3e3e41;
  --button-secondary-fg:#ffffff;
  --cta-fg:#000000;
  --cta-solid:#ffffff;
  --cta-solid-hover:#e5e5ea;
  /* focus */
  --focus-ring:#ffffff;
  --ring:0 0 0 2px #1c1c1e, 0 0 0 3.5px #ffffff;
  --ring-error:0 0 0 2px #1c1c1e,0 0 0 4px #f04438;
  /* label colours (badges, tags, chart series, calendar) */
  --utility-gray-50:#171717;
  --utility-gray-200:#404040;
  --utility-gray-700:#d4d4d4;
  --utility-error-50:#55160c;
  --utility-error-200:#912018;
  --utility-error-700:#fda29b;
  --utility-warning-50:#4e1d09;
  --utility-warning-200:#93370d;
  --utility-warning-700:#fec84b;
  --utility-success-50:#053321;
  --utility-success-200:#085d3a;
  --utility-success-700:#75e0a7;
  --utility-indigo-50:#1f235b;
  --utility-indigo-200:#2d31a6;
  --utility-indigo-700:#a4bcfd;
  --utility-purple-50:#27115f;
  --utility-purple-200:#4a1fb8;
  --utility-purple-700:#bdb4fe;
  --utility-pink-50:#4e0d30;
  --utility-pink-200:#9e165f;
  --utility-pink-700:#faa7e0;
  --utility-orange-50:#511c10;
  --utility-orange-200:#932f19;
  --utility-orange-700:#f7b27a;
  /* shadow and blur */
  --shadow-elevation-1:0 0 0 1px rgb(255 255 255 / 0.10);
  --shadow-elevation-2:0 0 0 1px rgb(255 255 255 / 0.12), 0 6px 12px -3px rgb(0 0 0 / 0.5);
  --shadow-elevation-3:0 0 0 1px rgb(255 255 255 / 0.12), 0 12px 24px -6px rgb(0 0 0 / 0.6);
  --shadow-elevation-high:0 0 0 1px rgb(255 255 255 / 0.12), 0 16px 48px rgb(0 0 0 / 0.7);
  --shadow-page-edge:6px 0 14px -4px rgb(0 0 0 / 0.5);
  --shadow-page-edge-l:-6px 0 14px -4px rgb(0 0 0 / 0.5);
  }
}
:root[data-theme="dark"]{
  /* type */
  --text-brand-secondary:#ffffff;
  --text-error-primary:#f97066;
  --text-placeholder:#636366;
  --text-primary:#ffffff;
  --text-quaternary:#98989f;
  --text-secondary:#d1d1d6;
  --text-secondary_hover:#ffffff;
  --text-success-primary:#47cd89;
  --text-tertiary:#98989f;
  --text-warning-primary:#fdb022;
  /* text and icon tones */
  --fg-disabled:#737373;
  --fg-error-primary:#f04438;
  --fg-primary:#ffffff;
  --fg-quaternary:#98989f;
  --fg-quaternary_hover:#ffffff;
  --fg-quinary:#636366;
  --fg-secondary:#d1d1d6;
  --fg-secondary_hover:#ffffff;
  --fg-success-primary:#17b26a;
  --fg-tertiary:#98989f;
  --fg-warning-primary:#f79009;
  --tone-1:#ffffff;
  --tone-2:#d1d1d6;
  --tone-3:#98989f;
  --tone-4:#636366;
  --fg-error-secondary:#f97066;
  --fg-warning-secondary:#fdb022;
  --fg-success-secondary:#47cd89;
  /* surfaces */
  --bg-active:#3a3a3c;
  --bg-brand-solid:#ffffff;
  --bg-disabled:#262626;
  --bg-error-primary:#55160c;
  --bg-frame:#000000;
  --bg-overlay:#262626;
  --bg-panel:#000000;
  --bg-primary:#1c1c1e;
  --bg-primary_alt:#2c2c2e;
  --bg-primary_hover:#2c2c2e;
  --bg-quaternary:#48484a;
  --bg-secondary:#2c2c2e;
  --bg-secondary_alt:#2c2c2e;
  --bg-secondary_hover:#3a3a3c;
  --bg-secondary_subtle:#2c2c2e;
  --bg-success-primary:#053321;
  --bg-tertiary:#3a3a3c;
  --bg-warning-primary:#4e1d09;
  /* lines */
  --border-brand:#ffffff;
  --border-error:#f97066;
  --border-primary:#3e3e41;
  --border-secondary:#303032;
  --border-tertiary:#262628;
  /* main and secondary buttons */
  --button-secondary-bg_hover:#3a3a3c;
  --button-secondary-border:#3e3e41;
  --button-secondary-fg:#ffffff;
  --cta-fg:#000000;
  --cta-solid:#ffffff;
  --cta-solid-hover:#e5e5ea;
  /* focus */
  --focus-ring:#ffffff;
  --ring:0 0 0 2px #1c1c1e, 0 0 0 3.5px #ffffff;
  --ring-error:0 0 0 2px #1c1c1e,0 0 0 4px #f04438;
  /* label colours (badges, tags, chart series, calendar) */
  --utility-gray-50:#171717;
  --utility-gray-200:#404040;
  --utility-gray-700:#d4d4d4;
  --utility-error-50:#55160c;
  --utility-error-200:#912018;
  --utility-error-700:#fda29b;
  --utility-warning-50:#4e1d09;
  --utility-warning-200:#93370d;
  --utility-warning-700:#fec84b;
  --utility-success-50:#053321;
  --utility-success-200:#085d3a;
  --utility-success-700:#75e0a7;
  --utility-indigo-50:#1f235b;
  --utility-indigo-200:#2d31a6;
  --utility-indigo-700:#a4bcfd;
  --utility-purple-50:#27115f;
  --utility-purple-200:#4a1fb8;
  --utility-purple-700:#bdb4fe;
  --utility-pink-50:#4e0d30;
  --utility-pink-200:#9e165f;
  --utility-pink-700:#faa7e0;
  --utility-orange-50:#511c10;
  --utility-orange-200:#932f19;
  --utility-orange-700:#f7b27a;
  /* shadow and blur */
  --shadow-elevation-1:0 0 0 1px rgb(255 255 255 / 0.10);
  --shadow-elevation-2:0 0 0 1px rgb(255 255 255 / 0.12), 0 6px 12px -3px rgb(0 0 0 / 0.5);
  --shadow-elevation-3:0 0 0 1px rgb(255 255 255 / 0.12), 0 12px 24px -6px rgb(0 0 0 / 0.6);
  --shadow-elevation-high:0 0 0 1px rgb(255 255 255 / 0.12), 0 16px 48px rgb(0 0 0 / 0.7);
  --shadow-page-edge:6px 0 14px -4px rgb(0 0 0 / 0.5);
  --shadow-page-edge-l:-6px 0 14px -4px rgb(0 0 0 / 0.5);
}
```

Load the font with:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap">
```

## Colour

Primitive families (12 steps each: 25 50 100 … 900 950). Value at 600:

| Family | `--x-600` | Use |
| --- | --- | --- |
| `--gray-*` | #525252 | The neutral scale (decision 2). Reach it through semantic tokens |
| `--error-*` | #d92d20 | Errors, destructive actions, a bad change |
| `--warning-*` | #dc6803 | Needs attention, waiting on you |
| `--success-*` | #079455 | Done, approved, a good change |
| `--indigo-*`, `--purple-*`, `--pink-*`, `--orange-*` | #444ce7 · #6938ef · #dd2590 · #e04f16 | Badges, tags, avatars, charts, calendar blocks |
| `--brand-*`, `--secondary-*` | #e31c5f · #008489 | Spares. Not used for buttons, links, selected states or focus |

Most-used semantic tokens (light → dark), as tokens.css resolves them:

| Token | Light | Dark |
| --- | --- | --- |
| `--bg-primary` (the page) | #ffffff | #1c1c1e |
| `--bg-frame` (behind the page: the sidebar) | #f2f2f7 | #000000 |
| `--bg-panel` (behind the page: side panels) | #f2f2f7 | #000000 |
| `--bg-secondary` (fill tiles, first card step) | #f2f2f7 | #2c2c2e |
| `--bg-tertiary` (muted fill, hover) | #e9e9ee | #3a3a3c |
| `--bg-quaternary` (selected, current) | #e5e5ea | #48484a |
| `--bg-primary_hover` · `--bg-secondary_hover` | #f2f2f7 · #e9e9ee | #2c2c2e · #3a3a3c |
| `--bg-primary_alt` · `--bg-secondary_alt` · `--bg-secondary_subtle` | #ffffff · #f2f2f7 · #f7f7fa | #2c2c2e (all three) |
| `--cta-solid` · `--cta-solid-hover` · `--cta-fg` (the main button) | #1c1410 · #42352c · #ffffff | #ffffff · #e5e5ea · #000000 |
| `--bg-brand-solid` (checked boxes, toggles) | = `--cta-solid` | = `--cta-solid` |
| `--bg-error-primary` · `--bg-warning-primary` · `--bg-success-primary` | #fef3f2 · #fffaeb · #ecfdf3 | #55160c · #4e1d09 · #053321 |
| `--bg-overlay` (under a modal, at 70%) | #0a0a0a | #262626 |
| `--text-primary`, `--fg-primary` (`--tone-1`) | #1c1410 | #ffffff |
| `--text-secondary`, `--fg-secondary` (`--tone-2`) | #42352c | #d1d1d6 |
| `--text-tertiary`, `--text-quaternary`, `--fg-tertiary`, `--fg-quaternary` (`--tone-3`) | #6e6055 | #98989f |
| `--text-placeholder`, `--fg-quinary` (`--tone-4`) | #8c7e72 | #636366 |
| `--text-secondary_hover`, `--fg-secondary_hover`, `--fg-quaternary_hover` | `--tone-1` | `--tone-1` |
| `--text-brand-secondary` (links), `--border-brand`, `--focus-ring` | #1c1410 | #ffffff |
| `--text-error-primary` · `--text-warning-primary` · `--text-success-primary` | #d92d20 · #dc6803 · #079455 | #f97066 · #fdb022 · #47cd89 |
| `--border-primary` (control borders) | rgb(60 60 67) at 18% | #3e3e41 |
| `--border-secondary` (hairlines, separators) | rgb(60 60 67) at 13% | #303032 |
| `--border-tertiary` | rgb(60 60 67) at 8% | #262628 |
| `--border-error` | #f04438 | #f97066 |
| `--button-secondary-bg` · `-bg_hover` · `-fg` · `-border` | transparent · #e9e9ee · #1c1410 · = `--border-primary` | transparent · #3a3a3c · #ffffff · #3e3e41 |
| `--utility-<accent>-50` · `-200` · `-700` (indigo shown) | #eef4ff · #c7d7fe · #3538cd | #1f235b · #2d31a6 · #a4bcfd |

`--bg-active` is the source's name for a pressed fill (#e9e9ee / #3a3a3c); the selected fill is
`--bg-quaternary`. The full list is in tokens.css. Sections 2 and 3 keep the Figma groups (Text,
Border, Foreground, Background, Effects, Alpha, component tokens, Utility); sections 10 and 11
override them with the values above, so when two sections set a token, the later one is live.

## Typography

Manrope for everything (`--font-display`, `--font-body`); sizes follow the ElevenLabs app. UI text is
13px/20px (`--text-sm`), small labels 11px/16px (`--text-xs`). Page titles are 24px/32px
(`--display-xs`), weight 500, -0.02em tracking (`.page h1` in `css/shell.css`); the Home question
alone is 28px/36px. No monospace anywhere (rule 9).
Load: `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap`.

| Class | Size / line height | Typical use |
| --- | --- | --- |
| `.display-2xl` … `.display-md` | 72/90 · 60/72 · 48/60 · 36/44, letter-spacing -0.02em | Marketing heroes only |
| `.display-sm` | 30/38 | Large display numbers |
| `.display-xs` | 24/32 | Page titles, KPI figures |
| `.text-xl` | 20/30 | Rare: a title that must outweigh its section |
| `.text-lg` | 18/28 | Section titles on Home |
| `.text-md` | 16/24 | Section, card and modal titles, lead text |
| `.text-sm` | 13/20 | Default UI text, buttons, inputs, table cells |
| `.text-xs` | 11/16 | Badges, hints, metadata |

Weights: 400 body and table text; 500 labels, buttons, names and titles; 600 only for large display
numbers.

## Spacing, radius, layout

- Spacing (`--spacing-*`, px): 0, xxs 2, 4, sm 6, 8, 12, 16, 20, 24, 32, 36, 40, 48, 56, 64, 80, 96, 128, 160.
  Common rhythm: 4/8 inside controls, 12/16 between related items, 24/32 between groups, 48 to 64 between page sections.
- Control sizes: `--size-control-xs` 28px, `--size-control-sm` 32px, `--size-control` 36px (default),
  `--size-control-lg` 40px. Also `--size-icon` 16px, `--size-rail` 56px, `--size-topbar` 48px.
- Radius: `--radius-control-sm` 12px (28 and 32px controls, tabs, nav items), `--radius-control` 13px
  (36px buttons and fields, popovers), `--radius-tile` 14px (40px buttons and icon tiles),
  `--radius-card` 16px (cards, floating panels, modals), `--radius-banner` 20px (banners, the page
  card), `--radius-full` (pills, avatars, toggles). The source scale (`--radius-0`, 2, 4, sm 6, md 8,
  lg 10, xl 12, 2xl 16, 3xl 20, 4xl 24) stays for small inner parts and so the references resolve;
  never use it for a control or a card.
- Widths: `--width-xxs` 320 … `--width-6xl` 1920 (xs 384, sm 480, md 560, lg 640, xl 768, 2xl 1024, 3xl 1280);
  `--paragraph-max-width` 720; container max 1280 with 32px padding (16px on phones).
- Shadows: `--shadow-elevation-1` (tiles, the prompt, the current segment), `--shadow-elevation-2`
  (menus, a focused prompt), `--shadow-elevation-3` (floating panels, the composer card),
  `--shadow-elevation-high` (modals); `--shadow-page-edge` and `--shadow-page-edge-l` (the page card
  onto the Messages panel and the sidebar). Light: a 1px black 6% ring plus tight black drops. Dark: a
  1px white 10 to 12% ring plus tight black drops. The source's `--shadow-xs` … `--shadow-3xl` and
  `--shadow-xs-skeuomorphic` stay only so the references resolve; don't use them in new work.
- Focus: `--ring` (1.5px ink ring, 2px gap), `--ring-error` on an invalid field.
  Backdrop blur: `--backdrop-blur-sm|md|lg|xl` (8, 16, 24, 40px).

## Motion tokens

| Token | Value | Use |
| --- | --- | --- |
| `--motion-duration-instant` | 80ms | Press, colour flips, hover fills in the app shell |
| `--motion-duration-fast` | 120ms | Hover fills |
| `--motion-duration-base` | 200ms | Menus, tooltips, modals |
| `--motion-duration-appear` | 360ms | Content entering |
| `--motion-duration-icon` | 440ms | One icon stroke redraw |
| `--motion-icon-loop` | 1600ms | One loop of an icon's motion family (move ~45%, rest). Nothing plays it on hover today (rule 12) |
| `--motion-stagger` | 45ms | Between siblings entering |
| `--motion-appear-distance` | 6px | Rise while entering |
| `--motion-ease-out` | cubic-bezier(0.23, 1, 0.32, 1) | Arrivals |
| `--motion-ease-in-out` | cubic-bezier(0.65, 0, 0.35, 1) | Moves that return |
| `--motion-ease-hop` | cubic-bezier(0.34, 1.56, 0.64, 1) | Small overshoot |
| `--motion-ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Colour and fill changes, layout changes (the sidebar opening) |

What moves: content arriving (rule 11), overlays easing in, icons drawing in once (rule 12), a
panel sliding in (rule 16), spinners. What doesn't: anything on hover (rule 25), which changes
colour and fill only. Under reduced motion only spinners move (rule 14).

### Motion code

The keyframes and classes (put them after the tokens):

```css
@keyframes ds-appear{from{opacity:0;transform:translateY(var(--motion-appear-distance))}to{opacity:1;transform:none}}
@keyframes ds-fade{from{opacity:0}to{opacity:1}}
@keyframes ds-pop{from{opacity:0;transform:scale(.97) translateY(4px)}to{opacity:1;transform:none}}
.ds-appear{animation:ds-appear var(--motion-duration-appear) var(--motion-ease-out) both}
/* --appear-base: when this group's own block starts, so nested groups stagger after it */
.ds-appear-stagger > *{animation:ds-appear var(--motion-duration-appear) var(--motion-ease-out) var(--appear-base,0ms) both}
.ds-appear-stagger > :nth-child(2){animation-delay:calc(var(--appear-base,0ms) + 1 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(3){animation-delay:calc(var(--appear-base,0ms) + 2 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(4){animation-delay:calc(var(--appear-base,0ms) + 3 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(5){animation-delay:calc(var(--appear-base,0ms) + 4 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(6){animation-delay:calc(var(--appear-base,0ms) + 5 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(7){animation-delay:calc(var(--appear-base,0ms) + 6 * var(--motion-stagger))}
.ds-appear-stagger > :nth-child(n+8){animation-delay:calc(var(--appear-base,0ms) + 7 * var(--motion-stagger))}

/* overlays */
.ds-overlay{animation:ds-fade var(--motion-duration-base) var(--motion-ease-out) both}
.ds-modal,.ds-command{animation:ds-pop var(--motion-duration-base) var(--motion-ease-out) both}
.ds-menu{animation:ds-pop var(--motion-duration-base) var(--motion-ease-out) both;transform-origin:top}
@keyframes ds-slide-in{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
.ds-slideout{animation:ds-slide-in var(--motion-duration-appear) var(--motion-ease-out) both}

@media (prefers-reduced-motion:reduce){
  .ds-appear,.ds-appear-stagger > *{animation:none!important}
  /* spinners keep turning, slower: */
  .spinner{animation-duration:2.4s!important}
}
```

How the prototype triggers entrances (plain JS, rule 36). `route()` calls `enterGroups(main)` after
drawing a page with `.ds-appear-stagger` on `.page`; `rerender()` calls `enterAfter(ENTER)` after a
tab or `data-enter` control redraws part of the page. `ENTER_GROUPS` lists the containers whose
children stagger; use your own containers' selectors. In React, a small hook that adds
`ds-appear-stagger` to a container on mount and sets `--appear-base` from its index does the same.

```js
/* ---- motion: what comes on screen eases in (nothing plays under reduced motion, rule 14) ----
   Navigation staggers the page's blocks (.ds-appear-stagger on .page). Inside them, every grid, list
   and table staggers its own cards and rows, starting when its block does. A tab, filter or stepper
   click does the same for the part of the page it changes: the control's or tablist's data-enter
   selector, else the tab panel after the tablist, else whatever follows the tablist's block. */
const ENTER_GROUPS='.camp-grid,.lib-grid,.home-list,.home-tiles,.home-ideas,.kpis,.bm-bento,.bm-cards,.bm-moods,.bm-rows,.tm-cards,.cal-next__grid,.pf-sugg,.mbgrid,.mood-grid,.cx-rows,.pg-rows,.up-feats,.feats,.calb,.rvp__list,.rvp__notes-list,tbody';
let ENTER=null;
const enterStep=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion-stagger'))||45;
function enterGroups(root,base){const st=enterStep();
  [...(root.matches(ENTER_GROUPS)?[root]:[]),...root.querySelectorAll(ENTER_GROUPS)].forEach(g=>{
    let b=base;
    if(b==null){let a=g;while(a.parentElement&&!a.parentElement.classList.contains('page')&&a.parentElement!==root)a=a.parentElement;b=Math.min([...a.parentElement.children].indexOf(a),4)*st}
    /* inside a block the steps are shorter, so the whole page has landed in about 0.7s */
    g.style.setProperty('--appear-base',b+'ms');g.style.setProperty('--motion-stagger','28ms');g.classList.add('ds-appear-stagger')})}
/* the next rerender eases these in (a selector inside #main) */
function enterNext(sel){ENTER={sel}}
function enterAfter(en){const main=document.getElementById('main'),st=enterStep();let els=[];
  if(en.sel)els=[...main.querySelectorAll(en.sel)];
  else{const list=[...main.querySelectorAll('[role="tablist"]')].find(l=>l.getAttribute('aria-label')===en.label);if(!list)return;
    let panel=null;
    for(let a=list.parentElement;a&&main.contains(a)&&!panel;a=a.parentElement)panel=[...a.querySelectorAll('[role="tabpanel"]')].find(x=>list.compareDocumentPosition(x)&Node.DOCUMENT_POSITION_FOLLOWING);
    if(panel)els=[panel];
    else{let a=list;while(a.parentElement&&a.parentElement!==main&&!a.parentElement.classList.contains('page'))a=a.parentElement;for(let n=a.nextElementSibling;n;n=n.nextElementSibling)els.push(n)}}
  els.forEach((el,i)=>{const d=Math.min(i,7)*st;el.style.animationDelay=d+'ms';el.classList.add('ds-appear');enterGroups(el,d)})}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[role="tab"],[data-enter]');if(!t)return;
  const list=t.closest('[role="tablist"]');
  ENTER={sel:t.dataset.enter||(list&&list.dataset.enter)||'',label:list?list.getAttribute('aria-label'):null};
  if(!ENTER.sel&&ENTER.label==null)ENTER=null;setTimeout(()=>{ENTER=null},0)},true);
document.addEventListener('change',e=>{const t=e.target.closest&&e.target.closest('[data-enter]');if(!t)return;ENTER={sel:t.dataset.enter};setTimeout(()=>{ENTER=null},0)},true);
```

## Core component specs

What components.css is held to; the gallery shows each one. Variants, parts and state names come
from the references, the values from here:

- **Button** (`ds-btn`): hierarchies primary, secondary, tertiary and link (`ds-btn--link-color`,
  `ds-btn--link-gray`), each with a destructive form (`ds-btn--destructive`). Heights 28 / 32 / 36
  (default) / 40px with 12 / 12 / 13 / 14px corners (rule 13); padding 8/12 at 36px, 6/10 at 32px;
  gap 4 to 6; text-sm at weight 500; 16px icons; icon-only is square, `ds-btn--round` a true circle.
  Primary: `--cta-solid` fill, `--cta-fg` text and icon, hover `--cta-solid-hover`, no border, no
  shadow. Secondary: no fill (`--button-secondary-bg` is transparent), 1px `--button-secondary-border`,
  `--button-secondary-fg` text; hover fills `--button-secondary-bg_hover`. Tertiary: no fill, no
  border, `--text-tertiary`; hover `--bg-tertiary` and `--text-primary`. Link: ink and underlined.
  Disabled: `--fg-disabled` text. Loading: a spinner takes the icon's place. Focus: `--ring`. No
  skeuomorphic shadow, no gradient border.
- **Field** (`ds-field` > `ds-label` + `ds-input` / `ds-select` / `ds-textarea` + `ds-hint`): 36px
  tall, padding 8/12, `--radius-control`, 1px `--border-primary`, no fill and no shadow, text-sm;
  label text-sm at weight 500 in `--text-secondary`; gap 6 between label, field and hint; placeholder
  `--text-placeholder`; hint text-sm `--text-tertiary`, error hint `--text-error-primary`; 16px
  leading icon. Hover and focus take the border to ink (`--border-brand`); focus adds `--ring`.
  Invalid: `--border-error` and `--ring-error`.
- **Badge** (`ds-badge`): a pill that is fill only: `--utility-<c>-50` fill, `--utility-<c>-700`
  text, no border (rule 18); `--radius-full`; padding 2/8; text-xs at weight 500; optional dot, icon,
  close. Colours: gray (default), error, warning, success, indigo, purple, pink, orange.
- **Tabs** (`ds-tabs` > `ds-tab`), by rule 19. Button tabs: 32px, `--radius-control-sm`, text-sm at
  weight 500, idle `--text-tertiary` with no fill, hover `--bg-tertiary` and `--text-primary`,
  current `--bg-quaternary` and `--text-primary`. Underline tabs (the outer level when tabs nest): a
  44px row on a `--border-secondary` hairline, the current tab marked by a 2px ink underline.
  Segmented switch: a `--bg-tertiary` track with 2px padding and 28px segments, the current one
  `--bg-primary` with `--shadow-elevation-1`. Focus: `--ring`.
- **Modal** (`ds-overlay` > `ds-modal`): panel `--bg-primary`, `--radius-card`,
  `--shadow-elevation-high`, no border; 400px wide by default, 544px (`ds-modal--md`) or 640px
  (`ds-modal--lg`), full width on a phone; overlay `--bg-overlay` at 70% with `--backdrop-blur-md`;
  title text-md at weight 500; one primary button in the actions row. Only for a task that must
  finish (rule 16).
- **Table**, by rule 32: a block with a hairline all round and `--radius-card`, no fill and no
  header fill. Header cells text-sm at weight 400 in `--text-tertiary`; body cells text-sm; rows
  split by `--border-secondary`, none under the last; cells padded 12px above and below, 16px at
  the sides and 20px at the block's left and right edges; numbers use `tabular-nums`; status cells
  hold a pill.
- **Card**: `--radius-card`; either a `--border-secondary` hairline with no fill, or a
  `--bg-secondary` fill with no border (rule 18); no shadow, no hover lift. Floating surfaces take a
  shadow in place of a border: menus `--shadow-elevation-2`, panels and the composer
  `--shadow-elevation-3`, modals `--shadow-elevation-high`.

Everything else (parts, variants, states) is in the references. When in doubt, grep the spec for the
structure and apply these values; don't guess from general Untitled UI knowledge.

## Components (recipes)

Plain CSS built only on the tokens. Rename classes to fit your stack, keep the values. These encode
rules 13, 18, 19, 25, 31, 32 and 35.

```css
/* ---------- base ---------- */
html{background:var(--bg-frame);color:var(--text-secondary);font-family:var(--font-body);font-size:var(--text-sm);line-height:var(--text-sm--lh);-webkit-font-smoothing:antialiased}
body{margin:0}
h1,h2,h3{margin:0;color:var(--text-primary);font-family:var(--font-display);font-weight:var(--font-medium);text-wrap:balance}
h1{font-size:var(--display-xs);line-height:var(--display-xs--lh);letter-spacing:-0.02em}
h2{font-size:var(--text-md);line-height:var(--text-md--lh)}
:focus-visible{outline:none;box-shadow:var(--ring)}
a{color:var(--text-brand-secondary);text-underline-offset:3px}

/* ---------- the frame (rule 16): sidebar on the frame colour, the page as one rounded card ---------- */
.app{display:grid;grid-template-columns:var(--size-rail) minmax(0,1fr);height:100vh;transition:grid-template-columns var(--motion-duration-base) var(--motion-ease-standard)}
.app.is-open{grid-template-columns:240px minmax(0,1fr)}
.rail{position:sticky;top:0;z-index:2;height:100vh;display:flex;flex-direction:column;justify-content:space-between;gap:var(--spacing-12);padding:8px 12px 12px;background:transparent}
.nav{display:flex;flex-direction:column;gap:var(--spacing-4)}
.nav__heading{display:block;height:36px;padding:16px 8px 4px;font-size:var(--text-xs);line-height:var(--text-xs--lh);font-weight:var(--font-medium);color:var(--text-tertiary);white-space:nowrap;overflow:hidden}
.nav__item{display:flex;align-items:center;gap:var(--spacing-8);height:var(--size-control-sm);padding:0 8px;border-radius:var(--radius-control-sm);color:var(--text-secondary);font-weight:var(--font-medium);text-decoration:none}
.nav__item svg{width:var(--size-icon);height:var(--size-icon);flex:none;color:var(--fg-tertiary)}
.nav__item:hover,.nav__item[aria-current="page"]{background:var(--bg-quaternary);color:var(--text-primary)}
.nav__item:hover svg,.nav__item[aria-current="page"] svg{color:var(--fg-primary)}
.app:not(.is-open) .nav__item{width:var(--size-control-sm)} /* collapsed: icons only, a tooltip names each */
.app:not(.is-open) .nav__item span{display:none}
.app:not(.is-open) .nav__heading{position:relative;color:transparent} /* collapsed: the heading becomes a short rule (rule 34) */
.app:not(.is-open) .nav__heading::before{content:"";position:absolute;left:4px;right:4px;top:20px;height:1px;background:var(--border-primary)}
.sheet{position:relative;z-index:1;min-width:0;height:100vh;overflow:hidden;background:var(--bg-primary);border-radius:var(--radius-banner) 0 0 var(--radius-banner);box-shadow:var(--shadow-page-edge-l)}
.sheet__scroll{height:100%;overflow-y:auto;overscroll-behavior:contain}
.topbar{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-16);height:var(--size-topbar);padding:0 12px;background:var(--bg-primary);box-shadow:inset 0 -1px 0 var(--border-secondary)}
.avatar-sq{display:grid;place-items:center;width:var(--size-control-sm);height:var(--size-control-sm);border-radius:var(--radius-control-sm);background:var(--bg-tertiary);color:var(--text-secondary);font-size:var(--text-xs);font-weight:var(--font-medium)} /* the top bar's profile (rule 20) */
.tabbar{display:none}
@media (max-width:820px){ /* phone (rule 37) */
  .app{grid-template-columns:minmax(0,1fr);height:auto}
  .rail,.topbar{display:none}
  .sheet{height:auto;overflow:visible;border-radius:0;box-shadow:none;z-index:auto}
  .sheet__scroll{height:auto;overflow:visible}
  .tabbar{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;padding:6px 8px calc(6px + env(safe-area-inset-bottom,0px));background:var(--bg-primary);border-top:1px solid var(--border-secondary)}
}

/* ---------- the page: one white card beside the sidebar ---------- */
.page{max-width:1120px;margin:0 auto;padding:24px 20px 96px;display:flex;flex-direction:column;gap:var(--spacing-32)}
.page-h{display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-12) var(--spacing-16);flex-wrap:wrap}
.back{display:inline-flex;align-items:center;gap:var(--spacing-4);color:var(--text-tertiary);font-size:var(--text-sm);text-decoration:none}
.back:hover{color:var(--text-primary)}
@media (max-width:820px){.page{padding:20px 16px 104px;gap:var(--spacing-24)}}

/* ---------- buttons: secondary is the default; one primary per view ---------- */
.btn{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:var(--spacing-sm);min-height:var(--size-control);padding:8px 12px;border:0;border-radius:var(--radius-control);background:var(--button-secondary-bg);box-shadow:inset 0 0 0 1px var(--button-secondary-border);color:var(--button-secondary-fg);font:inherit;font-weight:var(--font-medium);white-space:nowrap;cursor:pointer;transition:background-color var(--motion-duration-instant) var(--motion-ease-standard),color var(--motion-duration-instant) var(--motion-ease-standard)}
.btn:hover{background:var(--button-secondary-bg_hover);color:var(--text-primary)}
.btn svg{width:var(--size-icon);height:var(--size-icon);flex:none}
.btn--sm{min-height:var(--size-control-sm);padding:6px 10px;border-radius:var(--radius-control-sm)}
.btn--lg{min-height:var(--size-control-lg);padding:10px 16px;border-radius:var(--radius-tile)}
.btn--primary{background:var(--cta-solid);box-shadow:none;color:var(--cta-fg)}
.btn--primary:hover{background:var(--cta-solid-hover);color:var(--cta-fg)}
.btn--tertiary{box-shadow:none;color:var(--text-tertiary)}
.btn--tertiary:hover{background:var(--bg-tertiary);color:var(--text-primary)}
.btn:disabled,.btn[aria-disabled="true"]{color:var(--fg-disabled);cursor:default}
.icon-btn{display:grid;place-items:center;flex:none;width:var(--size-control-sm);height:var(--size-control-sm);padding:0;border:0;border-radius:var(--radius-control-sm);background:transparent;color:var(--fg-tertiary);cursor:pointer}
.icon-btn:hover{background:var(--bg-tertiary);color:var(--fg-primary)}
.icon-btn svg{width:var(--size-icon);height:var(--size-icon)}

/* ---------- tabs (rule 19) ---------- */
.tabs{display:flex;gap:var(--spacing-4);overflow-x:auto;scrollbar-width:none}
.tab{flex:none;display:inline-flex;align-items:center;gap:var(--spacing-8);height:var(--size-control-sm);padding:0 12px;border:0;border-radius:var(--radius-control-sm);background:transparent;color:var(--text-tertiary);font:inherit;font-weight:var(--font-medium);cursor:pointer}
.tab:hover{background:var(--bg-tertiary);color:var(--text-primary)}
.tab[aria-selected="true"]{background:var(--bg-quaternary);color:var(--text-primary)}
.tab svg{width:var(--size-icon);height:var(--size-icon)}
.tab__n{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;height:18px;min-width:18px;padding:0 5px;border-radius:var(--radius-full);background:var(--bg-tertiary);color:var(--text-secondary);font-size:var(--text-xs);line-height:1;font-variant-numeric:tabular-nums}
.tab[aria-selected="true"] .tab__n{background:var(--bg-primary)}
/* outer level when tabs nest: underline tabs */
.utabs{display:flex;gap:var(--spacing-20);box-shadow:inset 0 -1px 0 var(--border-secondary);overflow-x:auto;scrollbar-width:none}
.utab{position:relative;flex:none;display:inline-flex;align-items:center;gap:var(--spacing-8);height:44px;padding:0 2px;border:0;background:none;color:var(--text-tertiary);font:inherit;font-weight:var(--font-medium);cursor:pointer}
.utab:hover,.utab[aria-selected="true"]{color:var(--text-primary)}
.utab[aria-selected="true"]::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:var(--text-primary)}
/* segmented switch (Week, Month, Quarter; a period) */
.seg{display:inline-flex;padding:2px;gap:2px;border-radius:var(--radius-control);background:var(--bg-tertiary)}
.seg button{height:var(--size-control-xs);padding:0 12px;border:0;border-radius:var(--radius-control-sm);background:transparent;color:var(--text-tertiary);font:inherit;font-weight:var(--font-medium);cursor:pointer}
.seg button:hover{color:var(--text-primary)}
.seg button[aria-selected="true"]{background:var(--bg-primary);color:var(--text-primary);box-shadow:var(--shadow-elevation-1)}

/* ---------- table block (rule 32) ---------- */
.tblwrap{position:relative;overflow-x:auto;border-radius:var(--radius-card);box-shadow:inset 0 0 0 1px var(--border-secondary)}
.tblwrap table{width:100%;border-collapse:collapse}
.tblwrap th{padding:12px 16px;text-align:left;font-weight:var(--font-regular);color:var(--text-tertiary);border-bottom:1px solid var(--border-secondary)}
.tblwrap td{padding:12px 16px;border-bottom:1px solid var(--border-secondary);vertical-align:middle;font-variant-numeric:tabular-nums}
.tblwrap tr:last-child > td{border-bottom:0}
.tblwrap :is(th,td):first-child{padding-left:20px}
.tblwrap :is(th,td):last-child{padding-right:20px}
@media (max-width:700px){.tblwrap > table:has(th:nth-child(5)){min-width:620px}}

/* ---------- cards and tiles (rule 18: a hairline OR a fill) ---------- */
.card{border-radius:var(--radius-card);box-shadow:inset 0 0 0 1px var(--border-secondary)}
.tile{padding:var(--spacing-20);border-radius:var(--radius-card);background:var(--bg-secondary)}
.pic{display:block;aspect-ratio:4/3;border-radius:var(--radius-card);overflow:hidden;background:var(--bg-tertiary)} /* a picture card: words go below it (rule 23) */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--spacing-40) var(--spacing-24)}

/* ---------- number cards (rule 31) ---------- */
.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--spacing-12)}
.kpi{display:flex;flex-direction:column;gap:4px;min-width:0;padding:16px 16px 12px;border-radius:var(--radius-card);box-shadow:inset 0 0 0 1px var(--border-primary)}
.kpi__label{color:var(--text-tertiary)}
.kpi__value{font-size:var(--display-xs);line-height:var(--display-xs--lh);font-weight:var(--font-medium);letter-spacing:-0.02em;color:var(--text-primary);font-variant-numeric:tabular-nums}
.kpi__delta.is-good{color:var(--text-success-primary)}
.kpi__delta.is-bad{color:var(--text-error-primary)}
@media (max-width:820px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ---------- pills: status and labels (fill only, no border) ---------- */
.pill{box-sizing:border-box;display:inline-flex;align-items:center;gap:var(--spacing-sm);height:20px;padding:0 8px;border-radius:var(--radius-full);font-size:var(--text-xs);line-height:1;font-weight:var(--font-medium);white-space:nowrap;background:var(--bg-tertiary);color:var(--text-secondary)}
.pill .dot{width:6px;height:6px;border-radius:50%;background:currentColor}
.pill--good{background:var(--bg-success-primary);color:var(--text-success-primary)}
.pill--warn{background:var(--bg-warning-primary);color:var(--text-warning-primary)}
.pill--bad{background:var(--bg-error-primary);color:var(--text-error-primary)}
.badge--indigo{background:var(--utility-indigo-50);color:var(--utility-indigo-700)} /* same for purple, pink, orange */

/* ---------- fields ---------- */
.field{display:flex;flex-direction:column;gap:var(--spacing-sm)}
.field label{color:var(--text-secondary);font-weight:var(--font-medium)}
.inp{box-sizing:border-box;width:100%;min-height:var(--size-control);padding:8px 12px;border:1px solid var(--border-primary);border-radius:var(--radius-control);background:transparent;color:var(--text-primary);font:inherit}
.inp::placeholder{color:var(--text-placeholder)}
.inp:hover{border-color:var(--border-brand)}
.inp:focus-visible{border-color:var(--border-brand);box-shadow:var(--ring)}
.inp[aria-invalid="true"]{border-color:var(--border-error);box-shadow:var(--ring-error)}
.hint{color:var(--text-tertiary)}

/* ---------- floating surfaces: the edge is a shadow ---------- */
.menu{min-width:200px;padding:4px;border-radius:var(--radius-card);background:var(--bg-primary);box-shadow:var(--shadow-elevation-2)}
.menu__item{display:flex;align-items:center;gap:var(--spacing-8);width:100%;height:var(--size-control-sm);padding:0 8px;border:0;border-radius:var(--radius-control-sm);background:none;color:var(--text-secondary);font:inherit;font-weight:var(--font-medium);text-align:left;cursor:pointer}
.menu__item:hover{background:var(--bg-tertiary);color:var(--text-primary)}
.scrim{position:fixed;inset:0;background:color-mix(in srgb,var(--bg-overlay) 70%,transparent);backdrop-filter:var(--backdrop-blur-md)}
.modal{width:min(400px,calc(100vw - 32px));padding:var(--spacing-24);border-radius:var(--radius-card);background:var(--bg-primary);box-shadow:var(--shadow-elevation-high)}
.toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%);display:flex;align-items:center;gap:var(--spacing-12);padding:14px 20px 14px 16px;border-radius:var(--radius-card);background:var(--toast-bg);color:var(--toast-fg);box-shadow:var(--shadow-elevation-3);font-weight:var(--font-medium)}

/* ---------- an upload tile (rule 35) ---------- */
.drop{display:flex;align-items:center;gap:var(--spacing-12);padding:var(--spacing-16) var(--spacing-20);border-radius:var(--radius-card);background:var(--bg-secondary)}
.drop.is-over{background:var(--bg-tertiary)}
```

## Screen patterns

```html
<!-- the frame -->
<body>
<div class="app">
  <nav class="rail" aria-label="Workspace">
    <div class="nav"><a class="nav__item" href="#home" aria-current="page"><!-- lucide house --><span>Home</span></a> …</div>
    <div class="nav"><span class="nav__heading">Work</span> …</div>
  </nav>
  <div class="sheet"><div class="sheet__scroll">
    <header class="topbar"><span>Review</span><div><button class="btn btn--primary btn--sm">New request</button> <span class="avatar-sq">PS</span></div></header>
    <main><!-- one .page per screen --></main>
  </div></div>
</div>
<nav class="tabbar"><!-- phone: Home, Campaigns, + New request, Review, More --></nav>
</body>

<!-- a page: header, one row of button tabs, one pane -->
<div class="page ds-appear-stagger">
  <div class="page-h">
    <h1>Performance</h1>
    <div class="seg" role="tablist" aria-label="Period">
      <button role="tab" aria-selected="true">Last 7 days</button><button role="tab">Last 30 days</button>
    </div>
  </div>
  <div class="tabs" role="tablist" aria-label="Performance">
    <button class="tab" role="tab" aria-selected="true">Campaigns<span class="tab__n">3</span></button>
    <button class="tab" role="tab">Suggestions<span class="tab__n">2</span></button>
  </div>
  <section role="tabpanel">
    <div class="tblwrap"><table>
      <tr><th>Campaign</th><th>Spend</th><th>Status</th></tr>
      <tr><td>Festive Statics</td><td>₹3,91,000</td><td><span class="pill pill--good"><span class="dot"></span>Delivered</span></td></tr>
    </table></div>
  </section>
</div>

<!-- a detail page reached from a list: a way back above the title (rule 38) -->
<div class="page-h">
  <div><a class="back" href="#campaigns"><!-- lucide arrow-left -->Campaigns</a><h1>Winter Denim Edit</h1></div>
  <div><button class="btn">Book a call</button><button class="btn">Review now</button></div>
</div>

<!-- a list grouped by parent: the heading sits OUTSIDE the table block (rule 33) -->
<section>
  <header class="page-h"><h2>Winter Denim Edit</h2><a class="btn btn--sm" href="#review/winter-wedding">Review all</a></header>
  <div class="tblwrap"><table>…</table></div>
</section>

<!-- a picture card: picture alone, words below (rule 23) -->
<article>
  <a class="pic" href="#campaign/winter-wedding"><img alt="" src="…"></a>
  <div>Marketing · 10 statics + 2 videos</div>
  <h2>Winter Denim Edit</h2>
</article>
```

The screens of the approved app, so new work fits beside them: Home (review strip under the top bar,
the "What do you need?" prompt, five quick tiles, To do / In progress / Delivered, Ideas for you),
Review (list, then full-screen preview), Campaigns (picture cards) and a campaign (Overview, Plan,
Brief, Moodboards, Results, Activity tabs), New request (picture fan, prompt, Suggestions table, then
the form), Calendar (calendar, then Coming up), Library, Brand memory (Overview bento, then tabs),
Moodboards, Performance, Brand insights (coming soon), Billing, Team, Notifications, and Messages as
a docked side panel. Navigation: sidebar groups Home and Review; Work (Campaigns, Calendar, Library);
Brand & growth (Brand memory, Performance, Brand insights); Account at the bottom (Billing, Team).
On a phone a bottom tab bar holds Home, Campaigns, + (New request), Review and More.

## What the prototype is built with

No framework and no runtime library: plain HTML, CSS and JavaScript. Three outside sources only.

| What | Source | How it is used |
| --- | --- | --- |
| Type | Manrope (Google Fonts, weights 400 to 700) | One `<link>` in `index.html`; `--font-display` and `--font-body` |
| Icons | Lucide v0.556 (ISC licence) | Generated into `js/icons.js` by `scripts/build-icons.mjs` from a `lucide-react` install; never pasted by hand (rule 12). `I.*` are the app icons, `ICN.*` the composer icons, `ICN2.*` the theme icons |
| 3D icons | Drawn in code | `ICON3D` in `js/home.js` (chat, plus): clay-style SVG, used sparingly (rule 26) |
| Pictures | Seven product photos in `assets/` | `art()` in `js/core.js` frames them as creatives; `ideaScene()` in `js/home.js` composes them into the illustrated scenes (ads, reel, listing, sheet ...) |

In a real build, keep the tokens as CSS variables, take icons from `lucide-react` (same names as in
`scripts/build-icons.mjs`), load Manrope the same way, and replace `art()` / `ideaScene()` with real
creative thumbnails.

**Icons:** Lucide only (in React: `lucide-react`), 16px, stroke 2, colour from the `--fg-*` tokens.
Never draw or paste an icon by hand. App icons in use: house (Home), badge-check (Review), megaphone
(Campaigns), calendar-days (Calendar), images (Library), brain (Brand memory), chart-line
(Performance), radar (Brand insights), wallet (Billing), users (Team), bell, message-circle,
plus, ellipsis, panel-left, chevrons-up-down, check, search, clapperboard, palette, arrow-right,
arrow-left, x, paperclip, mic, arrow-up, circle-check, upload, file-text, sun, moon.

## Building a new screen

1. Read the rules above, then find the closest existing screen in the prototype (section "Where
   the app's styles and code live") and follow its structure: page header (`.page-h`, title,
   secondary actions), then tabs (rule 19), then content in table blocks, card grids or fill tiles.
2. Use tokens and `ds-` components only; add anything missing to components.css with a gallery
   entry (rule 10).
3. Give it its entrances (rule 36), a way back (rule 38) and a phone layout that never widens the
   page (rule 37).
4. Check light and dark, 375px wide, keyboard focus and reduced motion before calling it done.

## Checklist before you call it done

- Only tokens: no hex, rgb or named colour outside the Tokens block (rule 1). Search your CSS for `#`.
- One primary (ink) button per view; everything else secondary or tertiary (rules 2, 21).
- Every control 28, 32, 36 or 40px tall with the matching control radius; cards 16px, no card shadow (rule 13).
- Fill or hairline, never both, at rest (rule 18). No dashed borders anywhere (rule 35).
- Tabs follow rule 19; counts sit on tabs, not above titles (rule 22).
- Tables in a bordered block (rule 32); picture cards keep words outside the picture (rule 23).
- Hover turns text and icon to the primary colour and steps the fill one grey; nothing moves (rule 25).
- Focus ring visible on every control (rule 7).
- Content eases in on arrival and on tab or filter changes, never on plain redraws; reduced motion stops it (rules 11, 14, 36).
- A visible way back from every screen you can get into (rule 38).
- Light and dark both checked; nothing on a dark page is darker than the page (rules 8, 15).
- At 375px wide nothing widens the page and the bottom tab bar stays on screen (rule 37).
- Copy: sentence case, no em dashes, no helper paragraphs under titles on cards, no "coming soon" dead ends on main paths.
