/* Dot-particle portrait.
   Turns the black-and-white photo (window.PORTRAIT) into thousands of dots that fly in
   and assemble on load, push away from the mouse, and scatter as you scroll past the hero. */
(function () {
  'use strict';
  var R = document.documentElement, cv = document.getElementById('cv'), cx = cv.getContext('2d');
  var img = new Image(), P = [], B = [[], [], [], [], [], [], []];
  var COLS = 112, rows = 0, dpr = 1, CW = 0, CH = 0, box = {x: 0, y: 0, w: 0, h: 0, cell: 1};
  var t0 = null, mx = -9999, my = -9999, dirty = true, RAD = 74, accRGB = '165,179,84';
  function readAcc() { var v = getComputedStyle(R).getPropertyValue('--acc-rgb').trim(); if (v) accRGB = v; }
  readAcc();

  function nm() { return R.classList.contains('nm'); }
  function ss(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

  function layout() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    CW = cv.clientWidth; CH = cv.clientHeight;
    cv.width = CW * dpr; cv.height = CH * dpr;
    var ar = img.width / img.height;
    var h = Math.min(CH * 0.78, 840), w = h * ar;
    if (w > CW * 1.15) { w = CW * 1.15; h = w / ar; }
    box.w = w; box.h = h; box.x = (CW - w) / 2; box.y = 44; box.cell = w / COLS;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      p.tx = box.x + p.u * box.w; p.ty = box.y + p.v * box.h;
      p.r = box.cell * (0.13 + 0.4 * p.l);
    }
    dirty = true;
  }

  img.onload = function () {
    rows = Math.round(COLS * img.height / img.width);
    var o = document.createElement('canvas'); o.width = COLS; o.height = rows;
    var oc = o.getContext('2d'); oc.drawImage(img, 0, 0, COLS, rows);
    var d = oc.getImageData(0, 0, COLS, rows).data;
    for (var j = 0; j < rows; j++) {
      for (var i = 0; i < COLS; i++) {
        var k = (j * COLS + i) * 4, r = d[k], g = d[k + 1], b = d[k + 2], l = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
        if (l < 0.09) continue;
        var org = r > g * 1.3 + 25 && r > 90;
        var p = {
          u: (i + 0.5) / COLS, v: (j + 0.5) / rows, l: l,
          sx: Math.random(), sy: Math.random(), dl: (j / rows) * 0.9 + Math.random() * 0.6,
          rx: (Math.random() - 0.5) * 520, ry: -Math.random() * 520 - 60, ph: Math.random() * 6.28,
          ox: 0, oy: 0, vx: 0, vy: 0, x: 0, y: 0, tx: 0, ty: 0, r: 1
        };
        P.push(p);
        B[org ? 6 : Math.min(5, Math.floor(l * 6))].push(p);
      }
    }
    layout();
  };
  img.src = window.PORTRAIT;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!P.length || !CW) return;
    var still = nm();
    if (!still && !R.classList.contains('go')) return;
    if (t0 === null) t0 = still ? -1e8 : now;
    if (still && !dirty) return;
    dirty = false;
    var t = (now - t0) / 1000, sc = ss(window.scrollY / (CH * 0.9)), RR = RAD * RAD, i, p;
    for (i = 0; i < P.length; i++) {
      p = P[i];
      var k = Math.min(1, Math.max(0, (t - p.dl) / 1.8)); k = 1 - Math.pow(1 - k, 3);
      var sx = p.sx * CW, sy = p.sy * CH;
      var x = sx + (p.tx - sx) * k, y = sy + (p.ty - sy) * k;
      if (!still) {
        x += Math.sin(t * 1.1 + p.ph) * 0.4; y += Math.cos(t * 0.9 + p.ph) * 0.4;
        var dx = x + p.ox - mx, dy = y + p.oy - my, dd = dx * dx + dy * dy;
        if (dd < RR) { var f = (1 - Math.sqrt(dd) / RAD) * 5, a = Math.atan2(dy, dx); p.vx += Math.cos(a) * f; p.vy += Math.sin(a) * f; }
        p.vx += -p.ox * 0.07; p.vy += -p.oy * 0.07; p.vx *= 0.86; p.vy *= 0.86; p.ox += p.vx; p.oy += p.vy;
      }
      p.x = x + p.ox + p.rx * sc; p.y = y + p.oy + p.ry * sc;
    }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, CW, CH);
    var light = R.dataset.theme === 'light', fade = 1 - 0.9 * sc;
    for (var b = 0; b < 7; b++) {
      var list = B[b]; if (!list.length) continue;
      cx.beginPath();
      for (i = 0; i < list.length; i++) { p = list[i]; cx.moveTo(p.x + p.r, p.y); cx.arc(p.x, p.y, p.r, 0, 6.2832); }
      var al = b === 6 ? 0.95 : 0.3 + 0.7 * (b / 5);
      cx.fillStyle = b === 6 ? 'rgba(' + accRGB + ',' + al * fade + ')' : (light ? 'rgba(20,19,22,' : 'rgba(243,239,232,') + al * fade + ')';
      cx.fill();
    }
  }
  requestAnimationFrame(frame);

  var hero = document.getElementById('hero');
  hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  hero.addEventListener('pointerleave', function () { mx = my = -9999; });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (img.width) layout(); }, 150); });
  window.addEventListener('scroll', function () { dirty = true; }, {passive: true});
  new MutationObserver(function () { readAcc(); dirty = true; }).observe(R, {attributes: true, attributeFilter: ['data-theme', 'class']});
})();
