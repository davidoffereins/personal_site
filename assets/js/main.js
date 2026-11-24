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
