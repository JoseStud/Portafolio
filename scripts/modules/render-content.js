import {
  archiveItems,
  marqueeItems,
  navItems,
  studioServices,
  workProjects,
} from './content-data.js';

const setHtml = (selector, html) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = html;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderNavItem = ({ panel, number, text, category }) => `
        <div class="vnav-item" data-panel="${escapeHtml(panel)}" role="button" tabindex="0" aria-controls="panel-${escapeHtml(panel)}">
          <div class="vnav-item-inner">
            <span class="vnav-num">${escapeHtml(number)}</span>
            <span class="vnav-text">${escapeHtml(text)}</span>
            <span class="vnav-cat">${escapeHtml(category)}</span>
            <span class="vnav-arrow">↗</span>
          </div>
        </div>`;

const renderWorkProject = ({ number, title, category, url }) => {
  const tag = url ? 'a' : 'div';
  const attrs = url ? ` href="${escapeHtml(url)}" target="_blank" rel="noreferrer"` : '';
  return `
        <${tag} class="work-item"${attrs}><div class="work-stripe"></div><div class="work-item-inner"><div class="work-num">${escapeHtml(number)}</div><div class="work-title">${escapeHtml(title)}</div><div class="work-cat">${escapeHtml(category)}</div></div><div class="work-arrow">↗</div></${tag}>`;
};

const renderStudioService = ({ name, number }) =>
  `            <li>${escapeHtml(name)} <span>${escapeHtml(number)}</span></li>`;

const renderArchiveItem = ({ number, name, category, year }) =>
  `        <li><span class="archive-num">${escapeHtml(number)}</span><span class="archive-name">${escapeHtml(name)}</span><span class="archive-cat">${escapeHtml(category)}</span><span class="archive-yr">${escapeHtml(year)}</span></li>`;

const renderMarqueeItems = (items) =>
  items.map((item) => `      <span>${escapeHtml(item)}</span>`).join('<span>·</span>\n');

export function renderContent() {
  setHtml('#vnavItems', navItems.map(renderNavItem).join('\n'));
  setHtml('#workGrid', workProjects.map(renderWorkProject).join('\n'));
  setHtml('#servicesList', studioServices.map(renderStudioService).join('\n'));
  setHtml('#archiveList', archiveItems.map(renderArchiveItem).join('\n'));
  setHtml('#marqueeInner', renderMarqueeItems(marqueeItems));
}
