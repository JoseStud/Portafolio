import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { join, resolve } from "node:path";

const chromiumCommands = [
  process.env.CHROMIUM,
  "chromium",
  "chromium-browser",
  "google-chrome",
  "google-chrome-stable"
].filter(Boolean);

const viewports = [
  { name: "desktop", size: "1440,1000" },
  { name: "mobile", size: "390,844" }
];

function findChromium() {
  for (const command of chromiumCommands) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8" });
    if (result.status === 0) return command;
  }

  console.error(
    "Unable to find Chromium. Set CHROMIUM=/path/to/chromium or install chromium/chrome."
  );
  process.exit(1);
}

const outputDir = resolve("screenshots/current");
mkdirSync(outputDir, { recursive: true });

const chromium = findChromium();
const url = pathToFileURL(resolve("index.html")).href;

for (const viewport of viewports) {
  const outputPath = join(outputDir, `${viewport.name}.png`);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=3000",
    `--window-size=${viewport.size}`,
    `--screenshot=${outputPath}`,
    url
  ];

  const result = spawnSync(chromium, args, { encoding: "utf8", timeout: 15000 });
  if (result.status !== 0) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  console.log(`captured ${outputPath}`);
}
