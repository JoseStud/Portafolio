import { panelIds } from './content-data.js';

// Main page progress nodes are read lazily so regenerated markup or tests can
// replace DOM nodes before initialization without stale references.
const scrollTrack = () => document.getElementById('scrollTrack');
const scrollPip = () => document.getElementById('scrollPip');

// Stores the pinned narrative progress while panel scrolling temporarily takes
// over the shared progress bar.
let rememberedMainProgress = 0;

const clampProgress = (pct) => Math.max(0, Math.min(100, pct));

// Update the fixed right-edge progress indicator. Panel scroll handlers pass
// `remember: false` so closing a panel can restore the narrative position.
export function setMainScrollProgress(pct, { remember = true } = {}) {
  const nextProgress = clampProgress(pct);
  if (remember) rememberedMainProgress = nextProgress;

  const track = scrollTrack();
  const pip = scrollPip();
  if (track) track.style.height = `${nextProgress}%`;
  if (pip) pip.style.top = `${nextProgress}%`;
}

// Wait for the panel wipe transition to finish before restoring the narrative
// progress, avoiding a visible jump during the close animation.
export function resetMainScrollProgress() {
  setTimeout(() => {
    setMainScrollProgress(rememberedMainProgress, { remember: false });
  }, 450);
}

// Each modal-style panel owns its own internal scroll bar and mirrors that
// progress onto the global right-edge indicator while the panel is active.
function updatePanelScroll(panelId) {
  const panel = document.getElementById(`panel-${panelId}`);
  if (!panel) return;

  const body = panel.querySelector('.panel-body');
  const fill = document.getElementById(`fill-${panelId}`);
  const pip = document.getElementById(`pip-${panelId}`);
  if (!body || !fill || !pip) return;

  body.addEventListener('scroll', () => {
    const max = body.scrollHeight - body.clientHeight;
    const pct = max > 0 ? (body.scrollTop / max) * 100 : 0;

    fill.style.height = `${pct}%`;
    pip.style.top = `${pct}%`;

    setMainScrollProgress(pct, { remember: false });
  });
}

// Register scroll listeners for every known panel ID from content-data.js.
export function initPanelScrollProgress() {
  panelIds.forEach(updatePanelScroll);
}
