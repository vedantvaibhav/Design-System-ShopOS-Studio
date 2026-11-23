# Layout

Read this when you add a page or route, lay out a screen or toolbar, handle a phone width, or decide where a part or its content lives.

## App shell

```
app/layout.tsx           <html class="dark" data-theme="dark" data-brand="sloosh">; body h-dvh flex flex-col, safe-area padding;
                         mounts ThemeSync, Toaster, RiseObserver, IconMotionRuntime once
├── app/(shell)/layout.tsx   the product: header (AnnouncementBar + SlooshNavbar, z-40, animate-enter-down),
│                            <main> + NavLoader, MobileTabBar (below md), the auth, onboarding and sale hosts,
│                            JamProvider / CapsProvider / KeysProvider / OffersProvider
├── app/(focus)/layout.tsx   a focus page: only <main>, no navbar, announcement bar or tab bar; the page brings
│                            its own bar (today /microdrama/make)
└── app/design-system*, app/cards, app/offers, app/out-of-credit, app/nudges   specimen and prototype pages, no shell
```

- **`<main>` is the scroller, not the window.** It is `flex-1 min-h-0 overflow-auto px-(--shell-gutter)`. A full-height screen sizes to it with `h-full`. Scroll code and observers target `main` (`el.closest("main")`, `document.querySelector("main")`), never `window`. Why: the window never scrolls, so `window.scrollTo` does nothing.
- The header drops in once per visit; the shell stays mounted across pages, so pages bring their own entrances (`motion.md`).
- `--nav-h` is 61px and `--sl-tabbar-h` is 61px (`semantic.css`). `h-screen-minus-nav` exists for a full-height block outside `<main>`'s flow.
- `--shell-gutter` is 0 below 1920px and centres content past it; an element with `data-full-width` on the page keeps the whole width.
- `/spacelab` is an editor route (`isEditorRoute`, `components/shell/nav-items.ts`): the navbar renders nothing and the screen draws its own top row.
- Theme lives only in `lib/theme.ts` (`applyTheme`, `setTheme`, `THEME_SCRIPT`). Never set `data-theme` or the `dark` class on `<html>` anywhere else; `data-theme` on an element makes a dark or light island.
- z-order uses `--sl-z-*` tokens (`z-(--sl-z-modal)`); the shell's own layers keep `z-40` / `z-50`.

## Breakpoints

| Prefix | Width | Note |
|---|---|---|
| `xs` | 430px | defined in `styles/theme.css`, unused today |
| `sm` | 640px | |
| `md` | 768px | the phone line: tab bar, phone sheets |
| `lg` | 1024px | the tablet line: Modal and drawers become sheets |
| `xl` | 1280px | |
| `2xl` | 1400px | Sloosh's own value, not Tailwind's 1536 |
| `3xl` | 1600px | the navbar's Docs / Assets / credits words show from here |

`ScreenBreakpointPx` in `lib/screen-breakpoints.ts` mirrors `sm` to `2xl` for JavaScript. Write phone overrides as `max-md:` (the most used prefix, about 1,000 call sites). Prefer a CSS prefix to a hook: `useIsMobile` (below 768) and `useIsTablet` (below 1024) in `hooks/` report the smallest width on the server, so they swap after hydration. `useFinePointer` (`hooks/use-fine-pointer.ts`) is the test for hover-to-open.

```
What changes at a width?
├── below md (768): MobileTabBar shows; Select / Dropdown / Popover popups become sheets (phone-sheet);
│                   TextSegmentedSwitch becomes a Select; the navbar becomes the phone header
├── below lg (1024): Modal is a Base UI Drawer; AssetDrawer and AssetPicker become bottom sheets;
│                    TabFilters becomes a Select
└── 1920 and up: --shell-gutter centres the content
```

## Phones

- **Tab bar** (`components/shell/mobile-tab-bar.tsx`): five equal columns, Explore, Studio, Spaces, Creator, More; a 20px glyph over a 12px label, each cell at least 44px tall (`min-h-11`). Explore, Studio and Spaces navigate; Creator and More open `MobileNavSheet` (`components/shell/mobile-nav-sheet.tsx`). Labels come from `NAV_ITEMS` (`components/shell/nav-items.ts`), so phone and desktop agree.
- **Focused phone routes** (`isFocusedPhoneRoute`): `/spaces/<id>`, `/spaces/<id>/runs/<id>`, Synora, Calypso and `/microdrama/studio` hide the navbar and tab bar below md and draw their own phone header. A new full-screen phone flow joins that function.
- **Sheets.** A menu, select or popover is a sheet by itself through `phone-sheet` (closes on tap outside, Escape or a pick). A custom phone panel is `BottomSheet` (`components/ui/bottom-sheet.tsx`: drag to dismiss, `showTitle`, `onBack`, `footer`, rows with `SHEET_ROW` / `SHEET_ROW_ICON`). A dialog is the default `Modal` from `components/ui/dialog.tsx`, which becomes a drawer below lg by itself.
- **No hover on touch.** Anything shown on hover has a tap path: cards open their preview (rules.md, rule 5).

## Pages stay thin; content lives in `lib/mock/`

A page in `app/` reads mock data, sets metadata and renders one screen component from `components/<feature>/`. Copy, prices, options and media paths live in `lib/mock/` (typed in `lib/mock/types.ts`), never in a page or component. Why: going live means swapping the mock imports in pages for real fetching that returns the same shapes.

```tsx
// Correct: app/(shell)/spaces/[spaceId]/page.tsx
export default async function SpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const space = getSpace((await params).spaceId);          // lib/mock/spaces.ts
  if (!space) notFound();
  return <SpacePageScreen space={space} templates={getSpaceTemplates(space.id)} runs={[]} signedIn />;
}

// Incorrect: copy written in the component
<p className="rounded-xl bg-card px-4 py-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>
```

```tsx
// Correct: scroll the shell's scroller (components/home/home-ab-picker.tsx:27)
document.querySelector("main")?.scrollTo({ top: 0 });
// Incorrect: the window never scrolls inside the shell
window.scrollTo({ top: 0, behavior: "smooth" });
```

## Bar controls

A toolbar row (tabs on one side, controls on the other):

- **One weight per cluster.** Controls side by side are all filled or all ghost. A filled search beside icon keys makes them filled: `Button variant="secondary" size="icon-36"`. Ghost icon keys go only in rows of ghost or text controls (the navbar). Why: mixed weights make one control look disabled.
- **Tabs left, search and actions right,** the search first in the right cluster. A page's main search bar: source tabs far left, search far right (`/templates`).
- **Primary on the right.** In any button group the `variant="primary"` key is last.
- **One height.** Everything in the row is 36, the field included; a page-level bar may be 40 with 56-tall line tabs.
- **Two levels of tabs look different.** First level: line tabs (`TabsList variant="line"`, `components/ui/tabs.tsx`) on a full-width rule. Second level: pill tabs (`PAGE_TAB_CLASS` from `components/ui/pill.tsx` over a `TabTrack`), from the left.
- **Template search is one part** (`components/templates/template-search.tsx`): `useTemplateSearch` holds the typed and settled query, `TemplateSearch` is the field with ×, `TemplatesSkeleton` fills the grid while it settles, `TemplatesNoMatch` says nothing matched.

```tsx
// Correct: one filled cluster at 36 (components/ui/toolbar-menus.tsx, TOOLBAR_KEY_CLASS)
"relative flex size-9 shrink-0 items-center justify-center rounded-control bg-muted text-muted-foreground …"
```

## Page components

Parts used by one screen live in that screen's folder (`components/pricing/`, `components/mcp/`, `components/spacelab/`, `components/not-found/`...), never in `components/ui/`, and each folder has its own section on `/design-system` (`app/design-system/page-components.tsx`), shown live in page order. A part used by two screens moves to `components/ui/`.

- **Shared page parts** (`components/ui/`): `Reveal` (the marketing card rise), `FaqSection` (the page FAQ), `WaveEdge` (a band's hand-cut edge), `EmptyState` (every empty list, rules.md rule 20).
- **One state per page.** A page whose sections share state gets one provider in its screen file: `PricingProvider` (`components/pricing/pricing-screen.tsx`), `PublishProvider` (`components/spacelab/publish/publish-context.tsx`).
- **Prototype-only controls** (state pickers, demo switchers) are marked as such and never copied into product parts: `PrototypeStatePicker` (`components/spacelab/publish/prototype-state.tsx`), `CapsDemoPicker` and `KeysDemoPicker` (`components/settings/`), `OffersDemoPicker` (`components/offers/`).
- A page component's own animation (a graphic's scene, a critter) belongs to the component; shared motion (`MotionTitle`, the card rise) is documented once, in `motion.md`.
