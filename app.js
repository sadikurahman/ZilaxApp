/* Zilax — Stage 0 home app (mock data), Pathao-style layout. Stage 1 connects Supabase. */
(function () {
  var D = ZX.data;
  var S = function (p) { return '<svg viewBox="0 0 24 24">' + p + '</svg>'; };
  var extraIco = {
    tag: S('<path d="M20 12l-8 8-9-9V4h7z"/><circle cx="7.5" cy="7.5" r="1.3"/>'),
    list: S('<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>'),
    mail: S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    pin: S('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>'),
    check: S('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    back: S('<path d="M15 5l-7 7 7 7"/>'),
    gift: S('<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M12 9v11M3 13h18M12 9c-3 0-4.5-4 -1.5-4 2 0 1.5 4 1.5 4zm0 0c3 0 4.5-4 1.5-4-2 0-1.5 4-1.5 4z"/>'),
    box: S('<path d="M3 8l9-5 9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>')
  };
  for (var ik in extraIco) ZX.ico[ik] = extraIco[ik];

  var extra = {
    comingTitle: { en: 'Coming soon', bn: 'শীঘ্রই আসছে' },
    shopSub: { en: 'Daily essentials, clothes & more', bn: 'দৈনন্দিন প্রয়োজন, পোশাক ও আরও অনেক কিছু' },
    foodSub: { en: 'Kitchens near you, delivered fast', bn: 'আপনার কাছের কিচেন, দ্রুত ডেলিভারি' },
    serviceSub: { en: 'Verified technicians and event services', bn: 'যাচাইকৃত টেকনিশিয়ান ও ইভেন্ট সার্ভিস' },
    accSub: { en: 'Your profile, orders and partner access', bn: 'আপনার প্রোফাইল, অর্ডার ও পার্টনার প্রবেশ' },
    joinT: { en: 'Join as Partner', bn: 'পার্টনার হিসেবে যোগ দিন' },
    joinS: { en: 'Merchant, shop, rider, technician & more', bn: 'মার্চেন্ট, শপ, রাইডার, টেকনিশিয়ান ও আরও' },
    joinHint: { en: 'Choose what you do. Each type has its own form.', bn: 'আপনি কী করেন বাছাই করুন। প্রতিটির আলাদা ফর্ম আছে।' },
    loginT: { en: 'Log in / Sign up', bn: 'লগইন / সাইন আপ' }, loginS: { en: 'Phone number + OTP', bn: 'মোবাইল নম্বর + ওটিপি' },
    panelsT: { en: 'Demo panels', bn: 'ডেমো প্যানেল' }, panelsS: { en: 'Layout previews of the five staff and partner panels', bn: 'পাঁচটি স্টাফ ও পার্টনার প্যানেলের কাঠামো' },
    checksT: { en: 'Money rule checks', bn: 'হিসাবের পরীক্ষা' }, checksS: { en: 'Delivery charge and commission examples', bn: 'ডেলিভারি চার্জ ও কমিশনের উদাহরণ' },
    quick: { en: 'Quick actions', bn: 'দ্রুত অ্যাকশন' },
    deliv: { en: 'Your deliveries', bn: 'আপনার ডেলিভারি' },
    rate: { en: 'Rate your delivery experience', bn: 'ডেলিভারির অভিজ্ঞতা জানান' },
    orderFrom: { en: 'Order from: Royal Kitchen', bn: 'অর্ডার: রয়্যাল কিচেন' },
    nOffers: { en: 'Offers', bn: 'অফার' }, nActivity: { en: 'Activity', bn: 'অ্যাক্টিভিটি' }, nInbox: { en: 'Inbox', bn: 'ইনবক্স' },
    offers: { en: 'Zilax Spotlight', bn: 'জিলাক্স স্পটলাইট' },
    noOrders: { en: 'No orders yet', bn: 'এখনো কোনো অর্ডার নেই' }, noOrdersS: { en: 'Your orders and bookings will show here.', bn: 'আপনার অর্ডার ও বুকিং এখানে দেখা যাবে।' },
    noteTxt: { en: 'Free delivery on your first food order', bn: 'প্রথম ফুড অর্ডারে ফ্রি ডেলিভারি' }, noteCta: { en: 'Order now', bn: 'অর্ডার করুন' }
  };
  for (var k in extra) ZX.dict[k] = extra[k];

  var $ = function (id) { return document.getElementById(id); };
  var cart = ZX.store.get('zx_cart', {});
  var outMap = ZX.store.get('zx_out', {});
  D.items.forEach(function (i) { i.out = !!outMap[i.id]; });
  var tab = 'home';

  function photo(el, img, grad) {
    if (grad) el.style.background = grad;
    if (!img) return; var im = new Image();
    im.onload = function () { el.style.backgroundImage = 'url("' + img + '")'; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; var e = el.querySelector('.emo,.em'); if (e) e.style.display = 'none'; };
    im.src = img;
  }
  function arrows() { document.querySelectorAll('.ar').forEach(function (e) { e.innerHTML = ZX.ico.arrowR; }); document.querySelectorAll('.bk').forEach(function (e) { e.innerHTML = ZX.ico.back; }); }

  function renderHeader() {
    $('areaTxt').textContent = ZX.t(D.area) + ', Jamalpur'.replace('Jamalpur', ZX.lang === 'bn' ? 'জামালপুর' : 'Jamalpur');
    $('cartIco').innerHTML = ZX.ico.cart; $('siIco').innerHTML = ZX.ico.search; $('filterBtn').innerHTML = ZX.ico.filter;
    $('trustIco').innerHTML = ZX.ico.shield; $('avIco').innerHTML = ZX.ico.user; $('locIco').innerHTML = ZX.ico.pin; $('delIco').innerHTML = ZX.ico.box;
    $('lEn').classList.toggle('on', ZX.lang === 'en'); $('lBn').classList.toggle('on', ZX.lang === 'bn');
    $('delFrom').textContent = ZX.d('orderFrom');
    $('note').innerHTML = '<i>' + ZX.ico.gift + '</i><span>' + ZX.d('noteTxt') + '</span><b data-link="#food">' + ZX.d('noteCta') + '<span class="ar"></span></b>';
    updateBadge();
  }
  function renderHeroes() {
    $('heroes').innerHTML = D.banners.map(function (b) {
      return '<div class="hero ' + (b.id === 'b2' ? 'tech' : '') + '" data-link="' + b.link + '"><div class="bg" data-bg="' + b.id + '"></div><div class="em">' + b.emoji + '</div>' +
        '<div class="tag">' + ZX.t(b.tag) + '</div><h2>' + ZX.t(b.title) + '</h2>' + (ZX.t(b.sub) ? '<div class="sub">' + ZX.t(b.sub) + '</div>' : '') +
        (b.badge ? '<div class="badge">' + b.badge + '</div>' : '') + '<button class="cta ' + b.ctaStyle + '" type="button">' + ZX.t(b.cta) + '</button></div>';
    }).join('');
    D.banners.forEach(function (b) { photo(document.querySelector('[data-bg="' + b.id + '"]'), b.img, b.grad); });
    $('heroDots').innerHTML = D.banners.map(function (_, i) { return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('');
  }
  function mc(m) {
    var tg = m.tag ? '<span class="tg ' + (m.tone === 'gold' ? 'gold' : '') + '">' + (m.tone === 'gold' ? '' : ZX.ico.check) + ZX.t(m.tag) + '</span>' : '';
    var ph = m.img ? '<div class="ph" style="background-image:url(' + "'" + m.img + "'" + ')"></div>' : '<div class="ph art" style="background:' + m.grad + '"><span>' + m.emoji + '</span></div>';
    return '<button class="mc ' + m.size + '" type="button" data-link="' + m.link + '"><div class="tx"><b>' + ZX.t(m.title) + '</b>' + (m.sub ? '<span class="s">' + ZX.t(m.sub) + '</span>' : '') + '</div>' + ph + tg + '</button>';
  }
  function renderMosaic() {
    var M = {}; D.main.forEach(function (m) { M[m.id] = m; });
    $('mosaic').innerHTML = mc(M.m1) + mc(M.m2) + mc(M.m3) + '<div class="col">' + mc(M.m4) + '<div class="pair">' + mc(M.m5) + mc(M.m6) + '</div></div>';
  }
  function renderQuick() {
    var Q = [
      { c: 'o', t: { en: 'Join as Partner', bn: 'পার্টনার হোন' }, n: true, d: { en: 'Merchants, riders, technicians', bn: 'মার্চেন্ট, রাইডার, টেকনিশিয়ান' }, e: '🤝', link: '#join' },
      { c: 'm', t: { en: 'Zilax Wallet', bn: 'জিলাক্স ওয়ালেট' }, h: { en: 'Pay smarter, save more', bn: 'স্মার্ট পেমেন্ট, বেশি সাশ্রয়' }, e: '💳', stage: 7 },
      { c: 'g', t: { en: 'Track order', bn: 'অর্ডার ট্র্যাক' }, h: { en: 'Where is my food?', bn: 'আমার খাবার কোথায়?' }, e: '🛵', link: '#activity' },
      { c: 'y', t: { en: 'Refer & earn', bn: 'রেফার করুন, আয় করুন' }, h: { en: 'Invite friends', bn: 'বন্ধুদের ডাকুন' }, e: '🎁', stage: 9 }
    ];
    $('quick').innerHTML = Q.map(function (q) {
      var head = q.n ? '<div class="qt"><small>' + (ZX.lang === 'bn' ? 'নতুন!!' : 'NEW!!') + '</small>' + ZX.t(q.t) + '</div><div class="qh">' + (ZX.lang === 'bn' ? 'আজই যোগ দিন' : 'Earn with Zilax') + '<span class="ar"></span></div><div class="qd">' + ZX.t(q.d) + '</div>'
        : '<div class="qt">' + ZX.t(q.t) + '</div><div class="qh">' + ZX.t(q.h) + '</div>';
      return '<button class="qc ' + q.c + '" type="button" ' + (q.link ? 'data-link="' + q.link + '"' : 'data-stage="' + q.stage + '"') + '>' + head + '<span class="qe">' + q.e + '</span></button>';
    }).join('');
  }
  function renderOffers() {
    var h = D.offers.map(function (o) { return '<div class="offer" style="background:' + o.grad + '"><div class="em">' + o.emoji + '</div><span class="ob">' + o.badge + '</span><h4>' + ZX.t(o.title) + '</h4><p>' + ZX.t(o.sub) + '</p></div>'; }).join('');
    $('offers').innerHTML = h; $('offersList').innerHTML = h;
    [$('offers'), $('offersList')].forEach(function (root) { D.offers.forEach(function (o, i) { if (o.img) photo(root.children[i], o.img); }); });
    $('offerDots').innerHTML = D.offers.map(function (_, i) { return '<i class="' + (i ? '' : 'on') + '"></i>'; }).join('');
  }
  function pcard(it, fashion) {
    var plus = '<button class="plus" type="button" data-add="' + it.id + '" aria-label="Add">' + ZX.ico.plus + '</button>';
    return '<div class="pcard ' + (fashion ? 'fashion tall' : '') + (it.out ? ' out' : '') + '" data-id="' + it.id + '"><div class="im"><span class="emo">' + it.emoji + '</span><span class="bd">' + ZX.t(it.badge) + '</span>' + (it.out ? '<span class="so">' + ZX.d('soldOut') + '</span>' : '') + (fashion ? plus : '') + '</div>' +
      '<div class="info"><div class="nm">' + ZX.t(it) + '</div><div class="row"><span class="pr">' + ZX.money(it.price) + '</span>' + (fashion ? '' : plus) + '</div></div></div>';
  }
  function renderRows() {
    [['plates', D.plates, false], ['foodItems', D.plates, false], ['fashion', D.fashion, true], ['shopItems', D.fashion, true]].forEach(function (r) {
      var root = $(r[0]); root.innerHTML = r[1].map(function (it) { return pcard(it, r[2]); }).join('');
      r[1].forEach(function (it) { var c = root.querySelector('[data-id="' + it.id + '"] .im'); if (c) photo(c, it.img, it.grad); });
    });
  }
  function renderTech() {
    var T = [['❄️', { en: 'AC Service', bn: 'এসি সার্ভিস' }], ['⚡', { en: 'Electrician', bn: 'ইলেকট্রিশিয়ান' }], ['🚰', { en: 'Plumber', bn: 'প্লাম্বার' }], ['🧺', { en: 'Appliance Repair', bn: 'অ্যাপ্লায়েন্স মেরামত' }], ['📱', { en: 'Mobile & Laptop', bn: 'মোবাইল ও ল্যাপটপ' }], ['📹', { en: 'CCTV & WiFi', bn: 'সিসিটিভি ও ওয়াইফাই' }], ['🎨', { en: 'Painter', bn: 'পেইন্টার' }], ['🪚', { en: 'Carpenter', bn: 'কার্পেন্টার' }],
      ['🚘', { en: 'Rent a Car', bn: 'গাড়ি ভাড়া' }], ['🌸', { en: 'Decoration', bn: 'ডেকোরেশন' }], ['🎤', { en: 'Sound & Light', bn: 'সাউন্ড ও লাইট' }]];
    $('techList').innerHTML = T.map(function (t, i) { return '<button class="lrow" type="button" data-stage="' + (i < 8 ? 10 : 12) + '"><span class="le">' + t[0] + '</span><div><b>' + ZX.t(t[1]) + '</b></div><span class="ch ar"></span></button>'; }).join('');
  }
  function renderNav() {
    var items = [['home', 'home', 'nHome'], ['offers', 'tag', 'nOffers'], ['activity', 'list', 'nActivity'], ['inbox', 'mail', 'nInbox']];
    $('nav').innerHTML = items.map(function (n) { return '<button type="button" data-tab="' + n[0] + '" class="' + (tab === n[0] ? 'on' : '') + '">' + ZX.ico[n[1]] + '<span>' + ZX.d(n[2]) + '</span>' + (n[0] === 'inbox' ? '<span class="bdg">' + ZX.digits(2) + '</span>' : '') + '</button>'; }).join('');
  }
  function renderInbox() {
    var N = [['🎉', { en: 'Welcome to Zilax', bn: 'জিলাক্সে স্বাগতম' }, { en: 'Free delivery on your first food order.', bn: 'প্রথম ফুড অর্ডারে ফ্রি ডেলিভারি।' }], ['🔔', { en: 'Weekend Food Fest', bn: 'উইকেন্ড ফুড ফেস্ট' }, { en: 'Up to 40% off at partner kitchens.', bn: 'পার্টনার কিচেনে ৪০% পর্যন্ত ছাড়।' }]];
    $('inboxList').innerHTML = N.map(function (n) { return '<div class="lrow"><span class="le">' + n[0] + '</span><div><b>' + ZX.t(n[1]) + '</b><span>' + ZX.t(n[2]) + '</span></div></div>'; }).join('');
  }
  function renderAccount() {
    var P = [['merchant', '🏪', { en: 'Merchant dashboard', bn: 'মার্চেন্ট ড্যাশবোর্ড' }, { en: 'Menu, stock out, orders', bn: 'মেনু, স্টক আউট, অর্ডার' }], ['rider', '🏍️', { en: 'Rider dashboard', bn: 'রাইডার ড্যাশবোর্ড' }, { en: 'Online toggle, deliveries, earnings', bn: 'অনলাইন টগল, ডেলিভারি, আয়' }],
      ['sales', '📈', { en: 'Sales admin panel', bn: 'সেলস অ্যাডমিন প্যানেল' }, { en: 'Partner onboarding, targets', bn: 'পার্টনার অনবোর্ডিং, টার্গেট' }], ['admin', '🧭', { en: 'Admin panel', bn: 'অ্যাডমিন প্যানেল' }, { en: 'Live orders, approvals, support', bn: 'লাইভ অর্ডার, অনুমোদন, সাপোর্ট' }],
      ['super', '👑', { en: 'Super admin panel', bn: 'সুপার অ্যাডমিন প্যানেল' }, { en: 'Settings, Home Builder, finance', bn: 'সেটিংস, হোম বিল্ডার, অর্থ' }]];
    $('panelLinks').innerHTML = P.map(function (p) { return '<a class="lrow" href="panels.html#' + p[0] + '"><span class="le">' + p[1] + '</span><div><b>' + ZX.t(p[2]) + '</b><span>' + ZX.t(p[3]) + '</span></div><span class="ch ar"></span></a>'; }).join('');
    var r = ZX.calc.selfTest();
    $('checks').innerHTML = r.map(function (c) { return '<div style="padding:4px 0;color:' + (c.ok ? '#0D5C3A' : '#c0392b') + '">' + (c.ok ? '✔ ' : '✘ ') + c.name + '</div>'; }).join('') + '<div style="margin-top:8px;color:#6f7772;font-size:13px">' + (r.every(function (c) { return c.ok; }) ? (ZX.lang === 'bn' ? 'সব হিসাব ঠিক আছে' : 'All rules pass') : (ZX.lang === 'bn' ? 'কিছু হিসাব ভুল' : 'Some rules fail')) + '</div>';
  }
  function renderJoin() {
    $('ptypes').innerHTML = D.partnerTypes.map(function (p) {
      return '<div class="lrow" style="display:block"><div style="display:flex;gap:14px;align-items:center"><span class="le">' + p.emoji + '</span><div><b>' + ZX.t(p.name) + '</b><span>' + ZX.t(p.who) + '</span></div></div><ul class="docs">' + p.docs[ZX.lang].map(function (d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' +
        '<button class="cta-big" type="button" data-apply="' + p.id + '" style="padding:11px;margin-top:12px">' + (ZX.lang === 'en' ? 'Start as ' + ZX.t(p.name) : ZX.t(p.name) + ' হিসেবে শুরু করুন') + '</button></div>';
    }).join('');
  }
  function stageNotes() { $('shopSoon').textContent = ' ' + ZX.stageMsg(11); $('foodSoon').textContent = ' ' + ZX.stageMsg(4); $('svcSoon').textContent = ' ' + ZX.stageMsg(10); $('joinSoon').textContent = ' ' + ZX.stageMsg(1); $('actSoon').textContent = ' ' + ZX.stageMsg(5); }

  /* cart */
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function updateBadge() { var n = count(); $('cartN').textContent = n ? ZX.digits(n) : ''; $('cartN').setAttribute('data-n', n); }
  function find(id) { return D.items.filter(function (i) { return i.id === id; })[0]; }
  function addToCart(id) { var it = find(id); if (!it || it.out) return; cart[id] = (cart[id] || 0) + 1; ZX.store.set('zx_cart', cart); updateBadge(); ZX.toast(ZX.d('added') + ' — ' + ZX.t(it)); }
  function openSheet() {
    var ids = Object.keys(cart).filter(function (k) { return cart[k] > 0; }), sum = 0, h = '<h3>' + ZX.d('cart') + '</h3>';
    if (!ids.length) h += '<div class="soon">' + ZX.d('empty') + '</div>';
    ids.forEach(function (id) { var it = find(id); sum += it.price * cart[id]; h += '<div class="crow"><div class="cn"><b>' + ZX.t(it) + '</b><div style="color:#6f7772;font-size:13px">' + ZX.money(it.price) + '</div></div><div class="q"><button data-q="-' + id + '">−</button><b>' + ZX.digits(cart[id]) + '</b><button data-q="+' + id + '">+</button></div></div>'; });
    if (ids.length) h += '<div class="tot"><span>' + ZX.d('total') + '</span><span>' + ZX.money(sum) + '</span></div><button class="cta-big" id="chk" type="button">' + ZX.d('checkout') + '</button>';
    $('sheetPan').innerHTML = h; $('sheet').classList.add('show'); var c = $('chk'); if (c) c.onclick = function () { ZX.toast(ZX.stageMsg(4)); };
  }
  function doSearch(v) {
    v = v.trim().toLowerCase(); var box = $('suggest'); if (!v) { box.classList.remove('show'); box.innerHTML = ''; return; }
    var res = D.items.filter(function (i) { return (i.en + ' ' + i.bn).toLowerCase().indexOf(v) > -1; });
    box.innerHTML = res.length ? res.map(function (i) { return '<button type="button" data-add="' + i.id + '"><span style="font-size:24px">' + i.emoji + '</span><span>' + ZX.t(i) + '</span><span class="ps">' + ZX.money(i.price) + '</span></button>'; }).join('') : '<div class="empty">' + ZX.d('noResult') + '</div>';
    box.classList.add('show');
  }
  function go(t) {
    if (['home', 'offers', 'activity', 'inbox', 'shop', 'food', 'service', 'account', 'join', 'login', 'apply', 'myapps', 'profile', 'addresses'].indexOf(t) < 0) t = 'home';
    tab = t; document.querySelectorAll('.view').forEach(function (v) { v.classList.toggle('on', v.id === 'v-' + t); }); renderNav(); window.scrollTo(0, 0); if (ZX.onView) ZX.onView(t);
  }
  function wireDots(sc, dots, w) { sc.addEventListener('scroll', function () { var f = sc.firstElementChild; if (!f) return; var i = Math.round(sc.scrollLeft / (f.offsetWidth + 12)); i = Math.min(Math.max(i, 0), dots.children.length - 1); for (var j = 0; j < dots.children.length; j++) dots.children[j].classList.toggle('on', j === i); }, { passive: true }); }
  function renderAll() {
    ZX.applyI18n(); renderHeader(); renderHeroes(); renderMosaic(); renderQuick(); renderOffers(); renderRows(); renderTech(); renderNav(); renderInbox(); renderAccount(); renderJoin(); stageNotes(); arrows();
  }
  ZX.go = go; ZX.renderAll = renderAll;
  ZX.onLang = renderAll;

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-add],[data-tab],[data-link],[data-stage],[data-see],[data-q]'); if (!t) return;
    if (t.hasAttribute('data-add')) { addToCart(t.getAttribute('data-add')); return; }
    if (t.hasAttribute('data-tab')) { var tb = t.getAttribute('data-tab'); location.hash = tb === 'home' ? '' : tb; go(tb); return; }
    if (t.hasAttribute('data-see')) { go({ food: 'food', shop: 'shop' }[t.getAttribute('data-see')] || 'home'); return; }
    if (t.hasAttribute('data-link')) { go(t.getAttribute('data-link').replace('#', '')); return; }
    if (t.hasAttribute('data-stage')) { ZX.toast(ZX.stageMsg(t.getAttribute('data-stage'))); return; }
    if (t.hasAttribute('data-q')) { var q = t.getAttribute('data-q'), id = q.slice(1); cart[id] = Math.max(0, (cart[id] || 0) + (q[0] === '+' ? 1 : -1)); if (!cart[id]) delete cart[id]; ZX.store.set('zx_cart', cart); updateBadge(); openSheet(); }
  });
  $('lEn').onclick = function () { ZX.setLang('en'); }; $('lBn').onclick = function () { ZX.setLang('bn'); };
  $('cartBtn').onclick = openSheet; $('sheet').onclick = function (e) { if (e.target.id === 'sheet') $('sheet').classList.remove('show'); };
  $('q').addEventListener('input', function (e) { doSearch(e.target.value); });
  $('filterBtn').onclick = function () { ZX.toast(ZX.stageMsg(4)); }; $('loginDemo').onclick = function () { ZX.go('login'); };
  window.addEventListener('hashchange', function () { go(location.hash.replace('#', '')); });
  renderAll(); wireDots($('heroes'), $('heroDots')); wireDots($('offers'), $('offerDots')); go(location.hash.replace('#', '') || 'home');
})();
