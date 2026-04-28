import { readFileSync } from "node:fs";

const tokens = readFileSync("styles/tokens.css", "utf8");

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

if (zNav <= zVnav) {
  failures.push(`Expected --z-nav (${zNav}) to stay above --z-vnav (${zVnav}) for the menu controls.`);
}

if (zPanel <= zNav) {
  failures.push(`Expected --z-panel (${zPanel}) to render above --z-nav (${zNav}) when a panel is open.`);
}

if (zPanelWipe <= zPanel) {
  failures.push(`Expected --z-panel-wipe (${zPanelWipe}) to render above --z-panel (${zPanel}) during transitions.`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("ok layering tokens");
