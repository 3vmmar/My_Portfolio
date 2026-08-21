#!/usr/bin/env node
/**
 * Asserts app/tokens.css and assets/design-tokens.json describe the same system.
 *
 * app/tokens.css is hand-authored — it carries the provenance comments and the
 * reasoning. assets/design-tokens.json is the machine-readable export. Two
 * files describing one system will drift the moment nobody is checking, and a
 * silent palette fork is expensive to find by eye, so this checks:
 *
 *   1. every primitive colour in the JSON appears in tokens.css with the same value
 *   2. every primitive colour in tokens.css appears in the JSON
 *   3. every semantic/component reference in the JSON resolves to a real primitive
 *   4. no non-token hex literal has crept into the app stylesheets
 *
 * Run: npm run tokens:check
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Recursively list files under `dir` ending in `ext`. */
function globSync(dir, ext) {
  const out = [];
  const walk = (d) => {
    let entries;
    try {
      entries = readdirSync(d);
    } catch {
      return;
    }
    for (const e of entries) {
      const full = join(d, e);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith(ext)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

const fail = [];
const note = (m) => fail.push(m);

const SHEETS = ["app/globals.css", "app/components.css", "app/case.css"];

const css = readFileSync("app/tokens.css", "utf8");
const json = JSON.parse(readFileSync("assets/design-tokens.json", "utf8"));

/* ---- 1 & 2: primitive colours must match both ways --------------------- */
const cssVars = new Map();
for (const m of css.matchAll(/^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/gm)) {
  cssVars.set(m[1], m[2].toLowerCase());
}

const jsonPrims = new Map();
for (const [family, ramp] of Object.entries(json.primitive.color)) {
  const entries = ramp.$value ? { "": ramp } : ramp;
  for (const [step, tok] of Object.entries(entries)) {
    if (!tok || typeof tok.$value !== "string" || !tok.$value.startsWith("#")) continue;
    jsonPrims.set(step ? `${family}-${step}` : family, tok.$value.toLowerCase());
  }
}

for (const [name, hex] of jsonPrims) {
  if (!cssVars.has(name)) {
    note(`JSON primitive --${name} (${hex}) is missing from app/tokens.css`);
  } else if (cssVars.get(name) !== hex) {
    note(`--${name} disagrees: tokens.css ${cssVars.get(name)} vs JSON ${hex}`);
  }
}
for (const [name, hex] of cssVars) {
  if (!jsonPrims.has(name)) {
    note(`tokens.css --${name} (${hex}) is missing from assets/design-tokens.json`);
  }
}

/* ---- 3: every reference resolves -------------------------------------- */
function resolve(path) {
  return path
    .split(".")
    .reduce((node, key) => (node == null ? undefined : node[key]), json);
}
for (const layer of ["semantic", "component"]) {
  const walk = (node, trail) => {
    for (const [k, v] of Object.entries(node ?? {})) {
      if (v && typeof v === "object" && typeof v.$value === "string") {
        const ref = v.$value.match(/^\{(.+)\}$/);
        if (ref && resolve(ref[1]) === undefined) {
          note(`${layer}.${[...trail, k].join(".")} -> {${ref[1]}} does not resolve`);
        }
      } else if (v && typeof v === "object") {
        walk(v, [...trail, k]);
      }
    }
  };
  walk(json[layer], []);
}

/* ---- 4: no raw hex outside the token file ----------------------------- */
for (const file of SHEETS) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  const STENCIL = new Set(["#000", "#fff", "#000000", "#ffffff"]);
  text.split(/\r?\n/).forEach((line, i) => {
    // #000/#fff inside a mask gradient are alpha stencils, not brand colour.
    if (/mask-image|mask-composite|-webkit-mask/.test(line)) return;
    if (/^\s*(\/\*|\*)/.test(line)) return;
    for (const m of line.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      // `continue`, not `return`: returning here abandoned every remaining
      // match on the line as soon as one stencil value appeared.
      if (STENCIL.has(m[0].toLowerCase())) continue;
      note(`${file}:${i + 1} raw hex ${m[0]} — use a token`);
    }
    // rgb()/oklch()/hsl() are colour literals too, and were slipping through.
    // Shadows, scrims and filters are exempt by PROPERTY, not by value: an
    // alpha-tinted espresso is a depth value, not a palette entry.
    if (
      /box-shadow|text-shadow|filter:|color-mix|scrollbar-color|::selection/.test(line)
    ) {
      return;
    }
    for (const m of line.matchAll(/\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g)) {
      note(
        `${file}:${i + 1} raw ${m[0]}…) — use a token, or move it into a shadow/filter`,
      );
    }
  });
}

/* ---- 4b: the SEMANTIC layer has to agree too ---------------------------
   Matching primitives is not enough. Repointing `--accent` from brass-700 to
   brass-600 in tokens.css while the JSON still said brass-700 used to pass
   this check silently, which is exactly the fork it exists to prevent. */
const semanticCss = new Map();
for (const m of css.matchAll(/^\s*--([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)\s*;/gm)) {
  semanticCss.set(m[1], m[2]);
}
for (const [role, tok] of Object.entries(json.semantic?.color ?? {})) {
  const ref = String(tok.$value).match(/^\{primitive\.color\.([a-z]+)\.([a-z0-9]+)\}$/);
  if (!ref) continue;
  const expected = `${ref[1]}-${ref[2]}`;
  const actual = semanticCss.get(role);
  if (actual === undefined) {
    note(`semantic --${role} is in the JSON but not declared in app/tokens.css`);
  } else if (actual !== expected) {
    note(`semantic --${role} disagrees: tokens.css --${actual} vs JSON --${expected}`);
  }
}

/* ---- 5: every var(--token) reference resolves, in CSS *and* in TSX ------
   An invalid var() in an SVG presentation attribute is invalid at
   computed-value time, so `fill` silently falls back to its initial value —
   black. That is how a deleted token turned every architecture-diagram node
   into a black slab, invisible to a CSS-only check. */
const declared = new Set();
for (const m of css.matchAll(/^\s*--([a-z0-9-]+):/gm)) declared.add(m[1]);
// Injected by next/font at runtime, and layout-local custom properties.
for (const ext of [
  "font-display",
  "font-sans",
  "font-mono",
  "section-pad-t",
  "section-pad-b",
  "wash-l",
  "wash-r",
]) {
  declared.add(ext);
}

const REF_FILES = [
  ...SHEETS,
  ...globSync("app", ".tsx"),
  ...globSync("components", ".tsx"),
];
for (const file of REF_FILES) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  text.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*--([a-z0-9-]+)/g)) {
      if (!declared.has(m[1])) {
        note(`${file}:${i + 1} var(--${m[1]}) is not declared in app/tokens.css`);
      }
    }
  });
}

if (fail.length) {
  console.error(`\n✗ token check failed (${fail.length})\n`);
  for (const f of fail) console.error("  " + f);
  process.exit(1);
}
console.log(
  `✓ tokens consistent — ${jsonPrims.size} primitives matched, ${declared.size} declared, ` +
    `every var() in ${REF_FILES.length} files resolves, no raw hex in the app stylesheets`,
);
