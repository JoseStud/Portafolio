# Scroll Keyword Underline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CSS-driven underline reveal to curated keywords in the existing pinned homepage narrative.

**Architecture:** The existing pinned narrative controller already marks the active scene with `data-active="true"`. This implementation wraps selected phrases in presentational inline spans and reveals each underline through CSS when its scene is active. Static checks cover the markup and CSS hooks so future edits do not silently remove the effect.

**Tech Stack:** Static HTML, CSS custom properties/pseudo-elements, dependency-free Node maintenance checks.

---

## File Structure

- Modify `tools/check-narrative.mjs`: add static checks for underline markup, active-scene reveal CSS, stagger CSS variables, and reduced-motion handling.
- Modify `index.html`: wrap selected narrative phrases in `.reveal-underline` spans with optional inline `--underline-delay` values.
- Modify `styles/narrative.css`: add base underline styling, active scene reveal selector, stagger support, mobile-safe behavior, and reduced-motion override.
- Regenerate `scripts/site.js` only if the build process changes output. This feature is markup/CSS-only, so the bundle should remain functionally unchanged.

## Task 1: Add Failing Underline Integration Checks

**Files:**
- Modify: `tools/check-narrative.mjs`

- [ ] **Step 1: Add checks for underline hooks**

Append these checks inside `requiredChecks`, after the existing narrative progress checks:

```js
  ["narrative markup wraps emphasized keywords", files.html.includes('class="reveal-underline"') && files.html.includes('>software<') && files.html.includes('>AI Workflow Automation<') && files.html.includes('>LoRA Manager<')],
  ["narrative underline CSS defines reveal base", files.narrativeCss.includes(".reveal-underline::after") && files.narrativeCss.includes("transform: scaleX(0);")],
  ["narrative underline reveals in active scenes", files.narrativeCss.includes('.narrative-scene[data-active="true"] .reveal-underline::after') && files.narrativeCss.includes("transform: scaleX(1);")],
  ["narrative underline supports stagger delay", files.narrativeCss.includes("--underline-delay") && files.narrativeCss.includes("transition-delay: var(--underline-delay, 0s);")],
  ["narrative underline respects reduced motion", files.narrativeCss.includes(".reveal-underline::after") && files.narrativeCss.includes("transition-duration: var(--duration-instant) !important;")]
```

- [ ] **Step 2: Run the check and verify it fails**

Run: `node tools/check-narrative.mjs`

Expected: FAIL with messages including `failed narrative markup wraps emphasized keywords` and `failed narrative underline CSS defines reveal base`.

## Task 2: Implement Markup and CSS Reveal

**Files:**
- Modify: `index.html`
- Modify: `styles/narrative.css`

- [ ] **Step 1: Wrap selected heading words**

Change the Build Systems heading to:

```html
      <h1 class="narrative-title">Build <span class="reveal-underline">software</span>.<br>Automate <span class="reveal-underline" style="--underline-delay: 0.08s">work</span>.<br>Ship <span class="reveal-underline" style="--underline-delay: 0.16s">systems</span>.</h1>
```

- [ ] **Step 2: Wrap selected capability phrases**

Change the selected capability items to:

```html
        <span><span class="reveal-underline">AI Workflow Automation</span></span>
        <span>Full-Stack Applications</span>
        <span><span class="reveal-underline" style="--underline-delay: 0.1s">API &amp; Backend Systems</span></span>
        <span>Infrastructure as Code</span>
```

- [ ] **Step 3: Wrap selected project names**

Change the feature strip project titles to:

```html
        <div><span>001</span><strong><span class="reveal-underline">LoRA Manager</span></strong><em>FastAPI + Vue + SDNext</em></div>
        <div><span>002</span><strong><span class="reveal-underline" style="--underline-delay: 0.1s">GoodOldMeServer</span></strong><em>Terraform + Ansible + Swarm</em></div>
        <div><span>003</span><strong><span class="reveal-underline" style="--underline-delay: 0.2s">PIAR Digital App</span></strong><em>TypeScript workflow app</em></div>
```

- [ ] **Step 4: Wrap the final contact keyword**

Change the final scene heading to:

```html
      <h2 class="narrative-title narrative-title-small">Ready for <span class="reveal-underline">systems</span> that need to move.</h2>
```

- [ ] **Step 5: Add underline CSS**

Add this block to `styles/narrative.css` after `.narrative-title-small`:

```css
.reveal-underline {
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.reveal-underline::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.03em;
  height: 0.055em;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--duration-reveal) var(--ease-reveal);
  transition-delay: var(--underline-delay, 0s);
}

.narrative-scene[data-active="true"] .reveal-underline::after {
  transform: scaleX(1);
}
```

- [ ] **Step 6: Add reduced-motion support**

Add `.reveal-underline::after` to the existing reduced-motion selector in `styles/narrative.css`:

```css
  .reveal-underline::after {
    transition-duration: var(--duration-instant) !important;
    transition-delay: 0s !important;
  }
```

## Task 3: Verify and Refresh Generated Assets

**Files:**
- Modify if generated output changes: `scripts/site.js`

- [ ] **Step 1: Run underline integration check**

Run: `node tools/check-narrative.mjs`

Expected: PASS with `ok pinned narrative integration`.

- [ ] **Step 2: Run project check**

Run: `npm run check`

Expected: PASS with successful bundle build, JavaScript syntax check, layering check, and narrative integration check.

- [ ] **Step 3: Run screenshots**

Run: `npm run screenshots`

Expected: PASS and regenerated `screenshots/current/desktop.png` plus `screenshots/current/mobile.png`.

- [ ] **Step 4: Inspect screenshots**

Open:

```text
screenshots/current/desktop.png
screenshots/current/mobile.png
```

Expected: homepage text remains readable, no new overlap appears, and the initial scene is unchanged because underline scenes reveal after scroll.

- [ ] **Step 5: Inspect git status**

Run: `git status --short`

Expected: intended changes only: the plan, `tools/check-narrative.mjs`, `index.html`, and `styles/narrative.css`; `scripts/site.js` may appear only if the build output changed.
