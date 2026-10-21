/* Zilax — Stage 1 live panels: access gate, application review, staff roles, areas, audit log. */
(function () {
  var A = ZX.auth, D = ZX.data, esc = A.esc;
  var NEED = { merchant: ['merchant_food', 'merchant_shop', 'super_admin'], rider: ['rider', 'super_admin'], sales: ['sales_admin', 'admin', 'super_admin'], admin: ['admin', 'super_admin'], super: ['super_admin'] };
  var L = {
    loading: { en: 'Loading…', bn: 'লোড হচ্ছে…' }, loginT: { en: 'Staff & partner login', bn: 'স্টাফ ও পার্টনার লগইন' }, phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' }, pass: { en: 'Password', bn: 'পাসওয়ার্ড' }, login: { en: 'Log in', bn: 'লগইন' }, logout: { en: 'Log out', bn: 'লগআউট' },
    noAccess: { en: 'No access to this panel', bn: 'এই প্যানেলে আপনার প্রবেশাধিকার নেই' }, noAccessS: { en: 'Your account does not have this role. Ask a Super Admin or apply as a partner.', bn: 'আপনার অ্যাকাউন্টে এই ভূমিকা নেই। সুপার অ্যাডমিনকে বলুন অথবা পার্টনার হিসেবে আবেদন করুন।' },
    pendingT: { en: 'Your application is waiting for approval', bn: 'আপনার আবেদন অনুমোদনের অপেক্ষায়' }, pendingS: { en: 'You will get access as soon as an Admin approves it.', bn: 'অ্যাডমিন অনুমোদন দিলেই আপনি প্রবেশ করতে পারবেন।' },
    open: { en: 'Open', bn: 'চলমান' }, approved: { en: 'Approved', bn: 'অনুমোদিত' }, rejected: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' }, none: { en: 'Nothing here yet.', bn: 'এখানে এখনো কিছু নেই।' },
    applicant: { en: 'Applicant', bn: 'আবেদনকারী' }, address: { en: 'Address', bn: 'ঠিকানা' }, map: { en: 'Open map', bn: 'মানচিত্র দেখুন' }, docs: { en: 'Documents', bn: 'কাগজ ও ছবি' }, noDocs: { en: 'No documents uploaded', bn: 'কোনো ছবি আপলোড হয়নি' },
    note: { en: 'Your note (optional)', bn: 'আপনার নোট (ঐচ্ছিক)' }, salesNote: { en: 'Sales note', bn: 'সেলস নোট' }, adminNote: { en: 'Admin note', bn: 'অ্যাডমিন নোট' },
    recommend: { en: 'Recommend', bn: 'সুপারিশ করুন' }, notRec: { en: 'Do not recommend', bn: 'সুপারিশ করবেন না' }, approve: { en: 'Approve', bn: 'অনুমোদন' }, reject: { en: 'Reject', bn: 'প্রত্যাখ্যান' }, done: { en: 'Saved', bn: 'সংরক্ষিত' },
    staff: { en: 'Staff roles', bn: 'স্টাফের ভূমিকা' }, grant: { en: 'Give role', bn: 'ভূমিকা দিন' }, revoke: { en: 'Remove', bn: 'সরান' }, roleSel: { en: 'Role', bn: 'ভূমিকা' }, grantHint: { en: 'The person must sign up in the app first. Enter their mobile number.', bn: 'ব্যক্তিকে আগে অ্যাপে সাইন আপ করতে হবে। তাঁর মোবাইল নম্বর দিন।' },
    sure: { en: 'Are you sure?', bn: 'আপনি কি নিশ্চিত?' }, areas: { en: 'Areas', bn: 'এলাকা' }, addArea: { en: 'Add union / paurashava', bn: 'ইউনিয়ন / পৌরসভা যোগ করুন' }, upazila: { en: 'Upazila', bn: 'উপজেলা' }, nameEn: { en: 'Name (English)', bn: 'নাম (ইংরেজি)' }, nameBn: { en: 'Name (Bangla)', bn: 'নাম (বাংলা)' }, add: { en: 'Add', bn: 'যোগ করুন' },
    hide: { en: 'Hide', bn: 'লুকান' }, show: { en: 'Show', bn: 'দেখান' }, audit: { en: 'Recent changes', bn: 'সাম্প্রতিক পরিবর্তন' }, when: { en: 'When', bn: 'কখন' }, who: { en: 'Who', bn: 'কে' }, what: { en: 'What', bn: 'কী' }
  };
  var l = function (k) { return ZX.t(L[k]); };
  var STAFF_ROLES = ['sales_admin', 'admin', 'super_admin'];
  function ptypeOf(cat) { var k = Object.keys(A.PARTNER_ROLE).filter(function (x) { return A.PARTNER_ROLE[x] === cat; })[0]; return D.partnerTypes.filter(function (p) { return p.id === k; })[0] || { emoji: '📄', name: { en: cat, bn: cat } }; }
  function chip(txt, t) { return '<span class="chip ' + (t || '') + '">' + esc(txt) + '</span>'; }
  function tone(s) { return { active: 'ok', approved: 'ok', recommended: 'ok', pending: 'w', not_recommended: 'w', rejected: 'r' }[s] || ''; }
  function fdate(d) { try { return new Date(d).toLocaleString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return d; } }
  function areaName(list, id) { var a = list.filter(function (x) { return x.id === id; })[0]; return a ? ZX.t({ en: a.name_en, bn: a.name_bn }) : ''; }
  function head(title, sub) { return '<h2 class="pt serif">' + esc(title) + '</h2><p class="ps">' + esc(sub || '') + '</p>'; }

  /* ---------- gates ---------- */
  function gateLoading(el) { el.innerHTML = '<div class="soon">' + l('loading') + '</div>'; }
  function gateLogin(el) {
    el.innerHTML = '<div class="cardx" style="max-width:420px"><h3>' + l('loginT') + '</h3><label class="fld"><span>' + l('phone') + '</span><input class="inp" id="gPhone" type="tel" inputmode="numeric" placeholder="01XXXXXXXXX"></label><label class="fld"><span>' + l('pass') + '</span><input class="inp" id="gPass" type="password"></label><div id="gMsg" class="fmsg"></div><button class="btn" id="gGo" type="button">' + l('login') + '</button></div>';
    el.querySelector('#gGo').onclick = async function () { var m = el.querySelector('#gMsg'); m.className = 'fmsg ok'; m.textContent = '…'; try { await A.signIn(el.querySelector('#gPhone').value, el.querySelector('#gPass').value); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); } };
  }
  function gateNoAccess(el, role) {
    var pend = NEED[role].some(function (r) { return A.roleStatus(r) === 'pending'; });
    el.innerHTML = '<div class="soon" style="border-style:solid"><b>' + (pend ? l('pendingT') : l('noAccess')) + '</b>' + (pend ? l('pendingS') : l('noAccessS')) + '</div><p><a class="btn" href="index.html#join" style="display:inline-block;margin-top:10px">' + ZX.d('joinT') + '</a></p>';
  }

  /* ---------- applications board (premium): Sales recommends, Admin approves ---------- */
  var CATS = { merchant_food: ['food', '#ea580c'], merchant_shop: ['store', '#2563eb'], rider: ['bike', '#e11d48'], technician: ['tool', '#0d9488'], car_partner: ['car', '#7c3aed'], decoration: ['spark', '#db2777'], sound_light: ['speaker', '#ca8a04'] };
  var OPEN = ['pending', 'recommended', 'not_recommended'];
  var Q = {
    tLead: { en: 'Partner leads', bn: 'পার্টনার লিড' }, sLead: { en: 'Check the papers, then recommend or not.', bn: 'কাগজ দেখে সুপারিশ করুন বা করবেন না।' },
    tAppr: { en: 'Approvals', bn: 'অনুমোদন' }, sAppr: { en: 'Final decision on partner applications.', bn: 'পার্টনার আবেদনের চূড়ান্ত সিদ্ধান্ত।' },
    srch: { en: 'Search business, name or phone', bn: 'দোকান, নাম বা ফোন খুঁজুন' }, all: { en: 'All', bn: 'সব' }, noMatch: { en: 'No application matches.', bn: 'কোনো আবেদন মেলেনি।' },
    wait: { en: 'waiting', bn: 'অপেক্ষায়' }, now: { en: 'Just now', bn: 'এইমাত্র' }, contact: { en: 'Contact', bn: 'যোগাযোগ' }, loc: { en: 'Location', bn: 'অবস্থান' }, det: { en: 'Business details', bn: 'ব্যবসার তথ্য' },
    dec: { en: 'Your decision', bn: 'আপনার সিদ্ধান্ত' }, call: { en: 'Call', bn: 'কল' }, wa: { en: 'WhatsApp', bn: 'WhatsApp' }, owner: { en: 'Owner', bn: 'মালিক' }, applied: { en: 'Applied', bn: 'আবেদনের সময়' },
    confirmOk: { en: 'Approve this partner? They will get access to their panel.', bn: 'এই পার্টনারকে অনুমোদন দেবেন? তিনি নিজের প্যানেলে ঢুকতে পারবেন।' }, confirmNo: { en: 'Reject this application?', bn: 'এই আবেদন প্রত্যাখ্যান করবেন?' },
    confirmRec: { en: 'Send this recommendation to Admin?', bn: 'অ্যাডমিনের কাছে এই সুপারিশ পাঠাবেন?' }, close: { en: 'Close', bn: 'বন্ধ করুন' }
  };
  var q = function (k) { return ZX.t(Q[k]); };
  function ago(d) {
    var m = Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 60000)); if (m < 60) return m < 2 ? q('now') : ZX.digits(m) + (ZX.lang === 'bn' ? ' মিনিট আগে' : 'm ago');
    var h = Math.round(m / 60); if (h < 24) return ZX.digits(h) + (ZX.lang === 'bn' ? ' ঘণ্টা আগে' : 'h ago');
    var dd = Math.round(h / 24); return ZX.digits(dd) + (ZX.lang === 'bn' ? ' দিন আগে' : 'd ago');
  }
  function stc(s) { return '<span class="stc st-' + esc(s) + '">' + esc(A.statusLabel(s)) + '</span>'; }
  function wa2(phone) { var d = String(phone || '').replace(/\D/g, ''); if (d.length === 11 && d.charAt(0) === '0') d = '88' + d; return d; }
  function appsBoard(mode) {
    return async function (el) {
      var tab = 'open', cat = 'all', qs = '', apps = [], areas = [], cur = null, old = document.getElementById('aSheet'); if (old) old.remove();
      el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
      try { areas = await A.areas(); } catch (e) { }
      async function load() { try { apps = await A.listApplications(null); } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return false; } return true; }
      var isOpen = function (a) { return OPEN.indexOf(a.status) > -1; };
      var inTab = function (a, t) { return t === 'open' ? isOpen(a) : a.status === t; };
      function matches(a) { if (cat !== 'all' && a.category !== cat) return false; var s = qs.trim().toLowerCase(); if (!s) return true; return [a.business_name, (a.applicant || {}).full_name, a.owner_name, a.phone].join(' ').toLowerCase().indexOf(s) > -1; }
      function catOf(c) { var k = CATS[c] || ['store', '#64748b']; return { ico: k[0], col: k[1], name: ZX.t(ptypeOf(c).name) }; }
      function paintStats() {
        var S = [['open', '#ea580c', 'clock'], ['approved', '#15803d', 'check'], ['rejected', '#dc2626', 'x']];
        el.querySelector('#abStats').innerHTML = S.map(function (s) { var n0 = apps.filter(function (a) { return inTab(a, s[0]); }).length; return '<button type="button" class="ast' + (tab === s[0] ? ' on' : '') + '" style="--ac:' + s[1] + '" data-tab2="' + s[0] + '"><span>' + ic(s[2]) + '</span><b>' + ZX.digits(n0) + '</b><small>' + l(s[0]) + '</small></button>'; }).join('');
      }
      function paintCats() {
        var present = []; apps.forEach(function (a) { if (present.indexOf(a.category) < 0) present.push(a.category); });
        el.querySelector('#abCats').innerHTML = ['all'].concat(present).map(function (c) { var o = c === 'all' ? null : catOf(c); return '<button type="button" class="acat' + (cat === c ? ' on' : '') + '" data-cat="' + c + '"' + (o ? ' style="--ac:' + o.col + '"' : '') + '>' + (o ? '<i></i>' + esc(o.name) : q('all')) + '</button>'; }).join('');
      }
      function paintList() {
        var list = apps.filter(function (a) { return inTab(a, tab) && matches(a); }), box = el.querySelector('#abList');
        box.innerHTML = list.length ? list.map(function (a) {
          var c = catOf(a.category), days = Math.floor((Date.now() - new Date(a.created_at).getTime()) / 864e5);
          return '<button type="button" class="acard" data-open="' + a.id + '"><span class="aic" style="--ac:' + c.col + '">' + ic(c.ico) + '</span><div class="g"><b>' + esc(a.business_name) + '</b><small>' + esc(c.name) + ' · ' + esc((a.applicant || {}).full_name || a.owner_name || '') + '</small><small class="mut">' + esc(a.phone) + ' · ' + esc(ago(a.created_at)) + '</small></div><div class="aside">' + stc(a.status) + (isOpen(a) && days >= 3 ? '<em class="late">' + ZX.digits(days) + (ZX.lang === 'bn' ? ' দিন' : 'd') + ' ' + q('wait') + '</em>' : '') + '</div></button>';
        }).join('') : '<div class="soon">' + (apps.length ? q('noMatch') : l('none')) + '</div>';
      }
      function shell() {
        el.innerHTML = '<h2 class="pt serif">' + (mode === 'sales' ? q('tLead') : q('tAppr')) + '</h2><p class="ps">' + (mode === 'sales' ? q('sLead') : q('sAppr')) + '</p><div class="astats" id="abStats"></div>' +
          '<div class="srch"><span>' + ic('search') + '</span><input id="abq" type="search" placeholder="' + esc(q('srch')) + '" autocomplete="off"></div><div class="acats" id="abCats"></div><div id="abList"></div>';
        el.querySelector('#abq').addEventListener('input', function (e) { qs = e.target.value; paintList(); });
        paintStats(); paintCats(); paintList();
      }
      function sheetEl() {
        var sh = document.getElementById('aSheet'); if (sh) return sh;
        sh = document.createElement('div'); sh.className = 'sheet'; sh.id = 'aSheet'; sh.innerHTML = '<div class="pan" id="aPan"></div>'; document.body.appendChild(sh);
        sh.addEventListener('click', function (e) { if (e.target === sh || e.target.closest('[data-aclose]')) sh.classList.remove('show'); });
        sh.addEventListener('click', onAct); return sh;
      }
      function pair(k, v) { return v ? '<div class="apair"><small>' + esc(k) + '</small><b>' + esc(v) + '</b></div>' : ''; }
      async function openSheet(a) {
        cur = a; var c = catOf(a.category), d = a.details || {}, sh = sheetEl(), open = isOpen(a), ph = String(a.phone || '');
        var area = [areaName(areas, a.union_id), areaName(areas, a.upazila_id)].filter(Boolean).join(', ');
        var rows = Object.keys(d).filter(function (k) { return d[k] !== '' && d[k] != null; }).map(function (k) { return pair(k.replace(/_/g, ' '), String(d[k])); }).join('');
        var acts = !open ? '' : mode === 'sales'
          ? '<button type="button" class="btn" data-act="rec">' + l('recommend') + '</button><button type="button" class="btn o" data-act="norec">' + l('notRec') + '</button>'
          : '<button type="button" class="btn" data-act="ok">' + l('approve') + '</button><button type="button" class="btn o dng" data-act="no">' + l('reject') + '</button>';
        document.getElementById('aPan').innerHTML = '<div class="lsgrip"></div><div class="ashead"><span class="aic big" style="--ac:' + c.col + '">' + ic(c.ico) + '</span><div class="g"><h3>' + esc(a.business_name) + '</h3><small>' + esc(c.name) + '</small></div>' + stc(a.status) + '</div>' +
          '<div class="asec"><h4>' + q('contact') + '</h4>' + pair(l('applicant'), (a.applicant || {}).full_name) + pair(q('owner'), a.owner_name) + pair(q('applied'), fdate(a.created_at)) + '<div class="aqa"><a class="btn" href="tel:' + esc(ph) + '">' + ic('phone') + q('call') + '</a><a class="btn wab" href="https://wa.me/' + wa2(ph) + '" target="_blank" rel="noopener">' + ic('wa') + q('wa') + '</a></div></div>' +
          '<div class="asec"><h4>' + q('loc') + '</h4>' + pair(l('address'), [area, a.address].filter(Boolean).join(', ')) + (a.lat != null ? '<a class="amap" href="https://www.google.com/maps?q=' + esc(a.lat) + ',' + esc(a.lng) + '" target="_blank" rel="noopener">' + ic('pin') + l('map') + '</a>' : '') + '</div>' +
          (rows ? '<div class="asec"><h4>' + q('det') + '</h4>' + rows + '</div>' : '') +
          '<div class="asec"><h4>' + l('docs') + '</h4><div class="adocs" id="adocs">' + l('loading') + '</div></div>' +
          ((a.sales_note || a.admin_note) ? '<div class="asec">' + (a.sales_note ? '<p class="anote"><b>' + l('salesNote') + ':</b> ' + esc(a.sales_note) + '</p>' : '') + (a.admin_note ? '<p class="anote"><b>' + l('adminNote') + ':</b> ' + esc(a.admin_note) + '</p>' : '') + '</div>' : '') +
          (open ? '<div class="asec"><h4>' + q('dec') + '</h4><textarea class="inp" id="anote" rows="2" placeholder="' + esc(l('note')) + '"></textarea><div id="amsg" class="fmsg"></div><div class="aacts">' + acts + '</div></div>' : '') +
          '<button type="button" class="aclose" data-aclose="1">' + q('close') + '</button>';
        sh.classList.add('show');
        try { var ds = await A.docsOf(a.id), box = document.getElementById('adocs'); if (box && cur && cur.id === a.id) box.innerHTML = ds.length ? ds.map(function (x) { return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener"><img src="' + esc(x.url) + '" alt="' + esc(x.kind) + '"><small>' + esc(x.kind) + '</small></a>' : ''; }).join('') : '<span class="mut">' + l('noDocs') + '</span>'; } catch (e) { var b2 = document.getElementById('adocs'); if (b2) b2.textContent = A.errMsg(e); }
      }
      async function onAct(e) {
        var b = e.target.closest('[data-act]'); if (!b || !cur) return; var act = b.getAttribute('data-act'), msg = document.getElementById('amsg'), note = (document.getElementById('anote') || {}).value || '';
        if (!window.confirm(act === 'ok' ? q('confirmOk') : act === 'no' ? q('confirmNo') : q('confirmRec'))) return;
        b.disabled = true;
        try { if (act === 'rec' || act === 'norec') await A.salesReview(cur.id, act === 'rec', note); else await A.adminDecide(cur.id, act === 'ok', note); ZX.toast(l('done')); document.getElementById('aSheet').classList.remove('show'); cur = null; if (await load()) { shell(); } }
        catch (er) { b.disabled = false; if (msg) { msg.className = 'fmsg err'; msg.textContent = A.errMsg(er); } }
      }
      el.onclick = function (e) {
        var t = e.target.closest('[data-tab2],[data-cat],[data-open]'); if (!t) return;
        if (t.hasAttribute('data-tab2')) { tab = t.getAttribute('data-tab2'); paintStats(); paintList(); return; }
        if (t.hasAttribute('data-cat')) { cat = t.getAttribute('data-cat'); paintCats(); paintList(); return; }
        var a = apps.filter(function (x) { return x.id === t.getAttribute('data-open'); })[0]; if (a) openSheet(a);
      };
      if (await load()) shell();
    };
  }

  /* ---------- Super Admin: staff roles ---------- */
  async function staffPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    async function paint() {
      var rows; try { rows = await A.listStaff(); } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return; }
      el.innerHTML = head(ZX.t({ en: 'Roles & staff', bn: 'রোল ও কর্মী' }), l('grantHint')) +
        '<div class="cardx"><h3>' + l('grant') + '</h3><div class="grid2"><input class="inp" id="rPhone" type="tel" inputmode="numeric" placeholder="01XXXXXXXXX"><select class="inp" id="rRole">' + STAFF_ROLES.map(function (r) { return '<option value="' + r + '">' + esc(A.roleLabel(r)) + '</option>'; }).join('') + '</select></div><div id="rMsg" class="fmsg"></div><button class="btn" id="rGo" type="button">' + l('grant') + '</button></div>' +
        '<div class="cardx"><h3>' + l('staff') + '</h3>' + (rows.length ? rows.map(function (r) { var p = r.person || {}; return '<div class="rowx"><div class="g"><b>' + esc(p.full_name || '') + '</b><small>' + esc(p.phone || '') + '</small></div>' + chip(A.roleLabel(r.role), 'ok') + '<button class="btn o" data-rev="' + esc(r.user_id) + '|' + esc(r.role) + '">' + l('revoke') + '</button></div>'; }).join('') : '<p class="ps">' + l('none') + '</p>') + '</div>';
      el.querySelector('#rGo').onclick = async function () { var m = el.querySelector('#rMsg'); m.className = 'fmsg ok'; m.textContent = '…'; try { await A.grantRole(el.querySelector('#rPhone').value, el.querySelector('#rRole').value); ZX.toast(l('done')); paint(); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); } };
      el.querySelectorAll('[data-rev]').forEach(function (b) { b.onclick = async function () { if (!confirm(l('sure'))) return; var p = b.getAttribute('data-rev').split('|'); try { await A.revokeRole(p[0], p[1]); ZX.toast(l('done')); await A.refresh(); paint(); } catch (e) { ZX.toast(A.errMsg(e)); } }; });
    }
    paint();
  }

  /* ---------- areas ---------- */
  async function areasPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    async function paint() {
      var all; try { all = await A.areas(); } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return; }
      var ups = all.filter(function (a) { return a.level === 'upazila'; });
      var tree = ups.map(function (u) { var uns = all.filter(function (a) { return a.parent_id === u.id; }); return '<div class="cardx"><h3>' + esc(ZX.t({ en: u.name_en, bn: u.name_bn })) + ' <small style="color:var(--muted)">(' + ZX.digits(uns.length) + ')</small></h3>' + (uns.map(function (n) { return '<div class="rowx"><div class="g"><b>' + esc(ZX.t({ en: n.name_en, bn: n.name_bn })) + '</b><small>' + esc(n.name_en) + ' · ' + esc(n.name_bn) + '</small></div>' + chip(n.active ? A.statusLabel('active') : l('hide'), n.active ? 'ok' : 'r') + '<button class="btn o" data-tg="' + esc(n.id) + '">' + (n.active ? l('hide') : l('show')) + '</button></div>'; }).join('') || '<p class="ps">' + l('none') + '</p>') + '</div>'; }).join('');
      el.innerHTML = head(l('areas'), ZX.t({ en: 'Unions and paurashavas shown in sign-up forms.', bn: 'সাইন আপ ফর্মে যে ইউনিয়ন ও পৌরসভা দেখায়।' })) +
        '<div class="cardx"><h3>' + l('addArea') + '</h3><label class="fld"><span>' + l('upazila') + '</span><select class="inp" id="aPar">' + ups.map(function (u) { return '<option value="' + esc(u.id) + '">' + esc(ZX.t({ en: u.name_en, bn: u.name_bn })) + '</option>'; }).join('') + '</select></label><div class="grid2"><input class="inp" id="aEn" placeholder="' + l('nameEn') + '"><input class="inp" id="aBn" placeholder="' + l('nameBn') + '"></div><div id="aMs" class="fmsg"></div><button class="btn" id="aGo" type="button">' + l('add') + '</button></div>' + tree;
      el.querySelector('#aGo').onclick = async function () { var m = el.querySelector('#aMs'); m.className = 'fmsg ok'; m.textContent = '…'; try { await A.upsertArea({ parent_id: el.querySelector('#aPar').value, level: 'union', kind: 'union', name_en: el.querySelector('#aEn').value, name_bn: el.querySelector('#aBn').value }); ZX.toast(l('done')); paint(); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); } };
      el.querySelectorAll('[data-tg]').forEach(function (b) { b.onclick = async function () { var a = all.filter(function (x) { return x.id === b.getAttribute('data-tg'); })[0]; try { await A.upsertArea({ id: a.id, parent_id: a.parent_id, level: a.level, kind: a.kind, name_en: a.name_en, name_bn: a.name_bn, active: !a.active }); paint(); } catch (e) { ZX.toast(A.errMsg(e)); } }; });
    }
    paint();
  }

  async function auditPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    try {
      var rows = await A.auditLog();
      el.innerHTML = head(l('audit'), ZX.t({ en: 'Every sensitive change is recorded here.', bn: 'প্রতিটি গুরুত্বপূর্ণ পরিবর্তন এখানে লেখা থাকে।' })) + '<div class="cardx" style="overflow:auto"><table class="t"><tr><th>' + l('when') + '</th><th>' + l('who') + '</th><th>' + l('what') + '</th></tr>' + (rows.map(function (r) { return '<tr><td>' + esc(fdate(r.created_at)) + '</td><td>' + esc((r.who || {}).full_name || '') + '</td><td>' + esc(r.action) + (r.after ? ' <small>' + esc(JSON.stringify(r.after).slice(0, 90)) + '</small>' : '') + '</td></tr>'; }).join('') || '<tr><td colspan="3">' + l('none') + '</td></tr>') + '</table></div>';
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }


  /* ---------- Super Admin: real dashboard + users ---------- */
  var IC = {
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14c2.800 0 4.500 1.800 4.500 4.500"/>',
    plus: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6M19 8v6M16 11h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', store: '<path d="M4 9l1.500-5h13L20 9M4 9v11h16V9M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0"/>',
    bike: '<circle cx="6" cy="16" r="3.500"/><circle cx="18" cy="16" r="3.500"/><path d="M6 16l4-7h5l3 7M10 9l2 7"/>', check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.500l2.700 2.700L16 9.500"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>', arrow: '<path d="M9 5l7 7-7 7"/>', phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    wa: '<path d="M3 21l1.500-4.500A9 9 0 1 1 8 19.500L3 21z"/><path d="M9 9c0 3 3 6 6 6l1.200-1.500-2-1-1 .7c-.8-.4-1.600-1.200-2-2l.7-1-1-2L9 9z"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    food: '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-2 2-3 4-3 7h3v11"/>', tool: '<path d="M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9z"/>', car: '<path d="M5 16V11l2-5h10l2 5v5H5z"/><circle cx="8" cy="16" r="1.5"/><circle cx="16" cy="16" r="1.5"/>',
    spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/>', speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="7" r="1"/>', pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  var ic = function (k) { return '<svg viewBox="0 0 24 24">' + IC[k] + '</svg>'; };
  var N = {
    hi1: { en: 'Good morning', bn: 'সুপ্রভাত' }, hi2: { en: 'Good afternoon', bn: 'শুভ অপরাহ্ন' }, hi3: { en: 'Good evening', bn: 'শুভ সন্ধ্যা' },
    heroS: { en: 'Here is how Zilax is doing right now.', bn: 'এই মুহূর্তে জিলাক্সের অবস্থা এক নজরে।' }, heroPend1: { en: 'application waiting for a decision', bn: 'টি আবেদন সিদ্ধান্তের অপেক্ষায়' }, heroPend: { en: 'applications waiting for a decision', bn: 'টি আবেদন সিদ্ধান্তের অপেক্ষায়' }, review: { en: 'Review now', bn: 'এখনই দেখুন' }, allClear: { en: 'No application is waiting. Nice work!', bn: 'কোনো আবেদন অপেক্ষায় নেই। দারুণ কাজ!' },
    kUsers: { en: 'Total users', bn: 'মোট ইউজার' }, kNew: { en: 'New this week', bn: 'এই সপ্তাহে নতুন' }, kPend: { en: 'Pending applications', bn: 'অপেক্ষমাণ আবেদন' }, kPart: { en: 'Active partners', bn: 'সক্রিয় পার্টনার' }, kRider: { en: 'Active riders', bn: 'সক্রিয় রাইডার' }, kStaff: { en: 'Staff members', bn: 'স্টাফ সদস্য' },
    quick: { en: 'Quick actions', bn: 'দ্রুত কাজ' }, qAppr: { en: 'Approvals', bn: 'অনুমোদন' }, qUsers: { en: 'Users', bn: 'ইউজার' }, qStaff: { en: 'Staff', bn: 'কর্মী' },
    recent: { en: 'Latest applications', bn: 'সাম্প্রতিক আবেদন' }, seeAll: { en: 'See all', bn: 'সব দেখুন' }, sales: { en: 'Sales and income', bn: 'বিক্রি ও আয়' }, salesS: { en: 'These numbers will appear here once orders start.', bn: 'অর্ডার চালু হলে এই সংখ্যাগুলো এখানে আসবে।' },
    users: { en: 'Users', bn: 'ইউজার' }, usersS: { en: 'Everyone who has signed up on Zilax.', bn: 'যারা জিলাক্সে সাইন আপ করেছেন সবাই।' }, searchP: { en: 'Search name or phone', bn: 'নাম বা ফোন নম্বর খুঁজুন' }, more: { en: 'Show more', bn: 'আরও দেখান' }, noUsers: { en: 'No user found.', bn: 'কোনো ইউজার পাওয়া যায়নি।' },
    joined: { en: 'Joined', bn: 'যোগ দিয়েছেন' }, area: { en: 'Area', bn: 'এলাকা' }, addr: { en: 'Address', bn: 'ঠিকানা' }, roles: { en: 'Roles', bn: 'ভূমিকা' }, call: { en: 'Call', bn: 'কল' }, wa: { en: 'WhatsApp', bn: 'WhatsApp' }, suspended: { en: 'Suspended', bn: 'স্থগিত' }, activeU: { en: 'Active', bn: 'সক্রিয়' }, noRoles: { en: 'Customer', bn: 'গ্রাহক' },
    shown: { en: 'shown', bn: 'টি দেখানো হচ্ছে' }
  };
  var n = function (k) { return ZX.t(N[k]); };
  var PARTNER = ['merchant_food', 'merchant_shop', 'technician', 'car_partner', 'decoration', 'sound_light'];
  var PALETTE = ['#2563eb', '#0d9488', '#7c3aed', '#e11d48', '#ea580c', '#0D5C3A'];
  var hue = function (s) { var h = 0; String(s || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) | 0; }); return PALETTE[Math.abs(h) % PALETTE.length]; };
  var go = function (h) { location.hash = h; };
  async function cnt(q) { var r = await q; if (r.error) throw r.error; return r.count || 0; }
  function wa(phone) { var d = String(phone || '').replace(/\D/g, ''); if (d.length === 11 && d.charAt(0) === '0') d = '88' + d; return d; }

  async function dashPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    var sb = ZX.sb, week = new Date(Date.now() - 7 * 864e5).toISOString();
    try {
      var rs = await Promise.all([
        cnt(sb.from('profiles').select('id', { count: 'exact', head: true })),
        cnt(sb.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', week)),
        cnt(sb.from('partner_applications').select('id', { count: 'exact', head: true }).in('status', ['pending', 'recommended', 'not_recommended'])),
        cnt(sb.from('user_roles').select('user_id', { count: 'exact', head: true }).eq('status', 'active').in('role', PARTNER)),
        cnt(sb.from('user_roles').select('user_id', { count: 'exact', head: true }).eq('status', 'active').eq('role', 'rider')),
        cnt(sb.from('user_roles').select('user_id', { count: 'exact', head: true }).eq('status', 'active').in('role', STAFF_ROLES)),
        sb.from('partner_applications').select('id,business_name,category,status,created_at').order('created_at', { ascending: false }).limit(5)
      ]);
      var apps = (rs[6].data || []), p = A.me().profile || {}, hr = new Date().getHours(), first = String(p.full_name || '').trim().split(' ')[0];
      var greet = hr < 12 ? n('hi1') : hr < 17 ? n('hi2') : n('hi3');
      var date = new Date().toLocaleDateString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      var K = [['kUsers', rs[0], 'users', '#2563eb', 'super/users'], ['kNew', rs[1], 'plus', '#0d9488', 'super/users'], ['kPend', rs[2], 'clock', '#ea580c', 'super/appr'], ['kPart', rs[3], 'store', '#7c3aed', null], ['kRider', rs[4], 'bike', '#e11d48', null], ['kStaff', rs[5], 'key', '#0D5C3A', 'super/roles']];
      var h = '<div class="hero2"><small>' + esc(date) + '</small><h2>' + esc(greet) + (first ? ', ' + esc(first) : '') + '</h2><p>' + (rs[2] ? '<b>' + ZX.digits(rs[2]) + '</b> ' + (rs[2] === 1 ? n('heroPend1') : n('heroPend')) : n('allClear')) + '</p>' +
        (rs[2] ? '<button type="button" class="hbtn" data-g="super/appr">' + n('review') + ic('arrow') + '</button>' : '<p class="hs">' + n('heroS') + '</p>') + '</div>' +
        '<div class="kgrid">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '"' + (k[4] ? ' data-g="' + k[4] + '"' : '') + '><span class="kic">' + ic(k[2]) + '</span><b>' + ZX.digits(k[1]) + '</b><small>' + n(k[0]) + '</small></div>'; }).join('') + '</div>' +
        '<h3 class="sh">' + n('quick') + '</h3><div class="qrow">' +
        [['qAppr', 'check', '#ea580c', 'super/appr'], ['qUsers', 'users', '#2563eb', 'super/users'], ['qStaff', 'key', '#0D5C3A', 'super/roles']].map(function (q) { return '<button type="button" class="qb" style="--ac:' + q[2] + '" data-g="' + q[3] + '"><span>' + ic(q[1]) + '</span>' + n(q[0]) + '</button>'; }).join('') + '</div>' +
        '<div class="shr"><h3 class="sh">' + n('recent') + '</h3><a href="#super/appr" class="sal">' + n('seeAll') + '</a></div>';
      h += apps.length ? '<div class="cardx" style="padding:6px 16px">' + apps.map(function (a) { var pt = ptypeOf(a.category), col = hue(a.category); return '<div class="rowx"><span class="dot" style="background:' + col + '1f;color:' + col + '">' + esc(String(a.business_name || '?').trim().charAt(0).toUpperCase()) + '</span><div class="g"><b>' + esc(a.business_name) + '</b><small>' + esc(ZX.t(pt.name)) + ' · ' + esc(fdate(a.created_at)) + '</small></div>' + chip(a.status, tone(a.status)) + '</div>'; }).join('') + '</div>' : '<div class="soon">' + l('none') + '</div>';
      h += '<div class="soft2"><span class="kic" style="--ac:#64748b">' + ic('chart') + '</span><div><b>' + n('sales') + '</b><small>' + n('salesS') + '</small></div></div>';
      el.innerHTML = h;
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }

  async function usersPanel(el) {
    var st = { q: '', rows: [], roles: {}, more: false, busy: false }, areas = [], timer = null;
    try { areas = await A.areas(); } catch (e) { areas = []; }
    var PAGE = 30;
    function area(u) { return [areaName(areas, u.union_id), areaName(areas, u.upazila_id)].filter(Boolean).join(', '); }
    function rchips(id) { var rs = (st.roles[id] || []).filter(function (r) { return r.status === 'active'; }); return rs.length ? rs.map(function (r) { return '<span class="rc rc-' + r.role + '">' + esc(A.roleLabel(r.role)) + '</span>'; }).join('') : '<span class="rc rc-customer">' + n('noRoles') + '</span>'; }
    async function load(reset) {
      if (st.busy) return; st.busy = true; var from = reset ? 0 : st.rows.length;
      try {
        var q = ZX.sb.from('profiles').select('id,full_name,phone,upazila_id,union_id,address,created_at,status,avatar_url').order('created_at', { ascending: false }).range(from, from + PAGE - 1);
        var s = st.q.replace(/[%,()]/g, ' ').trim(); if (s) q = q.or('full_name.ilike.%' + s + '%,phone.ilike.%' + s + '%');
        var r = await q; if (r.error) throw r.error; var rows = r.data || [];
        if (rows.length) { var rr = await ZX.sb.from('user_roles').select('user_id,role,status').in('user_id', rows.map(function (x) { return x.id; })); (rr.data || []).forEach(function (x) { (st.roles[x.user_id] = st.roles[x.user_id] || []).push(x); }); }
        st.rows = reset ? rows : st.rows.concat(rows); st.more = rows.length === PAGE;
      } catch (e) { el.querySelector('#ulist').innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; st.busy = false; return; }
      st.busy = false; list();
    }
    function list() {
      var box = el.querySelector('#ulist'); if (!box) return;
      box.innerHTML = st.rows.length ? '<div class="cardx" style="padding:4px 14px">' + st.rows.map(function (u) {
        var col = hue(u.id), a = area(u);
        return '<button type="button" class="urow" data-u="' + u.id + '"><span class="uav" style="background:' + col + '">' + (u.avatar_url ? '<img src="' + esc(u.avatar_url) + '" alt="">' : esc(String(u.full_name || '?').trim().charAt(0).toUpperCase())) + '</span><div class="g"><b>' + esc(u.full_name || '—') + '</b><small>' + esc(u.phone) + (a ? ' · ' + esc(a) : '') + '</small><span class="rcs">' + rchips(u.id) + '</span></div><span class="uar">' + ic('arrow') + '</span></button>';
      }).join('') + '</div>' + (st.more ? '<button type="button" class="btn o umore" id="umore">' + n('more') + '</button>' : '') + '<p class="ucount">' + ZX.digits(st.rows.length) + ' ' + n('shown') + '</p>' : '<div class="soon">' + n('noUsers') + '</div>';
    }
    function sheet(u) {
      var sh = document.getElementById('uSheet'); if (!sh) { sh = document.createElement('div'); sh.className = 'sheet'; sh.id = 'uSheet'; sh.innerHTML = '<div class="pan" id="uPan"></div>'; document.body.appendChild(sh); sh.addEventListener('click', function (e) { if (e.target === sh) sh.classList.remove('show'); }); }
      var col = hue(u.id), a = area(u), ph = String(u.phone || '');
      document.getElementById('uPan').innerHTML = '<div class="lsgrip"></div><div class="udet"><span class="uav big" style="background:' + col + '">' + (u.avatar_url ? '<img src="' + esc(u.avatar_url) + '" alt="">' : esc(String(u.full_name || '?').trim().charAt(0).toUpperCase())) + '</span><h3>' + esc(u.full_name || '—') + '</h3><p>' + esc(ph) + ' ' + chip(u.status === 'suspended' ? n('suspended') : n('activeU'), u.status === 'suspended' ? 'r' : 'ok') + '</p></div>' +
        '<div class="cardx" style="margin:10px 0 0;padding:6px 14px"><div class="rowx"><small>' + n('joined') + '</small><div class="g" style="text-align:right"><b>' + esc(fdate(u.created_at)) + '</b></div></div>' + (a ? '<div class="rowx"><small>' + n('area') + '</small><div class="g" style="text-align:right"><b>' + esc(a) + '</b></div></div>' : '') + (u.address ? '<div class="rowx"><small>' + n('addr') + '</small><div class="g" style="text-align:right"><b>' + esc(u.address) + '</b></div></div>' : '') + '<div class="rowx"><small>' + n('roles') + '</small><div class="g" style="text-align:right">' + rchips(u.id) + '</div></div></div>' +
        '<div class="grid2" style="margin-top:12px"><a class="btn" href="tel:' + esc(ph) + '" style="text-align:center">' + ic('phone') + n('call') + '</a><a class="btn wab" href="https://wa.me/' + wa(ph) + '" target="_blank" rel="noopener" style="text-align:center">' + ic('wa') + n('wa') + '</a></div>';
      sh.classList.add('show');
    }
    el.innerHTML = '<h2 class="pt serif">' + n('users') + '</h2><p class="ps">' + n('usersS') + '</p><div class="srch"><span>' + ic('search') + '</span><input id="uq" type="search" placeholder="' + esc(n('searchP')) + '" autocomplete="off"></div><div id="ulist"><div class="soon">' + l('loading') + '</div></div>';
    el.querySelector('#uq').addEventListener('input', function (e) { st.q = e.target.value; clearTimeout(timer); timer = setTimeout(function () { load(true); }, 350); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-u],#umore'); if (!b) return;
      if (b.id === 'umore') { load(false); return; }
      var u = st.rows.filter(function (x) { return x.id === b.getAttribute('data-u'); })[0]; if (u) sheet(u);
    });
    load(true);
  }
  document.addEventListener('click', function (e) { var g = e.target.closest('[data-g]'); if (g) { location.hash = g.getAttribute('data-g'); } });

  var LIVE = { 'sales.leads': appsBoard('sales'), 'admin.appr': appsBoard('admin'), 'super.appr': appsBoard('admin'), 'super.cmd': dashPanel, 'super.users': usersPanel, 'super.roles': staffPanel, 'super.areas': areasPanel, 'super.audit': auditPanel };
  window.ZXLive = {
    ready: false,
    intercept: function (role, sec) {
      if (!ZX.live) return null;
      if (!this.ready) return gateLoading;
      if (!A.loggedIn()) return gateLogin;
      if (!A.hasAny(NEED[role] || [])) return function (el) { gateNoAccess(el, role); };
      return LIVE[role + '.' + sec] || null;
    },
    canSee: function (r) { return this.ready && A.loggedIn() && A.hasAny(NEED[r] || []); },
    has: function (r, s) { return !!LIVE[r + '.' + s]; },
    user: function () { var p = A.me().profile; return p ? { name: p.full_name || '' } : null; },
    who: function () { var p = A.me().profile; return p ? '<span style="color:#cfe3d4;font-size:12px">' + esc(p.full_name) + '</span> <a href="#" id="plOut" style="color:#fff;font-size:12px;font-weight:700">' + l('logout') + '</a>' : ''; },
    logout: function () { return A.signOut(); }
  };
})();
