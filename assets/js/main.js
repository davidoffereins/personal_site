document.documentElement.classList.add('js');

// Mobiel menu: pagina niet laten scrollen als het menu open staat
var toggle = document.getElementById('menu-toggle');
if (toggle) {
  toggle.addEventListener('change', function () {
    document.body.style.overflow = toggle.checked ? 'hidden' : 'auto';
  });
}

// Echte schermhoogte op telefoons
function setVh() {
  document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
}
setVh();
window.addEventListener('resize', setVh);

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Beelden en blokken rustig laten binnenkomen bij scrollen
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach(function (el) { io.observe(el); });
})();

// Pixelraster over de achtergrond: een traag bewegend, gedithered patroon
(function () {
  var c = document.querySelector('canvas.dither');
  if (!c) return;
  var ctx = c.getContext('2d');
  var CELL = 5; // grootte van een 'pixel' op het scherm
  var bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var w, h, img;
  function size() {
    w = Math.ceil(window.innerWidth / CELL);
    h = Math.ceil(window.innerHeight / CELL);
    c.width = w; c.height = h;
    img = ctx.createImageData(w, h);
  }
  function draw(t) {
    var d = img.data, i = 0, s = t * 0.00006;
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var u = x / w, v = y / h;
        // twee trage golven die door elkaar heen schuiven
        var a = Math.sin((u * 2.2 + v * 1.3) * 3.1 + s * 5) * 0.5 + 0.5;
        var b = Math.sin((u * 1.1 - v * 2.4) * 2.3 - s * 3.3 + 1.7) * 0.5 + 0.5;
        var val = a * 0.6 + b * 0.4;
        var th = (bayer[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
        var light = val > 0.5;
        var m = light ? (val - 0.5) * 2 : (0.5 - val) * 2; // sterkte 0..1
        var on = m > th;
        d[i] = d[i + 1] = d[i + 2] = light ? 255 : 0;
        d[i + 3] = on ? 150 : 0;
        i += 4;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  size();
  draw(performance.now() + 40000);
  window.addEventListener('resize', function () { size(); draw(performance.now()); });
  if (reduceMotion) return;
  var last = 0;
  function loop(t) {
    if (t - last > 90 && !document.hidden) { draw(t + 40000); last = t; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// Workbench: een zoekvraag die zichzelf typt
(function () {
  var el = document.querySelector('.query-text');
  if (!el || reduceMotion) return;
  var list;
  try { list = JSON.parse(el.getAttribute('data-queries')); } catch (e) { return; }
  var q = 0, n = list[0].length, dir = -1, wait = 40;
  setInterval(function () {
    if (wait > 0) { wait--; return; }
    n += dir;
    el.textContent = list[q].slice(0, n);
    if (n === 0) { q = (q + 1) % list.length; dir = 1; wait = 6; }
    else if (n === list[q].length && dir === 1) { dir = -1; wait = 45; }
  }, 55);
})();

// Het 3D-verhaal: beelden wisselen vanzelf, of met een klik op het bijschrift
(function () {
  var s = document.querySelector('[data-story]');
  if (!s) return;
  var frames = s.querySelectorAll('.story-frame');
  var caps = s.querySelectorAll('.story-captions li');
  var i = 0, timer;
  function show(n) {
    i = n;
    frames.forEach(function (f, k) { f.classList.toggle('on', k === n); });
    caps.forEach(function (c, k) { c.classList.toggle('on', k === n); });
  }
  function start() {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(function () { show((i + 1) % frames.length); }, 4200);
  }
  caps.forEach(function (c, k) {
    c.querySelector('button').addEventListener('click', function () { show(k); start(); });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) start(); else clearInterval(timer);
    }, { threshold: 0.3 }).observe(s);
  } else { start(); }
})();
