/* Page controls: motion toggle, theme toggle, preloader, progress bar, scroll reveals, counters. */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); }, R = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function nm() { return R.classList.contains('nm'); }

  function motion(on) {
    R.classList.toggle('nm', !on);
    $('mo').textContent = on ? 'Motion on' : 'Motion off';
    $('mo').setAttribute('aria-pressed', String(!on));
  }
  motion(!reduced);
  $('mo').addEventListener('click', function () { motion(nm()); });

  $('tg').addEventListener('click', function () {
    var n = R.dataset.theme === 'dark' ? 'light' : 'dark';
    R.dataset.theme = n; try { localStorage.setItem('hs-theme', n); } catch (e) {}
  });

  /* preloader, then the hero animation starts (adds the "go" class) */
  function go() { R.classList.add('go'); }
  if (nm()) { go(); } else {
    var n = 0, cnt = $('cnt'), pre = $('pre');
    var iv = setInterval(function () {
      n = Math.min(100, n + Math.ceil(Math.random() * 11)); cnt.textContent = n;
      if (n >= 100) {
        clearInterval(iv);
        setTimeout(function () { pre.classList.add('out'); go(); setTimeout(function () { pre.style.display = 'none'; }, 1100); }, 250);
      }
    }, 55);
  }

  window.addEventListener('scroll', function () {
    $('pg').style.width = window.scrollY / Math.max(1, R.scrollHeight - innerHeight) * 100 + '%';
  }, {passive: true});

  /* scroll reveals and number counters */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      e.target.querySelectorAll('[data-n]').forEach(function (b) {
        var to = +b.dataset.n, d = +b.dataset.d, s = performance.now();
        if (nm()) { b.textContent = to.toFixed(d); return; }
        (function f(t) {
          var p = Math.min(1, (t - s) / 1600);
          b.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(d);
          if (p < 1) requestAnimationFrame(f);
        })(s);
      });
      io.unobserve(e.target);
    });
  }, {threshold: 0.2});
  document.querySelectorAll('.rv,.stats').forEach(function (e) { io.observe(e); });
})();
