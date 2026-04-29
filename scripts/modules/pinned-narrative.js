import { setMainScrollProgress } from './scroll-progress.js';

const interactiveSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function isInteractiveTarget(target) {
  return target instanceof Element && Boolean(target.closest(interactiveSelector));
}

function isOverlayActive() {
  return Boolean(document.querySelector('.vnav.open, .panel.open'));
}

function normalizeWheelDelta(event) {
  const modeMultiplier = event.deltaMode === 1
    ? 16
    : event.deltaMode === 2
      ? window.innerHeight
      : 1;

  return event.deltaY * modeMultiplier;
}

export function initPinnedNarrative() {
  const root = document.getElementById('pinnedNarrative');
  const page = document.querySelector('.page');
  if (!root || !page) return;

  const scenes = [...root.querySelectorAll('[data-narrative-scene-index]')];
  if (scenes.length === 0) return;

  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lastSceneIndex = scenes.length - 1;
  let progress = 0;
  let touchY = null;
  let lastDiscreteStep = 0;

  const activeSceneIndex = () => Math.round(progress * lastSceneIndex);

  const updateScene = () => {
    const sceneIndex = activeSceneIndex();
    root.dataset.narrativeScene = String(sceneIndex);

    scenes.forEach((scene, index) => {
      const isActive = index === sceneIndex;
      if (isActive) scene.setAttribute('data-active', 'true');
      else scene.removeAttribute('data-active');
      scene.setAttribute('aria-hidden', String(!isActive));
    });

    page.style.setProperty('--narrative-progress', progress.toFixed(3));
    page.style.setProperty('--narrative-hero-scale', (1 - progress * 0.08).toFixed(3));
    page.style.setProperty('--narrative-hero-opacity', Math.max(0.04, 1 - progress * 1.8).toFixed(3));
    page.style.setProperty('--narrative-object-opacity', Math.max(0.12, 1 - progress * 1.05).toFixed(3));
    page.style.setProperty('--narrative-hint-opacity', Math.max(0, 0.3 - progress * 1.8).toFixed(3));

    if (!isOverlayActive()) setMainScrollProgress(progress * 100);
  };

  const setProgress = (nextProgress) => {
    const clampedProgress = clamp(nextProgress);
    if (clampedProgress === progress) return;

    progress = clampedProgress;
    updateScene();
  };

  const setScene = (sceneIndex) => {
    const nextScene = clamp(sceneIndex, 0, lastSceneIndex);
    setProgress(lastSceneIndex === 0 ? 0 : nextScene / lastSceneIndex);
  };

  const stepScene = (direction) => {
    const now = performance.now();
    if (now - lastDiscreteStep < 160) return;
    lastDiscreteStep = now;
    setScene(activeSceneIndex() + direction);
  };

  const canHandleInput = (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return false;
    if (isOverlayActive()) return false;
    if (isInteractiveTarget(event.target)) return false;
    return !isInteractiveTarget(document.activeElement);
  };

  const onWheel = (event) => {
    if (!canHandleInput(event)) return;

    const delta = normalizeWheelDelta(event);
    if (Math.abs(delta) < 1) return;

    event.preventDefault();

    if (reduceMotionQuery.matches) {
      stepScene(Math.sign(delta));
      return;
    }

    setProgress(progress + clamp(delta * 0.00072, -0.12, 0.12));
  };

  const onTouchStart = (event) => {
    if (event.touches.length !== 1 || isOverlayActive()) {
      touchY = null;
      return;
    }

    touchY = event.touches[0].clientY;
  };

  const onTouchMove = (event) => {
    if (touchY === null || event.touches.length !== 1 || isOverlayActive()) return;
    if (isInteractiveTarget(event.target)) return;

    const nextY = event.touches[0].clientY;
    const delta = touchY - nextY;
    if (Math.abs(delta) < 2) return;

    event.preventDefault();
    touchY = nextY;
    setProgress(progress + clamp(delta * 0.0012, -0.08, 0.08));
  };

  const onKeyDown = (event) => {
    if (!canHandleInput(event)) return;

    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      stepScene(1);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      stepScene(-1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setScene(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setScene(lastSceneIndex);
    }
  };

  updateScene();

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeyDown);
}
