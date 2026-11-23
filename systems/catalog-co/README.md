# Catalog Co.

The ShopOS Studio design system: the client portal ShopOS customers use. One
white page over cool Apple greys, warm brown text in four tones, one ink button,
and colour only in photos, status and label accents. Its north star is the
ElevenLabs app.

## Use it

Install it as a Claude Code skill:

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/catalog-co ~/.claude/skills/catalog-co
```

The whole system is one file, [`SKILL.md`](SKILL.md): the rules from design
reviews 1 to 38, light and dark tokens as copy-paste CSS, the motion system,
component recipes, screen patterns and a checklist.

## At a glance

| | |
| --- | --- |
| Page | `--bg-primary` #ffffff, over `--bg-frame` #f2f2f7 |
| Text | `--tone-1` #1c1410 to `--tone-4` #8c7e72 |
| Main button | `--cta-solid` #1c1410 with white text |
| Type | Manrope 400, 500, 600; UI text 13/20, page titles 24/32 |
| Status | error #d92d20 · warning #dc6803 · success #079455 |

## Licences

Manrope is under the SIL Open Font Licence and is loaded from Google Fonts.

## Changelog

- 2026-11-23: First version (design reviews 1 to 38).
