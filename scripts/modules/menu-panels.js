import { resetMainScrollProgress } from './scroll-progress.js';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

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

  const setMenuState = (isOpen) => {
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    vnav.setAttribute('aria-hidden', String(!isOpen));
    vnav.inert = !isOpen;

    document.querySelectorAll('.vnav-item[data-panel]').forEach((item) => {
      item.setAttribute('tabindex', isOpen ? '0' : '-1');
    });
  };

  const setPanelState = (panel, isOpen) => {
    panel.setAttribute('aria-hidden', String(!isOpen));
    panel.inert = !isOpen;
  };

  const restoreFocus = (target) => {
    if (target && document.contains(target)) target.focus();
  };

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
    panelFocusReturn = trigger?.closest('#vnav') ? menuBtn : (trigger || document.activeElement);
    closeMenu({ restore: false });

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
