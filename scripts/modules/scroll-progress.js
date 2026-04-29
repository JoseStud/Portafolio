import { panelIds } from './content-data.js';

const scrollTrack = () => document.getElementById('scrollTrack');
const scrollPip = () => document.getElementById('scrollPip');

let rememberedMainProgress = 0;

const clampProgress = (pct) => Math.max(0, Math.min(100, pct));

export function setMainScrollProgress(pct, { remember = true } = {}) {
  const nextProgress = clampProgress(pct);
  if (remember) rememberedMainProgress = nextProgress;

  const track = scrollTrack();
  const pip = scrollPip();
  if (track) track.style.height = `${nextProgress}%`;
  if (pip) pip.style.top = `${nextProgress}%`;
}

export function resetMainScrollProgress() {
  setTimeout(() => {
    setMainScrollProgress(rememberedMainProgress, { remember: false });
  }, 450);
}

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

export function initPanelScrollProgress() {
  panelIds.forEach(updatePanelScroll);
}
