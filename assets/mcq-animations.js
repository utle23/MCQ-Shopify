/* ============================================================
   MCQ Supermarket — micro-interactions
   Vanilla JS, no dependencies. Safe to load multiple times
   (guards against double-init). Handles:
     • scroll-reveal (.mcq-reveal)
     • count-up stats (.mcq-stat b, numeric only)
     • testimonial carousel ([data-mcq-testi])
   Respects prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  if (window.__mcqAnim) {
    // Re-run initialisers for sections added later (e.g. theme editor)
    window.__mcqAnim();
    return;
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    var els = document.querySelectorAll('.mcq-reveal:not([data-mcq-seen])');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); el.setAttribute('data-mcq-seen', '1'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.setAttribute('data-mcq-seen', '1'); io.observe(el); });
  }

  function countUp(el) {
    var raw = (el.textContent || '').trim();
    var m = raw.match(/^(\d+)$/);
    if (!m) return; // only pure integers ("5", "7") — leave "1000s", "WA" as-is
    var target = parseInt(m[1], 10);
    if (reduce || target === 0) { el.textContent = target; return; }
    var dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var nums = document.querySelectorAll('.mcq-stat b:not([data-mcq-counted])');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window)) { nums.forEach(function (n) { n.setAttribute('data-mcq-counted', '1'); countUp(n); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { countUp(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { n.setAttribute('data-mcq-counted', '1'); io.observe(n); });
  }

  function initTestimonials() {
    document.querySelectorAll('[data-mcq-testi]:not([data-mcq-testi-init])').forEach(function (root) {
      root.setAttribute('data-mcq-testi-init', '1');
      var track = root.querySelector('.mcq-testi__track');
      var slides = root.querySelectorAll('.mcq-testi__slide');
      var dots = root.querySelectorAll('.mcq-testi__dot');
      if (!track || slides.length < 2) return;
      var i = 0, timer = null;
      var delay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;

      function go(n) {
        i = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-100 * i) + '%)';
        dots.forEach(function (d, di) { d.classList.toggle('is-active', di === i); });
      }
      dots.forEach(function (d, di) { d.addEventListener('click', function () { go(di); restart(); }); });

      function restart() {
        if (!delay) return;
        clearInterval(timer);
        timer = setInterval(function () { go(i + 1); }, delay);
      }
      root.addEventListener('mouseenter', function () { clearInterval(timer); });
      root.addEventListener('mouseleave', restart);
      go(0); restart();
    });
  }

  function run() { initReveal(); initCounters(); initTestimonials(); }
  window.__mcqAnim = run;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  // Shopify theme editor: re-init when sections are reloaded
  document.addEventListener('shopify:section:load', run);
})();
