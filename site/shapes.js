// One sticker shape per slot, drawn in a 100x100 box: a paper fill, an ink
// outline and a hard offset shadow, like everything else on the page.
window.SHAPES = {
  grid: "M8 8h38v38H8zM54 8h38v38H54zM8 54h38v38H8zM54 54h38v38H54z",
  burst: "M50 4l9 22 22-9-9 22 22 9-22 9 9 22-22-9-9 22-9-22-22 9 9-22-22-9 22-9-9-22 22 9z",
  arrow: "M14 72L58 28H32V12h54v54H70V40L26 84z",
  drop: "M50 6C66 30 84 46 84 64a34 34 0 0 1-68 0C16 46 34 30 50 6z",
  bubble: "M50 8c25 0 44 16 44 37S75 82 50 82c-6 0-12-1-17-3L10 92l7-20C10 64 6 55 6 45 6 24 25 8 50 8z",
  arch: "M10 94V46a40 40 0 0 1 80 0v48H66V50a16 16 0 0 0-32 0v44z",
  boxes: "M8 54h40v40H8zM52 54h40v40H52zM30 10h40v40H30z",
  spark: "M50 4c4 26 20 42 46 46-26 4-42 20-46 46-4-26-20-42-46-46 26-4 42-20 46-46z",
  bars: "M6 40h14v20H6zM26 22h14v56H26zM46 6h14v88H46zM66 26h14v48H66zM86 42h8v16h-8z",
  rings: "M50 4a46 46 0 1 1 0 92 46 46 0 0 1 0-92zm0 22a24 24 0 1 0 0 48 24 24 0 0 0 0-48z",
};

window.shapeSvg = (name, dark) => {
  const d = window.SHAPES[name] || window.SHAPES.spark;
  const shade = dark ? "var(--green)" : "var(--ink)";
  return `<svg class="shape" viewBox="-4 -4 112 112" aria-hidden="true">
    <path d="${d}" transform="translate(6 6)" fill-rule="evenodd" fill="${shade}" stroke="${shade}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <path d="${d}" fill="var(--paper)" stroke="var(--ink)" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round" fill-rule="evenodd"/>
  </svg>`;
};
