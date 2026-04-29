import { readFileSync } from "node:fs";

const files = {
  html: readFileSync("index.html", "utf8"),
  narrativeCss: readFileSync("styles/narrative.css", "utf8"),
  pinnedJs: readFileSync("scripts/modules/pinned-narrative.js", "utf8"),
  mainCss: readFileSync("styles/main.css", "utf8"),
  mainJs: readFileSync("scripts/main.js", "utf8"),
  bundle: readFileSync("scripts/site.js", "utf8"),
  packageJson: readFileSync("package.json", "utf8")
};

const requiredChecks = [
  ["index.html contains narrative root", files.html.includes('id="pinnedNarrative"')],
  ["index.html contains six narrative scenes", (files.html.match(/class="narrative-scene/g) || []).length === 6],
  ["styles/main.css imports narrative.css", files.mainCss.includes("@import url('./narrative.css');")],
  ["scripts/main.js imports pinned narrative module", files.mainJs.includes("./modules/pinned-narrative.js")],
  ["scripts/main.js initializes pinned narrative", files.mainJs.includes("initPinnedNarrative();")],
  ["scripts/site.js includes pinned narrative bundle", files.bundle.includes("scripts/modules/pinned-narrative.js")],
  ["package.json runs narrative check", files.packageJson.includes("node tools/check-narrative.mjs")],
  ["narrative scenes use a progress-driven contrast scrim", files.narrativeCss.includes(".narrative::before") && files.narrativeCss.includes("opacity: clamp(0, calc(var(--narrative-progress) * 1.4), 0.92);")],
  ["narrative labels use high contrast color", files.narrativeCss.includes("color: rgba(var(--color-fg-rgb), 0.72);")],
  ["narrative copy uses high contrast color", files.narrativeCss.includes("color: rgba(var(--color-fg-rgb), 0.84);")],
  ["narrative cards use opaque backgrounds", files.narrativeCss.includes("background: rgba(6, 6, 6, 0.94);")],
  ["narrative card metadata uses high contrast color", files.narrativeCss.includes("color: rgba(var(--color-fg-rgb), 0.68);")],
  ["narrative process counters use high contrast color", files.narrativeCss.includes("color: rgba(var(--color-fg-rgb), 0.7);")],
  ["narrative feature titles wrap long project names", files.narrativeCss.includes("overflow-wrap: anywhere;")],
  ["narrative progress fades hero text behind content", files.pinnedJs.includes("Math.max(0.04, 1 - progress * 1.8)")],
  ["narrative progress fades objects behind content", files.pinnedJs.includes("Math.max(0.12, 1 - progress * 1.05)")]
];

const failures = requiredChecks
  .filter(([, passed]) => !passed)
  .map(([message]) => `failed ${message}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ok pinned narrative integration");
