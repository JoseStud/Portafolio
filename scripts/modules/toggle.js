export function initToggle() {
  const toggle = document.getElementById('toggleWrap');
  const switchElement = document.getElementById('sw');
  if (!toggle || !switchElement) return;

  toggle.addEventListener('click', () => {
    const isOn = switchElement.classList.toggle('on');
    toggle.setAttribute('aria-pressed', String(isOn));
  });
}
