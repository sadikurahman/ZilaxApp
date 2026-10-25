/* Zilax — Supabase connection, login and Stage 1 data helpers. */
(function () {
  var cfg = window.ZX_CONFIG || {};
  var urlOk = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.SUPABASE_URL || '');
  var keyOk = (cfg.SUPABASE_ANON_KEY || '').length > 40 && !/service_role/i.test(cfg.SUPABASE_ANON_KEY || '');
  ZX.configured = urlOk && keyOk;
  ZX.live = !!(ZX.configured && window.supabase && window.supabase.createClient);
  ZX.sb = ZX.live ? window.supabase.createClient(cfg.SUPABASE_URL.replace(/\/$/, ''), cfg.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } }) : null;

  var PARTNER_ROLE = { food: 'merchant_food', shop: 'merchant_shop', rider: 'rider', tech: 'technician', car: 'car_partner', decor: 'decoration', sound: 'sound_light' };
  var ROLE_LABEL = {
    customer: { en: 'Customer', bn: 'গ্রাহক' }, merchant_food: { en: 'Food Merchant', bn: 'ফুড মার্চেন্ট' }, merchant_shop: { en: 'Shop Merchant', bn: 'শপ মার্চেন্ট' },
    rider: { en: 'Rider', bn: 'রাইডার' }, technician: { en: 'Technician', bn: 'টেকনিশিয়ান' }, car_partner: { en: 'Car Partner', bn: 'গাড়ির পার্টনার' },
    decoration: { en: 'Decoration Vendor', bn: 'ডেকোরেশন ভেন্ডর' }, sound_light: { en: 'Sound & Light Vendor', bn: 'সাউন্ড ও লাইট ভেন্ডর' },
    sales_admin: { en: 'Sales Admin', bn: 'সেলস অ্যাডমিন' }, admin: { en: 'Admin', bn: 'অ্যাডমিন' }, super_admin: { en: 'Super Admin', bn: 'সুপার অ্যাডমিন' }
  };
  var STATUS_LABEL = {
    pending: { en: 'Pending', bn: 'অপেক্ষমান' }, recommended: { en: 'Recommended', bn: 'সুপারিশকৃত' }, not_recommended: { en: 'Not recommended', bn: 'সুপারিশ নেই' },
    approved: { en: 'Approved', bn: 'অনুমোদিত' }, rejected: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' }, active: { en: 'Active', bn: 'সক্রিয়' }, suspended: { en: 'Suspended', bn: 'স্থগিত' }
  };
  var ERR = {
    invalid_phone: { en: 'Enter a valid 11-digit mobile number (01XXXXXXXXX).', bn: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (01XXXXXXXXX)।' },
    weak_password: { en: 'Password must be at least 6 characters.', bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' },
    missing_name: { en: 'Please fill in the name fields.', bn: 'নামের ঘরগুলো পূরণ করুন।' },
    exists: { en: 'This number already has an account. Please log in.', bn: 'এই নম্বরে আগেই অ্যাকাউন্ট আছে। লগইন করুন।' },
    bad_login: { en: 'Wrong phone number or password.', bn: 'মোবাইল নম্বর বা পাসওয়ার্ড ভুল।' },
    confirm_on: { en: 'Setup needed: turn OFF "Confirm email" in Supabase (Authentication → Providers → Email).', bn: 'সেটআপ বাকি: Supabase-এ Authentication → Providers → Email থেকে "Confirm email" বন্ধ করুন।' },
    not_configured: { en: 'Supabase is not connected yet. Fill in config.js.', bn: 'Supabase এখনো সংযুক্ত নয়। config.js পূরণ করুন।' },
    already_applied: { en: 'You already have an open application in this category.', bn: 'এই ক্যাটাগরিতে আপনার আবেদন আগেই চলছে।' },
    forbidden: { en: 'You do not have permission for this.', bn: 'এই কাজের অনুমতি আপনার নেই।' },
    not_reviewable: { en: 'This application was already decided.', bn: 'এই আবেদনের সিদ্ধান্ত আগেই হয়ে গেছে।' },
    user_not_found: { en: 'No account with this phone number.', bn: 'এই নম্বরে কোনো অ্যাকাউন্ট নেই।' },
    last_super_admin: { en: 'You cannot remove the last Super Admin.', bn: 'শেষ সুপার অ্যাডমিনকে সরানো যাবে না।' },
    already_exists: { en: 'This name already exists here.', bn: 'এই নামটি এখানে আগেই আছে।' },
    account_suspended: { en: 'This account is suspended.', bn: 'এই অ্যাকাউন্ট স্থগিত।' },
    network: { en: 'Network problem. Check your internet and try again.', bn: 'নেটওয়ার্কে সমস্যা। ইন্টারনেট দেখে আবার চেষ্টা করুন।' },
    bad_value: { en: 'This amount is not valid.', bn: 'এই অঙ্কটি সঠিক নয়।' },
    bad_percent: { en: 'Commission must be between 0 and 100.', bn: 'কমিশন ০ থেকে ১০০-এর মধ্যে হতে হবে।' },
    unknown_setting: { en: 'Unknown setting.', bn: 'অজানা সেটিং।' },
    not_found: { en: 'Not found.', bn: 'পাওয়া যায়নি।' },
    unknown: { en: 'Something went wrong. Please try again.', bn: 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।' }
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bnToEn(s) { return String(s || '').replace(/[০-৯]/g, function (d) { return '০১২৩৪৫৬৭৮৯'.indexOf(d); }); }
  function normPhone(s) {
    var d = bnToEn(s).replace(/[^0-9]/g, '');
    if (/^8801[0-9]{9}$/.test(d)) d = d.slice(2);
    return /^01[3-9][0-9]{8}$/.test(d) ? d : null;
  }
  function emailOf(phone) { return phone + '@users.zilax.app'; }
  function errMsg(e) {
    var m = (e && (e.message || e.error_description || e.msg || e)) + '';
    var keys = ['already_applied', 'not_reviewable', 'user_not_found', 'last_super_admin', 'already_exists', 'account_suspended', 'forbidden', 'invalid_phone', 'missing_name', 'bad_value', 'bad_percent', 'unknown_setting', 'not_found'];
    for (var i = 0; i < keys.length; i++) if (m.indexOf(keys[i]) > -1) return ZX.t(ERR[keys[i]]);
    if (/already registered|already been registered|user_already_exists/i.test(m)) return ZX.t(ERR.exists);
    if (/invalid login|invalid_credentials/i.test(m)) return ZX.t(ERR.bad_login);
    if (/fetch|network|failed to/i.test(m)) return ZX.t(ERR.network);
    return ZX.t(ERR.unknown) + (m ? ' (' + m.slice(0, 80) + ')' : '');
  }
  function need() { if (!ZX.live) throw new Error(ZX.t(ERR.not_configured)); }

  var me = { user: null, profile: null, roles: [] };
  var listeners = [];
  function emit() { listeners.forEach(function (f) { try { f(me); } catch (e) { } }); }

  var auth = {
    esc: esc, normPhone: normPhone, errMsg: errMsg, ERR: ERR, ROLE_LABEL: ROLE_LABEL, STATUS_LABEL: STATUS_LABEL, PARTNER_ROLE: PARTNER_ROLE,
    me: function () { return me; },
    onChange: function (f) { listeners.push(f); },
    roleLabel: function (r) { return ZX.t(ROLE_LABEL[r] || { en: r, bn: r }); },
    statusLabel: function (s) { return ZX.t(STATUS_LABEL[s] || { en: s, bn: s }); },
    hasRole: function (r) { return me.roles.some(function (x) { return x.role === r && x.status === 'active'; }); },
    hasAny: function (rs) { return rs.some(auth.hasRole); },
    roleStatus: function (r) { var x = me.roles.filter(function (y) { return y.role === r; })[0]; return x ? x.status : null; },
    loggedIn: function () { return !!me.user; },

    refresh: async function () {
      if (!ZX.live) { me = { user: null, profile: null, roles: [] }; emit(); return me; }
      var s = await ZX.sb.auth.getSession(); var u = s && s.data && s.data.session ? s.data.session.user : null;
      if (!u) { me = { user: null, profile: null, roles: [] }; emit(); return me; }
      var p = await ZX.sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
      var r = await ZX.sb.from('user_roles').select('role,status').eq('user_id', u.id);
      me = { user: u, profile: p.data || null, roles: r.data || [] }; emit(); return me;
    },
    signUp: async function (f) {
      need();
      var phone = normPhone(f.phone); if (!phone) throw new Error(ZX.t(ERR.invalid_phone));
      if (!f.name || !f.name.trim()) throw new Error(ZX.t(ERR.missing_name));
      if (!f.password || f.password.length < 6) throw new Error(ZX.t(ERR.weak_password));
      var res = await ZX.sb.auth.signUp({ email: emailOf(phone), password: f.password, options: { data: { full_name: f.name.trim(), upazila_id: f.upazila_id || '', union_id: f.union_id || '', address: (f.address || '').trim(), terms_version: f.terms_version || '' } } });
      if (res.error) throw res.error;
      if (!res.data.session) throw new Error(ZX.t(ERR.confirm_on));
      await auth.refresh(); return me;
    },
    signIn: async function (phoneRaw, password) {
      need(); var phone = normPhone(phoneRaw); if (!phone) throw new Error(ZX.t(ERR.invalid_phone));
      var res = await ZX.sb.auth.signInWithPassword({ email: emailOf(phone), password: password });
      if (res.error) throw res.error;
      await auth.refresh(); return me;
    },
    signOut: async function () { if (ZX.live) await ZX.sb.auth.signOut(); await auth.refresh(); },
    updateProfile: async function (patch) {
      need(); var r = await ZX.sb.from('profiles').update(patch).eq('id', me.user.id); if (r.error) throw r.error; await auth.refresh();
    },
    listAddresses: async function () {
      need(); var r = await ZX.sb.from('addresses').select('*').order('is_default', { ascending: false }).order('created_at', { ascending: false });
      if (r.error) throw r.error; return r.data || [];
    },
    saveAddress: async function (a) {
      need(); var row = { label: a.label, line: a.line, upazila_id: a.upazila_id || null, union_id: a.union_id || null, lat: a.lat == null ? null : a.lat, lng: a.lng == null ? null : a.lng, is_default: !!a.is_default }, r;
      if (a.id) r = await ZX.sb.from('addresses').update(row).eq('id', a.id); else { row.user_id = me.user.id; r = await ZX.sb.from('addresses').insert(row); }
      if (r.error) throw r.error;
    },
    deleteAddress: async function (id) { need(); var r = await ZX.sb.from('addresses').delete().eq('id', id); if (r.error) throw r.error; },
    setDefaultAddress: async function (id) { need(); var r = await ZX.sb.from('addresses').update({ is_default: true }).eq('id', id); if (r.error) throw r.error; },
    changePassword: async function (oldPass, newPass) {
      need(); if (!newPass || newPass.length < 6) throw new Error(ZX.t(ERR.weak_password));
      var chk = await ZX.sb.auth.signInWithPassword({ email: emailOf((me.profile || {}).phone || ''), password: oldPass });
      if (chk.error) { var pe = new Error(ZX.t({ en: 'Old password is incorrect.', bn: 'পুরোনো পাসওয়ার্ড সঠিক নয়।' })); pe.zxMsg = true; throw pe; }
      var u = await ZX.sb.auth.updateUser({ password: newPass }); if (u.error) throw u.error;
    },
    uploadAvatar: async function (file) {
      need(); var blob = await auth.compress(file, 512, 0.85);
      var path = me.user.id + '/avatar-' + Date.now() + '.jpg';
      var up = await ZX.sb.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      if (up.error) throw up.error;
      var url = ZX.sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      await auth.updateProfile({ avatar_url: url }); return url;
    },

    areas: async function () {
      if (!ZX.live) return [];
      var r = await ZX.sb.from('areas').select('*').order('sort', { ascending: true }).order('name_en', { ascending: true });
      if (r.error) throw r.error; return r.data || [];
    },

    services: async function () {
      if (!ZX.live) return [];
      var r = await ZX.sb.from('services').select('*').order('sort', { ascending: true });
      if (r.error) throw r.error; return r.data || [];
    },
    setService: async function (code, enabled, approval) {
      need(); var r = await ZX.sb.rpc('set_service', { p_code: code, p_enabled: enabled, p_listing_approval: approval }); if (r.error) throw r.error;
    },

    /* Stage 2.2: money rates live in the database. settings() throws if the table is missing; loadPricing() never throws. */
    settings: async function () {
      if (!ZX.live) return [];
      var r = await ZX.sb.from('app_settings').select('*'); if (r.error) throw r.error; return r.data || [];
    },
    loadPricing: async function () {
      var st = ZX.data.settings;
      if (!ZX.live) return st;
      try {
        var a = await ZX.sb.from('app_settings').select('*');
        (a.data || []).forEach(function (r) {
          if (r.key === 'delivery_min' && typeof r.value === 'number') st.deliveryMin = r.value;
          if (r.key === 'delivery_per_100m' && typeof r.value === 'number') st.deliveryPer100m = r.value;
          if (r.key === 'service_charge' && typeof r.value === 'number') st.serviceCharge = r.value;
        });
      } catch (e) { }
      try {
        var b = await ZX.sb.from('services').select('*');
        (b.data || []).forEach(function (r) { if (r.code === 'food' && r.commission_pct != null) st.foodCommissionPct = Number(r.commission_pct); });
      } catch (e) { }
      return st;
    },
    setSetting: async function (key, value) { need(); var r = await ZX.sb.rpc('set_setting', { p_key: key, p_value: value }); if (r.error) throw r.error; },
    setCommission: async function (code, pct) { need(); var r = await ZX.sb.rpc('set_service_commission', { p_code: code, p_pct: pct }); if (r.error) throw r.error; },

    submitApplication: async function (category, f) {
      need();
      var r = await ZX.sb.rpc('submit_partner_application', { p_category: category, p_business_name: f.business_name, p_owner_name: f.owner_name, p_phone: f.phone, p_upazila: f.upazila_id || null, p_union: f.union_id || null, p_address: f.address || '', p_lat: f.lat == null ? null : f.lat, p_lng: f.lng == null ? null : f.lng, p_details: f.details || {} });
      if (r.error) throw r.error; return r.data;
    },
    compress: function (file, maxSide, quality) {
      maxSide = maxSide || 1400; quality = quality || 0.8;
      return new Promise(function (resolve) {
        if (!/^image\//.test(file.type) || !window.createImageBitmap) return resolve(file);
        createImageBitmap(file).then(function (bmp) {
          var k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height)), c = document.createElement('canvas');
          c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
          c.toBlob(function (b) { resolve(b || file); }, 'image/jpeg', quality);
        }).catch(function () { resolve(file); });
      });
    },
    uploadDoc: async function (appId, kind, file) {
      need(); var blob = await auth.compress(file);
      var path = me.user.id + '/' + appId + '/' + kind + '-' + Date.now() + '.jpg';
      var up = await ZX.sb.storage.from('partner-docs').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      if (up.error) throw up.error;
      var r = await ZX.sb.rpc('add_application_document', { p_app: appId, p_kind: kind, p_path: path });
      if (r.error) throw r.error; return path;
    },
    myApplications: async function () {
      need(); var r = await ZX.sb.from('partner_applications').select('*').eq('user_id', me.user.id).order('created_at', { ascending: false });
      if (r.error) throw r.error; var apps = r.data || [];
      if (apps.length) { var d = await ZX.sb.from('application_documents').select('*').in('application_id', apps.map(function (a) { return a.id; })); var docs = d.data || []; apps.forEach(function (a) { a.docs = docs.filter(function (x) { return x.application_id === a.id; }); }); }
      return apps;
    },

    /* staff */
    listApplications: async function (statuses) {
      need(); var q = ZX.sb.from('partner_applications').select('*, applicant:profiles!partner_applications_user_id_fkey(full_name,phone)').order('created_at', { ascending: false }).limit(100);
      if (statuses && statuses.length) q = q.in('status', statuses);
      var r = await q; if (r.error) throw r.error; return r.data || [];
    },
    docsOf: async function (appId) {
      need(); var r = await ZX.sb.from('application_documents').select('*').eq('application_id', appId); if (r.error) throw r.error;
      var out = []; for (var i = 0; i < (r.data || []).length; i++) { var d = r.data[i]; var s = await ZX.sb.storage.from('partner-docs').createSignedUrl(d.storage_path, 600); out.push({ kind: d.kind, url: s.data ? s.data.signedUrl : null }); }
      return out;
    },
    salesReview: async function (id, rec, note) { need(); var r = await ZX.sb.rpc('sales_review', { p_app: id, p_recommend: rec, p_note: note || '' }); if (r.error) throw r.error; },
    adminDecide: async function (id, ok, note) { need(); var r = await ZX.sb.rpc('admin_decide', { p_app: id, p_approve: ok, p_note: note || '' }); if (r.error) throw r.error; },
    listStaff: async function () {
      need(); var r = await ZX.sb.from('user_roles').select('user_id,role,status, person:profiles!user_roles_user_id_fkey(full_name,phone)').in('role', ['sales_admin', 'admin', 'super_admin']).order('role');
      if (r.error) throw r.error; return r.data || [];
    },
    grantRole: async function (phone, role) { need(); var p = normPhone(phone); if (!p) throw new Error(ZX.t(ERR.invalid_phone)); var r = await ZX.sb.rpc('super_grant_role', { p_phone: p, p_role: role }); if (r.error) throw r.error; },
    revokeRole: async function (userId, role) { need(); var r = await ZX.sb.rpc('super_revoke_role', { p_user: userId, p_role: role }); if (r.error) throw r.error; },
    upsertArea: async function (a) { need(); var r = await ZX.sb.rpc('upsert_area', { p_id: a.id || null, p_parent: a.parent_id || null, p_level: a.level, p_kind: a.kind || null, p_name_en: a.name_en, p_name_bn: a.name_bn, p_active: a.active !== false }); if (r.error) throw r.error; return r.data; },
    auditLog: async function () { need(); var r = await ZX.sb.from('audit_logs').select('*, who:profiles!audit_logs_actor_fkey(full_name,phone)').order('created_at', { ascending: false }).limit(60); if (r.error) throw r.error; return r.data || []; }
  };
  ZX.auth = auth;
  ZX.authReady = Promise.resolve();
  ZX.reloadPricing = auth.loadPricing;
  ZX.pricingReady = auth.loadPricing();
  if (ZX.live) { ZX.sb.auth.onAuthStateChange(function () { setTimeout(function () { auth.refresh(); }, 0); }); ZX.authReady = auth.refresh(); }
})();
