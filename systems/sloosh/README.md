# Sloosh

Sloosh is a creative tool for AI image, video and audio. Dark by default: a
near-black ground, flat neutral surfaces and one bright yellow (`#FECC15`) for
the single most important action and for display titles. Buttons are tactile
keycaps, titles are Bricolage Grotesque at 800, and the pictures carry the colour.

## Use it

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/sloosh ~/.claude/skills/sloosh
```

[`SKILL.md`](SKILL.md) is the index an agent reads first; it points to one file
per topic (colours, type, buttons, forms, motion and more). The live specimen of
every token and component is at
[sloosh-design-system.tech-9ce.workers.dev/design-system](https://sloosh-design-system.tech-9ce.workers.dev/design-system).

## Contents

| Path | Holds |
| ---- | ----- |
| `SKILL.md` | The index and the twelve rules that break most often |
| `*.md` | One file per topic, plus `rules.md` and `AUDIT.md` |
| `styles/tokens/primitives.css` | Colour ramps |
| `styles/tokens/semantic.css` | Roles, light theme, radius, motion, z-index, sizing |
| `styles/theme.css` | Tokens to Tailwind classes, type scale, shadows, animations |

The docs also name React components (`components/ui/`) and the icon registry;
those stay in the Sloosh app and are not part of this folder.

## Source

Synced from `Shop-OS/sloosh-design-system` (`docs/design-system/` and `styles/`).
Change it there; edits made here are overwritten by the next sync.

## Licences

Bricolage Grotesque is under the SIL Open Font Licence.
