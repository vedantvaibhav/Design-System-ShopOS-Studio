---
name: sloosh
description: "Sloosh's design system: dark by default, one yellow (#FECC15) for the main action and display titles, keycap buttons, Bricolage Grotesque titles, pictures carry the colour. Use when building or reviewing any Sloosh screen or component, in dark and light."
---

# Sloosh design system

Read this first, every time you build or change Sloosh UI. It is the index; load only the topic files your task needs.

## The character

Sloosh is a creative tool for AI image, video and audio. Dark by default: a near-black ground, flat neutral surfaces and one bright yellow (`#FECC15`) used for the single most important action and for display titles. Buttons are tactile keycaps with a lip, titles are Bricolage Grotesque at 800, and the pictures carry the colour; the interface stays quiet around them. There is a light theme behind the navbar's sun / moon switch, and every screen must work in both.

## The rules that break most often

These cover most drift. The full list, numbered, is in [rules.md](rules.md).

1. **Tokens only.** Never write hex, `rgb()`, `hsl()`, raw palette classes (`text-white`, `bg-black/40`, `bg-neutral-800`) or arbitrary radii, type sizes or colours (`rounded-[10px]`, `text-[13px]`). Missing colour: add a token to `styles/tokens/semantic.css` and its mapping to `styles/theme.css`. See [colors.md](colors.md).
2. **Both themes.** Check dark and light. Yellow text (`text-brand-accent-text`) is display size only, because it is about 1.5:1 on white; yellow at label size (12 to 16px) is `text-brand-accent-label`, which turns ink on light.
3. **One yellow CTA per view, and it goes last** (rightmost) in its group. It is always `<Button variant="primary">` or `buttonVariants({ variant: "primary" })`, never a hand-made yellow box. See [buttons.md](buttons.md).
4. **Never style a button at the call site** with `shadow-*`, `transition-*` or press classes: the keycap slab owns them.
5. **Every icon is a `MotionIcon`** registered in `app/design-system-icons/registry.ts`. Register a new glyph before using it. Icon buttons are muted at rest, foreground on hover, focus or open. See [icons.md](icons.md).
6. **Text over a photo or video** is `text-on-media` on `bg-media-scrim/*`, in both themes. Never `text-foreground` or `bg-background/*` on a picture.
7. **Flat colour only.** No gradient fills, gradient text, glows or purple-blue "AI" sweeps. The few sanctioned exceptions are listed in [rules.md](rules.md).
8. **Cards are their picture at rest.** Titles, actions and doodles appear on hover. Space cards are the one exception (eye and title at rest).
9. **Pills are a fill, never outlined.** Filters are one row: pills on the left, pickers on the right. See [pills-and-tags.md](pills-and-tags.md).
10. **Build on what exists.** Copy the closest existing surface before inventing: empty lists use `EmptyState`, uploads use `UploadTile`, model pickers use `ModelSelect` (with logos), stepped dialogs copy the "Add my voice" dialog.
11. **Show everything.** Never cut a list to a top N; overflow scrolls sideways.
12. **Toasts are two lines max:** what happened, then one consequence.

## Topic files

| File | Read it when you are... |
|---|---|
| [colors.md](colors.md) | choosing any colour, background, border or text colour; working on light / dark; recreating the palette elsewhere |
| [typography.md](typography.md) | setting any text: titles, body, captions, numbers, code |
| [shape-and-elevation.md](shape-and-elevation.md) | picking a radius, shadow, spacing step, z-index, or a floating-panel look |
| [buttons.md](buttons.md) | adding any button, link-as-button or icon button |
| [pills-and-tags.md](pills-and-tags.md) | showing a chip, filter, status, count, credit cost or tag |
| [forms.md](forms.md) | building inputs, pickers, uploads, the prompt composer or a space form |
| [surfaces.md](surfaces.md) | using cards, dialogs, sheets, popovers, menus, tooltips, notices |
| [media-and-cards.md](media-and-cards.md) | showing pictures or videos, template / space cards, avatars, grids |
| [navigation.md](navigation.md) | adding tabs, segmented switches, or touching the navbar or phone tab bar |
| [feedback-and-loading.md](feedback-and-loading.md) | showing loading, empty states, toasts, progress or success |
| [icons.md](icons.md) | adding or changing any icon |
| [motion.md](motion.md) | animating anything, adding press feedback or sound |
| [layout.md](layout.md) | building a page, the app shell, or phone layouts |
| [rules.md](rules.md) | reviewing work, or unsure whether something is allowed |
| [AUDIT.md](AUDIT.md) | fixing drift: where the code breaks these rules today |

## Where the source of truth lives

| What | File |
|---|---|
| Colour ramps (primitives) | `styles/tokens/primitives.css` |
| Roles, light theme, radius, motion, z-index, sizing | `styles/tokens/semantic.css` |
| Token to Tailwind class, type scale, shadows, animations | `styles/theme.css` |
| Fonts | `app/layout.tsx` |
| Components | `components/ui/` (the design system); `components/shell/` (navbar, tab bar) |
| Icon registry | `app/design-system-icons/registry.ts` |
| Live specimen of every token and component | `/design-system` in the running app |

When these docs and the code disagree, the code wins. Fix the doc in the same change.

## Using this in another codebase

Hand over this whole folder (or the bundled single file). An agent recreating Sloosh elsewhere needs: the value table at the end of [colors.md](colors.md), the scale in [typography.md](typography.md), the radius and shadow values in [shape-and-elevation.md](shape-and-elevation.md), and the component rules. Keep the token names: they match production (`packages/ui/src/semantic-tokens.css`).

## Before you call UI work done

- `pnpm lint` and `pnpm build` pass.
- Checked in dark and light, and at phone width (375px) if the screen exists on phones.
- No new hex, raw palette class, arbitrary radius / type size, unregistered icon or call-site button styling.
- Copy that was live stays word for word unless the change was asked for.
