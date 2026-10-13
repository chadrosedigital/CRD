/* Reveal behavior adapted from asanshay/Reveal (21st.dev, MIT), using native
   browser APIs for this static site. Original: fade + blur, stagger, once. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  let observer;
  const targets = [...document.querySelectorAll('[data-reveal]')];
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  function reveal(element, animate = true) {
    if (!element.classList.contains('reveal-pending')) return;
    element.classList.remove('reveal-pending');
    observer?.unobserve(element);
    if (!animate || reducedMotion.matches || !element.animate) return;
    const hasDepth = element.matches('.price-card, .value-grid article, .journey-step, .enquiry-panel, .prestige-stage');
    const animation = element.animate([
      {opacity: 0, transform: hasDepth ? 'perspective(1200px) translate3d(0,28px,-18px) rotateX(4deg) rotateY(-1deg) scale(.985)' : 'translateY(18px)', filter: 'blur(2px)'},
      {opacity: 1, transform: hasDepth ? 'perspective(1200px) translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)' : 'translateY(0)', filter: 'blur(0)'}
    ], {duration: 800, delay: Number(element.dataset.delay || 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'});
    animations.set(element, animation);
    animation.onfinish = animation.oncancel = () => animations.delete(element);
  }
  function settle() {
    observer?.disconnect();
    targets.forEach(element => {element.classList.remove('reveal-pending');animations.get(element)?.cancel();});
    animations.clear();
  }
  if (!reducedMotion.matches && 'IntersectionObserver' in window && Element.prototype.animate) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    }, {threshold: .12, rootMargin: '0px 0px -20px 0px'});
    targets.forEach(element => {element.classList.add('reveal-pending');observer.observe(element);});
    document.addEventListener('focusin', event => {
      const element = event.target.closest('[data-reveal]');
      if (element) {reveal(element, false);animations.get(element)?.cancel();}
    });
    reducedMotion.addEventListener('change', event => {if (event.matches) settle();});
    window.addEventListener('beforeprint', settle);
    window.addEventListener('pageshow', event => {if (event.persisted) settle();});
  }
  const progress = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero-surface');
  const heroArt = document.querySelector('.monitor-device');
  let frame = 0;
  function updateProgress() {
    frame = 0;
    if (reducedMotion.matches) {
      heroArt?.style.removeProperty('transform');
      return;
    }
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0})`;
    if (hero && heroArt) {
      const bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight) {
        const depth = Math.min(1, Math.max(0, -bounds.top / bounds.height));
        heroArt.style.transform = `perspective(1200px) translate3d(0,${-18 * depth}px,0) rotateX(${4 * depth}deg) rotateY(${-5 * depth}deg)`;
      }
    }
  }
  function scheduleProgress() {if (!frame) frame = requestAnimationFrame(updateProgress);}
  addEventListener('scroll', scheduleProgress, {passive:true});
  addEventListener('resize', scheduleProgress, {passive:true});
  reducedMotion.addEventListener('change', scheduleProgress);
  scheduleProgress();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu(returnFocus = false) {
    toggle?.setAttribute('aria-expanded','false');
    toggle?.setAttribute('aria-label','Open navigation');
    nav?.classList.remove('open');
    if (returnFocus) toggle?.focus();
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open',open);
  });
  document.addEventListener('keydown', event => {if(event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);});
  document.addEventListener('click', event => {if(!event.target.closest('.site-header')) closeMenu();});
  matchMedia('(min-width: 601px)').addEventListener('change', event => {if(event.matches) closeMenu();});
  nav?.addEventListener('click', event => {if(event.target.closest('a')) closeMenu();});

  async function copy(text, status, success) {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = success;
    } catch {
      status.textContent = 'Copy is unavailable in this browser. Select the email address or message text and copy it manually.';
    }
  }
  const copyEmail = document.querySelector('[data-copy-email]');
  copyEmail?.addEventListener('click', () => copy('chadrosedigital@gmail.com',document.querySelector('#copy-status'),'Email address copied.'));
  const form = document.querySelector('#enquiry-form');
  if (form) {
    const selected = new URLSearchParams(location.search).get('package');
    if (['full-website','landing-page','call'].includes(selected)) form.elements.package.value = selected;
    let enquiry = '';
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const packageName = form.elements.package.selectedOptions[0].textContent;
      enquiry = `Hi Chad Rose Digital,\n\nI'd like to enquire about: ${packageName}\n\nName: ${String(values.get('name')).trim()}\nEmail: ${String(values.get('email')).trim()}\nBusiness: ${String(values.get('business')).trim() || 'Not provided'}\n\n${String(values.get('message')).trim()}\n\nThanks!`;
      const result = document.querySelector('#form-result');
      result.hidden = false;
      let fallback = result.querySelector('textarea');
      if (!fallback) {
        fallback = document.createElement('textarea');
        fallback.readOnly = true;
        fallback.setAttribute('aria-label','Prepared enquiry message');
        fallback.rows = 6;
        fallback.className = 'enquiry-fallback';
        result.append(fallback);
      }
      fallback.value = enquiry;
      location.href = `mailto:chadrosedigital@gmail.com?subject=${encodeURIComponent('Website enquiry — '+packageName)}&body=${encodeURIComponent(enquiry)}`;
    });
    document.querySelector('#copy-enquiry').addEventListener('click', () => copy(enquiry,document.querySelector('#enquiry-status'),'Enquiry copied. Paste it into an email when you’re ready.'));
  }
})();
