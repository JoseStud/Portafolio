import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Syntax-check all maintained JavaScript sources without executing them.
const roots = ["scripts", "tools"];
const extensions = new Set([".js", ".mjs", ".cjs"]);

// Recursively collect script files from a root while preserving deterministic
// directory traversal from the filesystem.
function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(path));
    } else if (entry.isFile()) {
      const ext = path.slice(path.lastIndexOf("."));
      if (extensions.has(ext)) files.push(path);
    }
  }

  return files;
}

// Missing optional roots should not fail the check; they simply contribute no
// files. This keeps the script useful during partial refactors.
const files = roots.flatMap((root) => {
  try {
    if (!statSync(root).isDirectory()) return [];
    return collectFiles(root);
  } catch {
    return [];
  }
});

if (files.length === 0) {
  console.log("No JavaScript files found.");
  process.exit(0);
}

let failed = false;

// Use the same Node executable that launched this tool so local version
// behavior matches the rest of the npm scripts.
for (const file of files) {
  const label = relative(process.cwd(), file);
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8"
  });

  if (result.status === 0) {
    console.log(`ok ${label}`);
  } else {
    failed = true;
    console.error(`failed ${label}`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

process.exit(failed ? 1 : 0);
