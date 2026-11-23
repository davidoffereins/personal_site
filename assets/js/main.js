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
