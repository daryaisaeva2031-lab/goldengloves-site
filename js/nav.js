(function () {
  function nav() {
    return document.querySelector('header nav') || document.querySelector('nav');
  }
  function burger() {
    return document.querySelector('.burger');
  }
  function close() {
    var n = nav();
    if (n) n.classList.remove('open');
  }
  document.addEventListener('pointerdown', function (e) {
    var n = nav();
    if (!n || !n.classList.contains('open')) return;
    var b = burger();
    if (n.contains(e.target) || (b && b.contains(e.target))) return;
    close();
  });
  document.addEventListener('click', function (e) {
    var n = nav();
    if (!n || !n.classList.contains('open')) return;
    if (e.target.closest && e.target.closest('nav a')) close();
  });
})();
