import { readFileSync } from "node:fs";

const files = {
  html: readFileSync("index.html", "utf8"),
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
  ["package.json runs narrative check", files.packageJson.includes("node tools/check-narrative.mjs")]
];

const failures = requiredChecks
  .filter(([, passed]) => !passed)
  .map(([message]) => `failed ${message}`);

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ok pinned narrative integration");
