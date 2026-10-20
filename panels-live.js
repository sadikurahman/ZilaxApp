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

  /* ---------- applications board (Sales: recommend, Admin: approve) ---------- */
  function appsBoard(mode) {
    return async function (el) {
      var tab = 'open', apps = [], areas = [], openId = null;
      el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
      try { areas = await A.areas(); } catch (e) { }
      async function load() { try { apps = await A.listApplications(null); } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return false; } return true; }
      function filtered() { return apps.filter(function (a) { return tab === 'open' ? ['pending', 'recommended', 'not_recommended'].indexOf(a.status) > -1 : a.status === tab; }); }
      async function detail(a) {
        var d = a.details || {}, rows = Object.keys(d).filter(function (k) { return d[k] !== '' && d[k] != null; }).map(function (k) { return '<tr><td>' + esc(k.replace(/_/g, ' ')) + '</td><td>' + esc(d[k]) + '</td></tr>'; }).join('');
        var map = a.lat != null ? ' · <a href="https://www.google.com/maps?q=' + esc(a.lat) + ',' + esc(a.lng) + '" target="_blank" rel="noopener">' + l('map') + '</a>' : '';
        var open = ['pending', 'recommended', 'not_recommended'].indexOf(a.status) > -1;
        var acts = !open ? '' : mode === 'sales'
          ? '<button class="btn" data-act="rec" data-id="' + a.id + '">' + l('recommend') + '</button> <button class="btn o" data-act="norec" data-id="' + a.id + '">' + l('notRec') + '</button>'
          : '<button class="btn" data-act="ok" data-id="' + a.id + '">' + l('approve') + '</button> <button class="btn o" data-act="no" data-id="' + a.id + '">' + l('reject') + '</button>';
        return '<div class="cardx adet"><table class="t">' + '<tr><td>' + l('applicant') + '</td><td>' + esc((a.applicant || {}).full_name) + ' · ' + esc(a.phone) + '</td></tr>' +
          '<tr><td>' + l('address') + '</td><td>' + esc(areaName(areas, a.union_id)) + ' ' + esc(areaName(areas, a.upazila_id)) + ', ' + esc(a.address) + map + '</td></tr>' + rows + '</table>' +
          (a.sales_note ? '<p class="ps"><b>' + l('salesNote') + ':</b> ' + esc(a.sales_note) + '</p>' : '') + (a.admin_note ? '<p class="ps"><b>' + l('adminNote') + ':</b> ' + esc(a.admin_note) + '</p>' : '') +
          '<b>' + l('docs') + '</b><div class="thumbs" id="th_' + a.id + '">' + l('loading') + '</div>' +
          (open ? '<label class="fld"><span>' + l('note') + '</span><textarea class="inp" id="nt_' + a.id + '" rows="2"></textarea></label><div id="am_' + a.id + '" class="fmsg"></div><div class="acts">' + acts + '</div>' : '') + '</div>';
      }
      async function paint() {
        var list = filtered();
        var h = head(mode === 'sales' ? ZX.t({ en: 'Partner leads', bn: 'পার্টনার লিড' }) : ZX.t({ en: 'Approvals', bn: 'অনুমোদন' }), mode === 'sales' ? ZX.t({ en: 'Check the papers, then recommend or not.', bn: 'কাগজ দেখে সুপারিশ করুন বা করবেন না।' }) : ZX.t({ en: 'Final decision on partner applications.', bn: 'পার্টনার আবেদনের চূড়ান্ত সিদ্ধান্ত।' })) +
          '<div class="swi" style="padding:0 0 10px;background:none;border:0">' + ['open', 'approved', 'rejected'].map(function (k) { return '<a href="#" data-tab2="' + k + '" class="' + (tab === k ? 'on' : '') + '">' + l(k) + '</a>'; }).join('') + '</div>';
        if (!list.length) h += '<div class="soon">' + l('none') + '</div>';
        for (var i = 0; i < list.length; i++) {
          var a = list[i], pt = ptypeOf(a.category);
          h += '<div class="cardx"><div class="rowx" data-open="' + a.id + '" style="cursor:pointer"><span style="font-size:26px">' + pt.emoji + '</span><div class="g"><b>' + esc(a.business_name) + '</b><small>' + esc(ZX.t(pt.name)) + ' · ' + esc((a.applicant || {}).full_name) + ' · ' + esc(a.phone) + ' · ' + esc(fdate(a.created_at)) + '</small></div>' + chip(A.statusLabel(a.status), tone(a.status)) + '</div>' + (openId === a.id ? await detail(a) : '') + '</div>';
        }
        el.innerHTML = h;
        if (openId) { var box = el.querySelector('#th_' + openId); if (box) { try { var ds = await A.docsOf(openId); box.innerHTML = ds.length ? ds.map(function (x) { return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener"><img src="' + esc(x.url) + '" alt="' + esc(x.kind) + '"><small>' + esc(x.kind) + '</small></a>' : ''; }).join('') : l('noDocs'); } catch (e) { box.textContent = A.errMsg(e); } } }
      }
      el.onclick = async function (e) {
        var t = e.target.closest('[data-tab2],[data-open],[data-act]'); if (!t) return;
        if (t.hasAttribute('data-tab2')) { e.preventDefault(); tab = t.getAttribute('data-tab2'); openId = null; paint(); return; }
        if (t.hasAttribute('data-open')) { var id = t.getAttribute('data-open'); openId = openId === id ? null : id; paint(); return; }
        var act = t.getAttribute('data-act'), id2 = t.getAttribute('data-id'), note = (el.querySelector('#nt_' + id2) || {}).value || '', msgEl = el.querySelector('#am_' + id2);
        try {
          if (act === 'rec' || act === 'norec') await A.salesReview(id2, act === 'rec', note); else await A.adminDecide(id2, act === 'ok', note);
          ZX.toast(l('done')); openId = null; if (await load()) paint();
        } catch (er) { if (msgEl) { msgEl.className = 'fmsg err'; msgEl.textContent = A.errMsg(er); } }
      };
      if (await load()) paint();
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

  var LIVE = { 'sales.leads': appsBoard('sales'), 'admin.appr': appsBoard('admin'), 'super.appr': appsBoard('admin'), 'super.roles': staffPanel, 'super.areas': areasPanel, 'super.audit': auditPanel };
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
