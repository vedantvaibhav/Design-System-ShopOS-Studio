#!/usr/bin/env node
// Pulls each system in sources.json from the repo it lives in.
//   node scripts/sync.mjs                    sync every source
//   node scripts/sync.mjs --repo owner/name  only sources from that repo (what a push dispatch sends)
//   node scripts/sync.mjs --id jammie        only that system
//   node scripts/sync.mjs --from jammie=../ShopOS-Feed   read a local checkout instead of GitHub (testing)
// SOURCES_TOKEN, if set, is used to clone private repos. A source that fails keeps its current files.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const sources = JSON.parse(readFileSync(join(root, "sources.json"), "utf8"));
const lockPath = join(root, "sources.lock.json");
const lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf8")) : {};

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};
const onlyRepo = opt("--repo");
const onlyId = opt("--id");
const local = Object.fromEntries(
  args.flatMap((a, i) => (args[i - 1] === "--from" ? [a.split("=")] : [])).map(([id, p]) => [id, resolve(p)]),
);

const git = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();
const glob = (pattern) => new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? filesUnder(p) : [p];
  });
}

// One shallow, sparse clone per repo and ref, fetching only the paths the sources name.
const clones = new Map();
function checkout(repo, ref, paths) {
  const key = `${repo}@${ref}`;
  if (clones.has(key)) return clones.get(key);
  const dir = mkdtempSync(join(tmpdir(), "ds-sync-"));
  const token = process.env.SOURCES_TOKEN;
  const url = token ? `https://x-access-token:${token}@github.com/${repo}.git` : `https://github.com/${repo}.git`;
  try {
    git(dir, "clone", "--quiet", "--depth", "1", "--branch", ref, "--filter=blob:none", "--no-checkout", url, ".");
    git(dir, "sparse-checkout", "set", "--no-cone", ...paths.map((p) => `/${p}`));
    git(dir, "checkout", "--quiet");
  } catch (err) {
    // Never echo the clone URL: it can carry the token.
    throw new Error(`could not clone ${repo}@${ref} (private repos need SOURCES_TOKEN)`);
  }
  const result = { dir, commit: git(dir, "rev-parse", "HEAD") };
  clones.set(key, result);
  return result;
}

const picked = Object.entries(sources).filter(
  ([id, s]) => (!onlyId || id === onlyId) && (!onlyRepo || s.repo.toLowerCase() === onlyRepo.toLowerCase()),
);
if (!picked.length) {
  const msg = `Nothing in sources.json matches${onlyRepo ? ` ${onlyRepo}` : ""}${onlyId ? ` ${onlyId}` : ""}.`;
  writeFileSync(process.env.SYNC_REPORT || join(tmpdir(), "ds-sync-report.md"), `### Design system sync\n\n${msg}\n`);
  console.log(msg);
  process.exit(0);
}

const report = [];
const failed = [];

for (const [id, src] of picked) {
  const ref = src.ref || "main";
  const copy = src.copy || {};
  const wanted = [src.skill, ...Object.keys(copy)];
  try {
    let base, commit;
    if (local[id]) {
      base = local[id];
      commit = `local:${git(base, "rev-parse", "--short", "HEAD")}`;
    } else {
      ({ dir: base, commit } = checkout(src.repo, ref, picked.filter(([, s]) => s.repo === src.repo && (s.ref || "main") === ref).flatMap(([, s]) => [s.skill, ...Object.keys(s.copy || {})])));
    }
    const missing = wanted.filter((p) => !existsSync(join(base, p)));
    if (missing.length) throw new Error(`not on ${src.repo}@${ref}: ${missing.join(", ")}`);

    const out = mkdtempSync(join(tmpdir(), `ds-${id}-`));
    const excludes = (src.exclude || []).map(glob);
    for (const [from, to] of Object.entries(copy)) {
      const abs = join(base, from);
      const files = statSync(abs).isDirectory() ? filesUnder(abs) : [abs];
      for (const file of files) {
        const rel = relative(base, file);
        if (excludes.some((re) => re.test(rel))) continue;
        const dest = join(out, to, relative(abs, file));
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(file, dest);
      }
    }

    // The skill's name must match its folder here, whatever it is called upstream.
    let skill = readFileSync(join(base, src.skill), "utf8");
    if (!/^---\r?\n/.test(skill) && src.description) {
      // A docs index with no skill header gets one from sources.json.
      skill = `---\nname: ${id}\ndescription: ${JSON.stringify(src.description)}\n---\n\n${skill}`;
    }
    if (!/^---\r?\n[\s\S]*?^name:/m.test(skill)) throw new Error(`${src.skill} has no frontmatter name (add "description" to its sources.json entry)`);
    writeFileSync(join(out, "SKILL.md"), skill.replace(/^(---\r?\n[\s\S]*?^name:).*$/m, `$1 ${id}`));

    const warnings = [];
    for (const r of src.replace || []) {
      const p = join(out, r.file);
      if (!existsSync(p)) { warnings.push(`replace: ${r.file} not copied`); continue; }
      const text = readFileSync(p, "utf8");
      if (!text.includes(r.find)) { warnings.push(`replace: "${r.find.trim().slice(0, 40)}" not found in ${r.file}`); continue; }
      writeFileSync(p, text.split(r.find).join(r.with));
    }

    // Files written in this repo (its README, for example) survive the sync.
    const target = join(root, "systems", id);
    for (const k of src.keep || []) {
      if (existsSync(join(target, k))) cpSync(join(target, k), join(out, k), { recursive: true });
    }

    rmSync(target, { recursive: true, force: true });
    cpSync(out, target, { recursive: true });
    rmSync(out, { recursive: true, force: true });

    const before = lock[id]?.commit;
    if (!local[id]) lock[id] = { repo: src.repo, ref, commit };
    report.push(`- **${id}** from \`${src.repo}@${ref}\` ${before && before !== commit ? `${before.slice(0, 7)} → ` : ""}${commit.slice(0, 12)}`);
    for (const w of warnings) report.push(`  - ⚠ ${w}`);
    console.log(`✓ ${id} ← ${src.repo}@${ref} (${commit.slice(0, 12)})${warnings.length ? `, ${warnings.length} warning(s)` : ""}`);
    warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  } catch (err) {
    failed.push(id);
    report.push(`- **${id}** ✗ ${err.message}`);
    console.error(`✗ ${id}: ${err.message}`);
  }
}

for (const { dir } of clones.values()) rmSync(dir, { recursive: true, force: true });
writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
try {
  execFileSync(process.execPath, [join(root, "scripts", "check.mjs"), "--write"], { stdio: "inherit" });
} catch {
  failed.push("check");
  report.push("- ✗ `node scripts/check.mjs` failed after the sync; see the log");
}

const summary = `### Design system sync\n\n${report.join("\n")}\n`;
writeFileSync(process.env.SYNC_REPORT || join(tmpdir(), "ds-sync-report.md"), summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
process.exit(failed.length ? 1 : 0);
