// Selectors that should enlarge the custom cursor to signal interactivity.
// Keep this list aligned with dynamically rendered content in render-content.js.
const hoverSelectors = [
  'a',
  '#toggleWrap',
  '#menuBtn',
  '.vnav-item[data-panel]',
  '[data-close]',
  '.work-item',
  '.archive-list li',
  '.services-list li',
  '.contact-email',
  '.vnav-footer-email',
];

// Positions the custom cursor and wires hover affordances. The CSS accessibility
// file disables this cursor on coarse pointers and touch-first devices.
export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll(hoverSelectors.join(', ')).forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('big'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
}
