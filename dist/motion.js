/* GSAP enhancement of the existing 21st-inspired Reveal pattern.
   Content and navigation remain usable if these optional libraries fail. */
(() => {
  'use strict';
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  const seen = new WeakSet();
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const listeners = [];
  const listen = (node, event, handler) => {
    node.addEventListener(event, handler);
    listeners.push(() => node.removeEventListener(event, handler));
  };
  mm.add({ desktop: '(min-width: 801px)', reduce: '(prefers-reduced-motion: reduce)', all: '(min-width: 0px)' }, context => {
    if (context.conditions.reduce) return;
    const desktop = context.conditions.desktop;
    const introTargets = [...document.querySelectorAll('.hero-copy [data-reveal], .page-intro [data-reveal], .contact-copy > [data-reveal]')];
    const intro = gsap.timeline({ defaults: { duration: .85, ease: 'power3.out' } });
    const freshIntro = introTargets.filter(el => !seen.has(el));
    freshIntro.forEach(el => seen.add(el));
    if (freshIntro.length) intro.from(freshIntro, { y: desktop ? 26 : 12, opacity: 0, stagger: .09, clearProps: 'transform,opacity' }, 0);
    const stage = document.querySelector('.prestige-stage');
    if (stage && !seen.has(stage)) {
      seen.add(stage);
      intro.from(stage, { y: 24, rotationY: desktop ? -7 : 0, scale: .97, opacity: 0, transformPerspective: 1400, duration: 1.2, clearProps: 'transform,opacity' }, .18);
    }
    const revealTweens = new Map();
    reveals.filter(el => !seen.has(el) && !el.parentElement.closest('[data-reveal]')).forEach(el => {
      const tween = gsap.from(el, {
        y: desktop ? 28 : 12, opacity: 0, duration: desktop ? .8 : .45,
        delay: Math.min(Number(el.dataset.delay || 0) / 1000, .18), ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        onComplete: () => seen.add(el)
      });
      revealTweens.set(el, tween);
    });
    // Keyboard users can always reach a fully visible target immediately.
    const focus = event => {
      const el = event.target.closest('[data-reveal]');
      const tween = revealTweens.get(el);
      if (tween) { tween.progress(1); tween.scrollTrigger?.kill(); }
      if (introTargets.some(node => node.contains(event.target))) intro.progress(1);
    };
    document.addEventListener('focusin', focus);
    const monitor = document.querySelector('.monitor-device');
    if (monitor && desktop) gsap.to(monitor, {
      y: -38, rotationX: 5, rotationY: -7, scale: .97, transformPerspective: 1400, ease: 'none',
      scrollTrigger: { trigger: '.hero-surface', start: 'top top', end: 'bottom top', scrub: .8 }
    });
    document.querySelectorAll('.journey-step').forEach(step => {
      const number = step.querySelector('.journey-number');
      if (number && desktop) gsap.fromTo(number, { y: 12 }, { y: -12, ease: 'none', scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: .6 } });
    });
    const progress = document.querySelector('.scroll-progress');
    if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .25 } });
    return () => document.removeEventListener('focusin', focus);
  });
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cleanup = [];
    // A small tilt on the monitor frame complements the separate scroll layer.
    const frame = document.querySelector('.monitor-frame');
    const stage = document.querySelector('.hero-stage');
    if (frame && stage) {
      const x = gsap.quickTo(frame, 'rotationX', { duration: .65, ease: 'power3.out' });
      const y = gsap.quickTo(frame, 'rotationY', { duration: .65, ease: 'power3.out' });
      gsap.set(frame, { transformPerspective: 1100 });
      let bounds;
      const enter = () => { bounds = stage.getBoundingClientRect(); };
      const move = event => {
        if (!bounds) enter();
        x((.5 - (event.clientY - bounds.top) / bounds.height) * 5);
        y(((event.clientX - bounds.left) / bounds.width - .5) * 6);
      };
      const leave = () => { x(0); y(0); bounds = null; };
      stage.addEventListener('pointerenter', enter); stage.addEventListener('pointermove', move); stage.addEventListener('pointerleave', leave);
      window.addEventListener('scroll', leave, { passive: true });
      cleanup.push(() => { stage.removeEventListener('pointerenter', enter); stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); window.removeEventListener('scroll', leave); });
    }
    return () => cleanup.forEach(fn => fn());
  });
  // Refresh only after actual layout changes, never in the scroll callback.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  document.querySelectorAll('img').forEach(img => { if (!img.complete) listen(img, 'load', () => ScrollTrigger.refresh()); });
  document.querySelectorAll('details').forEach(details => listen(details, 'toggle', () => ScrollTrigger.refresh()));
  listen(window, 'beforeprint', () => mm.revert());
  listen(window, 'pageshow', event => { if (event.persisted) ScrollTrigger.refresh(); });
})();
