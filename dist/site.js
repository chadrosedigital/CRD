/* Accessible navigation and enquiry behavior; animation lives in motion.js. */
(() => {
  'use strict';
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

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
  copyEmail?.addEventListener('click', () => copy('designs@chadrosedigital.co.za',document.querySelector('#copy-status'),'Email address copied.'));
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
      location.href = `mailto:designs@chadrosedigital.co.za?subject=${encodeURIComponent('Website enquiry — '+packageName)}&body=${encodeURIComponent(enquiry)}`;
    });
    document.querySelector('#copy-enquiry').addEventListener('click', () => copy(enquiry,document.querySelector('#enquiry-status'),'Enquiry copied. Paste it into an email when you’re ready.'));
  }
})();
