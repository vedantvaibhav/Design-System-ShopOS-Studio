# ShopOS Studio Design Systems

A library of design systems you can read, copy and hand to an AI agent.

Each system lives in its own folder under [`systems/`](systems). Every folder is
a self-contained [Agent Skill](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview):
a `SKILL.md` an agent loads, a `README.md` for people, and the tokens and
references both of them read.

## Browse

Open [`index.html`](index.html) (or the GitHub Pages site, once it is on) to see
every studio's system. To run it locally, serve the repo root:

```bash
python3 -m http.server 5180
```

The page is built from [`site/structure.json`](site/structure.json): one slot per
studio, engine and shared space. A slot turns Ready once `systems/<id>` exists.

## Systems

<!-- systems:start -->
| System | Use it for |
| ------ | ---------- |
| [catalog-co](systems/catalog-co) | The ShopOS Studio design system in one file. Use it for any ShopOS Studio screen, component or review, in any stack. It holds every rule from the owner's design reviews (1 to 38), the resolved tokens for light and dark as copy-paste CSS, the motion system with its code, component recipes, screen patterns, fonts and icons, and a checklist. Follow it exactly; where your own taste disagrees, this file wins. |
| [jammie](systems/jammie) | Jammie's design system — tokens, type, the Jammie character, 3D icons, line icons and the shared cards (feed card, saved card, story ring, Command centre card, memory tile, rows). Use when building or reviewing any Jammie screen, so it uses the existing tokens and components instead of inventing new ones. |
| [sloosh](systems/sloosh) | Sloosh's design system: dark by default, one yellow (#FECC15) for the main action and display titles, keycap buttons, Bricolage Grotesque titles, pictures carry the colour. Use when building or reviewing any Sloosh screen or component, in dark and light. |
<!-- systems:end -->

## Download one system

Copy a single system without cloning the whole repo:

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/<name> <name>
```

Install it as a Claude Code skill, available in every project:

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/<name> ~/.claude/skills/<name>
```

Or install it for one project only, from that project's root:

```bash
npx degit vedantvaibhav/Design-System-ShopOS-Studio/systems/<name> .claude/skills/<name>
```

Prefer the whole library? Clone it, or use **Code → Download ZIP** on GitHub.

## What a system folder holds

```
systems/<name>/
  SKILL.md        what an agent reads first: when to use it, the rules, where to look
  README.md       the same system explained for people, with previews
  tokens/         colour, type, spacing, radius, motion (CSS variables and/or JSON)
  references/     longer guides the SKILL.md points to (components, patterns, copy)
  assets/         fonts, icons, images, preview screenshots
```

Only `SKILL.md` and `README.md` are required. Start from
[`systems/_template`](systems/_template).

## Keeping systems up to date

Most systems live in their own repos. [`sources.json`](sources.json) says where
each one comes from, and [`scripts/sync.mjs`](scripts/sync.mjs) copies it here.
The **Sync from source repos** workflow runs that script and opens one rolling
pull request with whatever changed:

- within minutes of a push to a source repo that carries the notify workflow
- every day at 03:17 UTC
- whenever you press **Run workflow** on the Actions tab

A source that cannot be read keeps its current files and the run is marked failed.
`sources.lock.json` records the commit each system was last synced from.

One-time setup:

1. **This repo:** Settings → Actions → General → Workflow permissions → tick
   *Allow GitHub Actions to create and approve pull requests*.
2. **Private sources:** create a fine-grained token with *Contents: Read* on those
   repos and save it here as the Actions secret `SOURCES_TOKEN`. Public sources
   need nothing.
3. **Instant updates, per source repo:** copy
   [`templates/notify-design-systems.yml`](templates/notify-design-systems.yml) to
   its `.github/workflows/`, and save a fine-grained token with *Contents: Read and
   write* on this repo as its secret `DESIGN_SYSTEMS_TOKEN`. One token can serve
   every source repo.

To add a system from its repo, add an entry to `sources.json` (see
[CONTRIBUTING.md](CONTRIBUTING.md)) and run the workflow once.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). In short: copy the template, fill it in,
run `node scripts/check.mjs --write`, open a pull request.
