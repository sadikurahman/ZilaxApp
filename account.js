/* Zilax — Account & Settings main page (Part 1, Step 1). Pathao/Foodpanda-style list, line icons, no emoji. */
(function () {
  var S = function (p) { return '<svg viewBox="0 0 24 24">' + p + '</svg>'; };
  var I = {
    a_user: S('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>'),
    a_lock: S('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    a_brief: S('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>'),
    a_card: S('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h4"/>'),
    a_wallet: S('<path d="M4 7a2 2 0 0 1 2-2h11v4"/><rect x="3" y="7" width="18" height="13" rx="2.5"/><circle cx="16.5" cy="13.5" r="1.2"/>'),
    a_mark: S('<path d="M6 4h12v17l-6-4-6 4V4z"/>'),
    a_hist: S('<path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4"/><path d="M12 8v4l3 2"/>'),
    a_heart: S('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.2 4.3 4.3 0 0 1 19.5 10c0 5.4-7.500 10-7.500 10z"/>'),
    a_pct: S('<path d="M12 3l2.4 1.6 2.9-.1 1 2.700 2.300 1.800-.9 2.800.9 2.800-2.300 1.800-1 2.700-2.900-.1L12 21l-2.400-1.600-2.900.1-1-2.700L3.400 15 4.300 12l-.9-2.800 2.300-1.800 1-2.700 2.900.1L12 3z"/><path d="M9 15l6-6"/><circle cx="9.300" cy="9.300" r=".8"/><circle cx="14.700" cy="14.700" r=".8"/>'),
    a_ticket: S('<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z"/><path d="M14 6v12" stroke-dasharray="2 2.500"/>'),
    a_globe: S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.800 3 2.800 15 0 18M12 3c-2.800 3-2.800 15 0 18"/>'),
    a_bell: S('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.500 2h-15L6 16z"/><path d="M10 20.500a2 2 0 0 0 4 0"/>'),
    a_shield: S('<path d="M12 3l8 3v6c0 4.500-3.400 7.800-8 9-4.600-1.200-8-4.500-8-9V6l8-3z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>'),
    a_life: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.500"/><path d="M5.600 5.600l3.900 3.900M14.500 14.500l3.900 3.900M18.400 5.600l-3.900 3.900M9.500 14.500l-3.900 3.900"/>'),
    a_phone: S('<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    a_doc: S('<path d="M7 3h7l4 4v14H7V3z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>'),
    a_hand: S('<path d="M3 12l4-4 4 1 3-2 5 4-5 6-3 1-4-2-4-4z"/><path d="M7 8l-4 4"/>'),
    a_info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>'),
    a_star: S('<path d="M12 3.500l2.700 5.500 6 .9-4.400 4.200 1 6-5.300-2.800-5.300 2.800 1-6L3.300 9.900l6-.9L12 3.500z"/>'),
    a_out: S('<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9"/>'),
    a_cam: S('<path d="M4 8h3l1.500-2h7L17 8h3v11H4V8z"/><circle cx="12" cy="13" r="3.500"/>'),
    a_eye: S('<path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    a_eyeoff: S('<path d="M3 3l18 18M10.600 5.100A9.700 9.700 0 0 1 12 5c6.500 0 10 7 10 7a17 17 0 0 1-3.200 4.100M6.600 6.600A17 17 0 0 0 2 12s3.500 7 10 7a9.600 9.600 0 0 0 4-.9"/>'),
    a_pencil: S('<path d="M4 20h4L19 9l-4-4L4 16v4z"/>'),
    a_box: S('<path d="M3 8l9-5 9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
    a_dash: S('<rect x="3" y="3" width="8" height="10" rx="2"/><rect x="13" y="3" width="8" height="6" rx="2"/><rect x="13" y="11" width="8" height="10" rx="2"/><rect x="3" y="15" width="8" height="6" rx="2"/>')
  };
  for (var k in I) ZX.ico[k] = I[k];

  var L = {
    inbox: { en: 'Inbox', bn: 'ইনবক্স' }, edit: { en: 'Edit', bn: 'এডিট' },
    orders: { en: 'Orders', bn: 'অর্ডার' }, wallet: { en: 'Wallet', bn: 'ওয়ালেট' },
    sAcc: { en: 'Account & security', bn: 'অ্যাকাউন্ট ও নিরাপত্তা' }, sOff: { en: 'Offers', bn: 'অফার' },
    sSet: { en: 'Settings', bn: 'সেটিংস' }, sHelp: { en: 'Help & legal', bn: 'সাহায্য ও আইনি' },
    sMore: { en: 'More', bn: 'আরও' }, sDash: { en: 'Dashboards', bn: 'ড্যাশবোর্ড' },
    prof: { en: 'Profile & password', bn: 'প্রোফাইল ও পাসওয়ার্ড' }, addr: { en: 'Saved addresses', bn: 'সেভ করা ঠিকানা' },
    hist: { en: 'Order history', bn: 'অর্ডারের ইতিহাস' }, fav: { en: 'Favourites', bn: 'পছন্দের তালিকা' },
    pay: { en: 'Wallet & payment', bn: 'ওয়ালেট ও পেমেন্ট' }, biz: { en: 'Business profile', bn: 'ব্যবসার প্রোফাইল' },
    payout: { en: 'Payout method', bn: 'পেআউট মাধ্যম' }, apps: { en: 'My applications', bn: 'আমার আবেদন' },
    promo: { en: 'Promos', bn: 'প্রোমো' }, refer: { en: 'Refer & earn', bn: 'রেফার করে আয় করুন' },
    lang: { en: 'Language', bn: 'ভাষা' }, notif: { en: 'Notifications & permissions', bn: 'নোটিফিকেশন ও অনুমতি' },
    help: { en: 'Help & FAQ', bn: 'সাহায্য ও FAQ' }, supp: { en: 'Support contact', bn: 'সাপোর্টে যোগাযোগ' },
    pol: { en: 'Policies', bn: 'নীতিমালা' }, join: { en: 'Join as Partner', bn: 'পার্টনার হিসেবে যোগ দিন' },
    about: { en: 'About Zilax', bn: 'জিলাক্স সম্পর্কে' }, rate: { en: 'Rate us', bn: 'রেটিং দিন' },
    out: { en: 'Log out', bn: 'লগআউট' }, soon: { en: 'Soon', bn: 'শীঘ্রই' },
    soonMsg: { en: 'Coming soon', bn: 'শীঘ্রই আসছে' }, curLang: { en: 'English', bn: 'বাংলা' },
    hi: { en: 'Welcome to Zilax', bn: 'জিলাক্সে স্বাগতম' }, hiS: { en: 'Log in to see your profile, orders and addresses.', bn: 'প্রোফাইল, অর্ডার ও ঠিকানা দেখতে লগইন করুন।' },
    login: { en: 'Log in / Sign up', bn: 'লগইন / সাইন আপ' }
  };
  var t = function (k) { return ZX.t(L[k]); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function row(ico, label, o) {
    o = o || {};
    var act = o.link ? 'data-link="' + o.link + '"' : o.href ? '' : o.lang ? 'data-lang="1"' : 'data-soon="1"';
    var right = o.val ? '<em class="acv">' + esc(o.val) + '</em>' : (!o.link && !o.href && !o.lang ? '<em class="acs">' + t('soon') + '</em>' : '');
    var inner = '<span class="aci">' + ZX.ico[ico] + '</span><span class="acl">' + esc(label) + '</span>' + right + '<span class="acr">' + ZX.ico.arrowR + '</span>';
    return o.href ? '<a class="acrow" href="' + o.href + '">' + inner + '</a>' : '<button class="acrow" type="button" ' + act + '>' + inner + '</button>';
  }
  function sec(title, rows) { return '<div class="acsec"><h4>' + esc(title) + '</h4>' + rows.join('') + '</div>'; }

  /* o = { user, name, phone, where, avatar, partner, panels:[{href,label}] } */
  ZX.accountHtml = function (o) {
    if (!o.user) {
      return '<div class="achello"><span class="achi">' + ZX.ico.a_user + '</span><b>' + t('hi') + '</b><span>' + t('hiS') + '</span>' +
        '<button class="cta-big" type="button" data-go="login">' + t('login') + '</button></div>' +
        sec(t('sSet'), [row('a_globe', t('lang'), { lang: 1, val: t('curLang') })]) +
        sec(t('sMore'), [row('a_hand', t('join'), { link: '#join' })]);
    }
    var ini = esc((o.name || '?').trim().charAt(0).toUpperCase());
    var av = o.avatar ? '<img src="' + esc(o.avatar) + '" alt="">' : ini;
    var h = '<div class="accard"><div class="acp"><div class="acav">' + av + '</div><div class="acin"><b>' + esc(o.name) + '</b><span>' + esc(o.phone) + '</span>' +
      (o.where ? '<span class="acw">' + esc(o.where) + '</span>' : '') + '</div>' +
      '<button class="acedit" type="button" data-link="#profile">' + ZX.ico.a_pencil + t('edit') + '</button></div>' +
      '<div class="acq"><button type="button" data-soon="1">' + ZX.ico.a_box + t('orders') + '</button><button type="button" data-soon="1">' + ZX.ico.a_wallet + t('wallet') + '</button></div></div>';
    h += '<div class="acsec flat">' + row('mail', t('inbox'), { link: '#inbox' }) + '</div>';
    var acc = [row('a_user', t('prof'), { link: '#profile' }), row('a_mark', t('addr')), row('a_hist', t('hist')), row('a_heart', t('fav')), row('a_card', t('pay'))];
    if (o.partner) { acc.splice(1, 0, row('a_brief', t('biz'))); acc.splice(2, 0, row('a_wallet', t('payout'))); }
    acc.push(row('a_doc', t('apps'), { link: '#myapps' }));
    h += sec(t('sAcc'), acc);
    if (o.panels && o.panels.length) h += sec(t('sDash'), o.panels.map(function (p) { return row('a_dash', p.label, { href: p.href }); }));
    h += sec(t('sOff'), [row('a_pct', t('promo')), row('a_ticket', t('refer'))]);
    h += sec(t('sSet'), [row('a_globe', t('lang'), { lang: 1, val: t('curLang') }), row('a_bell', t('notif'))]);
    h += sec(t('sHelp'), [row('a_life', t('help')), row('a_phone', t('supp')), row('a_shield', t('pol'))]);
    h += sec(t('sMore'), [row('a_hand', t('join'), { link: '#join' }), row('a_info', t('about')), row('a_star', t('rate'))]);
    h += '<button class="acout" type="button" data-go="logout">' + ZX.ico.a_out + t('out') + '</button>';
    return h;
  };

  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-soon]'); if (s) { ZX.toast(t('soonMsg')); return; }
    var g = e.target.closest('[data-lang]'); if (g) ZX.setLang(ZX.lang === 'bn' ? 'en' : 'bn');
  });

  /* ---------- Profile & password page ---------- */
  var A = ZX.auth, areas = [];
  var M = {
    title: { en: 'Profile & password', bn: 'প্রোফাইল ও পাসওয়ার্ড' }, login1: { en: 'Log in first to continue.', bn: 'চালিয়ে যেতে আগে লগইন করুন।' },
    name: { en: 'Full name', bn: 'পুরো নাম' }, phone: { en: 'Mobile number (cannot be changed)', bn: 'মোবাইল নম্বর (বদলানো যাবে না)' },
    up: { en: 'Upazila', bn: 'উপজেলা' }, un: { en: 'Union / Paurashava', bn: 'ইউনিয়ন / পৌরসভা' }, addr: { en: 'Village, road, house', bn: 'গ্রাম, রাস্তা, বাড়ি' },
    choose: { en: 'Choose…', bn: 'বাছাই করুন…' }, save: { en: 'Save changes', bn: 'পরিবর্তন সংরক্ষণ' }, wait: { en: 'Please wait…', bn: 'অপেক্ষা করুন…' },
    saved: { en: 'Saved', bn: 'সংরক্ষিত হয়েছে' }, needName: { en: 'Please enter your name.', bn: 'আপনার নাম লিখুন।' },
    pwT: { en: 'Change password', bn: 'পাসওয়ার্ড বদল' }, old: { en: 'Old password', bn: 'পুরোনো পাসওয়ার্ড' }, nw: { en: 'New password', bn: 'নতুন পাসওয়ার্ড' },
    nw2: { en: 'Confirm new password', bn: 'নতুন পাসওয়ার্ড আবার লিখুন' }, hint: { en: 'At least 6 characters', bn: 'কমপক্ষে ৬ অক্ষর' },
    pwBtn: { en: 'Change password', bn: 'পাসওয়ার্ড বদলান' }, pwFill: { en: 'Please fill all three fields.', bn: 'তিনটি ঘরই পূরণ করুন।' },
    pwShort: { en: 'New password must be at least 6 characters.', bn: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' },
    pwMatch: { en: 'The two new passwords do not match.', bn: 'দুটি নতুন পাসওয়ার্ড মিলছে না।' }, pwSame: { en: 'New password must be different from the old one.', bn: 'নতুন পাসওয়ার্ড পুরোনোটার থেকে আলাদা হতে হবে।' },
    pwOk: { en: 'Password changed.', bn: 'পাসওয়ার্ড বদলানো হয়েছে।' }, up1: { en: 'Uploading photo…', bn: 'ছবি আপলোড হচ্ছে…' }, photo: { en: 'Change photo', bn: 'ছবি বদলান' }
  };
  var m = function (k) { return ZX.t(M[k]); };
  var $ = function (id) { return document.getElementById(id); };
  var val = function (id) { var e = $(id); return e ? e.value : ''; };
  var nm = function (a) { return ZX.t({ en: a.name_en, bn: a.name_bn }); };
  function opts(list, sel) { return '<option value="">' + m('choose') + '</option>' + list.map(function (a) { return '<option value="' + esc(a.id) + '"' + (a.id === sel ? ' selected' : '') + '>' + esc(nm(a)) + '</option>'; }).join(''); }
  function unionsOf(up) { return areas.filter(function (a) { return a.level === 'union' && a.parent_id === up && a.active; }); }
  function fmsg(id, text, ok) { var e = $(id); if (e) { e.textContent = text || ''; e.className = 'fmsg ' + (ok ? 'ok' : 'err'); } }
  function pw(id, label, ph, auto) { return '<label class="fld"><span>' + label + '</span><div class="pw"><input id="' + id + '" type="password" autocomplete="' + auto + '"' + (ph ? ' placeholder="' + ph + '"' : '') + '><button type="button" data-eye="' + id + '" aria-label="Show">' + ZX.ico.a_eye + '</button></div></label>'; }

  async function renderProfile() {
    var v = $('v-profile'); if (!v) return;
    var bar = '<div class="pbar"><button class="bk" data-tab="account" type="button" aria-label="Back">' + ZX.ico.back + '</button><h2>' + m('title') + '</h2></div>';
    var me = A.me();
    if (!ZX.live || !me.user) { v.innerHTML = bar + '<div class="soon"><b>' + m('login1') + '</b></div><button class="cta-big" type="button" data-go="login">' + t('login') + '</button>'; return; }
    if (!areas.length) { try { areas = await A.areas(); } catch (e) { areas = []; } }
    var p = me.profile || {}, ups = areas.filter(function (a) { return a.level === 'upazila' && a.active; });
    var ini = esc((p.full_name || '?').trim().charAt(0).toUpperCase());
    v.innerHTML = bar +
      '<div class="pfav"><div class="pfwrap"><div class="acav">' + (p.avatar_url ? '<img src="' + esc(p.avatar_url) + '" alt="">' : ini) + '</div>' +
      '<label class="pfcam" aria-label="' + m('photo') + '">' + ZX.ico.a_cam + '<input id="pAvatar" type="file" accept="image/*"></label></div></div>' +
      '<label class="fld"><span>' + m('name') + '</span><input id="pName" type="text" autocomplete="name" value="' + esc(p.full_name || '') + '"></label>' +
      '<label class="fld"><span>' + m('phone') + '</span><input type="tel" value="' + esc(p.phone || '') + '" disabled></label>' +
      '<label class="fld"><span>' + m('up') + '</span><select id="pUp">' + opts(ups, p.upazila_id || '') + '</select></label>' +
      '<label class="fld"><span>' + m('un') + '</span><select id="pUn">' + opts(unionsOf(p.upazila_id || ''), p.union_id || '') + '</select></label>' +
      '<label class="fld"><span>' + m('addr') + '</span><input id="pAddr" type="text" autocomplete="street-address" value="' + esc(p.address || '') + '"></label>' +
      '<div id="pMsg" class="fmsg"></div><button class="cta-big" id="pSave" type="button">' + m('save') + '</button>' +
      '<div class="pfsec"><h3>' + m('pwT') + '</h3>' + pw('pOld', m('old'), '', 'current-password') + pw('pNew', m('nw'), m('hint'), 'new-password') + pw('pNew2', m('nw2'), '', 'new-password') +
      '<div id="pwMsg" class="fmsg"></div><button class="cta-big" id="pwSave" type="button">' + m('pwBtn') + '</button></div>';
  }
  async function saveProfile() {
    var name = val('pName').trim(); if (!name) { fmsg('pMsg', m('needName')); return; }
    var b = $('pSave'); b.disabled = true; fmsg('pMsg', m('wait'), true);
    try { await A.updateProfile({ full_name: name, upazila_id: val('pUp') || null, union_id: val('pUn') || null, address: val('pAddr').trim() }); fmsg('pMsg', m('saved'), true); ZX.toast(m('saved')); }
    catch (e) { fmsg('pMsg', A.errMsg(e)); } b.disabled = false;
  }
  async function savePass() {
    var o = val('pOld'), n = val('pNew'), n2 = val('pNew2');
    if (!o || !n || !n2) { fmsg('pwMsg', m('pwFill')); return; }
    if (n.length < 6) { fmsg('pwMsg', m('pwShort')); return; }
    if (n !== n2) { fmsg('pwMsg', m('pwMatch')); return; }
    if (n === o) { fmsg('pwMsg', m('pwSame')); return; }
    var b = $('pwSave'); b.disabled = true; fmsg('pwMsg', m('wait'), true);
    try { await A.changePassword(o, n); ['pOld', 'pNew', 'pNew2'].forEach(function (i) { $(i).value = ''; }); fmsg('pwMsg', m('pwOk'), true); ZX.toast(m('pwOk')); }
    catch (e) { fmsg('pwMsg', e && e.zxMsg ? e.message : A.errMsg(e)); } b.disabled = false;
  }
  document.addEventListener('click', function (e) {
    var t1 = e.target.closest('#pSave,#pwSave,[data-eye]'); if (!t1) return;
    if (t1.id === 'pSave') saveProfile(); else if (t1.id === 'pwSave') savePass();
    else { var i = $(t1.getAttribute('data-eye')); if (i) { var show = i.type === 'password'; i.type = show ? 'text' : 'password'; t1.innerHTML = show ? ZX.ico.a_eyeoff : ZX.ico.a_eye; } }
  });
  document.addEventListener('change', async function (e) {
    var x = e.target;
    if (x.id === 'pUp') { var un = $('pUn'); if (un) un.innerHTML = opts(unionsOf(x.value), ''); return; }
    if (x.id === 'pAvatar' && x.files && x.files[0]) {
      ZX.toast(m('up1'));
      try { await A.uploadAvatar(x.files[0]); ZX.toast(m('saved')); renderProfile(); } catch (er) { ZX.toast(A.errMsg(er)); }
    }
  });
  var prevView = ZX.onView; ZX.onView = function (v) { if (prevView) prevView(v); if (v === 'profile') renderProfile(); };
  var prevLang = ZX.onLang; ZX.onLang = function () { if (prevLang) prevLang(); var c = document.querySelector('.view.on'); if (c && c.id === 'v-profile') renderProfile(); };
})();
