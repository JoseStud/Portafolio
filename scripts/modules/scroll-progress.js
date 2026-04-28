import { panelIds } from './content-data.js';

const scrollTrack = () => document.getElementById('scrollTrack');
const scrollPip = () => document.getElementById('scrollPip');

export function resetMainScrollProgress() {
  setTimeout(() => {
    const track = scrollTrack();
    const pip = scrollPip();
    if (track) track.style.height = '0%';
    if (pip) pip.style.top = '0%';
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

    const track = scrollTrack();
    const mainPip = scrollPip();
    if (track) track.style.height = `${pct}%`;
    if (mainPip) mainPip.style.top = `${pct}%`;
  });
}

export function initPanelScrollProgress() {
  panelIds.forEach(updatePanelScroll);
}
