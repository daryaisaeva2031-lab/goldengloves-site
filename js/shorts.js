// Блок «Жизнь клуба»: последние Shorts с канала клуба через api.goldengloves59.ru/api/shorts
(function () {
  var FALLBACK = [
    { id: 'ed7J9n26SDg', title: 'Работа на мешке 🥊' },
    { id: 'LsJFtEqk4Ss', title: 'Вечерняя тренировка' },
    { id: '8prjVRO9W-k', title: 'Детский бокс: работаем в ринге' },
    { id: 'nupSFXN5qFM', title: 'Почему выбирают бокс?' },
    { id: 'sjTSA0A1vEE', title: 'Спарринг' },
    { id: 'D2elLK0eHyY', title: 'Тренировка по боксу для взрослых' }
  ].map(function (x) {
    return { id: x.id, title: x.title, url: 'https://www.youtube.com/shorts/' + x.id, thumb: 'https://i.ytimg.com/vi/' + x.id + '/hqdefault.jpg' };
  });

  var el = document.getElementById('shorts');
  if (!el) return;

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function cleanTitle(t) {
    return String(t || '').replace(/#shorts?/gi, '').replace(/\s+/g, ' ').trim();
  }

  function render(items) {
    el.innerHTML = items.slice(0, 8).map(function (it) {
      var t = cleanTitle(it.title);
      var thumb = it.thumb || ('https://i.ytimg.com/vi/' + it.id + '/hqdefault.jpg');
      return '<button type="button" class="scard card" data-id="' + esc(it.id) + '" aria-label="' + esc(t) + '">' +
        '<div class="sthumb" style="background-image:url(' + esc(thumb) + ')">' +
        '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></div>' +
        '<span class="st">' + esc(t) + '</span></button>';
    }).join('');

    el.querySelectorAll('.scard').forEach(function (card) {
      card.addEventListener('click', function () {
        if (card.classList.contains('playing')) return;
        el.querySelectorAll('.scard.playing').forEach(function (c) {
          c.classList.remove('playing');
          var th = c.querySelector('.sthumb');
          if (!th) return;
          var bg = th.style.backgroundImage;
          th.innerHTML = '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>';
          th.style.backgroundImage = bg;
        });
        card.classList.add('playing');
        var thumb = card.querySelector('.sthumb');
        thumb.style.backgroundImage = 'none';
        thumb.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(card.dataset.id) +
          '?autoplay=1&playsinline=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="Видео"></iframe>';
      });
    });
  }

  var bases = [window.API_BASE || 'https://api.goldengloves59.ru', window.API_ALT || 'https://goldengloves-api.goldengloves59.workers.dev'];
  (async function () {
    for (var i = 0; i < bases.length; i++) {
      try {
        var r = await fetch(bases[i] + '/api/shorts');
        if (!r.ok) continue;
        var j = await r.json();
        if (j && j.items && j.items.length) { render(j.items); return; }
      } catch (e) { /* try next */ }
    }
    render(FALLBACK);
  })();
})();
