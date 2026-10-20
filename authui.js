/* Zilax — login and 3-step sign-up screens (Step 5). Works with ZX.auth; stage1.js calls ZX.authView(view, ctx). */
(function () {
  var A = ZX.auth, $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var T = {
    welcome: { en: 'Welcome back', bn: 'আবার স্বাগতম' }, welcomeS: { en: 'Log in to order, track and manage your account.', bn: 'অর্ডার, ট্র্যাকিং ও অ্যাকাউন্ট সামলাতে লগইন করুন।' },
    phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' }, pass: { en: 'Password', bn: 'পাসওয়ার্ড' }, login: { en: 'Log in', bn: 'লগইন' },
    forgot: { en: 'Forgot password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' }, forgotMsg: { en: 'Hello Zilax, I forgot my password. My mobile number is ', bn: 'হ্যালো জিলাক্স, আমি পাসওয়ার্ড ভুলে গেছি। আমার মোবাইল নম্বর ' },
    newTo: { en: 'New to Zilax?', bn: 'জিলাক্সে নতুন?' }, create: { en: 'Create account', bn: 'অ্যাকাউন্ট খুলুন' }, have: { en: 'Already have an account?', bn: 'আগেই অ্যাকাউন্ট আছে?' },
    suT: { en: 'Create your account', bn: 'অ্যাকাউন্ট খুলুন' }, step: { en: 'Step', bn: 'ধাপ' }, of: { en: 'of', bn: '/' },
    s1: { en: 'Your mobile number', bn: 'আপনার মোবাইল নম্বর' }, s1s: { en: 'This will be your login. We use it for orders and support.', bn: 'এটাই আপনার লগইন হবে। অর্ডার ও সাপোর্টে ব্যবহার হবে।' },
    s2: { en: 'Name and password', bn: 'নাম ও পাসওয়ার্ড' }, s2s: { en: 'Choose a password you can remember.', bn: 'মনে রাখতে পারবেন এমন একটা পাসওয়ার্ড দিন।' },
    s3: { en: 'Where are you?', bn: 'আপনি কোথায় থাকেন?' }, s3s: { en: 'So we can show services near you.', bn: 'কাছের সেবা দেখাতে এটা দরকার।' },
    name: { en: 'Full name', bn: 'পুরো নাম' }, pass2: { en: 'Confirm password', bn: 'পাসওয়ার্ড আবার লিখুন' }, hint: { en: 'At least 6 characters', bn: 'কমপক্ষে ৬ অক্ষর' },
    up: { en: 'Upazila', bn: 'উপজেলা' }, un: { en: 'Union / Paurashava', bn: 'ইউনিয়ন / পৌরসভা' }, addr: { en: 'Village, road, house (optional)', bn: 'গ্রাম, রাস্তা, বাড়ি (ঐচ্ছিক)' }, choose: { en: 'Choose…', bn: 'বাছাই করুন…' },
    next: { en: 'Continue', bn: 'পরবর্তী' }, back: { en: 'Back', bn: 'পেছনে' },
    ePhone: { en: 'Enter an 11-digit mobile number, like 01XXXXXXXXX.', bn: '১১ অঙ্কের মোবাইল নম্বর দিন, যেমন 01XXXXXXXXX।' }, eName: { en: 'Please enter your name.', bn: 'আপনার নাম লিখুন।' },
    ePass: { en: 'Password must be at least 6 characters.', bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' }, ePass2: { en: 'The two passwords do not match.', bn: 'দুটি পাসওয়ার্ড মিলছে না।' }, ePassIn: { en: 'Enter your password.', bn: 'পাসওয়ার্ড দিন।' },
    weak: { en: 'Weak', bn: 'দুর্বল' }, ok: { en: 'Okay', bn: 'মোটামুটি' }, strong: { en: 'Strong', bn: 'শক্ত' },
    agree1: { en: 'I agree to the ', bn: 'আমি ' }, terms: { en: 'Terms of use', bn: 'ব্যবহারের শর্ত' }, and: { en: ' and ', bn: ' ও ' }, priv: { en: 'Privacy policy', bn: 'গোপনীয়তা নীতি' }, agree2: { en: '', bn: ' মেনে নিচ্ছি' },
    eAgree: { en: 'Please agree to the terms to continue.', bn: 'চালিয়ে যেতে শর্তে সম্মত হতে হবে।' }, wait: { en: 'Please wait…', bn: 'অপেক্ষা করুন…' },
    welcomeBack: { en: 'Welcome back', bn: 'আবার স্বাগতম' }, created: { en: 'Account created. Welcome to Zilax!', bn: 'অ্যাকাউন্ট খোলা হয়েছে। জিলাক্সে স্বাগতম!' }
  };
  var t = function (k) { return ZX.t(T[k]); };
  var st = { mode: 'login', step: 1, phone: '', name: '', pass: '', pass2: '', up: '', un: '', addr: '', agree: false };
  var ctx = null, v = null, areas = [];
  var phoneOk = function (p) { return /^01[3-9]\d{8}$/.test(p); };
  var digits = function (s) { var d = String(s || '').replace(/\D/g, ''); if (d.length === 13 && d.indexOf('88') === 0) d = d.slice(2); return d.slice(0, 11); };
  function unions(up) { return areas.filter(function (a) { return a.level === 'union' && a.parent_id === up && a.active; }); }
  function opts(list, sel) { return '<option value="">' + t('choose') + '</option>' + list.map(function (a) { return '<option value="' + esc(a.id) + '"' + (a.id === sel ? ' selected' : '') + '>' + esc(ZX.t({ en: a.name_en, bn: a.name_bn })) + '</option>'; }).join(''); }
  function eye(id) { return '<button type="button" class="eye" data-a="eye:' + id + '" aria-label="Show">' + ZX.ico.a_eye + '</button>'; }
  function fld(label, inner, errId) { return '<div class="fld"><span>' + label + '</span>' + inner + '<div class="ferr" id="' + errId + '"></div></div>'; }
  function perr(id, text) { var e = $(id); if (e) e.textContent = text || ''; var f = e && e.parentNode.querySelector('input,select'); if (f) f.classList.toggle('bad', !!text); }
  function val(id) { var e = $(id); return e ? e.value : ''; }
  function grab() {
    if (!v || !$('authBox')) return;
    if ($('lPhone')) st.phone = digits(val('lPhone')); if ($('sPhone')) st.phone = digits(val('sPhone'));
    if ($('sName')) st.name = val('sName'); if ($('sPass')) { st.pass = val('sPass'); st.pass2 = val('sPass2'); }
    if ($('sUp')) { st.up = val('sUp'); st.un = val('sUn'); st.addr = val('sAddr'); st.agree = $('sAgree').checked; }
  }
  function head() { return '<div class="authh"><img src="icon-512.png" alt="Zilax"></div>'; }
  function renderLogin() {
    v.innerHTML = '<div class="pbar"><button class="bk" data-tab="home" type="button" aria-label="Back">' + ZX.ico.back + '</button><h2>' + t('login') + '</h2></div><div id="authBox" class="auth">' + head() +
      '<h1>' + t('welcome') + '</h1><p class="adsub">' + t('welcomeS') + '</p>' +
      fld(t('phone'), '<div class="ph"><i>+88</i><input id="lPhone" type="tel" inputmode="numeric" maxlength="11" autocomplete="username" placeholder="01XXXXXXXXX" value="' + esc(st.phone) + '"></div>', 'lPhoneE') +
      fld(t('pass'), '<div class="pwf"><input id="lPass" type="password" autocomplete="current-password">' + eye('lPass') + '</div>', 'lPassE') +
      '<div class="fgt"><a href="#" data-a="forgot">' + t('forgot') + '</a></div><div id="lMsg" class="fmsg"></div>' +
      '<button class="cta-big" id="aLogin" type="button" data-a="login">' + t('login') + '</button>' +
      '<p class="altm">' + t('newTo') + ' <a href="#" data-a="mode:signup">' + t('create') + '</a></p></div>';
  }
  function bars() { return '<div class="prog">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= st.step ? 'on' : '') + '"></i>'; }).join('') + '</div><small class="stp">' + t('step') + ' ' + ZX.digits(st.step) + ' ' + t('of') + ' ' + ZX.digits(3) + '</small>'; }
  function renderSignup() {
    var s = st.step, body;
    if (s === 1) body = '<h1>' + t('s1') + '</h1><p class="adsub">' + t('s1s') + '</p>' + fld(t('phone'), '<div class="ph"><i>+88</i><input id="sPhone" type="tel" inputmode="numeric" maxlength="11" autocomplete="username" placeholder="01XXXXXXXXX" value="' + esc(st.phone) + '"></div>', 'sPhoneE');
    else if (s === 2) body = '<h1>' + t('s2') + '</h1><p class="adsub">' + t('s2s') + '</p>' + fld(t('name'), '<input id="sName" type="text" autocomplete="name" value="' + esc(st.name) + '">', 'sNameE') +
      fld(t('pass'), '<div class="pwf"><input id="sPass" type="password" autocomplete="new-password" placeholder="' + esc(t('hint')) + '" value="' + esc(st.pass) + '">' + eye('sPass') + '</div><div class="meter"><i id="mtr"></i></div><small id="mtrT" class="mtrt"></small>', 'sPassE') +
      fld(t('pass2'), '<div class="pwf"><input id="sPass2" type="password" autocomplete="new-password" value="' + esc(st.pass2) + '">' + eye('sPass2') + '</div>', 'sPass2E');
    else body = '<h1>' + t('s3') + '</h1><p class="adsub">' + t('s3s') + '</p>' + fld(t('up'), '<select id="sUp">' + opts(areas.filter(function (a) { return a.level === 'upazila' && a.active; }), st.up) + '</select>', 'sUpE') +
      fld(t('un'), '<select id="sUn">' + opts(unions(st.up), st.un) + '</select>', 'sUnE') + fld(t('addr'), '<input id="sAddr" type="text" autocomplete="street-address" value="' + esc(st.addr) + '">', 'sAddrE') +
      '<label class="agree"><input id="sAgree" type="checkbox"' + (st.agree ? ' checked' : '') + '><span>' + t('agree1') + '<a href="#" data-legal="terms">' + t('terms') + '</a>' + t('and') + '<a href="#" data-legal="privacy">' + t('priv') + '</a>' + t('agree2') + '</span></label><div class="ferr" id="sAgreeE"></div>';
    var btn = s < 3 ? '<button class="cta-big" type="button" data-a="next">' + t('next') + '</button>' : '<button class="cta-big" id="aCreate" type="button" data-a="create"' + (st.agree ? '' : ' disabled') + '>' + t('create') + '</button>';
    v.innerHTML = '<div class="pbar"><button class="bk" data-a="' + (s > 1 ? 'prev' : 'mode:login') + '" type="button" aria-label="Back">' + ZX.ico.back + '</button><h2>' + t('suT') + '</h2></div><div id="authBox" class="auth">' + bars() + body + '<div id="sMsg" class="fmsg"></div>' + btn +
      (s === 1 ? '<p class="altm">' + t('have') + ' <a href="#" data-a="mode:login">' + t('login') + '</a></p>' : '') + '</div>';
    if (s === 2) meter();
  }
  function meter() {
    var p = val('sPass'), sc = (p.length >= 6) + (p.length >= 9) + (/[A-Za-z]/.test(p) && /\d/.test(p)) + (/[^A-Za-z0-9]/.test(p)), m = $('mtr'), tx = $('mtrT'); if (!m) return;
    var lvl = !p ? 0 : (p.length < 6 ? 1 : sc >= 3 ? 3 : 2); m.style.width = [0, 33, 66, 100][lvl] + '%'; m.className = 'l' + lvl; tx.textContent = lvl ? t(['', 'weak', 'ok', 'strong'][lvl]) : '';
  }
  async function render() { if (st.mode === 'login') renderLogin(); else { if (!areas.length) { try { areas = await A.areas(); } catch (e) { areas = []; } } renderSignup(); } }
  ZX.authView = function (view, c) { grab(); v = view; ctx = c; areas = c.areas || areas; if (!$('authBox') || c.fresh) st.mode = c.mode || st.mode; render(); };

  async function doLogin() {
    var ph = digits(val('lPhone')), pw = val('lPass'), bad = false; st.phone = ph;
    perr('lPhoneE', phoneOk(ph) ? '' : t('ePhone')); perr('lPassE', pw ? '' : t('ePassIn')); if (!phoneOk(ph) || !pw) return;
    var b = $('aLogin'); b.disabled = true; b.classList.add('spin'); var m = $('lMsg'); m.className = 'fmsg'; m.textContent = '';
    try { await A.signIn(ph, pw); ctx.afterAuth(t('welcomeBack')); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); } b.disabled = false; b.classList.remove('spin');
  }
  function step(dir) {
    grab(); var ok = true;
    if (st.step === 1 && dir > 0) { ok = phoneOk(st.phone); perr('sPhoneE', ok ? '' : t('ePhone')); }
    if (st.step === 2 && dir > 0) {
      var a1 = !!st.name.trim(), a2 = st.pass.length >= 6, a3 = st.pass === st.pass2; perr('sNameE', a1 ? '' : t('eName')); perr('sPassE', a2 ? '' : t('ePass')); perr('sPass2E', a3 || !a2 ? '' : t('ePass2')); ok = a1 && a2 && a3;
    }
    if (!ok) return; st.step += dir; renderSignup();
  }
  async function doCreate() {
    grab(); if (!st.agree) { perr('sAgreeE', t('eAgree')); return; }
    var b = $('aCreate'); b.disabled = true; b.classList.add('spin'); var m = $('sMsg'); m.className = 'fmsg'; m.textContent = '';
    try { await A.signUp({ name: st.name, phone: st.phone, password: st.pass, upazila_id: st.up, union_id: st.un, address: st.addr, terms_version: ZX.LEGAL_VERSION || '' }); var n = t('created'); st = { mode: 'login', step: 1, phone: '', name: '', pass: '', pass2: '', up: '', un: '', addr: '', agree: false }; ctx.afterAuth(n); }
    catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); b.disabled = !st.agree; b.classList.remove('spin'); }
  }
  document.addEventListener('click', function (e) {
    var x = e.target.closest('[data-a]'); if (!x || !v || !v.contains(x)) return; e.preventDefault();
    var p = x.getAttribute('data-a').split(':'), k = p[0];
    if (k === 'mode') { grab(); st.mode = p[1]; st.step = 1; render(); }
    else if (k === 'eye') { var i = $(p[1]); if (i) { var sh = i.type === 'password'; i.type = sh ? 'text' : 'password'; x.innerHTML = sh ? ZX.ico.a_eyeoff : ZX.ico.a_eye; } }
    else if (k === 'login') doLogin(); else if (k === 'next') step(1); else if (k === 'prev') step(-1); else if (k === 'create') doCreate();
    else if (k === 'forgot') { var ph = digits(val('lPhone')); window.open('https://wa.me/' + ((ZX.support && ZX.support.wa) || '8801646921627') + '?text=' + encodeURIComponent(t('forgotMsg') + ph), '_blank', 'noopener'); }
  });
  document.addEventListener('input', function (e) {
    var x = e.target; if (!v || !v.contains(x)) return;
    if (x.id === 'lPhone' || x.id === 'sPhone') { var d = digits(x.value); if (x.value !== d) x.value = d; }
    if (x.id === 'sPass') meter();
    if (x.className && x.classList.contains('bad')) { x.classList.remove('bad'); var er = x.closest('.fld') && x.closest('.fld').querySelector('.ferr'); if (er) er.textContent = ''; }
  });
  document.addEventListener('change', function (e) {
    var x = e.target; if (!v || !v.contains(x)) return;
    if (x.id === 'sUp') { st.up = x.value; st.un = ''; $('sUn').innerHTML = opts(unions(x.value), ''); }
    if (x.id === 'sAgree') { st.agree = x.checked; $('aCreate').disabled = !x.checked; perr('sAgreeE', ''); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || !v || !v.contains(e.target)) return;
    if (st.mode === 'login') doLogin(); else if (st.step < 3) step(1);
  });
})();
