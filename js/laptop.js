/* 3D laptop: builds the keyboard, types the portfolio code on the screen,
   and moves/rotates the laptop as you scroll. The model itself is CSS (see style.css). */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); }, R = document.documentElement;
  function nm() { return R.classList.contains('nm'); }

  /* keyboard */
  var KR = [
    'esc F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12'.split(' '),
    '` 1 2 3 4 5 6 7 8 9 0 - = delete'.split(' '),
    'tab q w e r t y u i o p [ ] \\'.split(' '),
    "caps a s d f g h j k l ; ' return".split(' '),
    'shift z x c v b n m , . / shift'.split(' '),
    'fn ctrl opt cmd space cmd opt \u25c2 \u25be \u25b8'.split(' ')
  ], WIDE = {'delete': 1.6, tab: 1.5, caps: 1.8, 'return': 1.8, shift: 2.3, cmd: 1.3, space: 5.2}, kb = $('kb');
  KR.forEach(function (row, ri) {
    var d = document.createElement('div'); d.className = 'kr' + (ri === 0 ? ' f' : '');
    row.forEach(function (k) {
      var e = document.createElement('div'); e.className = 'ky';
      e.textContent = k === 'space' ? '' : k; e.style.flex = WIDE[k] || 1; d.appendChild(e);
    });
    kb.appendChild(d);
  });

  /* screen: live-typed code from this very portfolio */
  var CODE = [
    '<h1>Hamza <em>Shaikh</em></h1>',
    '<canvas id="cv"></canvas>',
    '',
    "const skills = ['C++', 'Python',",
    "                'HTML', 'CSS'];",
    '',
    '// learning the logic,',
    '// coding the future',
    'laptop.open();'
  ].join('\n'), ci = 0, out = $('code');
  function hl(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/(&lt;\/?[a-z0-9]+)/g, '<i class=t>$1</i>')
      .replace(/('[^']*')/g, '<i class=s>$1</i>')
      .replace(/\b(const|laptop)\b/g, '<i class=k>$1</i>')
      .replace(/(\/\/.*)/g, '<i class=c>$1</i>');
  }
  function type() {
    ci++; out.innerHTML = hl(CODE.slice(0, ci)) + '<b class="cu"></b>';
    var d = 38; if (ci >= CODE.length) { ci = 0; d = 4200; }
    setTimeout(type, d);
  }
  if (nm()) { out.innerHTML = hl(CODE) + '<b class="cu"></b>'; } else { type(); }

  /* scroll choreography */
  var pos = $('pos'), lap = $('lap'), lid = $('lid'), bob = $('bob'), scene = $('scene');
  var secs = [].slice.call(document.querySelectorAll('main>section'));
  var c = {x: 0, y: 0, ry: -24, rx: -16, s: 1, o: -90, lo: 0}, mx = 0, my = 0;
  function ss(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }
  function U() {  /* fractional index of the section in the middle of the screen */
    var y = window.scrollY + innerHeight * 0.5, i = 0, k;
    for (k = 0; k < secs.length; k++) if (secs[k].offsetTop <= y) i = k;
    var a = secs[i].offsetTop, b = i < secs.length - 1 ? secs[i + 1].offsetTop : a + secs[i].offsetHeight;
    return i + Math.min(1, (y - a) / Math.max(1, b - a));
  }
  function side(i) { return i % 2 === 0 ? 1 : -1; }  /* laptop stays opposite the open panel */
  function T() {
    var u = U(), m = innerWidth < 900, k = Math.min(1, innerWidth / 1400);
    var s = Math.floor(u), f = u - s, w = ss((f - 0.7) / 0.3);          /* travel during the last 30% of a section */
    var sd = side(s) * (1 - w) + side(s + 1) * w;
    return {
      x: m ? 0 : 25 * sd,
      y: m ? -4 : 5 + 3 * Math.sin(u * 1.3),
      ry: -24 * sd + 180 * (1 - ss((u - 1.0) / 1.0)) + 360 * ss((u - 3.6) / 0.8),   /* arrives back-first, then turns to show the screen */
      rx: -(14 + 5 * Math.sin(u * 2)),
      s: (m ? 0.52 : 1 + 0.06 * Math.sin(u * Math.PI)) * k * 0.86,
      o: 8,
      lo: (m ? 0.55 : 1) * ss((u - 0.8) / 0.4)
    };
  }
  function draw() {
    pos.style.transform = 'translate(-50%,-50%) translate(' + c.x + 'vw,' + c.y + 'vh) scale(' + c.s + ')';
    lap.style.transform = 'rotateX(' + (c.rx + my * -5) + 'deg) rotateY(' + (c.ry + mx * 8) + 'deg)';
    lid.style.transform = 'rotateX(' + c.o + 'deg)';
    lid.style.setProperty('--gx', (50 + c.ry * 1.4 + mx * 30) + '%');
    scene.style.opacity = c.lo;
  }
  function loop(t) {
    var q = T();
    if (!nm() && R.classList.contains('go')) {
      for (var p in q) c[p] += (q[p] - c[p]) * (p === 'o' ? 0.045 : 0.08);
      bob.style.transform = 'translateY(' + Math.sin(t / 900) * 14 + 'px)';
    } else { c.lo = q.lo; c.o = 8; bob.style.transform = 'none'; }
    draw(); requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; });
})();
