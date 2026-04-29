// Local availability toggle in the bottom bar. It is intentionally client-only:
// the control communicates state visually and through aria-pressed without
// persisting anything between page loads.
export function initToggle() {
  const toggle = document.getElementById('toggleWrap');
  const switchElement = document.getElementById('sw');
  if (!toggle || !switchElement) return;

  toggle.addEventListener('click', () => {
    const isOn = switchElement.classList.toggle('on');
    toggle.setAttribute('aria-pressed', String(isOn));
  });
}
