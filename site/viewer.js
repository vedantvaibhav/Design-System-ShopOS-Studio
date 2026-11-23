// The design system viewer: one page per system with a sidebar.
// Token pages are drawn from the system's own CSS, read in a hidden frame so
// every var() chain resolves exactly as it does in the product, in light and dark.
(() => {
  const REPO = "vedantvaibhav/Design-System-ShopOS-Studio";
  const GH = `https://github.com/${REPO}`;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const icon = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7m0 0H8m9 0v9"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14"/></svg>',
  };

  const page = $("#page");
  const side = $("#side");
  const items = window.DS.groups.flatMap((g) => g.items);
  const item = items.find((it) => it.id === new URLSearchParams(location.search).get("id"));

  // ---------- small helpers ----------
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("on"), 1800);
  };
  const copy = async (text, what = "Copied") => {
    try { await navigator.clipboard.writeText(text); toast(what); }
    catch { toast("Copy failed. Select it by hand."); }
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (b) copy(b.dataset.copy, b.dataset.copied || "Copied");
  });

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgba = (c) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b, a: a / 255 };
  };
  const hex = (c) => {
    const { r, g, b, a } = rgba(c);
    const h = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    return a < 1 ? `${h} · ${Math.round(a * 100)}%` : h;
  };
  const inkOn = (c) => {
    const { r, g, b, a } = rgba(c);
    if (a < 0.5) return "var(--ink)";
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return lum > 0.55 ? "var(--ink)" : "#fff";
  };
  const isColor = (v) => v && !/^(inherit|initial|unset|currentcolor|none)$/i.test(v) && !/^[\d.]+$/.test(v) && CSS.supports("color", v);
  const px = (v) => {
    const m = String(v).match(/^(-?[\d.]+)(px|rem|em)?$/);
    if (!m) return null;
    return m[2] === "rem" || m[2] === "em" ? parseFloat(m[1]) * 16 : parseFloat(m[1]);
  };
  const isLen = (v) => /^-?[\d.]+(px|rem|em)$/.test(v);
  const slug = (s) => s.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const dark = (it) => Boolean(it.ink) && it.ink.toLowerCase() !== "#ffffff";

  if (!item) {
    side.remove();
    page.innerHTML = `<section class="empty"><h2>Not found.</h2><a class="btn green raised" href="./">All systems</a></section>`;
    return;
  }

  const dir = `systems/${item.id}`;
  const live = item.preview ? `${dir}/${item.preview}` : item.live || null;
  document.title = `${item.name} · ShopOS Design Systems`;
  document.documentElement.style.setProperty("--accent", item.accent);
  document.documentElement.style.setProperty("--accent-ink", item.ink || "var(--ink)");

  const pill = item.stage ? `<span class="pill">${esc(item.stage)}</span>`
    : item.ready ? '<span class="pill ready">Ready</span>' : '<span class="pill">Soon</span>';
  const hero = () => `
    <section class="detail-hero">
      ${shapeSvg(item.shape, dark(item))}
      ${pill}
      <span class="kicker">${esc(item.kicker)}</span>
      <h1>${esc(item.name)}</h1>
    </section>`;

  $("#bar-actions").innerHTML = [
    live ? `<a class="btn raised" href="${esc(live)}" target="_blank" rel="noopener">Live site ${icon.out}</a>` : "",
    item.ready ? `<button class="btn green raised hide-sm" type="button" id="zip">Download .zip ${icon.down}</button>` : "",
  ].join("");

  if (!item.ready) {
    side.innerHTML = sideHead();
    page.innerHTML = hero() + `
      <section class="empty">
        <h2>Soon.</h2>
        <a class="btn ink raised" href="${GH}/blob/main/CONTRIBUTING.md">Add it</a>
      </section>`;
    return;
  }

  function sideHead() {
    return `
      <div class="side-head">
        <span class="side-tile">${shapeSvg(item.shape, dark(item))}</span>
        <span><span class="kicker">${esc(item.kicker)}</span><strong>${esc(item.name)}</strong></span>
      </div>`;
  }

  // ---------- zip ----------
  let JSZipReady;
  const loadJSZip = () => (JSZipReady ??= new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => res(window.JSZip);
    s.onerror = rej;
    document.head.append(s);
  }));
  async function downloadZip() {
    toast("Packing the folder…");
    try {
      const JSZip = await loadJSZip();
      const zip = new JSZip();
      const folder = zip.folder(item.id);
      await Promise.all(item.files.map(async (f) => {
        const r = await fetch(`${dir}/${f}`);
        if (!r.ok) throw new Error(f);
        folder.file(f, await r.blob());
      }));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `${item.id}.zip` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(`${item.id}.zip downloaded`);
    } catch {
      toast("Could not pack it here. Use the GitHub folder.");
    }
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#zip, [data-zip]")) downloadZip();
  });

  // ---------- reading the system ----------
  const get = async (path) => {
    const r = await fetch(`${dir}/${path}`);
    if (!r.ok) throw new Error(path);
    return r.text();
  };
  const stripFront = (md) => md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const firstH1 = (md) => (md.match(/^#\s+(.+)$/m) || [])[1];
  const dropH1 = (md) => md.replace(/^\s*#\s+.+\r?\n/, "");
  const cssBlocks = (md) => [...md.matchAll(/```css\r?\n([\s\S]*?)```/g)].map((m) => m[1]);

  async function readTokens(cssTexts) {
    const css = cssTexts.join("\n")
      .replace(/@import[^;]+;/g, "")
      .replace(/@theme(\s+(inline|static|default|reference))*\s*\{/g, ":root {")
      .replace(/<\/style/gi, "<\\/style")
      // OS-driven dark mode becomes a width query, so this page can switch it.
      .replace(/@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/g, "@media (min-width: 5000px)")
      .replace(/@media\s*\(\s*prefers-color-scheme\s*:\s*light\s*\)/g, "@media (max-width: 4999px)");
    // Type styles that live in classes (Tailwind @utility text-display-60, .display-xs …).
    S.typeClasses = [];
    for (const m of css.matchAll(/(?:@utility\s+|\.)((?:text|display|heading|title|type|h[1-6])(?:-[\w-]+)?)\s*\{([^{}]*)\}/g)) {
      const props = Object.fromEntries([...m[2].matchAll(/([a-z-]+)\s*:\s*([^;]+)/g)].map((d) => [d[1], d[2].trim()]));
      if (props["font-size"] && !S.typeClasses.some((c) => c.name === m[1])) S.typeClasses.push({ name: m[1], props });
    }
    const raw = new Map();
    for (const m of css.matchAll(/(--[A-Za-z0-9_-]+)\s*:\s*([^;{}]*)/g)) {
      if (!raw.has(m[1])) raw.set(m[1], m[2].trim());
    }
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.style.cssText = "position:fixed;left:-9000px;top:0;width:10px;height:10px;border:0;visibility:hidden";
    frame.srcdoc = `<!doctype html><html><head><style>${css}</style></head><body></body></html>`;
    document.body.append(frame);
    await new Promise((res) => frame.addEventListener("load", res, { once: true }));
    const html = frame.contentDocument.documentElement;
    const read = (theme) => {
      frame.style.width = theme === "dark" ? "6000px" : "10px";
      html.setAttribute("data-theme", theme);
      html.className = theme;
      const cs = frame.contentWindow.getComputedStyle(html);
      return new Map([...raw.keys()].map((n) => [n, cs.getPropertyValue(n).trim()]));
    };
    const light = read("light");
    const darkV = read("dark");
    frame.style.width = "10px";
    html.removeAttribute("data-theme");
    html.className = "";
    const cs = frame.contentWindow.getComputedStyle(html);
    let toDark = 0, toLight = 0;
    for (const n of raw.keys()) {
      const v = cs.getPropertyValue(n).trim();
      if (light.get(n) !== darkV.get(n)) { if (v === darkV.get(n)) toDark++; else if (v === light.get(n)) toLight++; }
    }
    S.theme = toDark > toLight ? "dark" : "light";
    frame.remove();
    return [...raw.keys()]
      .map((name) => ({ name, raw: raw.get(name), light: light.get(name), dark: darkV.get(name) }))
      .filter((t) => t.light || t.dark);
  }

  function classify(t) {
    const n = t.name.toLowerCase();
    const v = t.light || t.dark;
    if (/^--.+--/.test(n)) return "sub";
    if (/ease|easing|curve|bezier/.test(n) || /cubic-bezier|linear\(|steps\(/.test(v)) return "ease";
    if (/duration|dur\b|-dur|delay|stagger|time|speed/.test(n) && /^-?[\d.]+m?s$/.test(v)) return "duration";
    if (/shadow|elevation/.test(n) && /\d/.test(v) && !isColor(v)) return "shadow";
    if (/font|family|face/.test(n) && !/size|weight|lh|line|track|letter|feature|variation|smooth|style|stretch|optical|synth/.test(n) && /[a-z]/i.test(v) && !/\(/.test(v) && !isLen(v) && !isColor(v)) return "family";
    if (/weight|font-(thin|light|regular|normal|medium|semibold|bold|black|extrabold|heavy)$/.test(n) && /^\d{3}$/.test(v)) return "weight";
    if (isColor(v)) return "color";
    if (isLen(v)) {
      if (/radius|rounded|^--r-|corner/.test(n)) return "radius";
      if (/^--(text|display|fs|font-size|heading|title|type)-|font-size|body-size|h-size|-fs$/.test(n)) return "typesize";
      if (/space|spacing|gap|gutter|pad|inset/.test(n)) return "space";
    }
    return "other";
  }

  const GENERIC = /^(ui-|system-ui|-apple-system|blinkmacsystemfont|sans-serif|serif|monospace|cursive|fantasy|emoji|math|segoe|roboto$|helvetica|arial|sf |sf$|apple|noto color|menlo|consolas|courier new|comic|bradley|times|georgia|var\()/i;
  const familyOf = (t) => {
    const v = (t.light || t.dark || t.raw.replace(/var\([^)]*\)\s*,?/g, "")).trim();
    return v.split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).find((f) => f && !GENERIC.test(f));
  };
  const loadedFonts = new Set();
  function loadFont(family) {
    if (!family || loadedFonts.has(family)) return;
    loadedFonts.add(family);
    const name = encodeURIComponent(family).replace(/%20/g, "+");
    const link = Object.assign(document.createElement("link"), {
      rel: "stylesheet",
      href: `https://fonts.googleapis.com/css2?family=${name}:wght@400..800&display=swap`,
    });
    // Static families refuse a weight range; ask again for their regular cut.
    link.onerror = () => { link.href = `https://fonts.googleapis.com/css2?family=${name}&display=swap`; link.onerror = null; };
    document.head.append(link);
  }

  // ---------- markdown ----------
  const docSlugs = new Set();
  function md(text) {
    const box = document.createElement("div");
    box.innerHTML = DOMPurify.sanitize(marked.parse(text));
    const local = (u) => u && !/^([a-z]+:|#|\/)/i.test(u);
    box.querySelectorAll("a[href]").forEach((a) => {
      const h = a.getAttribute("href");
      if (!local(h)) { if (/^https?:/.test(h)) { a.target = "_blank"; a.rel = "noopener"; } return; }
      const m = h.match(/^(?:\.\/)?([\w-]+)\.md(#.*)?$/);
      if (m && docSlugs.has(m[1])) a.href = `#doc/${m[1]}`;
      else if (/\.md$/i.test(h)) a.href = `${GH}/blob/main/${dir}/${h}`;
      else a.href = `${dir}/${h}`;
    });
    box.querySelectorAll("img[src]").forEach((img) => {
      if (local(img.getAttribute("src"))) img.src = `${dir}/${img.getAttribute("src")}`;
    });
    box.querySelectorAll("h2, h3").forEach((h) => { h.id ||= slug(h.textContent); });
    box.querySelectorAll("pre").forEach((pre) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "code-copy";
      b.textContent = "Copy";
      b.dataset.copy = pre.textContent;
      pre.append(b);
    });
    box.querySelectorAll("table").forEach((t) => {
      const w = document.createElement("div");
      w.className = "table-scroll";
      t.replaceWith(w);
      w.append(t);
    });
    return box.innerHTML;
  }

  // ---------- pages ----------
  const S = { theme: "light", hasDark: false, tokens: [], by: {}, guide: [], intro: "", pages: [], typeClasses: [] };

  const pageHead = (title, extra = "") => `<header class="page-head"><h1>${esc(title)}</h1>${extra}</header>`;
  const seg = () => S.hasDark ? `
    <div class="seg" role="group" aria-label="Theme">
      ${["light", "dark"].map((t) => `<button type="button" data-theme-pick="${t}" aria-pressed="${S.theme === t}">${t === "light" ? "Light" : "Dark"}</button>`).join("")}
    </div>` : "";
  const search = (ph) => `<label class="search"><span class="sr">${esc(ph)}</span><input type="search" placeholder="${esc(ph)}" data-filter></label>`;
  const val = (t) => (S.theme === "dark" ? t.dark || t.light : t.light || t.dark);

  function overview() {
    const tiles = [
      ["colours", S.by.color.length, "Colours"],
      ["type", Math.max(S.by.typesize.length, S.typeClasses.length) + S.by.family.length, "Type styles"],
      ["shape", S.by.radius.length + S.by.shadow.length, "Radii and shadows"],
      ["motion", S.by.ease.length + S.by.duration.length, "Motion tokens"],
      [S.guide[0] ? `doc/${S.guide[0].slug}` : "", S.guide.length, "Guide pages"],
    ].filter(([k, n]) => k && n);
    return hero() + `
      ${tiles.length ? `<div class="stats">${tiles.map(([k, n, label]) => `
        <a class="stat raised" href="#${k}"><strong>${n}</strong><span>${label}</span></a>`).join("")}</div>` : ""}
      <article class="doc raised">${md(S.intro)}</article>
      ${live ? `<section class="band live"><h2>See it live</h2><a class="btn ink raised" href="${esc(live)}" target="_blank" rel="noopener">Open live site ${icon.out}</a></section>` : ""}`;
  }

  function useWithClaude() {
    const all = `npx degit ${REPO}/${dir} ~/.claude/skills/${item.id}`;
    const one = `npx degit ${REPO}/${dir} .claude/skills/${item.id}`;
    const ask = `Use the ${item.id} skill to build a settings page.`;
    const cmd = (c) => `<div class="cmd"><code>${esc(c)}</code><button class="btn green raised" type="button" data-copy="${esc(c)}">Copy</button></div>`;
    return pageHead("Use with Claude") + `
      <ol class="steps">
        <li class="step raised">
          <span class="num">1</span>
          <div><h2>Claude Code</h2>
            <p class="label">Every project</p>${cmd(all)}
            <p class="label">This project only</p>${cmd(one)}
          </div>
        </li>
        <li class="step raised">
          <span class="num">2</span>
          <div><h2>Claude app</h2>
            <p>Settings → Capabilities → Skills → Upload skill.</p>
            <button class="btn ink raised" type="button" data-zip>Download ${esc(item.id)}.zip ${icon.down}</button>
          </div>
        </li>
        <li class="step raised">
          <span class="num">3</span>
          <div><h2>Any other agent</h2>
            <p>Paste it into AGENTS.md or the system prompt.</p>
            <button class="btn raised" type="button" data-copy-skill>Copy SKILL.md</button>
          </div>
        </li>
        <li class="step raised">
          <span class="num">4</span>
          <div><h2>Then ask</h2>${cmd(ask)}</div>
        </li>
      </ol>`;
  }

  function colours() {
    const groups = new Map();
    // Tailwind mirrors (--color-x: var(--x)) repeat a token already on the page.
    const names = new Set(S.by.color.map((t) => t.name));
    const shown = S.by.color.filter((t) => {
      const m = t.name.match(/^--color-(.+)$/);
      return !(m && names.has(`--${m[1]}`) && t.raw.replace(/\s/g, "") === `var(--${m[1]})`);
    });
    for (const t of shown) {
      const n = t.name.slice(2).replace(/^colou?r-/, "");
      const ramp = n.match(/^(.*?)-(\d{1,3})$/);
      const key = ramp ? `ramp:${ramp[1]}` : `role:${n.split("-")[0]}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    }
    const stepOf = (t) => Number(t.name.match(/-(\d+)$/)?.[1] ?? 0);
    for (const [k, list] of groups) if (k.startsWith("ramp:")) list.sort((a, b) => stepOf(a) - stepOf(b));
    const ramps = [...groups].filter(([k, list]) => k.startsWith("ramp:") && list.length > 2);
    const loose = [...groups].filter(([k, list]) => !(k.startsWith("ramp:") && list.length > 2));
    // Small groups read as noise one by one; they share one "other" group at the end.
    const other = loose.filter(([, list]) => list.length < 3).flatMap(([, list]) => list);
    const roles = [...loose.filter(([, list]) => list.length >= 3), ...(other.length ? [["role:other", other]] : [])];
    const swatch = (t) => {
      const v = val(t);
      return `<button type="button" class="swatch raised" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})" data-name="${esc(t.name)}">
        <span class="chip" style="--c:${esc(v)}"></span>
        <span class="meta"><code>${esc(t.name)}</code><small>${esc(hex(v))}</small></span>
      </button>`;
    };
    const rampRow = ([k, list]) => `
      <div class="ramp-row" data-names="${esc(list.map((t) => t.name).join(" "))}">
        <h3>${esc(k.slice(5))}</h3>
        <div class="ramp raised">${list.map((t) => {
          const v = val(t);
          return `<button type="button" class="step-c" style="--c:${esc(v)};color:${inkOn(v)}" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})" title="${esc(t.name)} ${esc(hex(v))}">
            <b>${esc(t.name.match(/-(\d+)$/)[1])}</b><small>${esc(hex(v).split(" ")[0])}</small></button>`;
        }).join("")}</div>
      </div>`;
    return pageHead("Palette", `<div class="tools">${search("Find a colour")}${seg()}</div>`) + `
      ${ramps.length ? `<section class="block"><h2>Palette</h2>${ramps.map(rampRow).join("")}</section>` : ""}
      ${roles.length ? `<section class="block"><h2>${ramps.length ? "Roles" : "All colours"}</h2>
        ${roles.map(([k, list]) => `<div class="role-group"><h3>${esc(k.split(":")[1])} <span class="count">${list.length}</span></h3>
          <div class="swatches">${list.map(swatch).join("")}</div></div>`).join("")}</section>` : ""}`;
  }

  function typography() {
    const fams = [];
    const seen = new Map();
    for (const t of S.by.family) {
      const f = familyOf(t);
      if (!f) continue;
      loadFont(f);
      const stack = val(t) || f;
      const label = stack.split(",")[0].trim().replace(/^["']|["']$/g, "");
      if (!seen.has(f)) { seen.set(f, { family: label && !/^var\(/.test(label) ? label : f, stack, names: [] }); fams.push(seen.get(f)); }
      seen.get(f).names.push(t.name);
    }
    const pick = (re) => fams.find((f) => f.names.some((n) => re.test(n)));
    const display = pick(/display|heading|title|brand/) || fams[0];
    const body = pick(/sans|body|text|ui|base/) || fams.find((f) => f !== display) || fams[0];
    const fontFor = (name) => (/display|title|heading|h-size|^--h\d/.test(name) ? display : body);
    const sub = (name, key) => S.tokens.find((t) => t.name === `${name}--${key}`);
    const resolve = (v, depth = 0) => depth > 6 ? v : v.replace(/var\((--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (all, n, fb) => {
      const t = S.tokens.find((x) => x.name === n);
      return t ? resolve(val(t), depth + 1) : fb ?? all;
    });
    const rows = [];
    for (const c of S.typeClasses) {
      const size = px(resolve(c.props["font-size"]));
      if (!size) continue;
      const p = (k) => (c.props[k] ? resolve(c.props[k]) : null);
      rows.push({ name: c.name, label: `${c.props["font-size"].startsWith("var(") ? resolve(c.props["font-size"]) : c.props["font-size"]}`, px: size,
        lh: p("line-height"), w: p("font-weight"), tr: p("letter-spacing"), fam: p("font-family") });
    }
    const have = new Set(rows.map((r) => r.name));
    for (const t of S.by.typesize) {
      const size = px(val(t));
      const base = t.name.slice(2);
      if (!size || have.has(base)) continue;
      const lh = sub(t.name, "line-height") || sub(t.name, "lh");
      const w = sub(t.name, "font-weight");
      const tr = sub(t.name, "letter-spacing");
      rows.push({ name: t.name, label: val(t), px: size, lh: lh && val(lh), w: w && val(w), tr: tr && val(tr), fam: null });
    }
    const sizes = rows.sort((a, b) => b.px - a.px);
    const weights = [...new Map(S.by.weight.map((t) => [val(t), t])).values()].sort((a, b) => val(a) - val(b));
    return pageHead("Type specimen") + `
      ${fams.length ? `<section class="block"><h2>Typefaces</h2><div class="fams">${fams.map((f) => `
        <div class="fam raised">
          <span class="aa" style="font-family:${esc(f.stack)}">Aa</span>
          <strong>${esc(f.family)}</strong>
          <span class="names">${f.names.map((n) => `<code>${esc(n)}</code>`).join(" ")}</span>
          <span class="abc" style="font-family:${esc(f.stack)}">ABCDEFGHIJKLM nopqrstuvwxyz 0123456789</span>
        </div>`).join("")}</div></section>` : ""}
      ${weights.length ? `<section class="block"><h2>Weights</h2><div class="weights raised">${weights.map((t) => `
        <div><span style="font-family:${esc(body?.stack || "inherit")};font-weight:${esc(val(t))}">Aa</span><code>${esc(t.name)}</code><small>${esc(val(t))}</small></div>`).join("")}</div></section>` : ""}
      ${sizes.length ? `<section class="block"><h2>Scale</h2><div class="scale raised">${sizes.map((r) => {
        const fam = r.fam || fontFor(r.name)?.stack;
        const style = [`font-size:${r.px}px`, fam && `font-family:${fam}`, r.lh && `line-height:${r.lh}`, r.w && `font-weight:${r.w}`, r.tr && `letter-spacing:${r.tr}`].filter(Boolean).join(";");
        return `<div class="scale-row" data-names="${esc(r.name)}">
          <div class="scale-meta"><code>${esc(r.name)}</code><small>${esc(r.label)}${r.lh ? ` / ${esc(r.lh)}` : ""}${r.w ? ` · ${esc(r.w)}` : ""}</small></div>
          <div class="scale-spec" style="${esc(style)}">${r.px >= 40 ? "One group, many studios" : r.px >= 20 ? "Every studio's design system" : "Every studio's design system, ready to read and download."}</div>
        </div>`;
      }).join("")}</div></section>` : ""}`;
  }

  function shape() {
    return pageHead("Shape", seg() ? `<div class="tools">${seg()}</div>` : "") + `
      ${S.by.radius.length ? `<section class="block"><h2>Radius</h2><div class="tiles">${S.by.radius.map((t) => `
        <button type="button" class="tile raised" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})">
          <span class="radius-demo" style="border-radius:${esc(val(t))}"></span>
          <code>${esc(t.name)}</code><small>${esc(val(t))}</small></button>`).join("")}</div></section>` : ""}
      ${S.by.shadow.length ? `<section class="block"><h2>Shadows</h2><div class="tiles shadows ${S.theme}">${S.by.shadow.map((t) => `
        <button type="button" class="tile flat" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})">
          <span class="shadow-demo" style="box-shadow:${esc(val(t))}"></span>
          <code>${esc(t.name)}</code></button>`).join("")}</div></section>` : ""}`;
  }

  function spacing() {
    const list = S.by.space.map((t) => ({ t, p: px(val(t)) })).filter((s) => s.p !== null).sort((a, b) => a.p - b.p);
    const max = Math.max(...list.map((s) => s.p), 1);
    return pageHead("Spacing") + `<div class="spaces raised">${list.map(({ t, p }) => `
      <div class="space-row"><code>${esc(t.name)}</code><small>${esc(val(t))}</small>
        <span class="space-bar" style="width:${Math.max(2, (p / max) * 100)}%"></span></div>`).join("")}</div>`;
  }

  const NAMED = { ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1], linear: [0, 0, 1, 1] };
  const bezier = (v) => {
    const m = v.match(/cubic-bezier\(([^)]+)\)/);
    if (m) return m[1].split(",").map(Number);
    return NAMED[v.trim()] || null;
  };
  function motion() {
    const curve = (b) => {
      if (!b) return "";
      const [x1, y1, x2, y2] = b;
      const P = (x, y) => `${8 + x * 84} ${92 - y * 84}`;
      return `<svg class="curve" viewBox="0 0 100 100" aria-hidden="true"><path d="M${P(0, 0)} C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}" /></svg>`;
    };
    const ms = (v) => (v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    return pageHead("Motion") + `
      ${S.by.ease.length ? `<section class="block"><h2>Easing</h2><div class="tiles">${S.by.ease.map((t) => `
        <button type="button" class="tile raised motion-tile" style="--e:${esc(val(t))};--d:900ms" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})">
          ${curve(bezier(val(t)))}<span class="track"><i></i></span>
          <code>${esc(t.name)}</code><small>${esc(val(t))}</small></button>`).join("")}</div></section>` : ""}
      ${S.by.duration.length ? `<section class="block"><h2>Durations</h2><div class="tiles">${S.by.duration.map((t) => `
        <button type="button" class="tile raised motion-tile" style="--e:cubic-bezier(.2,.8,.2,1);--d:${ms(val(t))}ms" data-copy="var(${t.name})" data-copied="Copied var(${esc(t.name)})">
          <span class="track"><i></i></span>
          <code>${esc(t.name)}</code><small>${esc(val(t))}</small></button>`).join("")}</div></section>` : ""}`;
  }

  function allTokens() {
    return pageHead("All tokens", `<div class="tools">${search("Find a token")}</div>`) + `
      <div class="table-scroll raised tokens-table"><table>
        <thead><tr><th>Token</th><th>${S.hasDark ? "Light" : "Value"}</th>${S.hasDark ? "<th>Dark</th>" : ""}</tr></thead>
        <tbody>${S.tokens.map((t) => {
          const cell = (v) => `<td>${isColor(v) ? `<span class="dot" style="--c:${esc(v)}"></span>` : ""}<code>${esc(v)}</code></td>`;
          return `<tr data-names="${esc(t.name)}"><td><code>${esc(t.name)}</code></td>${cell(t.light)}${S.hasDark ? cell(t.dark) : ""}</tr>`;
        }).join("")}</tbody></table></div>`;
  }

  const guidePage = (g) => () => pageHead(g.title) + `<article class="doc raised">${md(g.md)}</article>`;

  // ---------- shell ----------
  function buildPages() {
    const P = [
      { key: "overview", title: "Overview", group: "Start", render: overview },
      { key: "use", title: "Use with Claude", group: "Start", render: useWithClaude },
    ];
    if (S.by.color.length) P.push({ key: "colours", title: "Palette", group: "Tokens", render: colours });
    if (S.by.family.length || S.by.typesize.length || S.typeClasses.length) P.push({ key: "type", title: "Type specimen", group: "Tokens", render: typography });
    if (S.by.radius.length || S.by.shadow.length) P.push({ key: "shape", title: "Shape", group: "Tokens", render: shape });
    if (S.by.space.length) P.push({ key: "spacing", title: "Spacing", group: "Tokens", render: spacing });
    if (S.by.ease.length || S.by.duration.length) P.push({ key: "motion", title: "Motion", group: "Tokens", render: motion });
    if (S.tokens.length) P.push({ key: "tokens", title: "All tokens", group: "Tokens", render: allTokens });
    for (const g of S.guide) P.push({ key: `doc/${g.slug}`, title: g.title, group: "Guide", render: guidePage(g) });
    S.pages = P;
  }

  function renderSide(current) {
    const groups = [...new Set(S.pages.map((p) => p.group))];
    side.innerHTML = sideHead() + `<nav class="nav">${groups.map((g) => `
      <div class="nav-group"><span class="nav-title">${esc(g)}</span>
        ${S.pages.filter((p) => p.group === g).map((p) => `<a href="#${p.key}"${p.key === current ? ' aria-current="page"' : ""}>${esc(p.title)}</a>`).join("")}
      </div>`).join("")}
      ${live ? `<div class="nav-group"><span class="nav-title">Live</span><a href="${esc(live)}" target="_blank" rel="noopener">Live site ${icon.out}</a></div>` : ""}
    </nav>`;
    side.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" });
  }

  function route() {
    const key = decodeURIComponent(location.hash.slice(1)) || "overview";
    const i = Math.max(0, S.pages.findIndex((p) => p.key === key));
    const p = S.pages[i];
    renderSide(p.key);
    const prev = S.pages[i - 1];
    const next = S.pages[i + 1];
    page.innerHTML = p.render() + `
      <nav class="pager" aria-label="More pages">
        ${prev ? `<a class="btn raised" href="#${prev.key}">← ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="btn raised" href="#${next.key}">${esc(next.title)} →</a>` : ""}
      </nav>`;
    page.classList.remove("in");
    void page.offsetWidth;
    page.classList.add("in");
    scrollTo({ top: 0 });
  }

  page.addEventListener("click", (e) => {
    const t = e.target.closest("[data-theme-pick]");
    if (t) { S.theme = t.dataset.themePick; route(); }
    if (e.target.closest("[data-copy-skill]")) copy(S.skillText, "SKILL.md copied");
  });
  page.addEventListener("input", (e) => {
    if (!e.target.matches("[data-filter]")) return;
    const q = e.target.value.trim().toLowerCase();
    page.querySelectorAll("[data-name], [data-names]").forEach((el) => {
      const names = (el.dataset.name || el.dataset.names).toLowerCase();
      el.hidden = Boolean(q) && !names.includes(q);
    });
    page.querySelectorAll(".role-group, .ramp-row").forEach((g) => {
      if (g.matches(".ramp-row")) return;
      g.hidden = Boolean(q) && !g.querySelector(".swatch:not([hidden])");
    });
  });

  async function boot() {
    side.innerHTML = sideHead();
    page.innerHTML = hero() + `<p class="loading">Loading…</p>`;
    try {
      const skill = await get("SKILL.md");
      S.skillText = skill;
      const body = dropH1(stripFront(skill));
      const docs = await Promise.all(item.docs.map(async (f) => ({ f, text: await get(f) })));
      if (docs.length) {
        S.intro = body;
        const order = (f) => { const i = body.indexOf(f.split("/").pop()); return i === -1 ? 1e9 : i; };
        docs.sort((a, b) => order(a.f) - order(b.f));
        S.guide = docs.map(({ f, text }) => {
          const s = f.split("/").pop().replace(/\.md$/, "");
          return { slug: s, title: firstH1(text) || s, md: dropH1(text) };
        });
      } else {
        const parts = body.split(/^## /m);
        S.intro = parts.shift();
        S.guide = parts.map((p) => {
          const [title, ...rest] = p.split(/\r?\n/);
          const t = title.replace(/\s*\(.*\)\s*$/, "").trim();
          return { slug: slug(t), title: t, md: rest.join("\n") };
        });
      }
      S.guide.forEach((g) => docSlugs.add(g.slug));

      const cssFiles = await Promise.all(item.css.map(get));
      const fromMd = [skill, ...docs.map((d) => d.text)].flatMap(cssBlocks);
      S.tokens = await readTokens([...cssFiles, ...fromMd]);
      S.hasDark = S.tokens.some((t) => t.dark && t.light !== t.dark);
      S.by = { color: [], family: [], weight: [], typesize: [], radius: [], shadow: [], space: [], ease: [], duration: [], other: [], sub: [] };
      for (const t of S.tokens) S.by[classify(t)].push(t);
      for (const m of skill.matchAll(/https:\/\/fonts\.googleapis\.com\/css2\?[^\s)`"'<>]+/g)) {
        document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href: m[0] }));
      }
      S.by.family.forEach((t) => loadFont(familyOf(t)));
    } catch (err) {
      page.innerHTML = hero() + `<section class="empty"><h2>Could not load it.</h2>
        <a class="btn ink raised" href="${GH}/tree/main/${dir}">Open on GitHub</a></section>`;
      return;
    }
    buildPages();
    addEventListener("hashchange", route);
    route();
  }

  const bar = $(".bar");
  const onScroll = () => bar.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  boot();
})();
