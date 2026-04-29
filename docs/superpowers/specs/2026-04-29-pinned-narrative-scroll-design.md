# Pinned Narrative Scroll Design

## Goal

Add a pinned homepage scroll narrative that gives the portfolio more substance than repeating the menu links. The menu remains a direct way to open the existing Work, Profile, Archive, and Contact panels; scrolling becomes a separate homepage story.

## Current Context

The site is a static single-page portfolio with no frontend framework. `index.html` contains a fixed viewport shell, the hero, menu overlay, panels, floating objects, marquee, and scroll indicators. `scripts/main.js` initializes small behavior modules, and `scripts/site.js` is the generated classic bundle loaded by the page. Styles are split by concern in `styles/`.

The body currently uses `overflow: hidden`, so the homepage does not have native document scrolling. The existing scroll code only updates progress while panel bodies scroll.

## Experience

The homepage should behave like a pinned, full-screen narrative. Wheel, touch, and keyboard input move a normalized progress value from `0` to `1`. That progress selects one of six scenes and updates CSS variables/classes for transition state.

Scenes:

1. Intro: the current `JOSE` hero remains dominant and the scroll hint is visible.
2. Build Systems: show "Build software. Automate work. Ship systems." with one supporting line about turning rough workflows into reliable tools.
3. Capability Sequence: cycle through four practice areas: AI Workflow Automation, Full-Stack Applications, API & Backend Systems, and Infrastructure as Code.
4. Featured Work: highlight LoRA Manager, GoodOldMeServer, and PIAR Digital App as a curated proof strip, not the full Work panel grid.
5. Operating Style: show the process sequence "Map workflow", "Design system", "Automate edge cases", and "Maintain deployment".
6. Contact Landing: finish on a compact GitHub/contact prompt while keeping the existing Contact panel available.

## Architecture

Add a new focused module, `scripts/modules/pinned-narrative.js`, initialized from `scripts/main.js` after content rendering. It owns homepage narrative state only. It should not open panels, duplicate menu behavior, or alter panel focus trapping.

Add static narrative markup to `index.html` so the content is visible in the generated bundle and can be tested without depending on remote data. Add a focused stylesheet, `styles/narrative.css`, imported by `styles/main.css`.

The module updates:

- `data-narrative-scene` on the narrative root
- `data-active` on the current scene
- `--narrative-progress` on `.page`
- the main scroll progress bar while no panel is active

The existing panel scroll progress remains authoritative when a panel is open. Closing a panel restores the homepage progress indicator instead of resetting it to zero.

## Input Behavior

Wheel and touch input change narrative progress in small increments and prevent native scroll. Keyboard controls are:

- `ArrowDown`, `PageDown`, and Space: advance one scene
- `ArrowUp` and `PageUp`: go back one scene
- `Home`: first scene
- `End`: last scene

Inputs are ignored while the menu overlay or a panel is open, while focus is inside an interactive control, or while modifier keys are active.

## Visual Behavior

Scenes crossfade and move vertically with restrained scale changes. The hero and floating objects subtly retreat as progress advances. The scroll hint fades after the intro. The visual language stays monochrome, dense, and editorial to match the current site.

On mobile, the same scenes stack inside the fixed viewport with smaller text and tighter spacing. Text must not overlap the bottom bar, nav, or side chrome.

## Accessibility

Respect `prefers-reduced-motion: reduce` by disabling long transitions and snapping scene states. The narrative layer should be `aria-live="polite"` only if scene changes are not overly noisy; otherwise it remains ordinary page content. Existing menu and panel focus behavior must remain unchanged.

## Testing

Add a small Node-based static check that verifies the narrative markup and generated bundle references exist after `npm run build:scripts`. Continue to use `npm run check` for script syntax, generated bundle refresh, and layering validation. Run `npm run screenshots` to verify desktop and mobile layout.
