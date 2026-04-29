import { resetMainScrollProgress } from './scroll-progress.js';

// Shared focusable query used for focus trapping inside open panels.
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

// Coordinates the fullscreen menu, panel transitions, ARIA state, and keyboard
// focus behavior for the portfolio's modal-style sections.
export function initMenuPanels() {
  const wipe = document.getElementById('panelWipe');
  const page = document.querySelector('.page');
  const vnav = document.getElementById('vnav');
  const mainNav = document.getElementById('mainNav');
  const menuBtn = document.getElementById('menuBtn');
  if (!wipe || !page || !vnav || !mainNav || !menuBtn) return;

  let menuOpen = false;
  let activePanel = null;
  let menuFocusReturn = null;
  let panelFocusReturn = null;

  // Keep visual menu state and accessibility tree state in lockstep.
  const setMenuState = (isOpen) => {
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    vnav.setAttribute('aria-hidden', String(!isOpen));
    vnav.inert = !isOpen;

    document.querySelectorAll('.vnav-item[data-panel]').forEach((item) => {
      item.setAttribute('tabindex', isOpen ? '0' : '-1');
    });
  };

  // `inert` prevents hidden panels from receiving focus or screen-reader
  // interaction while CSS transitions keep them in the DOM.
  const setPanelState = (panel, isOpen) => {
    panel.setAttribute('aria-hidden', String(!isOpen));
    panel.inert = !isOpen;
  };

  const restoreFocus = (target) => {
    if (target && document.contains(target)) target.focus();
  };

  // Filter out focusable nodes that are currently hidden by CSS.
  const getFocusable = (container) =>
    [...container.querySelectorAll(focusableSelector)].filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

  const trapPanelFocus = (event) => {
    if (event.key !== 'Tab' || !activePanel) return;

    const focusable = getFocusable(activePanel);
    if (focusable.length === 0) {
      event.preventDefault();
      activePanel.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && (!activePanel.contains(activeElement) || activeElement === first)) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function openMenu() {
    menuFocusReturn = document.activeElement;
    menuOpen = true;
    setMenuState(true);
    vnav.classList.add('open');
    mainNav.classList.add('menu-open');
    page.classList.add('panel-active');
  }

  function closeMenu({ restore = true } = {}) {
    menuOpen = false;
    setMenuState(false);
    vnav.classList.remove('open');
    mainNav.classList.remove('menu-open');
    if (!activePanel) page.classList.remove('panel-active');
    if (restore) restoreFocus(menuFocusReturn);
  }

  function focusPanelClose(panel) {
    const closeButton = panel.querySelector('[data-close]');
    if (closeButton) closeButton.focus();
    else panel.focus();
  }

  function openPanel(id, trigger) {
    // When opened from the overlay menu, focus should return to the menu button
    // because the original nav item will be inert once the menu is closed.
    panelFocusReturn = trigger?.closest('#vnav') ? menuBtn : (trigger || document.activeElement);
    closeMenu({ restore: false });

    // The nested timeouts match the CSS wipe timing: first cover the page, then
    // switch panel content while covered, then reveal the selected panel.
    setTimeout(() => {
      wipe.classList.add('open');
      page.classList.add('panel-active');

      setTimeout(() => {
        if (activePanel) {
          activePanel.classList.remove('open');
          setPanelState(activePanel, false);
        }

        const panel = document.getElementById(`panel-${id}`);
        if (panel) {
          panel.classList.add('open');
          setPanelState(panel, true);
          activePanel = panel;
          focusPanelClose(panel);
        }

        wipe.classList.remove('open');
      }, 420);
    }, 100);
  }

  function closePanel() {
    wipe.classList.add('open');
    resetMainScrollProgress();

    // Release the active panel after the wipe covers the viewport, then restore
    // focus to the control that opened the panel.
    setTimeout(() => {
      if (activePanel) {
        activePanel.classList.remove('open');
        setPanelState(activePanel, false);
        activePanel = null;
      }

      page.classList.remove('panel-active');
      wipe.classList.remove('open');
      restoreFocus(panelFocusReturn || menuBtn);
    }, 420);
  }

  // Start with all overlays removed from the accessibility tree.
  setMenuState(false);
  document.querySelectorAll('.panel').forEach((panel) => setPanelState(panel, false));

  menuBtn.addEventListener('click', () => {
    if (menuOpen) closeMenu();
    else openMenu();
  });

  document.querySelectorAll('.vnav-item[data-panel]').forEach((element) => {
    element.addEventListener('click', () => openPanel(element.dataset.panel, element));
    element.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openPanel(element.dataset.panel, element);
    });
  });

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', closePanel);
  });

  document.addEventListener('keydown', (event) => {
    trapPanelFocus(event);

    if (event.key !== 'Escape') return;

    if (activePanel) closePanel();
    else if (menuOpen) closeMenu();
  });
}
