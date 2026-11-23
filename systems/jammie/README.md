# Jammie

Calm, soft and tactile: white pages, one clean red, felt-textured art, and no
hairlines. Things are separated by soft fills and gaps, never by rules or outlines.

![Jammie waving](assets/jammie/v3/pose-wave.png)

## Use it

Install it as a Claude Code skill:

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/jammie ~/.claude/skills/jammie
```

Open [`design-system.html`](design-system.html) for the live reference. Serve the
folder first so the scripts load:

```bash
python3 -m http.server 5173
```

## Contents

| Path | Holds |
| ---- | ----- |
| `SKILL.md` | The rules an agent follows |
| `design-system.html` | The live reference: every token, component and card |
| `assets/jammie/v3/jammie.css` | Tokens and every shared component |
| `assets/jammie/v3/data.js` | The card renderers: `fcard`, `scard`, `story`, `dcard`, `ltile` |
| `assets/jammie/v3/icons.js` | The line icons |
| `assets/jammie/v3/pose-*.png` | Jammie's poses |
| `assets/jammie/v3/el-*.png` | Felt 3D icons |
| `assets/jammie/v3/anim/` | Jammie's loops |

The demo ideas in `data.js` point to sample pictures (`assets/jammie/v3/demo/`)
that are not in this folder, so the example cards show empty pictures.

## Licences

Jammie art and icons are ShopOS's own. Figtree is under the SIL Open Font
Licence and is loaded from Google Fonts.

## Changelog

- 2026-11-23: First version, from the Jammie workbench (v3).
