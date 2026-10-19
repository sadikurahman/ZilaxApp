/* Zilax — Stage 1 screens: login, sign up, account, Join as Partner, my applications. */
(function () {
  var A = ZX.auth, D = ZX.data, esc = A.esc;
  var $ = function (id) { return document.getElementById(id); };

  var T = {
    login: { en: 'Log in', bn: 'লগইন' }, signup: { en: 'Sign up', bn: 'সাইন আপ' }, logout: { en: 'Log out', bn: 'লগআউট' },
    phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' }, pass: { en: 'Password', bn: 'পাসওয়ার্ড' }, name: { en: 'Full name', bn: 'পুরো নাম' },
    upazila: { en: 'Upazila', bn: 'উপজেলা' }, union: { en: 'Union / Paurashava', bn: 'ইউনিয়ন / পৌরসভা' }, address: { en: 'Village, road, house', bn: 'গ্রাম, রাস্তা, বাড়ি' },
    choose: { en: 'Choose…', bn: 'বাছাই করুন…' }, passHint: { en: 'At least 6 characters', bn: 'কমপক্ষে ৬ অক্ষর' },
    welcome: { en: 'Welcome to Zilax', bn: 'জিলাক্সে স্বাগতম' }, welcomeS: { en: 'Log in to order, track and join as a partner.', bn: 'অর্ডার, ট্র্যাক ও পার্টনার হতে লগইন করুন।' },
    needSetup: { en: 'Supabase is not connected yet', bn: 'Supabase এখনো সংযুক্ত নয়' },
    needSetupS: { en: 'Open config.js and fill in your Project URL and anon key (see the setup guide). Until then the app works in demo mode.', bn: 'config.js খুলে আপনার Project URL ও anon key বসান (সেটআপ গাইড দেখুন)। ততক্ষণ অ্যাপ ডেমো মোডে চলবে।' },
    myApps: { en: 'My applications', bn: 'আমার আবেদন' }, myAppsS: { en: 'Status of your partner applications', bn: 'আপনার পার্টনার আবেদনের অবস্থা' },
    roles: { en: 'Your roles', bn: 'আপনার ভূমিকা' }, openPanel: { en: 'Open dashboard', bn: 'ড্যাশবোর্ড খুলুন' },
    applyT: { en: 'Partner application', bn: 'পার্টনার আবেদন' }, bizName: { en: 'Business name', bn: 'প্রতিষ্ঠানের নাম' }, ownerName: { en: 'Owner / your name', bn: 'মালিক / আপনার নাম' },
    gps: { en: 'Use my current location', bn: 'আমার বর্তমান লোকেশন নিন' }, gpsOk: { en: 'Location saved', bn: 'লোকেশন সংরক্ষিত' }, gpsFail: { en: 'Could not get location. Allow location access and try again.', bn: 'লোকেশন পাওয়া যায়নি। লোকেশনের অনুমতি দিয়ে আবার চেষ্টা করুন।' },
    docs: { en: 'Documents & photos', bn: 'কাগজ ও ছবি' }, req: { en: 'required', bn: 'বাধ্যতামূলক' }, opt: { en: 'optional', bn: 'ঐচ্ছিক' },
    pick: { en: 'Choose photo', bn: 'ছবি বাছাই' }, picked: { en: 'selected', bn: 'বাছাই হয়েছে' }, submit: { en: 'Submit application', bn: 'আবেদন জমা দিন' },
    sending: { en: 'Submitting…', bn: 'জমা হচ্ছে…' }, uploading: { en: 'Uploading photos…', bn: 'ছবি আপলোড হচ্ছে…' },
    fillReq: { en: 'Please fill all required fields and add all required photos.', bn: 'সব বাধ্যতামূলক ঘর পূরণ করুন ও বাধ্যতামূলক ছবি যোগ করুন।' },
    sentOk: { en: 'Application submitted. We will review it soon.', bn: 'আবেদন জমা হয়েছে। শীঘ্রই যাচাই করা হবে।' },
    partialOk: { en: 'Application submitted, but some photos did not upload. Add them from My applications.', bn: 'আবেদন জমা হয়েছে, তবে কিছু ছবি আপলোড হয়নি। "আমার আবেদন" থেকে যোগ করুন।' },
    noApps: { en: 'No applications yet', bn: 'এখনো কোনো আবেদন নেই' }, sales: { en: 'Sales note', bn: 'সেলস নোট' }, admin: { en: 'Admin note', bn: 'অ্যাডমিন নোট' },
    missing: { en: 'Missing photos', bn: 'বাকি ছবি' }, add: { en: 'Upload', bn: 'আপলোড' }, uploaded: { en: 'Uploaded', bn: 'আপলোড হয়েছে' },
    loginFirst: { en: 'Log in first to continue.', bn: 'চালিয়ে যেতে আগে লগইন করুন।' }, hello: { en: 'Hi', bn: 'হ্যালো' },
    welcomeBack: { en: 'Logged in', bn: 'লগইন সফল' }, created: { en: 'Account created', bn: 'অ্যাকাউন্ট তৈরি হয়েছে' }, loggedOut: { en: 'Logged out', bn: 'লগআউট হয়েছে' },
    reapply: { en: 'Apply again', bn: 'আবার আবেদন করুন' }, noDocs: { en: 'No photos uploaded yet', bn: 'এখনো ছবি আপলোড হয়নি' }, saving: { en: 'Please wait…', bn: 'অপেক্ষা করুন…' }
  };
  var tt = function (k) { return ZX.t(T[k]); };

  var OPT = {
    payout: [{ v: 'bKash', l: { en: 'bKash', bn: 'বিকাশ' } }, { v: 'Nagad', l: { en: 'Nagad', bn: 'নগদ' } }, { v: 'Rocket', l: { en: 'Rocket', bn: 'রকেট' } }, { v: 'Bank', l: { en: 'Bank', bn: 'ব্যাংক' } }],
    shopType: [{ v: 'grocery', l: { en: 'Grocery', bn: 'মুদি' } }, { v: 'clothes', l: { en: 'Clothes', bn: 'কাপড়' } }, { v: 'shoes', l: { en: 'Shoes', bn: 'জুতা' } }, { v: 'electronics', l: { en: 'Electronics', bn: 'ইলেকট্রনিক্স' } }, { v: 'cosmetics', l: { en: 'Cosmetics', bn: 'কসমেটিক্স' } }, { v: 'other', l: { en: 'Other', bn: 'অন্যান্য' } }],
    skill: [{ v: 'ac', l: { en: 'AC Service', bn: 'এসি সার্ভিস' } }, { v: 'electrician', l: { en: 'Electrician', bn: 'ইলেকট্রিশিয়ান' } }, { v: 'plumber', l: { en: 'Plumber', bn: 'প্লাম্বার' } }, { v: 'appliance', l: { en: 'Appliance Repair', bn: 'অ্যাপ্লায়েন্স মেরামত' } }, { v: 'mobile', l: { en: 'Mobile & Laptop', bn: 'মোবাইল ও ল্যাপটপ' } }, { v: 'cctv', l: { en: 'CCTV & WiFi', bn: 'সিসিটিভি ও ওয়াইফাই' } }, { v: 'painter', l: { en: 'Painter', bn: 'পেইন্টার' } }, { v: 'carpenter', l: { en: 'Carpenter', bn: 'কার্পেন্টার' } }],
    driver: [{ v: 'with', l: { en: 'With driver', bn: 'ড্রাইভারসহ' } }, { v: 'without', l: { en: 'Without driver', bn: 'ড্রাইভার ছাড়া' } }, { v: 'both', l: { en: 'Both', bn: 'দুটোই' } }]
  };
  var F = function (k, en, bn, type, opt, req) { return { k: k, l: { en: en, bn: bn }, type: type || 'text', opt: opt, req: req !== false }; };
  var DOC = function (k, en, bn, req, multi) { return { k: k, l: { en: en, bn: bn }, req: !!req, multi: !!multi }; };
  var TYPES = {
    food: { biz: { en: 'Restaurant / kitchen name', bn: 'রেস্টুরেন্ট / কিচেনের নাম' }, fields: [F('opening', 'Opening hours (e.g. 10am – 11pm)', 'খোলার সময় (যেমন সকাল ১০টা – রাত ১১টা)'), F('payout_method', 'Payout method', 'পেআউট মাধ্যম', 'select', 'payout'), F('payout_number', 'Payout number / account', 'পেআউট নম্বর / অ্যাকাউন্ট', 'text'), F('licence_no', 'Trade licence no.', 'ট্রেড লাইসেন্স নম্বর', 'text', null, false)],
      docs: [DOC('shop_photo', 'Shop / kitchen photo', 'দোকান / কিচেনের ছবি', true), DOC('trade_license', 'Trade licence', 'ট্রেড লাইসেন্স', false)] },
    shop: { biz: { en: 'Shop name', bn: 'দোকানের নাম' }, fields: [F('shop_type', 'Shop type', 'দোকানের ধরন', 'select', 'shopType'), F('payout_method', 'Payout method', 'পেআউট মাধ্যম', 'select', 'payout'), F('payout_number', 'Payout number / account', 'পেআউট নম্বর / অ্যাকাউন্ট', 'text'), F('licence_no', 'Trade licence no.', 'ট্রেড লাইসেন্স নম্বর', 'text', null, false)],
      docs: [DOC('shop_photo', 'Shop photo', 'দোকানের ছবি', true), DOC('trade_license', 'Trade licence', 'ট্রেড লাইসেন্স', false)] },
    rider: { biz: null, fields: [F('bike_model', 'Motorbike model', 'মোটরসাইকেলের মডেল'), F('bike_plate', 'Registration number', 'রেজিস্ট্রেশন নম্বর'), F('licence_no', 'Driving licence no.', 'ড্রাইভিং লাইসেন্স নম্বর'), F('emergency_name', 'Emergency contact name', 'জরুরি যোগাযোগের নাম'), F('emergency_phone', 'Emergency contact phone', 'জরুরি যোগাযোগের ফোন', 'tel')],
      docs: [DOC('photo', 'Your photo', 'আপনার ছবি', true), DOC('nid', 'National ID (front)', 'জাতীয় পরিচয়পত্র (সামনের দিক)', true), DOC('bike_paper', 'Motorbike papers', 'মোটরসাইকেলের কাগজ', true), DOC('driving_license', 'Driving licence', 'ড্রাইভিং লাইসেন্স', true)] },
    tech: { biz: null, fields: [F('skill', 'Main skill', 'প্রধান দক্ষতা', 'select', 'skill'), F('experience_years', 'Experience (years)', 'অভিজ্ঞতা (বছর)', 'number'), F('service_area', 'Service area', 'সেবা এলাকা')],
      docs: [DOC('photo', 'Your photo', 'আপনার ছবি', true), DOC('nid', 'National ID (front)', 'জাতীয় পরিচয়পত্র (সামনের দিক)', true), DOC('certificate', 'Training certificate', 'প্রশিক্ষণের সনদ', false)] },
    car: { biz: { en: 'Car name / business name', bn: 'গাড়ি / প্রতিষ্ঠানের নাম' }, fields: [F('car_model', 'Car model & year', 'গাড়ির মডেল ও সাল'), F('plate', 'Registration number', 'রেজিস্ট্রেশন নম্বর'), F('seats', 'Seats', 'আসন সংখ্যা', 'number'), F('rate_hourly', 'Hourly rate (Tk)', 'ঘণ্টার ভাড়া (টাকা)', 'number'), F('rate_daily', 'Daily rate (Tk)', 'দিনের ভাড়া (টাকা)', 'number'), F('driver', 'Driver', 'ড্রাইভার', 'select', 'driver')],
      docs: [DOC('car_photo', 'Car photos', 'গাড়ির ছবি', true, true), DOC('registration', 'Registration papers', 'রেজিস্ট্রেশন কাগজ', true), DOC('driving_license', 'Driver’s licence', 'ড্রাইভারের লাইসেন্স', true)] },
    decor: { biz: { en: 'Business name', bn: 'প্রতিষ্ঠানের নাম' }, fields: [F('packages', 'Packages & prices', 'প্যাকেজ ও দাম', 'textarea'), F('service_area', 'Service area', 'সেবা এলাকা')],
      docs: [DOC('work_samples', 'Work sample photos', 'কাজের নমুনা ছবি', true, true)] },
    sound: { biz: { en: 'Business name', bn: 'প্রতিষ্ঠানের নাম' }, fields: [F('equipment', 'Equipment list', 'সরঞ্জাম তালিকা', 'textarea'), F('packages', 'Packages & prices', 'প্যাকেজ ও দাম', 'textarea'), F('service_area', 'Service area', 'সেবা এলাকা')],
      docs: [DOC('equipment_photo', 'Equipment photos', 'সরঞ্জামের ছবি', true, true)] }
  };
  var ROLE2TYPE = {}; Object.keys(A.PARTNER_ROLE).forEach(function (k) { ROLE2TYPE[A.PARTNER_ROLE[k]] = k; });
  var PANEL_OF = { merchant_food: 'merchant', merchant_shop: 'merchant', rider: 'rider', sales_admin: 'sales', admin: 'admin', super_admin: 'super' };

  var areas = [], mode = 'login', applyType = null, gps = null, files = {}, next = null;
  function ptype(id) { return D.partnerTypes.filter(function (p) { return p.id === id; })[0]; }
  function chip(txt, tone) { return '<span class="chip ' + (tone || '') + '">' + esc(txt) + '</span>'; }
  function tone(s) { return { active: 'ok', approved: 'ok', recommended: 'ok', pending: 'w', not_recommended: 'w', rejected: 'r', suspended: 'r' }[s] || ''; }
  function opts(list, sel, ph) { return '<option value="">' + esc(ph || tt('choose')) + '</option>' + list.map(function (a) { return '<option value="' + esc(a.id) + '"' + (a.id === sel ? ' selected' : '') + '>' + esc(ZX.t({ en: a.name_en, bn: a.name_bn })) + '</option>'; }).join(''); }
  function upazilas() { return areas.filter(function (a) { return a.level === 'upazila' && a.active; }); }
  function unionsOf(up) { return areas.filter(function (a) { return a.level === 'union' && a.parent_id === up && a.active; }); }
  function bar(title, back) { return '<div class="pbar"><button class="bk" data-tab="' + (back || 'home') + '" type="button" aria-label="Back"></button><h2>' + esc(title) + '</h2></div>'; }
  function setBk() { document.querySelectorAll('.bk').forEach(function (e) { e.innerHTML = ZX.ico.back; }); }
  function msg(id, text, ok) { var e = $(id); if (e) { e.textContent = text || ''; e.className = 'fmsg ' + (ok ? 'ok' : 'err'); } }
  function val(id) { var e = $(id); return e ? e.value : ''; }
  async function ensureAreas() { if (!areas.length && ZX.live) { try { areas = await A.areas(); } catch (e) { areas = []; } } }

  /* ---------------- login / sign up ---------------- */
  function notConfigured() {
    return '<div class="soon" style="border-style:solid"><b>' + tt('needSetup') + '</b>' + tt('needSetupS') + '</div>';
  }
  async function renderLogin() {
    var v = $('v-login'); if (!ZX.live) { v.innerHTML = bar(tt('login')) + notConfigured(); setBk(); return; }
    await ensureAreas();
    var up0 = (A.me().profile || {}).upazila_id || '';
    v.innerHTML = bar(mode === 'login' ? tt('login') : tt('signup')) +
      '<div class="hello"><b>' + tt('welcome') + '</b><span>' + tt('welcomeS') + '</span></div>' +
      '<div class="seg"><button type="button" data-mode="login" class="' + (mode === 'login' ? 'on' : '') + '">' + tt('login') + '</button><button type="button" data-mode="signup" class="' + (mode === 'signup' ? 'on' : '') + '">' + tt('signup') + '</button></div>' +
      (mode === 'login'
        ? '<label class="fld"><span>' + tt('phone') + '</span><input id="lPhone" type="tel" inputmode="numeric" autocomplete="username" placeholder="01XXXXXXXXX"></label>' +
          '<label class="fld"><span>' + tt('pass') + '</span><input id="lPass" type="password" autocomplete="current-password"></label>' +
          '<div id="lMsg" class="fmsg"></div><button class="cta-big" id="btnLogin" type="button">' + tt('login') + '</button>'
        : '<label class="fld"><span>' + tt('name') + '</span><input id="sName" type="text" autocomplete="name"></label>' +
          '<label class="fld"><span>' + tt('phone') + '</span><input id="sPhone" type="tel" inputmode="numeric" autocomplete="username" placeholder="01XXXXXXXXX"></label>' +
          '<label class="fld"><span>' + tt('pass') + '</span><input id="sPass" type="password" autocomplete="new-password" placeholder="' + tt('passHint') + '"></label>' +
          '<label class="fld"><span>' + tt('upazila') + '</span><select id="sUp">' + opts(upazilas(), up0) + '</select></label>' +
          '<label class="fld"><span>' + tt('union') + '</span><select id="sUn">' + opts(unionsOf(up0), '') + '</select></label>' +
          '<label class="fld"><span>' + tt('address') + '</span><input id="sAddr" type="text" autocomplete="street-address"></label>' +
          '<div id="sMsg" class="fmsg"></div><button class="cta-big" id="btnSign" type="button">' + tt('signup') + '</button>');
    setBk();
  }
  function afterAuth(text) { ZX.toast(text); var n = next; next = null; ZX.go(n || 'account'); }
  async function doLogin() {
    var b = $('btnLogin'); b.disabled = true; msg('lMsg', tt('saving'), true);
    try { await A.signIn(val('lPhone'), val('lPass')); afterAuth(tt('welcomeBack')); } catch (e) { msg('lMsg', A.errMsg(e)); } b.disabled = false;
  }
  async function doSignup() {
    var b = $('btnSign'); b.disabled = true; msg('sMsg', tt('saving'), true);
    try { await A.signUp({ name: val('sName'), phone: val('sPhone'), password: val('sPass'), upazila_id: val('sUp'), union_id: val('sUn'), address: val('sAddr') }); afterAuth(tt('created')); } catch (e) { msg('sMsg', A.errMsg(e)); } b.disabled = false;
  }

  /* ---------------- account ---------------- */
  function renderAccountTop() {
    var box = $('accTop'); if (!box || !ZX.accountHtml) return; var demo = $('demoBlock');
    if (!ZX.live) { box.innerHTML = notConfigured(); if (demo) demo.style.display = ''; return; }
    if (demo) demo.style.display = 'none';
    var me = A.me(), lg = document.querySelector('#v-account .acclogo'); if (lg) lg.style.display = 'none';
    var p = me.profile || {}, up = areas.filter(function (a) { return a.id === p.upazila_id; })[0], un = areas.filter(function (a) { return a.id === p.union_id; })[0];
    var where = [un && ZX.t({ en: un.name_en, bn: un.name_bn }), up && ZX.t({ en: up.name_en, bn: up.name_bn })].filter(Boolean).join(', ');
    var panels = (me.roles || []).filter(function (r) { return r.status === 'active' && PANEL_OF[r.role]; }).map(function (r) { return { href: 'panels.html#' + PANEL_OF[r.role], label: A.roleLabel(r.role) }; });
    var partner = (me.roles || []).some(function (r) { return r.status === 'active' && ROLE2TYPE[r.role]; });
    box.innerHTML = ZX.accountHtml({ user: !!me.user, name: p.full_name, phone: p.phone, where: where, avatar: p.avatar_url, partner: partner, panels: panels });
    arrows();
  }
  function arrows() { document.querySelectorAll('.ar').forEach(function (e) { e.innerHTML = ZX.ico.arrowR; }); }

  /* ---------------- apply ---------------- */
  function startApply(id) {
    if (!ZX.live) { ZX.toast(tt('needSetup')); return; }
    if (!A.loggedIn()) { next = 'apply'; applyType = id; mode = 'signup'; ZX.toast(tt('loginFirst')); ZX.go('login'); return; }
    applyType = id; gps = null; files = {}; ZX.go('apply');
  }
  async function renderApply() {
    var v = $('v-apply'); if (!applyType) { ZX.go('join'); return; }
    await ensureAreas(); var c = TYPES[applyType], pt = ptype(applyType), me = A.me(), p = me.profile || {};
    var fields = c.fields.map(function (f) {
      var inner = f.type === 'select' ? '<select id="f_' + f.k + '">' + '<option value="">' + tt('choose') + '</option>' + OPT[f.opt].map(function (o) { return '<option value="' + o.v + '">' + esc(ZX.t(o.l)) + '</option>'; }).join('') + '</select>'
        : f.type === 'textarea' ? '<textarea id="f_' + f.k + '" rows="3"></textarea>' : '<input id="f_' + f.k + '" type="' + (f.type === 'number' ? 'number' : f.type === 'tel' ? 'tel' : 'text') + '"' + (f.type === 'number' ? ' inputmode="numeric"' : '') + '>';
      return '<label class="fld"><span>' + esc(ZX.t(f.l)) + (f.req ? '' : ' <i>(' + tt('opt') + ')</i>') + '</span>' + inner + '</label>';
    }).join('');
    var docs = c.docs.map(function (d) {
      return '<div class="docrow"><div><b>' + esc(ZX.t(d.l)) + '</b> <i>(' + (d.req ? tt('req') : tt('opt')) + ')</i><span id="dn_' + d.k + '"></span></div><label class="filebtn">' + tt('pick') + '<input type="file" accept="image/*"' + (d.multi ? ' multiple' : '') + ' data-doc="' + d.k + '"></label></div>';
    }).join('');
    v.innerHTML = bar(tt('applyT') + ' — ' + ZX.t(pt.name), 'join') +
      '<div class="hello"><b>' + pt.emoji + ' ' + esc(ZX.t(pt.name)) + '</b><span>' + esc(ZX.t(pt.who)) + '</span></div>' +
      (c.biz ? '<label class="fld"><span>' + esc(ZX.t(c.biz)) + '</span><input id="aBiz" type="text"></label>' : '') +
      '<label class="fld"><span>' + tt('ownerName') + '</span><input id="aOwner" type="text" value="' + esc(p.full_name || '') + '"></label>' +
      '<label class="fld"><span>' + tt('phone') + '</span><input id="aPhone" type="tel" inputmode="numeric" value="' + esc(p.phone || '') + '"></label>' +
      '<label class="fld"><span>' + tt('upazila') + '</span><select id="aUp">' + opts(upazilas(), p.upazila_id) + '</select></label>' +
      '<label class="fld"><span>' + tt('union') + '</span><select id="aUn">' + opts(unionsOf(p.upazila_id), p.union_id) + '</select></label>' +
      '<label class="fld"><span>' + tt('address') + '</span><input id="aAddr" type="text" value="' + esc(p.address || '') + '"></label>' +
      '<button class="gpsbtn" id="btnGps" type="button">📍 ' + tt('gps') + '</button><div id="gpsMsg" class="fmsg"></div>' + fields +
      '<h3 class="h3s">' + tt('docs') + '</h3>' + docs + '<div id="aMsg" class="fmsg"></div><button class="cta-big" id="btnApply" type="button">' + tt('submit') + '</button>';
    setBk();
  }
  function locate() {
    if (!navigator.geolocation) { msg('gpsMsg', tt('gpsFail')); return; }
    msg('gpsMsg', tt('saving'), true);
    navigator.geolocation.getCurrentPosition(function (pos) { gps = { lat: pos.coords.latitude, lng: pos.coords.longitude }; msg('gpsMsg', tt('gpsOk') + ' (' + gps.lat.toFixed(4) + ', ' + gps.lng.toFixed(4) + ')', true); }, function () { msg('gpsMsg', tt('gpsFail')); }, { enableHighAccuracy: true, timeout: 12000 });
  }
  async function doApply() {
    var c = TYPES[applyType], b = $('btnApply'), biz = c.biz ? val('aBiz').trim() : val('aOwner').trim(), owner = val('aOwner').trim(), details = {}, bad = false;
    if (!biz || !owner || !A.normPhone(val('aPhone')) || !val('aUp')) bad = true;
    c.fields.forEach(function (f) { var x = val('f_' + f.k).trim(); details[f.k] = x; if (f.req && !x) bad = true; });
    c.docs.forEach(function (d) { if (d.req && !(files[d.k] && files[d.k].length)) bad = true; });
    if (bad) { msg('aMsg', tt('fillReq')); return; }
    b.disabled = true; msg('aMsg', tt('sending'), true);
    var id;
    try { id = await A.submitApplication(A.PARTNER_ROLE[applyType], { business_name: biz, owner_name: owner, phone: val('aPhone'), upazila_id: val('aUp'), union_id: val('aUn'), address: val('aAddr'), lat: gps && gps.lat, lng: gps && gps.lng, details: details }); }
    catch (e) { msg('aMsg', A.errMsg(e)); b.disabled = false; return; }
    var failed = 0; msg('aMsg', tt('uploading'), true);
    for (var i = 0; i < c.docs.length; i++) { var d = c.docs[i], list = files[d.k] || []; for (var j = 0; j < list.length; j++) { try { await A.uploadDoc(id, d.k, list[j]); } catch (e) { failed++; } } }
    b.disabled = false; ZX.toast(failed ? tt('partialOk') : tt('sentOk')); await A.refresh(); ZX.go('myapps');
  }

  /* ---------------- my applications ---------------- */
  async function renderMyApps() {
    var v = $('v-myapps'); v.innerHTML = bar(tt('myApps'), 'account') + '<div class="soon">' + tt('saving') + '</div>'; setBk();
    if (!ZX.live || !A.loggedIn()) { v.innerHTML = bar(tt('myApps'), 'account') + '<div class="soon"><b>' + tt('loginFirst') + '</b></div><button class="cta-big" type="button" data-go="login">' + tt('login') + '</button>'; setBk(); return; }
    var apps; try { apps = await A.myApplications(); } catch (e) { v.innerHTML = bar(tt('myApps'), 'account') + '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; setBk(); return; }
    var h = bar(tt('myApps'), 'account');
    if (!apps.length) h += '<div class="soon"><b>' + tt('noApps') + '</b></div><a class="cta-big" href="#join">' + ZX.d('joinT') + '</a>';
    apps.forEach(function (a) {
      var tid = ROLE2TYPE[a.category], c = TYPES[tid], pt = ptype(tid), have = (a.docs || []).map(function (d) { return d.kind; });
      var miss = c.docs.filter(function (d) { return d.req && have.indexOf(d.k) < 0; });
      h += '<div class="appcard"><div class="ahead"><span class="le">' + pt.emoji + '</span><div><b>' + esc(a.business_name) + '</b><span>' + esc(ZX.t(pt.name)) + ' · ' + esc(new Date(a.created_at).toLocaleDateString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB')) + '</span></div>' + chip(A.statusLabel(a.status), tone(a.status)) + '</div>' +
        (a.sales_note ? '<p class="note2"><b>' + tt('sales') + ':</b> ' + esc(a.sales_note) + '</p>' : '') + (a.admin_note ? '<p class="note2"><b>' + tt('admin') + ':</b> ' + esc(a.admin_note) + '</p>' : '') +
        '<p class="note2">' + (have.length ? tt('uploaded') + ': ' + have.map(function (k) { return esc(k); }).join(', ') : tt('noDocs')) + '</p>';
      if (['pending', 'recommended', 'not_recommended'].indexOf(a.status) > -1 && miss.length) {
        h += '<div class="miss"><b>' + tt('missing') + '</b>' + miss.map(function (d) { return '<div class="docrow"><div>' + esc(ZX.t(d.l)) + '</div><label class="filebtn">' + tt('add') + '<input type="file" accept="image/*" data-late="' + a.id + '|' + d.k + '"></label></div>'; }).join('') + '</div>';
      }
      if (a.status === 'rejected') h += '<button class="cta-big" type="button" data-apply="' + tid + '" style="padding:10px">' + tt('reapply') + '</button>';
      if (a.status === 'approved' && PANEL_OF[a.category]) h += '<a class="cta-big" href="panels.html#' + PANEL_OF[a.category] + '" style="padding:10px">' + tt('openPanel') + '</a>';
      h += '</div>';
    });
    v.innerHTML = h; setBk();
  }

  /* ---------------- wiring ---------------- */
  var viewRender = { login: renderLogin, apply: renderApply, myapps: renderMyApps };
  ZX.onView = function (t) { if (viewRender[t]) viewRender[t](); if (t === 'account') { ensureAreas().then(renderAccountTop); renderAccountTop(); } };
  var prevLang = ZX.onLang; ZX.onLang = function () { if (prevLang) prevLang(); renderAccountTop(); setHeaderAvatar(); var cur = document.querySelector('.view.on'); if (cur && viewRender[cur.id.slice(2)]) viewRender[cur.id.slice(2)](); };
  function setHeaderAvatar() {
    var av = $('avIco'), p = A.me().profile; if (!av) return;
    av.innerHTML = p && p.avatar_url ? '<img class="avimg" src="' + esc(p.avatar_url) + '" alt="">' : (p && p.full_name ? '<b class="avl">' + esc(p.full_name.trim().charAt(0).toUpperCase()) + '</b>' : ZX.ico.user);
  }
  A.onChange(function () { renderAccountTop(); setHeaderAvatar(); });

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-mode],[data-go],[data-apply],#btnLogin,#btnSign,#btnApply,#btnGps'); if (!t) return;
    if (t.hasAttribute('data-mode')) { mode = t.getAttribute('data-mode'); renderLogin(); return; }
    if (t.hasAttribute('data-apply')) { startApply(t.getAttribute('data-apply')); return; }
    if (t.hasAttribute('data-go')) { var g = t.getAttribute('data-go'); if (g === 'logout') { A.signOut().then(function () { ZX.toast(tt('loggedOut')); ZX.go('home'); }); } else { mode = 'login'; ZX.go(g); } return; }
    if (t.id === 'btnLogin') doLogin(); else if (t.id === 'btnSign') doSignup(); else if (t.id === 'btnApply') doApply(); else if (t.id === 'btnGps') locate();
  });
  document.addEventListener('change', async function (e) {
    var t = e.target;
    if (t.id === 'sUp' || t.id === 'aUp') { var un = $(t.id === 'sUp' ? 'sUn' : 'aUn'); if (un) un.innerHTML = opts(unionsOf(t.value), ''); return; }
    if (t.hasAttribute && t.hasAttribute('data-doc')) { var k = t.getAttribute('data-doc'); files[k] = Array.prototype.slice.call(t.files || []); var n = $('dn_' + k); if (n) n.textContent = files[k].length ? ' ✔ ' + ZX.digits(files[k].length) + ' ' + tt('picked') : ''; return; }
    if (t.hasAttribute && t.hasAttribute('data-late')) {
      var parts = t.getAttribute('data-late').split('|'), f = t.files && t.files[0]; if (!f) return; ZX.toast(tt('uploading'));
      try { await A.uploadDoc(parts[0], parts[1], f); ZX.toast(tt('uploaded')); renderMyApps(); } catch (er) { ZX.toast(A.errMsg(er)); }
    }
  });
  if (location.hash === '#login' || location.hash === '#apply' || location.hash === '#myapps') { ZX.onView(location.hash.slice(1)); }
  renderAccountTop();
})();
