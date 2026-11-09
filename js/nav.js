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

(function () {
  var CERT = 'gg-cert-pending', PAY = 'gg-pay-pending';
  function read(key) {
    try {
      var n = localStorage.getItem(key);
      return n && (Date.now() - Number(n) < 36e5) ? n : null;
    } catch (e) { return null; }
  }
  function page() {
    return (location.pathname.split('/').pop() || 'index.html');
  }
  function show() {
    if (document.getElementById('gg-paid-note')) return;
    var pg = page();
    if (pg === 'certificate.html' || pg === 'pay.html') return;
    var cert = read(CERT), pay = read(PAY);
    if (!cert && !pay) return;
    var text = cert
      ? 'Если оплата прошла — спасибо, всё в порядке. Сертификат придёт на email после подтверждения менеджера.'
      : 'Если оплата прошла — спасибо, всё в порядке. Чек придёт на email.';
    var note = document.createElement('div');
    note.id = 'gg-paid-note';
    note.setAttribute('role', 'status');
    note.innerHTML = '<div class="w" style="max-width:720px;padding-top:18px"><div class="card" style="text-align:center;padding:18px 20px"><p style="margin:0 0 12px;font-size:18px;color:var(--g1);line-height:1.45">' + text + '</p><button type="button" class="btn o" id="gg-paid-note-x">Закрыть</button></div></div>';
    var header = document.querySelector('header');
    if (header && header.parentNode) header.parentNode.insertBefore(note, header.nextSibling);
    else document.body.insertBefore(note, document.body.firstChild);
    var x = document.getElementById('gg-paid-note-x');
    if (x) x.onclick = function () {
      try {
        if (cert) localStorage.removeItem(CERT);
        if (pay) localStorage.removeItem(PAY);
      } catch (e) {}
      note.remove();
    };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
  addEventListener('pageshow', show);
  addEventListener('storage', function (e) {
    if (e.key === CERT || e.key === PAY) show();
  });
})();
