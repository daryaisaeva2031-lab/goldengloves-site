(function () {
  function nav() {
    return document.querySelector('header nav') || document.querySelector('nav');
  }
  function burger() {
    return document.querySelector('.burger');
  }
  function sync() {
    var n = nav();
    if (n && n.classList.contains('open')) document.documentElement.classList.add('nav-open');
    else document.documentElement.classList.remove('nav-open');
  }
  function close() {
    var n = nav();
    if (n) n.classList.remove('open');
    document.documentElement.classList.remove('nav-open');
  }
  function insideMenu(target) {
    var t = target;
    if (t && t.nodeType === 3) t = t.parentNode;
    if (!t || !t.closest) return false;
    var n = nav();
    var b = burger();
    return (n && n.contains(t)) || (b && b.contains(t));
  }
  function onOutside(e) {
    var n = nav();
    if (!n || !n.classList.contains('open')) return;
    if (insideMenu(e.target)) return;
    close();
  }
  document.addEventListener('pointerdown', onOutside, true);
  document.addEventListener('touchstart', onOutside, { capture: true, passive: true });
  document.addEventListener('click', function (e) {
    var n = nav();
    if (!n || !n.classList.contains('open')) return;
    if (e.target.closest && e.target.closest('nav a')) {
      close();
      return;
    }
    if (!insideMenu(e.target)) close();
  }, true);
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.burger')) setTimeout(sync, 0);
  });
  var n = nav();
  if (n && window.MutationObserver) {
    new MutationObserver(sync).observe(n, { attributes: true, attributeFilter: ['class'] });
  }
  sync();
})();
