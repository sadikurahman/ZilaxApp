/* Zilax — delivery location: header sheet (Foodpanda-style), GPS, map picker (OpenStreetMap + Leaflet), reverse geocoding. */
(function () {
  var A = ZX.auth, $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var S = function (p) { return '<svg viewBox="0 0 24 24">' + p + '</svg>'; };
  ZX.ico.l_nav = S('<path d="M3 11l18-8-8 18-2-8-8-2z"/>');
  ZX.ico.l_pin = '<svg viewBox="0 0 24 32"><path d="M12 31S2 20.500 2 12a10 10 0 0 1 20 0c0 8.500-10 19-10 19z" fill="#0D5C3A"/><circle cx="12" cy="12" r="4" fill="#fff"/></svg>';
  ZX.ico.l_map = S('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>');
  ZX.ico.l_down = S('<path d="M6 9l6 6 6-6"/>');
  var T = {
    title: { en: 'Where should we deliver your order?', bn: 'আপনার অর্ডার কোথায় পৌঁছাব?' }, gps: { en: 'Use my current location', bn: 'আমার বর্তমান লোকেশন নিন' },
    find: { en: 'Finding your location…', bn: 'লোকেশন খোঁজা হচ্ছে…' }, no: { en: 'Could not get location. Allow location access for your browser and try again.', bn: 'লোকেশন পাওয়া যায়নি। ব্রাউজারে লোকেশনের অনুমতি দিয়ে আবার চেষ্টা করুন।' },
    add: { en: 'Add a new address', bn: 'নতুন ঠিকানা যোগ করুন' }, cur: { en: 'Current location', bn: 'বর্তমান লোকেশন' }, set: { en: 'Delivery location updated', bn: 'ডেলিভারি লোকেশন বদলানো হয়েছে' },
    login: { en: 'Log in to use your saved addresses', bn: 'সেভ করা ঠিকানা ব্যবহার করতে লগইন করুন' }, edit: { en: 'Edit', bn: 'এডিট' },
    Home: { en: 'Home', bn: 'বাসা' }, Office: { en: 'Office', bn: 'অফিস' }, Other: { en: 'Other', bn: 'অন্যান্য' },
    mapT: { en: 'Choose on map', bn: 'ম্যাপে বাছুন' }, ok: { en: 'Confirm location', bn: 'লোকেশন নিশ্চিত করুন' }, move: { en: 'Move the map to place the pin', bn: 'পিন ঠিক জায়গায় আনতে ম্যাপ সরান' },
    mapLoad: { en: 'Loading map…', bn: 'ম্যাপ লোড হচ্ছে…' }, mapFail: { en: 'Could not load the map. Check your internet and try again.', bn: 'ম্যাপ লোড হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।' }, finding: { en: 'Finding address…', bn: 'ঠিকানা খোঁজা হচ্ছে…' }
  };
  var t = function (k) { return ZX.t(T[k]); };
  var cur = ZX.store.get('zx_loc', null);

  /* ---- header text ---- */
  function locText() {
    if (!cur) return null;
    if (cur.kind === 'gps') return cur.place || t('cur');
    var an = cur.an ? ZX.t(cur.an) : ''; return ZX.t(T[cur.label] || T.Other) + (an ? ' · ' + an : '');
  }
  function setLocText() { var e = $('areaTxt'), s = locText(); if (e && s) e.textContent = s; }
  function save(v) { cur = v; ZX.store.set('zx_loc', v); setLocText(); }
  var box = document.querySelector('.loc');
  if (box && !box.querySelector('.locdd')) { var dd = document.createElement('span'); dd.className = 'locdd'; dd.innerHTML = ZX.ico.l_down; box.appendChild(dd); box.setAttribute('role', 'button'); }

  /* ---- GPS + reverse geocoding ---- */
  ZX.reverseGeocode = function (lat, lng) {
    var u = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=' + ZX.lang + '&lat=' + lat + '&lon=' + lng;
    return fetch(u).then(function (r) { return r.json(); }).then(function (j) {
      var a = j.address || {}, area = a.suburb || a.neighbourhood || a.village || a.hamlet || a.quarter || a.city_district || '', town = a.city || a.town || a.municipality || a.county || a.state_district || '';
      var short = [area, town].filter(Boolean).join(', ') || (j.display_name || '').split(',').slice(0, 2).join(',').trim();
      var line = [a.house_number, a.road, area].filter(Boolean).join(', ') || short;
      return { short: short, line: line };
    }).catch(function () { return null; });
  };
  function getPos(ok, fail) {
    if (!navigator.geolocation) { fail(); return; }
    navigator.geolocation.getCurrentPosition(function (p) { ok(Math.round(p.coords.latitude * 1e6) / 1e6, Math.round(p.coords.longitude * 1e6) / 1e6); }, fail, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  }

  /* ---- bottom sheet ---- */
  var sh = document.createElement('div'); sh.className = 'sheet'; sh.id = 'locSheet'; sh.innerHTML = '<div class="pan" id="locPan"></div>'; document.body.appendChild(sh);
  sh.addEventListener('click', function (e) { if (e.target === sh) sh.classList.remove('show'); });
  var lstate = { list: [], areas: [] };
  function an2(a) {
    var f = function (id, k) { var x = lstate.areas.filter(function (r) { return r.id === id; })[0]; return x ? x['name_' + k] : ''; };
    var one = function (k) { return [f(a.union_id, k), f(a.upazila_id, k)].filter(Boolean).join(', '); };
    return { en: one('en'), bn: one('bn') };
  }
  async function renderSheet(msg) {
    var pan = $('locPan'), me = A.me(), h = '<div class="lsgrip"></div><h3>' + t('title') + '</h3>';
    h += '<button class="lsrow lsgps" type="button" data-ls="gps"><span class="lsi">' + ZX.ico.l_nav + '</span><b>' + t('gps') + '</b></button>' + (msg ? '<div class="lsmsg">' + esc(msg) + '</div>' : '');
    pan.innerHTML = h + '<div class="lsrest"></div>';
    var rest = '';
    if (ZX.live && me.user) {
      try { lstate.list = await A.listAddresses(); lstate.areas = await A.areas(); } catch (e) { lstate.list = []; }
      if (cur && cur.kind === 'addr' && !lstate.list.some(function (a) { return a.id === cur.id; })) { cur = null; ZX.store.set('zx_loc', null); }
      var sel = cur && cur.kind === 'addr' ? cur.id : (!cur ? (lstate.list.filter(function (a) { return a.is_default; })[0] || {}).id : null);
      lstate.list.forEach(function (a) {
        var an = ZX.t(an2(a));
        rest += '<div class="lsaddr' + (a.id === sel ? ' on' : '') + '" data-ls="pick:' + a.id + '"><span class="lsrad"></span><div class="lst"><b>' + ZX.t(T[a.label] || T.Other) + '</b><span>' + esc(a.line) + (an ? ' · ' + esc(an) : '') + '</span></div>' +
          '<button class="lsed" type="button" data-ls="edit:' + a.id + '" aria-label="' + t('edit') + '">' + ZX.ico.a_pencil + '</button></div>';
      });
      rest += '<button class="lsrow" type="button" data-ls="add"><span class="lsi">' + ZX.ico.a_plus + '</span><b>' + t('add') + '</b></button>';
    } else rest += '<button class="lsrow" type="button" data-go="login"><span class="lsi">' + ZX.ico.a_user + '</span><b>' + t('login') + '</b></button>';
    var r = pan.querySelector('.lsrest'); if (r) r.innerHTML = rest;
  }
  function openSheet() { sh.classList.add('show'); renderSheet(); }
  function useGps() {
    var b = document.querySelector('.lsgps b'); if (b) b.textContent = t('find');
    getPos(function (lat, lng) {
      save({ kind: 'gps', lat: lat, lng: lng, place: '' }); sh.classList.remove('show'); ZX.toast(t('set'));
      ZX.reverseGeocode(lat, lng).then(function (g) { if (g && g.short && cur && cur.kind === 'gps' && cur.lat === lat) { cur.place = g.short; save(cur); } });
    }, function () { renderSheet(t('no')); });
  }
  document.addEventListener('click', function (e) {
    var l = e.target.closest('.loc'); if (l && !e.target.closest('#locSheet')) { openSheet(); return; }
    var x = e.target.closest('[data-ls]'); if (!x) return;
    var p = x.getAttribute('data-ls').split(':'), id = p[1];
    if (p[0] === 'gps') return useGps();
    if (p[0] === 'add') { sh.classList.remove('show'); return ZX.addrOpen && ZX.addrOpen(); }
    if (p[0] === 'edit') { e.stopPropagation(); sh.classList.remove('show'); return ZX.addrOpen && ZX.addrOpen(id); }
    if (p[0] === 'pick') {
      var a = lstate.list.filter(function (r) { return r.id === id; })[0]; if (!a) return;
      save({ kind: 'addr', id: a.id, label: a.label, line: a.line, lat: a.lat, lng: a.lng, an: an2(a) }); sh.classList.remove('show'); ZX.toast(t('set'));
    }
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-go="login"]') && sh.classList.contains('show')) sh.classList.remove('show'); }, true);

  /* ---- map picker ---- */
  var DEF = [25.0807, 89.9296], map = null, cb = null, mapTimer = null, mv = null;
  function loadLeaflet() {
    return new Promise(function (res, rej) {
      if (window.L) return res();
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'; document.head.appendChild(l);
      var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function mapAddr() {
    var c = map.getCenter(), el = $('mapAddr'); if (el) el.textContent = t('finding');
    ZX.reverseGeocode(c.lat, c.lng).then(function (g) { var e2 = $('mapAddr'); if (e2) { e2.textContent = (g && g.line) || t('move'); mv.line = g ? g.line : ''; } });
  }
  ZX.pickOnMap = function (init, done) {
    cb = done; mv = { line: '' };
    var o = $('mapv'); if (o) o.remove();
    o = document.createElement('div'); o.id = 'mapv'; o.className = 'mapv';
    o.innerHTML = '<div id="mapcv"></div><div class="mappin">' + ZX.ico.l_pin + '</div>' +
      '<div class="mapbar"><button type="button" data-mp="back" aria-label="Back">' + ZX.ico.back + '</button><h2>' + t('mapT') + '</h2></div>' +
      '<button class="mapme" type="button" data-mp="me" aria-label="' + t('gps') + '">' + ZX.ico.l_nav + '</button>' +
      '<div class="mapcard"><p id="mapAddr">' + t('mapLoad') + '</p><button class="cta-big" type="button" data-mp="ok">' + t('ok') + '</button></div>';
    document.body.appendChild(o);
    loadLeaflet().then(function () {
      var has = init && init.lat != null, c = has ? [init.lat, init.lng] : DEF;
      map = L.map('mapcv', { zoomControl: false }).setView(c, has ? 18 : 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
      map.on('moveend', function () { clearTimeout(mapTimer); mapTimer = setTimeout(mapAddr, 500); });
      mapAddr();
      if (!has) getPos(function (lat, lng) { if (map) map.setView([lat, lng], 18); }, function () {});
    }).catch(function () { var e = $('mapAddr'); if (e) e.textContent = t('mapFail'); });
  };
  function closeMap() { clearTimeout(mapTimer); if (map && map.remove) map.remove(); map = null; var o = $('mapv'); if (o) o.remove(); }
  document.addEventListener('click', function (e) {
    var x = e.target.closest('[data-mp]'); if (!x) return; var k = x.getAttribute('data-mp');
    if (k === 'back') return closeMap();
    if (k === 'me') return getPos(function (lat, lng) { if (map) map.setView([lat, lng], 18); }, function () { var el = $('mapAddr'); if (el) el.textContent = t('no'); });
    if (k === 'ok' && map) { var c = map.getCenter(), r = { lat: Math.round(c.lat * 1e6) / 1e6, lng: Math.round(c.lng * 1e6) / 1e6, line: mv.line || '' }; closeMap(); if (cb) cb(r); }
  });

  /* ---- keep header in sync ---- */
  var pl = ZX.onLang; ZX.onLang = function () { if (pl) pl(); setLocText(); if (sh.classList.contains('show')) renderSheet(); };
  A.onChange(function () { var me = A.me(); if (!me.user && cur && cur.kind === 'addr') { cur = null; ZX.store.set('zx_loc', null); } if (me.user === null || me.user) setLocText(); });
  setLocText();
})();
