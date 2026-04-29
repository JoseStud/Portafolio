# Scroll Keyword Underline Design

## Goal

Add a restrained underline reveal to selected keywords in the existing pinned homepage narrative. The effect should make the scroll story feel more deliberate and editorial, similar in spirit to Damn Good Brands, without overwhelming the current monochrome portfolio style.

## Current Context

The project is a static single-page portfolio with dependency-free JavaScript. The homepage already has a pinned narrative controller in `scripts/modules/pinned-narrative.js`. It advances six full-screen scenes by updating `data-active` on `.narrative-scene` elements and setting progress CSS variables on `.page`.

The narrative markup lives in `index.html`, narrative styles live in `styles/narrative.css`, and `scripts/site.js` is generated from the ES module source by `npm run build:scripts`.

## Experience

Only a curated set of emphasis phrases should get animated underlines:

- `software`
- `work`
- `systems`
- `AI Workflow Automation`
- `API & Backend Systems`
- `LoRA Manager`
- `GoodOldMeServer`
- `PIAR Digital App`

The underline should animate after the relevant scene becomes active. In scenes with multiple emphasized phrases, each underline should use a small stagger so the motion reads as intentional rather than simultaneous noise.

## Visual Behavior

Each emphasized phrase will be wrapped in a reusable inline element such as `.reveal-underline`. The underline will be drawn with a pseudo-element, anchored below the text, and animated from left to right by scaling its X axis.

The underline color should use the existing accent red. It should be thin enough to read as editorial emphasis, not a thick marker stroke. The text layout must not shift when the underline animates.

For reduced-motion users, active scene underlines should appear immediately with no sweep animation.

## Architecture

Keep this primarily CSS-driven. The existing pinned narrative module already marks the active scene with `data-active="true"`, so no new scroll state module is needed.

Implementation should update:

- `index.html` to wrap selected keyword phrases
- `styles/narrative.css` to define base underline styles, active-scene reveal styles, stagger delays, mobile-safe positioning, and reduced-motion behavior
- `tools/check-narrative.mjs` to statically verify underline hooks exist
- `scripts/site.js` by running the existing build script if source changes require bundle refresh

## Accessibility

The added spans must not change the spoken text or keyboard behavior. They are presentational wrappers around existing text. The effect should respect `prefers-reduced-motion: reduce`.

## Testing

Use test-first static coverage for the integration:

1. Add failing checks in `tools/check-narrative.mjs` for the underline class, active-scene CSS selector, reduced-motion handling, and at least the key wrapped phrases.
2. Run the check and confirm it fails for the missing underline implementation.
3. Implement markup and CSS.
4. Run `npm run check`.
5. Run `npm run screenshots` and inspect desktop/mobile screenshots to confirm text remains readable and no layout shifts or overlaps are introduced.
