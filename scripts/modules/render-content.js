import {
  archiveItems,
  marqueeItems,
  navItems,
  studioServices,
  workProjects,
} from './content-data.js';

// Replace a generated content mount only when the expected node exists.
// This keeps the module safe if a section is temporarily removed from HTML.
const setHtml = (selector, html) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = html;
};

// All generated labels are escaped before entering template strings. The
// current content is static, but this preserves the invariant if copy changes.
const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// Navigation entries are intentionally rendered as focusable divs because the
// menu opens in-page panels instead of navigating to URLs.
const renderNavItem = ({ panel, number, text, category }) => `
        <div class="vnav-item" data-panel="${escapeHtml(panel)}" role="button" tabindex="0" aria-controls="panel-${escapeHtml(panel)}">
          <div class="vnav-item-inner">
            <span class="vnav-num">${escapeHtml(number)}</span>
            <span class="vnav-text">${escapeHtml(text)}</span>
            <span class="vnav-cat">${escapeHtml(category)}</span>
            <span class="vnav-arrow">↗</span>
          </div>
        </div>`;

// Work cards become anchors when a URL is present and plain blocks otherwise,
// letting the data model support both linked and unlinked portfolio items.
const renderWorkProject = ({ number, title, category, url }) => {
  const tag = url ? 'a' : 'div';
  const attrs = url ? ` href="${escapeHtml(url)}" target="_blank" rel="noreferrer"` : '';
  return `
        <${tag} class="work-item"${attrs}><div class="work-stripe"></div><div class="work-item-inner"><div class="work-num">${escapeHtml(number)}</div><div class="work-title">${escapeHtml(title)}</div><div class="work-cat">${escapeHtml(category)}</div></div><div class="work-arrow">↗</div></${tag}>`;
};

// Small list renderers keep the templates colocated with the data shape they
// expect, which makes future copy/content additions easier to audit.
const renderStudioService = ({ name, number }) =>
  `            <li>${escapeHtml(name)} <span>${escapeHtml(number)}</span></li>`;

const renderArchiveItem = ({ number, name, category, year }) =>
  `        <li><span class="archive-num">${escapeHtml(number)}</span><span class="archive-name">${escapeHtml(name)}</span><span class="archive-cat">${escapeHtml(category)}</span><span class="archive-yr">${escapeHtml(year)}</span></li>`;

const renderMarqueeItems = (items) =>
  items.map((item) => `      <span>${escapeHtml(item)}</span>`).join('<span>·</span>\n');

// Populate all dynamic islands before interactive modules attach listeners to
// the generated controls and links.
export function renderContent() {
  setHtml('#vnavItems', navItems.map(renderNavItem).join('\n'));
  setHtml('#workGrid', workProjects.map(renderWorkProject).join('\n'));
  setHtml('#servicesList', studioServices.map(renderStudioService).join('\n'));
  setHtml('#archiveList', archiveItems.map(renderArchiveItem).join('\n'));
  setHtml('#marqueeInner', renderMarqueeItems(marqueeItems));
}
