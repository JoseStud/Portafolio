import { readFileSync } from "node:fs";

// This guard catches accidental z-index regressions that can make menu controls
// or panel transitions unreachable even when the CSS still parses.
const tokens = readFileSync("styles/tokens.css", "utf8");

// Extract numeric custom properties from tokens.css. The checked tokens are
// intentionally unitless so they can be compared directly.
function tokenNumber(name) {
  const match = tokens.match(new RegExp(`--${name}:\\s*(\\d+)\\s*;`));
  if (!match) throw new Error(`Missing --${name} in styles/tokens.css`);
  return Number(match[1]);
}

const zVnav = tokenNumber("z-vnav");
const zNav = tokenNumber("z-nav");
const zPanel = tokenNumber("z-panel");
const zPanelWipe = tokenNumber("z-panel-wipe");

const failures = [];

// Nav must stay above the vertical menu so the close button remains reachable.
if (zNav <= zVnav) {
  failures.push(`Expected --z-nav (${zNav}) to stay above --z-vnav (${zVnav}) for the menu controls.`);
}

// Panels intentionally cover the nav after a menu item is selected.
if (zPanel <= zNav) {
  failures.push(`Expected --z-panel (${zPanel}) to render above --z-nav (${zNav}) when a panel is open.`);
}

// The wipe needs to cover both the outgoing and incoming panel content.
if (zPanelWipe <= zPanel) {
  failures.push(`Expected --z-panel-wipe (${zPanelWipe}) to render above --z-panel (${zPanel}) during transitions.`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ok layering tokens");
