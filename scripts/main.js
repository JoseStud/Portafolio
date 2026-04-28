import { renderContent } from './modules/render-content.js';
import { initClock } from './modules/clock.js';
import { initCursor } from './modules/cursor.js';
import { initMenuPanels } from './modules/menu-panels.js';
import { initParallax } from './modules/parallax.js';
import { initPanelScrollProgress } from './modules/scroll-progress.js';
import { initToggle } from './modules/toggle.js';

renderContent();
initCursor();
initPanelScrollProgress();
initClock();
initToggle();
initMenuPanels();
initParallax();
