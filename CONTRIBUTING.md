# Contributing

## Add a design system

1. Copy the template under a new folder name. Use lowercase and hyphens; the
   folder name is the system's id. To fill a slot on the site, use that slot's
   `id` from `site/structure.json` (for example `crafeed` or `sloosh`).

   ```bash
   cp -R systems/_template systems/my-system
   ```

2. Fill in `systems/my-system/SKILL.md`. Its frontmatter `name` must equal the
   folder name, and `description` must say when an agent should use it (it is
   also the one-line summary in the root README).
3. Fill in `README.md` for people: what the system is for, a preview, how to use it.
4. Put tokens in `tokens/`, longer guides in `references/`, files in `assets/`.
   Delete any folder you do not use. A `design-system.html` in the folder shows
   as the system's Live reference on the site.
5. Regenerate the index in the root README and check everything:

   ```bash
   node scripts/check.mjs --write
   ```

6. Open a pull request. CI runs `node scripts/check.mjs` and fails if a system is
   missing a file, has a mismatched name, or the index is out of date.

## Update a system

Edit its folder, run `node scripts/check.mjs --write` if you changed its
`name` or `description`, and open a pull request. Note what changed at the
bottom of the system's `README.md` under **Changelog**.

## Rules

- One system per folder. No shared files between systems: each folder must work
  when downloaded on its own.
- Paths inside a system are relative to that system's folder.
- No secrets, API keys, private URLs or customer data.
- Only add fonts, icons and images you have the right to share, and name their
  licence in the system's `README.md`.
