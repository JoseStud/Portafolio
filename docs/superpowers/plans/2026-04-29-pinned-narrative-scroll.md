# Pinned Narrative Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pinned homepage narrative scroll that adds substantive portfolio content without duplicating the menu panel navigation.

**Architecture:** Add static narrative markup to `index.html`, a focused `styles/narrative.css` stylesheet, and a focused `scripts/modules/pinned-narrative.js` controller. Extend `scripts/modules/scroll-progress.js` so homepage progress and panel progress can share the same right-side indicator without overwriting each other.

**Tech Stack:** Static HTML/CSS, dependency-free browser JavaScript, Node maintenance scripts.

---

## File Structure

- Create `scripts/modules/pinned-narrative.js`: owns pinned narrative progress, scene activation, wheel/touch/key input, and reduced-motion handling.
- Create `styles/narrative.css`: owns narrative scene layout, transitions, responsive rules, and hero/object retreat variables.
- Create `tools/check-narrative.mjs`: static regression check for narrative markup, module wiring, CSS import, package integration, and generated bundle output.
- Modify `index.html`: add the narrative layer after the hero and before the scroll progress indicator.
- Modify `styles/main.css`: import `styles/narrative.css`.
- Modify `styles/hero.css`: let narrative CSS variables control hero text scale and opacity.
- Modify `scripts/main.js`: import and initialize `initPinnedNarrative`.
- Modify `scripts/modules/scroll-progress.js`: expose `setMainScrollProgress()` and preserve homepage progress when panels open and close.
- Modify `scripts/modules/menu-panels.js`: restore the homepage progress indicator after panel close through the updated scroll-progress module.
- Modify `tools/build-classic-bundle.mjs`: include the new narrative module before `scripts/main.js`.
- Modify `package.json`: include `tools/check-narrative.mjs` in `npm run check`.
- Update generated `scripts/site.js` by running `npm run build:scripts`.

## Task 1: Regression Check

**Files:**
- Create: `tools/check-narrative.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing static check**

```js
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
```

- [ ] **Step 2: Run the check and verify it fails**

Run: `node tools/check-narrative.mjs`

Expected: FAIL with messages including `failed index.html contains narrative root` and `failed scripts/main.js imports pinned narrative module`.

- [ ] **Step 3: Add the check to `package.json`**

Change the `check` script to:

```json
"check": "npm run build:scripts && node tools/check-js.mjs && node tools/check-layering.mjs && node tools/check-narrative.mjs"
```

- [ ] **Step 4: Commit**

```bash
git add package.json tools/check-narrative.mjs
git commit -m "test: add pinned narrative integration check"
```

## Task 2: Markup and Styles

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`
- Modify: `styles/hero.css`
- Create: `styles/narrative.css`

- [ ] **Step 1: Add narrative markup**

Insert after the existing `.hero` element:

```html
  <!-- PINNED NARRATIVE -->
  <section class="narrative" id="pinnedNarrative" aria-label="Portfolio narrative" data-narrative-scene="0">
    <article class="narrative-scene narrative-scene-intro" data-narrative-scene-index="0" data-active="true">
      <div class="narrative-meta">Software Engineering / AI Automation</div>
    </article>
    <article class="narrative-scene" data-narrative-scene-index="1">
      <div class="narrative-kicker">Build Systems</div>
      <h1 class="narrative-title">Build software.<br>Automate work.<br>Ship systems.</h1>
      <p class="narrative-copy">Turning rough operational workflows into reliable tools, APIs, automation, and deployment paths.</p>
    </article>
    <article class="narrative-scene" data-narrative-scene-index="2">
      <div class="narrative-kicker">Capability Sequence</div>
      <div class="capability-list" aria-label="Core capabilities">
        <span>AI Workflow Automation</span>
        <span>Full-Stack Applications</span>
        <span>API &amp; Backend Systems</span>
        <span>Infrastructure as Code</span>
      </div>
    </article>
    <article class="narrative-scene" data-narrative-scene-index="3">
      <div class="narrative-kicker">Featured Work</div>
      <div class="feature-strip">
        <div><span>001</span><strong>LoRA Manager</strong><em>FastAPI + Vue + SDNext</em></div>
        <div><span>002</span><strong>GoodOldMeServer</strong><em>Terraform + Ansible + Swarm</em></div>
        <div><span>003</span><strong>PIAR Digital App</strong><em>TypeScript workflow app</em></div>
      </div>
    </article>
    <article class="narrative-scene" data-narrative-scene-index="4">
      <div class="narrative-kicker">Operating Style</div>
      <ol class="process-line" aria-label="Operating process">
        <li>Map workflow</li>
        <li>Design system</li>
        <li>Automate edge cases</li>
        <li>Maintain deployment</li>
      </ol>
    </article>
    <article class="narrative-scene" data-narrative-scene-index="5">
      <div class="narrative-kicker">Contact</div>
      <h2 class="narrative-title narrative-title-small">Ready for systems that need to move.</h2>
      <a class="narrative-link" href="https://github.com/JoseStud" target="_blank" rel="noreferrer">github.com/JoseStud</a>
    </article>
  </section>
```

- [ ] **Step 2: Import narrative styles**

Add this after `hero.css` in `styles/main.css`:

```css
@import url('./narrative.css');
```

- [ ] **Step 3: Make hero text accept narrative variables**

Update `.hero-text` in `styles/hero.css`:

```css
  transform: scale(var(--narrative-hero-scale, 1));
  transition: transform var(--duration-reveal) var(--ease-reveal), opacity var(--duration-reveal) ease;
  opacity: var(--narrative-hero-opacity, 1) !important;
```

- [ ] **Step 4: Create narrative styles**

Create `styles/narrative.css` with fixed-viewport scene layout, scene activation rules, hero/object retreat variables, mobile rules, and reduced-motion overrides.

- [ ] **Step 5: Run the static check and verify partial failure**

Run: `node tools/check-narrative.mjs`

Expected: FAIL only for JavaScript module and bundle checks until Task 3 is complete.

- [ ] **Step 6: Commit**

```bash
git add index.html styles/main.css styles/hero.css styles/narrative.css
git commit -m "feat: add pinned narrative markup and styles"
```

## Task 3: Narrative Behavior and Scroll Progress

**Files:**
- Create: `scripts/modules/pinned-narrative.js`
- Modify: `scripts/main.js`
- Modify: `scripts/modules/scroll-progress.js`
- Modify: `scripts/modules/menu-panels.js`
- Modify: `tools/build-classic-bundle.mjs`
- Modify: `scripts/site.js`

- [ ] **Step 1: Implement shared main scroll progress**

In `scripts/modules/scroll-progress.js`, add exported `setMainScrollProgress(pct, { remember = true } = {})`. Use it from panel scroll listeners with `remember: false`. Keep homepage progress in module state and make `resetMainScrollProgress()` restore that remembered value after panel close.

- [ ] **Step 2: Implement pinned narrative module**

Create `scripts/modules/pinned-narrative.js` with `initPinnedNarrative()`, scene collection, progress clamping, wheel handling, touch handling, keyboard scene stepping, overlay/interactive-input guards, and CSS variable updates.

- [ ] **Step 3: Wire initialization**

Update `scripts/main.js` to import `initPinnedNarrative` and call it after `initPanelScrollProgress()`.

- [ ] **Step 4: Bundle the new module**

Add `scripts/modules/pinned-narrative.js` to `orderedSources` in `tools/build-classic-bundle.mjs` before `scripts/main.js`.

- [ ] **Step 5: Build and run the integration check**

Run: `npm run build:scripts`

Expected: PASS and `scripts/site.js` includes `scripts/modules/pinned-narrative.js`.

Run: `node tools/check-narrative.mjs`

Expected: PASS with `ok pinned narrative integration`.

- [ ] **Step 6: Commit**

```bash
git add scripts/main.js scripts/modules/pinned-narrative.js scripts/modules/scroll-progress.js scripts/modules/menu-panels.js tools/build-classic-bundle.mjs scripts/site.js
git commit -m "feat: wire pinned narrative scrolling"
```

## Task 4: Full Verification and PR Prep

**Files:**
- Verify all changed files

- [ ] **Step 1: Run project check**

Run: `npm run check`

Expected: PASS with build output, JavaScript syntax checks, layering check, and pinned narrative integration check.

- [ ] **Step 2: Run screenshots**

Run: `npm run screenshots`

Expected: PASS with `screenshots/current/desktop.png` and `screenshots/current/mobile.png` generated.

- [ ] **Step 3: Inspect git status and diff**

Run: `git status --short`

Expected: only intended files changed after commits, or clean if all changes are committed.

- [ ] **Step 4: Publish through PR flow**

Push `codex/pinned-narrative-scroll` and open a draft PR against `main` once a GitHub remote is available.
