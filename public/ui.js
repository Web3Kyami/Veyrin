(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const items = [...document.querySelectorAll('[data-reveal]')];
  let observer;
  function enableReveals() {
    observer?.disconnect();
    if (reduced.matches) { document.documentElement.classList.remove('motion-ready'); items.forEach(el => el.classList.add('is-visible')); return; }
    document.documentElement.classList.add('motion-ready');
    observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .1, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => observer.observe(el));
  }
  function floatingNav() { const floating = scrollY > 48 && !header.classList.contains('is-app'); if (header.classList.contains('is-floating') !== floating) header.classList.toggle('is-floating', floating); }
  addEventListener('scroll', floatingNav, { passive: true });
  new MutationObserver(floatingNav).observe(header, { attributes: true, attributeFilter: ['class'] });
  const hero = document.querySelector('.hero-visual'), tilt = document.querySelector('.hero-tilt');
  hero.addEventListener('pointermove', event => { if (reduced.matches || event.pointerType !== 'mouse') return; const rect = hero.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5, y = (event.clientY - rect.top) / rect.height - .5; tilt.style.transform = `rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`; });
  hero.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  function visibleScroll(el, render) {
    let active = false, pending = false;
    const tick = () => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; render(); }); };
    new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting && !active) { active = true; addEventListener('scroll', tick, { passive: true }); tick(); } else if (!entry.isIntersecting && active) { active = false; removeEventListener('scroll', tick); } }); }).observe(el);
    addEventListener('resize', tick, { passive: true });
    reduced.addEventListener('change', tick);
  }
  const compare = document.querySelector('[data-compare]');
  let compared = false;
  visibleScroll(compare, () => { if (compared) return; if (reduced.matches || 1 - compare.getBoundingClientRect().top / innerHeight > .45) { compared = true; compare.classList.add('is-compared'); } });
  const chamber = document.querySelector('[data-scroll-chamber]');
  const rows = [...chamber.querySelectorAll('[data-progress-at]')];
  const portraits = [...chamber.querySelectorAll('[data-handoff-portrait]')];
  visibleScroll(chamber, () => { const rect = chamber.getBoundingClientRect(); const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight))); chamber.style.setProperty('--progress', progress); rows.forEach(row => row.classList.toggle('is-active', progress >= Number(row.dataset.progressAt))); portraits.forEach((portrait, index) => portrait.classList.toggle('is-active', reduced.matches || (progress >= [.2, .45, .7][index] && progress < [.45, .7, 1.01][index]))); });
  reduced.addEventListener('change', enableReveals);
  enableReveals(); floatingNav();
  const numbers = [...document.querySelectorAll('[data-count-to]')];
  let numberFrame = 0;
  function formatNumber(el, progress = 1) {
    const target = Number(el.dataset.countTo);
    const value = Math.abs(target * progress).toFixed(Number(el.dataset.decimals || 0));
    el.textContent = `${target < 0 ? '−' : ''}${value}${el.dataset.suffix || ''}`;
  }
  function animateStudy() {
    cancelAnimationFrame(numberFrame);
    numbers.forEach(el => formatNumber(el));
    if (document.body.dataset.currentView !== 'sample' || reduced.matches) return;
    const started = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - started) / 1100);
      const eased = 1 - Math.pow(1 - progress, 3);
      numbers.forEach(el => formatNumber(el, eased));
      if (progress < 1) numberFrame = requestAnimationFrame(step);
    };
    numbers.forEach(el => formatNumber(el, 0));
    numberFrame = requestAnimationFrame(step);
  }
  new MutationObserver(animateStudy).observe(document.body, { attributes: true, attributeFilter: ['data-current-view'] });
  reduced.addEventListener('change', animateStudy);
  animateStudy();
})();
