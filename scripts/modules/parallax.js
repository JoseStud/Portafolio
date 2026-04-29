// Per-object depth values create a layered parallax field; the fallback below
// covers any additional decorative object added to the markup.
const depths = [0.018, 0.022, 0.014, 0.020, 0.016, 0.012];

// Moves decorative objects and the hero headline subtly against pointer motion.
// The effect is visual only, so the elements remain pointer-events: none in CSS.
export function initParallax() {
  const objects = document.querySelectorAll('.obj');
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('mousemove', (event) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const ratioX = (event.clientX - centerX) / centerX;
    const ratioY = (event.clientY - centerY) / centerY;

    objects.forEach((object, index) => {
      const depth = depths[index] || 0.015;
      object.style.marginLeft = `${ratioX * depth * 100}px`;
      object.style.marginTop = `${ratioY * depth * 60}px`;
    });

    hero.style.transform = `translate(${ratioX * -10}px, ${ratioY * -6}px)`;
  });
}
