// Блок «Жизнь клуба»: на главной только 2 последних Shorts, остальные — на YouTube
(function () {
  var LIMIT = 2;
  var FALLBACK = [
    { id: 'ed7J9n26SDg', title: 'Работа на мешке 🥊' },
    { id: 'LsJFtEqk4Ss', title: 'Вечерняя тренировка' }
  ].map(function (x) {
    return { id: x.id, title: x.title, url: 'https://www.youtube.com/shorts/' + x.id, thumb: 'https://i.ytimg.com/vi/' + x.id + '/mqdefault.jpg' };
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
    var playing = el.querySelector('.scard.playing');
    if (playing) return;
    el.innerHTML = items.slice(0, LIMIT).map(function (it) {
      var t = cleanTitle(it.title);
      var thumb = it.thumb || ('https://i.ytimg.com/vi/' + it.id + '/mqdefault.jpg');
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

  function load(url, ms) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, ms || 2500);
    return fetch(url, { signal: ctrl.signal }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) throw new Error('http');
      return r.json();
    }, function (e) {
      clearTimeout(t);
      throw e;
    });
  }

  render(FALLBACK);

  var bases = [window.API_BASE || 'https://api.goldengloves59.ru', window.API_ALT || 'https://goldengloves-api.goldengloves59.workers.dev'];
  (async function () {
    for (var i = 0; i < bases.length; i++) {
      try {
        var j = await load(bases[i] + '/api/shorts', 2500);
        if (j && j.items && j.items.length) { render(j.items); return; }
      } catch (e) { /* try next */ }
    }
  })();
})();
