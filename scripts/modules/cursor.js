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
