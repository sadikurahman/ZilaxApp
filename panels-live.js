/* Zilax — live panels: access gate, application review, staff roles, areas, audit log, Stage 2.1 services on/off. */
(function () {
  var A = ZX.auth, D = ZX.data, esc = A.esc;
  var NEED = { merchant: ['merchant_food', 'super_admin'], shop: ['merchant_shop', 'super_admin'], tech: ['technician', 'super_admin'], car: ['car_partner', 'super_admin'], decor: ['decoration', 'super_admin'], sound: ['sound_light', 'super_admin'], rider: ['rider', 'super_admin'], sales: ['sales_admin', 'admin', 'super_admin'], admin: ['admin', 'super_admin'], super: ['super_admin'] };
  var L = {
    loading: { en: 'Loading…', bn: 'লোড হচ্ছে…' }, loginT: { en: 'Staff & partner login', bn: 'স্টাফ ও পার্টনার লগইন' }, phone: { en: 'Mobile number', bn: 'মোবাইল নম্বর' }, pass: { en: 'Password', bn: 'পাসওয়ার্ড' }, login: { en: 'Log in', bn: 'লগইন' }, logout: { en: 'Log out', bn: 'লগআউট' },
    noAccess: { en: 'No access to this panel', bn: 'এই প্যানেলে আপনার প্রবেশাধিকার নেই' }, noAccessS: { en: 'Your account does not have this role. Ask a Super Admin or apply as a partner.', bn: 'আপনার অ্যাকাউন্টে এই ভূমিকা নেই। সুপার অ্যাডমিনকে বলুন অথবা পার্টনার হিসেবে আবেদন করুন।' },
    pendingT: { en: 'Your application is waiting for approval', bn: 'আপনার আবেদন অনুমোদনের অপেক্ষায়' }, pendingS: { en: 'You will get access as soon as an Admin approves it.', bn: 'অ্যাডমিন অনুমোদন দিলেই আপনি প্রবেশ করতে পারবেন।' },
    open: { en: 'Open', bn: 'চলমান' }, approved: { en: 'Approved', bn: 'অনুমোদিত' }, price: { en: 'Price', bn: 'দাম' }, active: { en: 'Active', bn: 'চালু' }, rejected: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' }, none: { en: 'Nothing here yet.', bn: 'এখানে এখনো কিছু নেই।' },
    applicant: { en: 'Applicant', bn: 'আবেদনকারী' }, address: { en: 'Address', bn: 'ঠিকানা' }, map: { en: 'Open map', bn: 'মানচিত্র দেখুন' }, docs: { en: 'Documents', bn: 'কাগজ ও ছবি' }, noDocs: { en: 'No documents uploaded', bn: 'কোনো ছবি আপলোড হয়নি' },
    note: { en: 'Your note (optional)', bn: 'আপনার নোট (ঐচ্ছিক)' }, salesNote: { en: 'Sales note', bn: 'সেলস নোট' }, adminNote: { en: 'Admin note', bn: 'অ্যাডমিন নোট' },
    recommend: { en: 'Recommend', bn: 'সুপারিশ করুন' }, notRec: { en: 'Do not recommend', bn: 'সুপারিশ করবেন না' }, approve: { en: 'Approve', bn: 'অনুমোদন' }, reject: { en: 'Reject', bn: 'প্রত্যাখ্যান' }, done: { en: 'Saved', bn: 'সংরক্ষিত' },
    staff: { en: 'Staff roles', bn: 'স্টাফের ভূমিকা' }, grant: { en: 'Give role', bn: 'ভূমিকা দিন' }, revoke: { en: 'Remove', bn: 'সরান' }, roleSel: { en: 'Role', bn: 'ভূমিকা' }, grantHint: { en: 'The person must sign up in the app first. Enter their mobile number.', bn: 'ব্যক্তিকে আগে অ্যাপে সাইন আপ করতে হবে। তাঁর মোবাইল নম্বর দিন।' },
    sure: { en: 'Are you sure?', bn: 'আপনি কি নিশ্চিত?' }, areas: { en: 'Areas', bn: 'এলাকা' }, addArea: { en: 'Add union / paurashava', bn: 'ইউনিয়ন / পৌরসভা যোগ করুন' }, upazila: { en: 'Upazila', bn: 'উপজেলা' }, nameEn: { en: 'Name (English)', bn: 'নাম (ইংরেজি)' }, nameBn: { en: 'Name (Bangla)', bn: 'নাম (বাংলা)' }, add: { en: 'Add', bn: 'যোগ করুন' },
    hide: { en: 'Hide', bn: 'লুকান' }, show: { en: 'Show', bn: 'দেখান' }, audit: { en: 'Recent changes', bn: 'সাম্প্রতিক পরিবর্তন' }, when: { en: 'When', bn: 'কখন' }, who: { en: 'Who', bn: 'কে' }, what: { en: 'What', bn: 'কী' },
    svcT: { en: 'Services', bn: 'সার্ভিস' }, svcS: { en: 'Switch a whole service on or off. An off service shows "Coming soon" on the customer home page.', bn: 'পুরো সার্ভিস চালু বা বন্ধ করুন। বন্ধ সার্ভিস ক্রেতার হোম পেজে "শীঘ্রই আসছে" দেখায়।' },
    svcOn: { en: 'On', bn: 'চালু' }, svcOffL: { en: 'Off', bn: 'বন্ধ' }, svcTurnOn: { en: 'Turn on', bn: 'চালু করুন' }, svcTurnOff: { en: 'Turn off', bn: 'বন্ধ করুন' },
    svcApprYes: { en: 'New listings need approval', bn: 'নতুন লিস্টিংয়ে অনুমোদন লাগবে' }, svcApprNo: { en: 'New listings go live without approval', bn: 'নতুন লিস্টিং অনুমোদন ছাড়াই চালু হবে' }, svcApprBtn: { en: 'Change approval rule', bn: 'অনুমোদনের নিয়ম বদলান' },
    svcConfirmOff: { en: 'Turn this service off? Customers will see "Coming soon".', bn: 'এই সার্ভিস বন্ধ করবেন? ক্রেতারা "শীঘ্রই আসছে" দেখবে।' },
    svcSetup: { en: 'Setup needed: run stage2_1.sql in Supabase (SQL Editor), then open this page again.', bn: 'সেটআপ বাকি: Supabase-এর SQL Editor-এ stage2_1.sql চালান, তারপর এই পেজ আবার খুলুন।' },
    prT: { en: 'Pricing & commission', bn: 'মূল্য ও কমিশন' }, 
    prSetup: { en: 'Setup needed: run stage2_2.sql in Supabase (SQL Editor), then open this page again.', bn: 'সেটআপ বাকি: Supabase-এর SQL Editor-এ stage2_2.sql চালান, তারপর এই পেজ আবার খুলুন।' }, prSave: { en: 'Save', bn: 'সংরক্ষণ' }, 
    delT: { en: 'Delivery charge', bn: 'ডেলিভারি চার্জ' }, delHint: { en: 'The customer pays whichever is higher: the minimum charge, or the rate for every started 100 metres.', bn: 'ক্রেতা যেটা বেশি সেটাই দেন: সর্বনিম্ন চার্জ, অথবা প্রতি শুরু হওয়া ১০০ মিটারের হার।' }, delMin: { en: 'Minimum delivery charge', bn: 'সর্বনিম্ন ডেলিভারি চার্জ' }, delPer: { en: 'Charge per 100 metres', bn: 'প্রতি ১০০ মিটারের চার্জ' },
    prS: { en: 'Delivery charge, a fixed platform fee and a commission rate for every service. Every change is written to the audit log.', bn: 'ডেলিভারি চার্জ, প্রতি সার্ভিসের নির্দিষ্ট প্ল্যাটফর্ম ফি ও কমিশনের হার। প্রতিটি পরিবর্তন অডিট লগে লেখা হয়।' },
    delNote: { en: 'Applies to Food and Shop only.', bn: 'শুধু ফুড ও শপে প্রযোজ্য।' },
    rtT: { en: 'Technician rates', bn: 'টেকনিশিয়ান রেট' }, rtS: { en: 'Fixed prices for technician jobs. Technicians cannot change them. The customer also pays the platform fee on top.', bn: 'টেকনিশিয়ানের কাজের নির্দিষ্ট দাম। টেকনিশিয়ান এগুলো বদলাতে পারেন না। ক্রেতা এর ওপর প্ল্যাটফর্ম ফিও দেন।' },
    rtAdd: { en: 'Add a rate', bn: 'নতুন রেট যোগ' }, rtNameEn: { en: 'Service name (English)', bn: 'সার্ভিসের নাম (ইংরেজি)' }, rtNameBn: { en: 'Service name (Bangla)', bn: 'সার্ভিসের নাম (বাংলা)' }, rtPrice: { en: 'Price (৳)', bn: 'দাম (৳)' },
    rtEdit: { en: 'Edit', bn: 'বদলান' }, rtCancel: { en: 'Cancel', bn: 'বাতিল' }, rtPays: { en: 'customer pays', bn: 'ক্রেতা দেবে' }, rtFeeIn: { en: 'with platform fee', bn: 'প্ল্যাটফর্ম ফিসহ' }, rtHiddenL: { en: 'Hidden', bn: 'লুকানো' },
    rtNone: { en: 'No rates yet. Add the first one above.', bn: 'এখনো কোনো রেট নেই। ওপরে প্রথমটা যোগ করুন।' }, rtSetup: { en: 'Run stage2_4.sql in Supabase to turn on technician rates.', bn: 'টেকনিশিয়ান রেট চালু করতে Supabase-এ stage2_4.sql চালান।' },
    rtViewS: { en: 'These are the fixed prices for your jobs. Zilax sets them and you cannot change them.', bn: 'এগুলো আপনার কাজের নির্দিষ্ট দাম। Zilax ঠিক করে, আপনি বদলাতে পারবেন না।' }, rtViewNone: { en: 'No rates have been set yet.', bn: 'এখনো কোনো রেট ঠিক করা হয়নি।' },
    arSvcT: { en: 'Services in this upazila', bn: 'এই উপজেলায় সার্ভিস' }, arSvcGlobal: { en: 'Off everywhere (Services page)', bn: 'সবখানে বন্ধ (Services পেজ)' },
    arSvcConfirm: { en: 'Turn {s} off in {u}? Customers there will see "Coming soon".', bn: '{u}-তে {s} বন্ধ করবেন? সেখানকার ক্রেতারা "শীঘ্রই আসছে" দেখবে।' },
    arSvcSetup: { en: 'Run stage2_3.sql in Supabase to switch services per upazila.', bn: 'উপজেলা ধরে সার্ভিস চালু/বন্ধ করতে Supabase-এ stage2_3.sql চালান।' },
    acomT: { en: 'Commission agreed with this partner (%)', bn: 'এই পার্টনারের সঙ্গে ঠিক করা কমিশন (%)' }, acomH: { en: 'Leave empty to use the service default (shown in the box). You can change it later from Users.', bn: 'ফাঁকা রাখলে সার্ভিসের ডিফল্ট চলবে (ঘরে দেখানো আছে)। পরে Users থেকে বদলাতে পারবেন।' },
    acomFail: { en: 'Approved, but the commission could not be saved. Set it from Users.', bn: 'অনুমোদন হয়েছে, কিন্তু কমিশন সংরক্ষণ হয়নি। Users থেকে বসান।' },
    svcRatesT: { en: 'Fee and commission per service', bn: 'সার্ভিস অনুযায়ী ফি ও কমিশন' },
    svcRatesS: { en: 'The platform fee is a fixed amount the customer pays on every order or booking, shown on the bill. Commission is taken on the item price only. A partner can have their own rate: open the partner in Users.', bn: 'প্ল্যাটফর্ম ফি প্রতি অর্ডার বা বুকিংয়ে ক্রেতার দেওয়া নির্দিষ্ট টাকা, বিলে আলাদা দেখা যায়। কমিশন শুধু পণ্যের দামের ওপর। কোনো পার্টনারের নিজস্ব হার থাকলে Users থেকে পার্টনার খুলে বসান।' },
    feeL: { en: 'Platform fee (৳)', bn: 'প্ল্যাটফর্ম ফি (৳)' }, pctL: { en: 'Default commission (%)', bn: 'ডিফল্ট কমিশন (%)' }, hasDel: { en: 'With delivery', bn: 'ডেলিভারি আছে' },
    feeSetup: { en: 'Run stage2_2b.sql in Supabase to turn on per-service platform fees.', bn: 'প্রতি সার্ভিসের প্ল্যাটফর্ম ফি চালু করতে Supabase-এ stage2_2b.sql চালান।' },
    pPartnerPh: { en: 'Partner own rate % (optional)', bn: 'পার্টনারের নিজস্ব হার % (ঐচ্ছিক)' }, billT: { en: 'Customer bill', bn: 'ক্রেতার বিল' }, splitT: { en: 'Who gets what', bn: 'কে কত পাবে' },
    srcPartner: { en: 'partner deal', bn: 'পার্টনারের চুক্তি' }, srcService: { en: 'service default', bn: 'সার্ভিসের ডিফল্ট' }, srcNone: { en: 'not set', bn: 'ঠিক হয়নি' },
    missCom: { en: 'Commission for this service is not set yet, so 0% is used here.', bn: 'এই সার্ভিসের কমিশন এখনো ঠিক হয়নি, তাই এখানে ০% ধরা হয়েছে।' },
    dealT: { en: 'Commission deal', bn: 'কমিশন চুক্তি' }, dealHint: { en: 'A special rate for this partner. Without one, the service default is used. The platform fee does not change.', bn: 'এই পার্টনারের জন্য বিশেষ হার। না থাকলে সার্ভিসের ডিফল্ট চলবে। প্ল্যাটফর্ম ফি বদলায় না।' },
    dealOwn: { en: 'own deal', bn: 'নিজস্ব চুক্তি' }, dealDef: { en: 'service default', bn: 'সার্ভিসের ডিফল্ট' }, dealNotSet: { en: 'Service default not set yet', bn: 'সার্ভিসের ডিফল্ট ঠিক হয়নি' },
    dealSave: { en: 'Save deal', bn: 'চুক্তি সংরক্ষণ' }, dealReset: { en: 'Use default', bn: 'ডিফল্টে ফেরান' }, dealSetup: { en: 'Run stage2_2b.sql in Supabase to turn on commission deals.', bn: 'কমিশন চুক্তি চালু করতে Supabase-এ stage2_2b.sql চালান।' },
    auS: { en: 'Every sensitive change: what changed, who did it and when.', bn: 'প্রতিটি গুরুত্বপূর্ণ পরিবর্তন: কী বদলাল, কে করল, কখন।' }, auMore: { en: 'Show more', bn: 'আরও দেখান' }, auNone: { en: 'No changes here yet.', bn: 'এখানে এখনো কোনো পরিবর্তন নেই।' },
    auAll: { en: 'All', bn: 'সব' }, auToday: { en: 'Today', bn: 'আজ' }, auYest: { en: 'Yesterday', bn: 'গতকাল' }, auSys: { en: 'System', bn: 'সিস্টেম' }, auShown: { en: 'changes shown', bn: 'টি পরিবর্তন দেখানো হচ্ছে' }, auBefore: { en: 'Before', bn: 'আগে' }, auAfter: { en: 'After', bn: 'পরে' }, 
    comT: { en: 'Commission by service', bn: 'সার্ভিস অনুযায়ী কমিশন' }, comHint: { en: 'Percent Zilax keeps from the partner. Empty means not decided yet. For now only Food commission is used in calculations.', bn: 'পার্টনারের কাছ থেকে Zilax যত শতাংশ রাখে। ফাঁকা মানে এখনো ঠিক হয়নি। এখন হিসাবে শুধু ফুডের কমিশন ব্যবহার হয়।' }, comNotSet: { en: 'not set', bn: 'ঠিক হয়নি' },
    calcT: { en: 'Try a calculation', bn: 'হিসাব পরীক্ষা করুন' }, cSubPh: { en: 'Food subtotal', bn: 'খাবারের দাম' }, cKmPh: { en: 'Distance (km)', bn: 'দূরত্ব (কিমি)' },
    cFood: { en: 'Food', bn: 'খাবার' }, cDel: { en: 'Delivery', bn: 'ডেলিভারি' },  cPay: { en: 'Customer pays', bn: 'ক্রেতা দেবেন' }, cCom: { en: 'Commission', bn: 'কমিশন' }, cMer: { en: 'Merchant gets', bn: 'মার্চেন্ট পাবেন' }, cRid: { en: 'Rider gets', bn: 'রাইডার পাবেন' }, cZil: { en: 'Zilax income', bn: 'Zilax-এর আয়' }
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
          (open ? '<div class="asec"><h4>' + q('dec') + '</h4>' + (mode === 'super' && ROLE_SVC[a.category] ? '<p class="ps" style="margin:0 0 4px"><b>' + l('acomT') + '</b></p><div style="display:flex;gap:8px;align-items:center"><input class="inp" id="acom" inputmode="decimal" style="max-width:110px" placeholder="' + esc((ZX.data.settings.commission || {})[ROLE_SVC[a.category]] == null ? '' : ZX.digits((ZX.data.settings.commission || {})[ROLE_SVC[a.category]])) + '"><span class="ps" style="margin:0">%</span></div><p class="ps" style="margin:6px 0 12px">' + esc(l('acomH')) + '</p>' : '') + '<textarea class="inp" id="anote" rows="2" placeholder="' + esc(l('note')) + '"></textarea><div id="amsg" class="fmsg"></div><div class="aacts">' + acts + '</div></div>' : '') +
          '<button type="button" class="aclose" data-aclose="1">' + q('close') + '</button>';
        sh.classList.add('show');
        try { var ds = await A.docsOf(a.id), box = document.getElementById('adocs'); if (box && cur && cur.id === a.id) box.innerHTML = ds.length ? ds.map(function (x) { return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener"><img src="' + esc(x.url) + '" alt="' + esc(x.kind) + '"><small>' + esc(x.kind) + '</small></a>' : ''; }).join('') : '<span class="mut">' + l('noDocs') + '</span>'; } catch (e) { var b2 = document.getElementById('adocs'); if (b2) b2.textContent = A.errMsg(e); }
      }
      async function onAct(e) {
        var b = e.target.closest('[data-act]'); if (!b || !cur) return; var act = b.getAttribute('data-act'), msg = document.getElementById('amsg'), note = (document.getElementById('anote') || {}).value || '';
        var deal = null, comEl = document.getElementById('acom');
        if (act === 'ok' && comEl && comEl.value.trim() !== '') { deal = pnum(comEl.value); if (!(deal >= 0 && deal <= 100)) { if (msg) { msg.className = 'fmsg err'; msg.textContent = A.errMsg(new Error('bad_percent')); } return; } }
        if (!window.confirm(act === 'ok' ? q('confirmOk') : act === 'no' ? q('confirmNo') : q('confirmRec'))) return;
        b.disabled = true;
        var app = cur, dealFailed = false;
        try {
          if (act === 'rec' || act === 'norec') await A.salesReview(app.id, act === 'rec', note); else await A.adminDecide(app.id, act === 'ok', note);
          if (deal !== null) { try { await A.setPartnerCommission(app.user_id, ROLE_SVC[app.category], deal); } catch (e2) { dealFailed = true; } }
          ZX.toast(dealFailed ? l('acomFail') : l('done')); document.getElementById('aSheet').classList.remove('show'); cur = null; if (await load()) { shell(); }
        }
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
  function svCss() {
    if (document.getElementById('svCss')) return;
    var c = document.createElement('style'); c.id = 'svCss';
    c.textContent = '.sv-row{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 12px}.sv-p{border:1px solid var(--line);border-radius:999px;padding:7px 12px;font-size:12.5px;font-weight:700;background:#fff;color:var(--ink)}' +
      '.sv-p.on{background:var(--mint);border-color:#bfe3c9;color:var(--forest)}.sv-p.off{background:#fef2f2;border-color:#fecaca;color:#b91c1c}.sv-p.gl{opacity:.55}';
    document.head.appendChild(c);
  }
  async function areasPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    async function paint() {
      var all; try { all = await A.areas(); } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return; }
      var ups = all.filter(function (a) { return a.level === 'upazila'; });
      var svcs = [], off = {}, offErr = false;
      try { svcs = await A.services(); } catch (e) { }
      try { (await A.areaServicesOff()).forEach(function (r) { off[r.area_id + '|' + r.service_code] = 1; }); } catch (e) { offErr = true; }
      svCss();
      function pills(u) {
        if (!svcs.length) return '';
        if (offErr) return '<p class="ps" style="margin:6px 0">' + l('arSvcSetup') + '</p>';
        return '<p class="ps" style="margin:6px 0 0"><b>' + l('arSvcT') + '</b></p><div class="sv-row">' + svcs.map(function (r) {
          var gl = r.enabled === false, o = !!off[u.id + '|' + r.code];
          return '<button type="button" class="sv-p ' + (gl ? 'gl off' : o ? 'off' : 'on') + '" data-asv="' + esc(u.id) + '|' + esc(r.code) + '"' + (gl ? ' disabled title="' + esc(l('arSvcGlobal')) + '"' : '') + '>' + (o || gl ? '✕ ' : '✓ ') + esc(ZX.t({ en: r.name_en, bn: r.name_bn })) + '</button>';
        }).join('') + '</div>';
      }
      var tree = ups.map(function (u) { var uns = all.filter(function (a) { return a.parent_id === u.id; }); return '<div class="cardx"><h3>' + esc(ZX.t({ en: u.name_en, bn: u.name_bn })) + ' <small style="color:var(--muted)">(' + ZX.digits(uns.length) + ')</small></h3>' + pills(u) + (uns.map(function (n) { return '<div class="rowx"><div class="g"><b>' + esc(ZX.t({ en: n.name_en, bn: n.name_bn })) + '</b><small>' + esc(n.name_en) + ' · ' + esc(n.name_bn) + '</small></div>' + chip(n.active ? A.statusLabel('active') : l('hide'), n.active ? 'ok' : 'r') + '<button class="btn o" data-tg="' + esc(n.id) + '">' + (n.active ? l('hide') : l('show')) + '</button></div>'; }).join('') || '<p class="ps">' + l('none') + '</p>') + '</div>'; }).join('');
      el.innerHTML = head(l('areas'), ZX.t({ en: 'Unions and paurashavas shown in sign-up forms.', bn: 'সাইন আপ ফর্মে যে ইউনিয়ন ও পৌরসভা দেখায়।' })) +
        '<div class="cardx"><h3>' + l('addArea') + '</h3><label class="fld"><span>' + l('upazila') + '</span><select class="inp" id="aPar">' + ups.map(function (u) { return '<option value="' + esc(u.id) + '">' + esc(ZX.t({ en: u.name_en, bn: u.name_bn })) + '</option>'; }).join('') + '</select></label><div class="grid2"><input class="inp" id="aEn" placeholder="' + l('nameEn') + '"><input class="inp" id="aBn" placeholder="' + l('nameBn') + '"></div><div id="aMs" class="fmsg"></div><button class="btn" id="aGo" type="button">' + l('add') + '</button></div>' + tree;
      el.querySelector('#aGo').onclick = async function () { var m = el.querySelector('#aMs'); m.className = 'fmsg ok'; m.textContent = '…'; try { await A.upsertArea({ parent_id: el.querySelector('#aPar').value, level: 'union', kind: 'union', name_en: el.querySelector('#aEn').value, name_bn: el.querySelector('#aBn').value }); ZX.toast(l('done')); paint(); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); } };
      el.querySelectorAll('[data-asv]').forEach(function (b) {
        b.onclick = async function () {
          var k = b.getAttribute('data-asv').split('|'), isOff = !!off[k[0] + '|' + k[1]];
          var u = all.filter(function (x) { return x.id === k[0]; })[0] || {}, sv = svcs.filter(function (x) { return x.code === k[1]; })[0] || {};
          if (!isOff && !window.confirm(l('arSvcConfirm').replace('{s}', ZX.t({ en: sv.name_en, bn: sv.name_bn })).replace('{u}', ZX.t({ en: u.name_en, bn: u.name_bn })))) return;
          try { await A.setAreaService(k[0], k[1], isOff); ZX.toast(l('done')); paint(); } catch (e) { ZX.toast(A.errMsg(e)); }
        };
      });
      el.querySelectorAll('[data-tg]').forEach(function (b) { b.onclick = async function () { var a = all.filter(function (x) { return x.id === b.getAttribute('data-tg'); })[0]; try { await A.upsertArea({ id: a.id, parent_id: a.parent_id, level: a.level, kind: a.kind, name_en: a.name_en, name_bn: a.name_bn, active: !a.active }); paint(); } catch (e) { ZX.toast(A.errMsg(e)); } }; });
    }
    paint();
  }

  /* ---------- pricing & commission (Stage 2.2) ---------- */
  function pnum(v) { v = String(v == null ? '' : v).replace(/[০-৯]/g, function (d) { return '০১২৩৪৫৬৭৮৯'.indexOf(d); }).trim(); return v === '' ? NaN : Number(v); }
  var ROLE_SVC = { merchant_food: 'food', merchant_shop: 'shop', technician: 'technical', car_partner: 'rent_car', decoration: 'decoration', sound_light: 'sound_light' };
  async function pricingPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    var svcs;
    try { await A.settings(); svcs = await A.services(); await A.loadPricing(); } catch (e) { el.innerHTML = head(l('prT'), '') + '<div class="soon">' + esc(A.errMsg(e)) + '<br>' + l('prSetup') + '</div>'; return; }
    var st = ZX.data.settings, DEL = { food: 1, shop: 1 };
    var noFee = svcs.length && !('platform_fee' in svcs[0]);
    function sname(r) { return ZX.t({ en: r.name_en, bn: r.name_bn }); }
    function numRow(label, id, val, goId) {
      return '<p class="ps" style="margin:12px 0 4px">' + l(label) + '</p><div style="display:flex;gap:8px;align-items:center"><input class="inp" id="' + id + '" inputmode="decimal" style="max-width:120px" value="' + esc(val) + '"><span class="ps" style="margin:0">৳</span><button class="btn" type="button" id="' + goId + '">' + l('prSave') + '</button></div>';
    }
    function field(label, attr, val, ph) { return '<label class="ps" style="margin:0;display:block">' + esc(label) + '<input class="inp" inputmode="decimal" style="margin-top:4px" ' + attr + ' value="' + esc(val) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></label>'; }
    el.innerHTML = head(l('prT'), l('prS')) +
      '<div class="cardx"><h3>' + l('delT') + '</h3><p class="ps">' + l('delHint') + ' ' + l('delNote') + '</p>' + numRow('delMin', 'dmV', st.deliveryMin, 'dmGo') + numRow('delPer', 'dpV', st.deliveryPer100m, 'dpGo') + '</div>' +
      '<h3 class="pt" style="font-size:19px;margin:18px 0 4px">' + l('svcRatesT') + '</h3><p class="ps">' + l('svcRatesS') + '</p>' + (noFee ? '<div class="soon" style="margin:0 0 12px">' + l('feeSetup') + '</div>' : '') +
      svcs.map(function (r) {
        var fee = r.platform_fee != null ? r.platform_fee : (st.platformFee[r.code] == null ? 0 : st.platformFee[r.code]);
        return '<div class="cardx"><div class="rowx" style="padding-top:0"><div class="g"><b>' + esc(sname(r)) + '</b><small>' + esc(r.code) + '</small></div>' + (DEL[r.code] ? chip(l('hasDel')) : '') + '</div>' +
          '<div class="grid2">' + field(l('feeL'), 'data-fee="' + esc(r.code) + '"', fee) + field(l('pctL'), 'data-pct="' + esc(r.code) + '"', r.commission_pct == null ? '' : r.commission_pct, l('comNotSet')) + '</div>' +
          '<button class="btn" type="button" style="margin-top:12px" data-ssave="' + esc(r.code) + '">' + l('prSave') + '</button></div>';
      }).join('') +
      '<div class="cardx"><h3>' + l('calcT') + '</h3><div class="grid2"><select class="inp" id="pSvc">' + svcs.map(function (r) { return '<option value="' + esc(r.code) + '">' + esc(sname(r)) + '</option>'; }).join('') + '</select><input class="inp" id="pSub" inputmode="decimal" value="1000" placeholder="' + esc(l('cSubPh')) + '"></div>' +
      '<div class="grid2" style="margin-top:10px"><input class="inp" id="pKm" inputmode="decimal" value="1.5" placeholder="' + esc(l('cKmPh')) + '"><input class="inp" id="pPartner" inputmode="decimal" placeholder="' + esc(l('pPartnerPh')) + '"></div><div id="pOut" style="margin-top:12px"></div></div>';
    function table(rows) { return '<table class="t">' + rows.map(function (r) { return '<tr><td' + (r[2] ? ' style="font-weight:700"' : '') + '>' + esc(r[0]) + '</td><td style="text-align:right"><b>' + ZX.money(r[1]) + '</b></td></tr>'; }).join('') + '</table>'; }
    function calcRender() {
      var code = el.querySelector('#pSvc').value, isDel = !!DEL[code];
      var sub = pnum(el.querySelector('#pSub').value) || 0, km = pnum(el.querySelector('#pKm').value) || 0, pp = pnum(el.querySelector('#pPartner').value);
      el.querySelector('#pKm').style.display = isDel ? '' : 'none';
      var o = ZX.calc.order(code, sub, isDel ? km : null, { partnerPct: isNaN(pp) ? null : pp });
      var src = o.commissionSource === 'partner' ? l('srcPartner') : o.commissionSource === 'service' ? l('srcService') : l('srcNone');
      var split = [[l('cCom') + ' (' + ZX.digits(o.commissionPct) + '% · ' + src + ')', o.commission], [l('cMer'), o.merchantPayout]];
      if (isDel) split.push([l('cRid'), o.riderEarning]);
      split.push([l('cZil') + ' (' + l('cCom') + ' + ' + ZX.t({ en: 'fee', bn: 'ফি' }) + ')', o.zilaxIncome]);
      el.querySelector('#pOut').innerHTML = '<p class="ps" style="margin:0 0 4px"><b>' + l('billT') + '</b></p>' + table(ZX.calc.bill(o).map(function (x) { return [ZX.t(x.label), x.amount, x.strong]; })) +
        '<p class="ps" style="margin:14px 0 4px"><b>' + l('splitT') + '</b></p>' + table(split) + (o.commissionMissing ? '<p class="ps" style="margin:8px 0 0">' + l('missCom') + '</p>' : '');
    }
    function saveNum(goId, inpId, key, max) {
      el.querySelector('#' + goId).onclick = async function () {
        var v = pnum(el.querySelector('#' + inpId).value);
        if (!(v >= 0 && v <= max)) { ZX.toast(A.errMsg(new Error('bad_value'))); return; }
        try { await A.setSetting(key, v); await A.loadPricing(); calcRender(); ZX.toast(l('done')); } catch (e) { ZX.toast(A.errMsg(e)); }
      };
    }
    saveNum('dmGo', 'dmV', 'delivery_min', 1000);
    saveNum('dpGo', 'dpV', 'delivery_per_100m', 1000);
    el.querySelectorAll('[data-ssave]').forEach(function (b) {
      b.onclick = async function () {
        var code = b.getAttribute('data-ssave'), r = svcs.filter(function (x) { return x.code === code; })[0]; if (!r) return;
        var fee = pnum(el.querySelector('[data-fee="' + code + '"]').value), raw = el.querySelector('[data-pct="' + code + '"]').value.trim(), pct = raw === '' ? null : pnum(raw);
        if (!(fee >= 0 && fee <= 10000)) { ZX.toast(A.errMsg(new Error('bad_value'))); return; }
        if ((pct !== null && !(pct >= 0 && pct <= 100)) || (pct === null && r.commission_pct != null)) { ZX.toast(A.errMsg(new Error('bad_percent'))); return; }
        try {
          var oldFee = Number(r.platform_fee != null ? r.platform_fee : st.platformFee[code]);
          if (fee !== oldFee) { await A.setServiceFee(code, fee); r.platform_fee = fee; }
          if (pct !== null && pct !== (r.commission_pct == null ? null : Number(r.commission_pct))) { await A.setCommission(code, pct); r.commission_pct = pct; }
          await A.loadPricing(); calcRender(); ZX.toast(l('done'));
        } catch (e) { ZX.toast(A.errMsg(e)); }
      };
    });
    ['#pSvc', '#pSub', '#pKm', '#pPartner'].forEach(function (q) { var x = el.querySelector(q); x.oninput = calcRender; x.onchange = calcRender; });
    calcRender();
  }

  /* ---------- services on/off (Stage 2.1) ---------- */
  async function servicesPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    async function paint() {
      var rows; try { rows = await A.services(); } catch (e) { el.innerHTML = head(l('svcT'), '') + '<div class="soon">' + esc(A.errMsg(e)) + '<br>' + l('svcSetup') + '</div>'; return; }
      el.innerHTML = head(l('svcT'), l('svcS')) + (rows.map(function (r) {
        return '<div class="cardx"><div class="rowx"><div class="g"><b>' + esc(ZX.t({ en: r.name_en, bn: r.name_bn })) + '</b><small>' + esc(r.code) + '</small></div>' + chip(r.enabled ? l('svcOn') : l('svcOffL'), r.enabled ? 'ok' : 'r') + '</div>' +
          '<p class="ps" style="margin:8px 0">' + (r.listing_approval ? l('svcApprYes') : l('svcApprNo')) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn o" type="button" data-on="' + esc(r.code) + '">' + (r.enabled ? l('svcTurnOff') : l('svcTurnOn')) + '</button>' +
          '<button class="btn o" type="button" data-ap="' + esc(r.code) + '">' + l('svcApprBtn') + '</button></div></div>';
      }).join('') || '<p class="ps">' + l('none') + '</p>');
      function row(code) { return rows.filter(function (x) { return x.code === code; })[0]; }
      el.querySelectorAll('[data-on]').forEach(function (b) {
        b.onclick = async function () {
          var r = row(b.getAttribute('data-on')); if (!r) return;
          if (r.enabled && !window.confirm(l('svcConfirmOff'))) return;
          try { await A.setService(r.code, !r.enabled, null); ZX.toast(l('done')); paint(); } catch (e) { ZX.toast(A.errMsg(e)); }
        };
      });
      el.querySelectorAll('[data-ap]').forEach(function (b) {
        b.onclick = async function () {
          var r = row(b.getAttribute('data-ap')); if (!r) return;
          try { await A.setService(r.code, null, !r.listing_approval); ZX.toast(l('done')); paint(); } catch (e) { ZX.toast(A.errMsg(e)); }
        };
      });
    }
    paint();
  }

  /* ---------- technician rates (Stage 2.4) ---------- */
  async function ratesPanel(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    var editId = null;
    try { await A.loadPricing(); } catch (e) { }
    function fee() { var f = (ZX.data.settings.platformFee || {}).technical; return f == null ? 0 : f; }
    function nm(r) { return ZX.t({ en: r.name_en, bn: r.name_bn }); }
    function valid(en, bn, price) { return en.trim().length >= 1 && en.trim().length <= 80 && bn.trim().length >= 1 && bn.trim().length <= 80 && price >= 0 && price <= 1000000; }
    async function paint() {
      var rows; try { rows = await A.techRates(true); } catch (e) { el.innerHTML = head(l('rtT'), '') + '<div class="soon">' + esc(A.errMsg(e)) + '<br>' + l('rtSetup') + '</div>'; return; }
      function field(label, id, val, extra) { return '<label class="ps" style="margin:0;display:block">' + esc(label) + '<input class="inp" id="' + id + '" style="margin-top:4px" ' + (extra || '') + ' value="' + esc(val) + '"></label>'; }
      el.innerHTML = head(l('rtT'), l('rtS')) +
        '<div class="cardx"><h3>' + l('rtAdd') + '</h3><div class="grid2">' + field(l('rtNameEn'), 'rtEn', '') + field(l('rtNameBn'), 'rtBn', '') + '</div><div style="margin-top:10px">' + field(l('rtPrice'), 'rtPr', '', 'inputmode="decimal"') + '</div><div id="rtMs" class="fmsg"></div><button class="btn" type="button" id="rtGo" style="margin-top:8px">' + l('add') + '</button></div>' +
        (rows.length ? rows.map(function (r) {
          if (editId === r.id) return '<div class="cardx"><div class="grid2">' + field(l('rtNameEn'), 'eEn', r.name_en) + field(l('rtNameBn'), 'eBn', r.name_bn) + '</div><div style="margin-top:10px">' + field(l('rtPrice'), 'ePr', r.price, 'inputmode="decimal"') + '</div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn" type="button" data-rsave="' + esc(r.id) + '">' + l('prSave') + '</button><button class="btn o" type="button" data-rcancel="1">' + l('rtCancel') + '</button></div></div>';
          return '<div class="cardx"><div class="rowx" style="padding-top:0"><div class="g"><b>' + esc(nm(r)) + '</b><small>' + esc(r.name_en) + ' · ' + esc(r.name_bn) + '</small></div>' + chip(r.active ? l('svcOn') : l('rtHiddenL'), r.active ? 'ok' : 'r') + '</div>' +
            '<p class="ps" style="margin:8px 0"><b>' + ZX.money(r.price) + '</b> · ' + l('rtPays') + ' ' + ZX.money(Number(r.price) + fee()) + ' (' + l('rtFeeIn') + ')</p>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn o" type="button" data-redit="' + esc(r.id) + '">' + l('rtEdit') + '</button><button class="btn o" type="button" data-rhide="' + esc(r.id) + '">' + (r.active ? l('hide') : l('show')) + '</button></div></div>';
        }).join('') : '<p class="ps">' + l('rtNone') + '</p>');
      function row(id) { return rows.filter(function (x) { return x.id === id; })[0]; }
      el.querySelector('#rtGo').onclick = async function () {
        var en = el.querySelector('#rtEn').value, bn = el.querySelector('#rtBn').value, pr = pnum(el.querySelector('#rtPr').value), m = el.querySelector('#rtMs');
        if (!valid(en, bn, pr)) { m.className = 'fmsg err'; m.textContent = A.errMsg(new Error('bad_value')); return; }
        try { await A.saveTechRate({ name_en: en.trim(), name_bn: bn.trim(), price: pr, active: true }); ZX.toast(l('done')); paint(); } catch (e) { m.className = 'fmsg err'; m.textContent = A.errMsg(e); }
      };
      el.querySelectorAll('[data-redit]').forEach(function (b) { b.onclick = function () { editId = b.getAttribute('data-redit'); paint(); }; });
      el.querySelectorAll('[data-rcancel]').forEach(function (b) { b.onclick = function () { editId = null; paint(); }; });
      el.querySelectorAll('[data-rsave]').forEach(function (b) {
        b.onclick = async function () {
          var r = row(b.getAttribute('data-rsave')); if (!r) return;
          var en = el.querySelector('#eEn').value, bn = el.querySelector('#eBn').value, pr = pnum(el.querySelector('#ePr').value);
          if (!valid(en, bn, pr)) { ZX.toast(A.errMsg(new Error('bad_value'))); return; }
          try { await A.saveTechRate({ id: r.id, name_en: en.trim(), name_bn: bn.trim(), price: pr, active: r.active }); editId = null; ZX.toast(l('done')); paint(); } catch (e) { ZX.toast(A.errMsg(e)); }
        };
      });
      el.querySelectorAll('[data-rhide]').forEach(function (b) {
        b.onclick = async function () {
          var r = row(b.getAttribute('data-rhide')); if (!r) return;
          try { await A.saveTechRate({ id: r.id, name_en: r.name_en, name_bn: r.name_bn, price: r.price, active: !r.active }); ZX.toast(l('done')); paint(); } catch (e) { ZX.toast(A.errMsg(e)); }
        };
      });
    }
    paint();
  }
  /* what the technician sees: the same list, read-only */
  async function techRatesView(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    var rows; try { rows = await A.techRates(false); } catch (e) { el.innerHTML = head(l('rtT'), '') + '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; return; }
    el.innerHTML = head(l('rtT'), l('rtViewS')) + (rows.length ? rows.map(function (r) { return '<div class="cardx"><div class="rowx" style="padding:0"><div class="g"><b>' + esc(ZX.t({ en: r.name_en, bn: r.name_bn })) + '</b></div><b>' + ZX.money(r.price) + '</b></div></div>'; }).join('') : '<div class="soon">' + l('rtViewNone') + '</div>');
  }

  /* ---------- audit log: grouped by day, filter chips, plain-language lines, tap for details ---------- */
  var SVC_NAME = { food: { en: 'Food', bn: 'ফুড' }, technical: { en: 'Technical', bn: 'টেকনিক্যাল' }, shop: { en: 'Shop', bn: 'শপ' }, rent_car: { en: 'Rent a Car', bn: 'গাড়ি ভাড়া' }, decoration: { en: 'Decoration', bn: 'ডেকোরেশন' }, sound_light: { en: 'Sound & Light', bn: 'সাউন্ড ও লাইট' } };
  var AU_CAT = { pricing: { en: 'Pricing', bn: 'মূল্য', c: '#0f766e' }, service: { en: 'Services', bn: 'সার্ভিস', c: '#ea580c' }, area: { en: 'Areas', bn: 'এলাকা', c: '#2563eb' }, role: { en: 'Roles', bn: 'রোল', c: '#7c3aed' }, app: { en: 'Applications', bn: 'আবেদন', c: '#db2777' } };
  var AU_SVG = {
    tag: '<path d="M3 12V4h8l9 9-8 8-9-9z"/><circle cx="7.500" cy="8.500" r="1.300"/>', power: '<path d="M12 3v8M6.500 6.500a8 8 0 1 0 11 0"/>', pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>', doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>', deal: '<path d="M3 12l4-4 4 3 4-3 6 5-5 5-3-2-3 2-5-3z"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 8v.5M12 11v5"/>'
  };
  function auSvg(k) { return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (AU_SVG[k] || AU_SVG.info) + '</svg>'; }
  function auCss() {
    if (document.getElementById('auCss')) return;
    var c = document.createElement('style'); c.id = 'auCss';
    c.textContent = '.au-chips{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 12px;margin:0 -2px;scrollbar-width:none}.au-chips::-webkit-scrollbar{display:none}' +
      '.au-chip{flex:none;display:flex;align-items:center;gap:6px;border:1px solid var(--line);background:#fff;color:var(--ink);border-radius:999px;padding:8px 14px;font-weight:700;font-size:13px}.au-chip i{width:8px;height:8px;border-radius:50%;background:var(--c,#94a3b8)}.au-chip.on{background:var(--forest);border-color:var(--forest);color:#fff}.au-chip.on i{background:#fff}' +
      '.au-day{margin:18px 4px 8px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}' +
      '.au-card{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(15,25,18,.04)}' +
      '.au-it{display:flex;align-items:flex-start;gap:12px;width:100%;padding:14px;border:0;border-bottom:1px solid var(--line);background:none;text-align:left;color:var(--ink)}.au-card .au-row:last-child .au-it{border-bottom:0}' +
      '.au-ic{flex:none;width:40px;height:40px;border-radius:14px;display:grid;place-items:center;color:var(--c);background:color-mix(in srgb,var(--c) 12%,#fff)}' +
      '.au-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}.au-tx b{font-size:14.5px;line-height:1.3}.au-tx small{color:var(--muted);font-size:12px}' +
      '.au-ch{font-size:13px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}.au-ch s{color:var(--muted)}.au-ch em{font-style:normal;font-weight:800;color:var(--forest);background:var(--mint);border-radius:8px;padding:1px 8px}' +
      '.au-chev{flex:none;color:var(--muted);transition:transform .2s;margin-top:8px}.au-chev svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.au-row.open .au-chev{transform:rotate(180deg)}' +
      '.au-d{display:none;padding:2px 14px 14px 66px;border-bottom:1px solid var(--line);background:#fafcfa}.au-row.open .au-d{display:block}.au-card .au-row:last-child .au-d{border-bottom:0}' +
      '.au-d table{width:100%;border-collapse:collapse;font-size:12.5px}.au-d th{color:var(--muted);font-weight:700;text-align:left;padding:4px 6px 4px 0}.au-d td{padding:4px 6px 4px 0;vertical-align:top;word-break:break-word}' +
      '.au-empty{margin-top:14px;background:#fff;border:1px dashed #bcd0c0;border-radius:20px;padding:26px;text-align:center;color:var(--muted)}';
    document.head.appendChild(c);
  }
  function auInfo(r) {
    var b = r.before, a = r.after, id = r.entity_id, bn = ZX.lang === 'bn';
    function T(en, bnT) { return bn ? bnT : en; }
    function obj(x) { return x && typeof x === 'object' && !Array.isArray(x) ? x : {}; }
    function sv(code) { return ZX.t(SVC_NAME[code] || { en: code, bn: code }); }
    function taka(x) { return x == null ? T('not set', 'ঠিক হয়নি') : ZX.digits(x) + ' ৳'; }
    function pct(x) { return x == null ? T('not set', 'ঠিক হয়নি') : ZX.digits(x) + '%'; }
    function yn(x) { return x ? T('Yes', 'হ্যাঁ') : T('No', 'না'); }
    var bo = obj(b), ao = obj(a), o = { cat: 'service', ico: 'info', title: r.action };
    switch (r.action) {
      case 'set_setting': o = { cat: 'pricing', ico: 'tag', title: { delivery_min: T('Minimum delivery charge', 'সর্বনিম্ন ডেলিভারি চার্জ'), delivery_per_100m: T('Delivery charge per 100 m', 'প্রতি ১০০ মিটারের ডেলিভারি চার্জ'), service_charge: T('Service charge (old)', 'সার্ভিস চার্জ (পুরোনো)') }[id] || id, from: typeof b === 'number' ? taka(b) : null, to: typeof a === 'number' ? taka(a) : null }; break;
      case 'set_service_fee': o = { cat: 'pricing', ico: 'tag', title: sv(id) + ' · ' + T('platform fee', 'প্ল্যাটফর্ম ফি'), from: taka(bo.platform_fee), to: taka(ao.platform_fee) }; break;
      case 'set_service_commission': o = { cat: 'pricing', ico: 'tag', title: sv(id) + ' · ' + T('default commission', 'ডিফল্ট কমিশন'), from: pct(bo.commission_pct), to: pct(ao.commission_pct) }; break;
      case 'set_partner_commission': o = { cat: 'pricing', ico: 'deal', title: (ao.partner || bo.partner || T('Partner', 'পার্টনার')) + ' · ' + sv(ao.service || bo.service) + ' · ' + T('commission deal', 'কমিশন চুক্তি'), from: bo.pct == null ? T('service default', 'সার্ভিসের ডিফল্ট') : pct(bo.pct), to: ao.pct == null ? T('service default', 'সার্ভিসের ডিফল্ট') : pct(ao.pct) }; break;
      case 'upsert_tech_service': {
        var nmR = ZX.t({ en: ao.name_en || bo.name_en || '', bn: ao.name_bn || bo.name_bn || '' });
        if (b == null) o = { cat: 'pricing', ico: 'tag', title: T('New technician rate', 'নতুন টেকনিশিয়ান রেট') + ': ' + nmR, from: null, to: taka(ao.price) };
        else if (bo.price !== ao.price) o = { cat: 'pricing', ico: 'tag', title: T('Technician rate', 'টেকনিশিয়ান রেট') + ': ' + nmR, from: taka(bo.price), to: taka(ao.price) };
        else if (bo.active !== ao.active) o = { cat: 'pricing', ico: 'power', title: nmR + ' · ' + T('technician rate', 'টেকনিশিয়ান রেট') + ' ' + (ao.active ? T('shown', 'দেখানো হচ্ছে') : T('hidden', 'লুকানো হয়েছে')), from: yn(bo.active), to: yn(ao.active) };
        else o = { cat: 'pricing', ico: 'tag', title: T('Technician rate updated', 'টেকনিশিয়ান রেট আপডেট') + ': ' + nmR };
        break;
      }
      case 'set_service':
        if (bo.enabled !== ao.enabled) o = { cat: 'service', ico: 'power', title: sv(id) + ' ' + (ao.enabled ? T('turned on', 'চালু করা হয়েছে') : T('turned off', 'বন্ধ করা হয়েছে')), from: yn(bo.enabled), to: yn(ao.enabled) };
        else o = { cat: 'service', ico: 'power', title: sv(id) + ' · ' + T('new listings need approval', 'নতুন লিস্টিংয়ে অনুমোদন'), from: yn(bo.listing_approval), to: yn(ao.listing_approval) };
        break;
      case 'set_area_service': o = { cat: 'service', ico: 'pin', title: sv(ao.service || bo.service) + ' · ' + (ao.area || bo.area || '') + ' ' + (ao.enabled ? T('turned on', 'চালু করা হয়েছে') : T('turned off', 'বন্ধ করা হয়েছে')), from: yn(bo.enabled), to: yn(ao.enabled) }; break;
      case 'upsert_area': o = { cat: 'area', ico: 'pin', title: (b == null ? T('New area added', 'নতুন এলাকা যোগ') : T('Area updated', 'এলাকা বদলানো হয়েছে')) + ': ' + ZX.t({ en: ao.name_en || '', bn: ao.name_bn || '' }) }; break;
      case 'grant_role': o = { cat: 'role', ico: 'key', title: T('Role given', 'রোল দেওয়া হয়েছে') + ': ' + A.roleLabel(ao.role) }; break;
      case 'revoke_role': o = { cat: 'role', ico: 'key', title: T('Role removed', 'রোল সরানো হয়েছে') + ': ' + A.roleLabel(bo.role) }; break;
      case 'application_submitted': o = { cat: 'app', ico: 'doc', title: T('New partner application', 'নতুন পার্টনার আবেদন') }; break;
      case 'sales_review': o = { cat: 'app', ico: 'doc', title: ao.recommend ? T('Application recommended by Sales', 'সেলস আবেদনটি সুপারিশ করেছে') : T('Application not recommended by Sales', 'সেলস আবেদনটি সুপারিশ করেনি') }; break;
      case 'admin_decide': o = { cat: 'app', ico: 'doc', title: ao.approved ? T('Application approved', 'আবেদন অনুমোদিত') : T('Application rejected', 'আবেদন প্রত্যাখ্যাত') }; break;
    }
    return o;
  }
  var AU_KEY = { commission_pct: { en: 'Commission %', bn: 'কমিশন %' }, platform_fee: { en: 'Platform fee', bn: 'প্ল্যাটফর্ম ফি' }, enabled: { en: 'On', bn: 'চালু' }, listing_approval: { en: 'Approval needed', bn: 'অনুমোদন লাগবে' }, name_en: { en: 'Name (English)', bn: 'নাম (ইংরেজি)' }, name_bn: { en: 'Name (Bangla)', bn: 'নাম (বাংলা)' }, level: { en: 'Level', bn: 'স্তর' }, role: { en: 'Role', bn: 'রোল' }, pct: { en: 'Commission %', bn: 'কমিশন %' }, service: { en: 'Service', bn: 'সার্ভিস' }, partner: { en: 'Partner', bn: 'পার্টনার' }, area: { en: 'Upazila', bn: 'উপজেলা' }, note: { en: 'Note', bn: 'নোট' }, approved: { en: 'Approved', bn: 'অনুমোদিত' }, recommend: { en: 'Recommended', bn: 'সুপারিশ' }, status: { en: 'Status', bn: 'অবস্থা' }, category: { en: 'Category', bn: 'ধরন' } };
  function auVal(k, v) { if (v === null || v === undefined || v === '') return '—'; if (typeof v === 'boolean') return ZX.lang === 'bn' ? (v ? 'হ্যাঁ' : 'না') : (v ? 'Yes' : 'No'); if (k === 'service') return ZX.t(SVC_NAME[v] || { en: v, bn: v }); if (k === 'role') return A.roleLabel(v); return typeof v === 'object' ? JSON.stringify(v) : String(v); }
  function auDetails(r) {
    var b = r.before, a = r.after, rows = [];
    if (typeof b === 'number' || typeof a === 'number') rows.push([ZX.t({ en: 'Value', bn: 'মান' }), auVal('', b), auVal('', a)]);
    else { var bo = b && typeof b === 'object' ? b : {}, ao = a && typeof a === 'object' ? a : {}; Object.keys(Object.assign({}, bo, ao)).forEach(function (k) { rows.push([ZX.t(AU_KEY[k] || { en: k, bn: k }), auVal(k, bo[k]), auVal(k, ao[k])]); }); }
    if (!rows.length) return '<small style="color:var(--muted)">—</small>';
    var one = !b;
    return '<table><tr><th></th>' + (one ? '' : '<th>' + l('auBefore') + '</th>') + '<th>' + l('auAfter') + '</th></tr>' + rows.map(function (x) { return '<tr><td>' + esc(x[0]) + '</td>' + (one ? '' : '<td>' + esc(x[1]) + '</td>') + '<td><b>' + esc(x[2]) + '</b></td></tr>'; }).join('') + '</table>';
  }
  async function auditPanel(el) {
    auCss();
    var PAGE = 40, st = { rows: [], more: false, cat: 'all', busy: false };
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    function dayKey(d) { var x = new Date(d); return x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate(); }
    function dayLabel(d) {
      var x = new Date(d), now = new Date(), y = new Date(now.getTime() - 86400000);
      if (dayKey(x) === dayKey(now)) return l('auToday'); if (dayKey(x) === dayKey(y)) return l('auYest');
      try { return x.toLocaleDateString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return String(d); }
    }
    function ftime(d) { try { return new Date(d).toLocaleTimeString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
    function paint() {
      var box = el.querySelector('#auList'); if (!box) return;
      var infos = st.rows.map(function (r, i) { var o = auInfo(r); o.i = i; o.r = r; return o; }).filter(function (o) { return st.cat === 'all' || o.cat === st.cat; });
      var html = '', last = '';
      infos.forEach(function (o, k) {
        var day = dayKey(o.r.created_at);
        if (day !== last) { if (last) html += '</div>'; html += '<div class="au-day">' + esc(dayLabel(o.r.created_at)) + '</div><div class="au-card">'; last = day; }
        var c = AU_CAT[o.cat].c, who = (o.r.who || {}).full_name || l('auSys');
        html += '<div class="au-row" data-au="' + o.i + '"><button type="button" class="au-it"><span class="au-ic" style="--c:' + c + '">' + auSvg(o.ico) + '</span><span class="au-tx"><b>' + esc(o.title) + '</b>' +
          (o.from != null || o.to != null ? '<span class="au-ch"><s>' + esc(o.from == null ? '—' : o.from) + '</s><span>→</span><em>' + esc(o.to == null ? '—' : o.to) + '</em></span>' : '') +
          '<small>' + esc(who) + ' · ' + esc(ftime(o.r.created_at)) + '</small></span><span class="au-chev">' + ic('arrow').replace('<svg', '<svg style="transform:rotate(90deg)"') + '</span></button><div class="au-d">' + auDetails(o.r) + '</div></div>';
      });
      if (last) html += '</div>';
      box.innerHTML = html || '<div class="au-empty">' + l('auNone') + '</div>';
      el.querySelector('#auMore').innerHTML = (st.more ? '<button type="button" class="btn o" id="auMoreBtn" style="width:100%;margin-top:14px">' + l('auMore') + '</button>' : '') + (st.rows.length ? '<p class="ucount" style="text-align:center;color:var(--muted);font-size:12px;margin:12px 0 0">' + ZX.digits(st.rows.length) + ' ' + l('auShown') + '</p>' : '');
    }
    async function load(more) {
      if (st.busy) return; st.busy = true;
      try { var from = more ? st.rows.length : 0, rows = await A.auditLog(from, from + PAGE - 1); st.rows = more ? st.rows.concat(rows) : rows; st.more = rows.length === PAGE; }
      catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; st.busy = false; return; }
      st.busy = false; paint();
    }
    var chips = '<button type="button" class="au-chip on" data-c="all"><i></i>' + l('auAll') + '</button>' + Object.keys(AU_CAT).map(function (k) { return '<button type="button" class="au-chip" data-c="' + k + '" style="--c:' + AU_CAT[k].c + '"><i></i>' + esc(ZX.t(AU_CAT[k])) + '</button>'; }).join('');
    el.innerHTML = head(l('audit'), l('auS')) + '<div class="au-chips">' + chips + '</div><div id="auList"></div><div id="auMore"></div>';
    el.addEventListener('click', function (e) {
      var ch = e.target.closest('.au-chip'); if (ch) { st.cat = ch.getAttribute('data-c'); el.querySelectorAll('.au-chip').forEach(function (x) { x.classList.toggle('on', x === ch); }); paint(); return; }
      if (e.target.closest('#auMoreBtn')) { load(true); return; }
      var it = e.target.closest('.au-it'); if (it) it.parentNode.classList.toggle('open');
    });
    load(false);
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
    spark: '<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/>', speaker: '<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="7" r="1"/>', pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', menu: '<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z"/><path d="M9 9h6M9 13h6"/>', alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.1"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M4 18l5-5 4 4 3-3 4 4"/>', box: '<path d="M3 8l9-5 9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="8" r="1.4"/>', target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>', wallet: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M4 7a2 2 0 0 1 2-2h11v4"/><circle cx="16.5" cy="13.5" r="1.2"/>'
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
    async function loadDeals(u) {
      var box = document.getElementById('dealBox'); if (!box) return;
      var rs = (st.roles[u.id] || []).filter(function (r) { return r.status === 'active' && ROLE_SVC[r.role]; });
      if (!rs.length) { box.innerHTML = ''; return; }
      var terms, svcs;
      try { terms = await A.partnerTerms(u.id); svcs = await A.services(); } catch (e) { box.innerHTML = '<div class="cardx" style="margin:10px 0 0"><h3>' + l('dealT') + '</h3><p class="ps" style="margin:0">' + l('dealSetup') + '</p></div>'; return; }
      box.innerHTML = '<div class="cardx" style="margin:10px 0 0"><h3>' + l('dealT') + '</h3><p class="ps">' + l('dealHint') + '</p>' + rs.map(function (r) {
        var code = ROLE_SVC[r.role], sv = svcs.filter(function (x) { return x.code === code; })[0] || {}, tm = terms.filter(function (x) { return x.service_code === code; })[0];
        var cur = tm ? ZX.digits(tm.commission_pct) + '% · ' + l('dealOwn') : (sv.commission_pct == null ? l('dealNotSet') : ZX.digits(sv.commission_pct) + '% · ' + l('dealDef'));
        return '<div class="rowx" style="display:block"><b>' + esc(A.roleLabel(r.role)) + '</b><small>' + esc(cur) + '</small><div style="display:flex;gap:8px;align-items:center;margin-top:8px"><input class="inp" style="max-width:96px" inputmode="decimal" data-dp="' + code + '" value="' + (tm ? esc(tm.commission_pct) : '') + '" placeholder="%"><span class="ps" style="margin:0">%</span><button type="button" class="btn" data-ds="' + code + '">' + l('dealSave') + '</button>' + (tm ? '<button type="button" class="btn o" data-dr="' + code + '">' + l('dealReset') + '</button>' : '') + '</div></div>';
      }).join('') + '</div>';
      async function act(code, v) { try { await A.setPartnerCommission(u.id, code, v); ZX.toast(l('done')); loadDeals(u); } catch (e) { ZX.toast(A.errMsg(e)); } }
      box.querySelectorAll('[data-ds]').forEach(function (b) { b.onclick = function () { var code = b.getAttribute('data-ds'), v = pnum(box.querySelector('[data-dp="' + code + '"]').value); if (!(v >= 0 && v <= 100)) { ZX.toast(A.errMsg(new Error('bad_percent'))); return; } act(code, v); }; });
      box.querySelectorAll('[data-dr]').forEach(function (b) { b.onclick = function () { act(b.getAttribute('data-dr'), null); }; });
    }
    function sheet(u) {
      var sh = document.getElementById('uSheet'); if (!sh) { sh = document.createElement('div'); sh.className = 'sheet'; sh.id = 'uSheet'; sh.innerHTML = '<div class="pan" id="uPan"></div>'; document.body.appendChild(sh); sh.addEventListener('click', function (e) { if (e.target === sh) sh.classList.remove('show'); }); }
      var col = hue(u.id), a = area(u), ph = String(u.phone || '');
      document.getElementById('uPan').innerHTML = '<div class="lsgrip"></div><div class="udet"><span class="uav big" style="background:' + col + '">' + (u.avatar_url ? '<img src="' + esc(u.avatar_url) + '" alt="">' : esc(String(u.full_name || '?').trim().charAt(0).toUpperCase())) + '</span><h3>' + esc(u.full_name || '—') + '</h3><p>' + esc(ph) + ' ' + chip(u.status === 'suspended' ? n('suspended') : n('activeU'), u.status === 'suspended' ? 'r' : 'ok') + '</p></div>' +
        '<div class="cardx" style="margin:10px 0 0;padding:6px 14px"><div class="rowx"><small>' + n('joined') + '</small><div class="g" style="text-align:right"><b>' + esc(fdate(u.created_at)) + '</b></div></div>' + (a ? '<div class="rowx"><small>' + n('area') + '</small><div class="g" style="text-align:right"><b>' + esc(a) + '</b></div></div>' : '') + (u.address ? '<div class="rowx"><small>' + n('addr') + '</small><div class="g" style="text-align:right"><b>' + esc(u.address) + '</b></div></div>' : '') + '<div class="rowx"><small>' + n('roles') + '</small><div class="g" style="text-align:right">' + rchips(u.id) + '</div></div></div><div id="dealBox"></div>' +
        '<div class="grid2" style="margin-top:12px"><a class="btn" href="tel:' + esc(ph) + '" style="text-align:center">' + ic('phone') + n('call') + '</a><a class="btn wab" href="https://wa.me/' + wa(ph) + '" target="_blank" rel="noopener" style="text-align:center">' + ic('wa') + n('wa') + '</a></div>';
      sh.classList.add('show'); loadDeals(u);
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

  /* ---------- Sales Admin + Merchant panels (premium; real data where it exists, honest empty states where it does not) ---------- */
  var M = {
    hi1: { en: 'Good morning', bn: 'শুভ সকাল' }, hi2: { en: 'Good afternoon', bn: 'শুভ অপরাহ্ন' }, hi3: { en: 'Good evening', bn: 'শুভ সন্ধ্যা' },
    sWait: { en: 'leads waiting for your review', bn: 'টি লিড আপনার যাচাইয়ের অপেক্ষায়' }, sWait1: { en: 'lead waiting for your review', bn: 'টি লিড আপনার যাচাইয়ের অপেক্ষায়' }, sClear: { en: 'No lead is waiting. Great work!', bn: 'কোনো লিড অপেক্ষায় নেই। দারুণ কাজ!' },
    review: { en: 'Review leads', bn: 'লিড যাচাই করুন' }, kWait: { en: 'Waiting for review', bn: 'যাচাইয়ের অপেক্ষায়' }, kMine: { en: 'Recommended by me', bn: 'আমার সুপারিশ' }, kAppr: { en: 'Approved partners', bn: 'অনুমোদিত পার্টনার' },
    kNot: { en: 'Not recommended', bn: 'সুপারিশ হয়নি' }, kWeek: { en: 'New this week', bn: 'এই সপ্তাহে নতুন' }, kRej: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' },
    needs: { en: 'Needs your review', bn: 'আপনার যাচাই দরকার' }, seeAll: { en: 'See all', bn: 'সব দেখুন' }, quick: { en: 'Quick actions', bn: 'দ্রুত কাজ' }, qLeads: { en: 'Leads', bn: 'লিড' }, qRep: { en: 'Reports', bn: 'রিপোর্ট' },
    repT: { en: 'Reports', bn: 'রিপোর্ট' }, repS: { en: 'How partner applications are moving. Based on the latest 100 applications.', bn: 'পার্টনার আবেদন কেমন এগোচ্ছে। সর্বশেষ ১০০টি আবেদনের ভিত্তিতে।' },
    funnel: { en: 'Journey of applications', bn: 'আবেদনের যাত্রা' }, fRecv: { en: 'Received', bn: 'পাওয়া গেছে' }, fRec: { en: 'Recommended', bn: 'সুপারিশ হয়েছে' }, fAppr: { en: 'Approved', bn: 'অনুমোদিত' }, byCat: { en: 'By partner type', bn: 'পার্টনারের ধরন অনুযায়ী' },
    tgT: { en: 'Targets', bn: 'টার্গেট' }, tgH: { en: 'Targets are not set yet', bn: 'এখনো টার্গেট ঠিক হয়নি' }, tgP: { en: 'Your admin will set monthly partner sign-up targets here. This arrives in a later stage.', bn: 'আপনার অ্যাডমিন এখানে মাসিক পার্টনার-যুক্ত করার টার্গেট ঠিক করবেন। এটা পরের ধাপে আসবে।' },
    vsT: { en: 'Field visits', bn: 'ফিল্ড ভিজিট' }, vsH: { en: 'No visits logged', bn: 'কোনো ভিজিট লেখা নেই' }, vsP: { en: 'Log your shop and partner visits here, with location. This arrives in a later stage.', bn: 'দোকান ও পার্টনার ভিজিট লোকেশনসহ এখানে লিখে রাখবেন। এটা পরের ধাপে আসবে।' },
    soon: { en: 'Coming soon', bn: 'শীঘ্রই আসছে' }, preview: { en: 'Preview as Super Admin', bn: 'সুপার অ্যাডমিন হিসেবে প্রিভিউ' }, store: { en: 'Your store', bn: 'আপনার দোকান' }, open: { en: 'Open', bn: 'খোলা' }, closed: { en: 'Closed', bn: 'বন্ধ' },
    swNote: { en: 'This switch will control your store once ordering starts.', bn: 'অর্ডার চালু হলে এই সুইচ দিয়ে আপনার দোকান খোলা বা বন্ধ হবে।' }, today: { en: 'Today', bn: 'আজ' }, orders: { en: 'Orders', bn: 'অর্ডার' }, sales: { en: 'Sales', bn: 'বিক্রি' }, rating: { en: 'Rating', bn: 'রেটিং' },
    start: { en: 'Get ready to sell', bn: 'বিক্রি শুরুর প্রস্তুতি' }, c1: { en: 'Application approved', bn: 'আবেদন অনুমোদিত' }, c2: { en: 'Add your menu items', bn: 'মেনুর আইটেম যোগ করুন' }, c3: { en: 'Set opening hours', bn: 'খোলার সময় ঠিক করুন' }, c4: { en: 'Add payout details', bn: 'পেআউটের তথ্য দিন' },
    mQ1: { en: 'Orders', bn: 'অর্ডার' }, mQ2: { en: 'Menu', bn: 'মেনু' }, mQ3: { en: 'Offers', bn: 'অফার' }, mQ4: { en: 'Earnings', bn: 'আয়' },
    oT: { en: 'Orders', bn: 'অর্ডার' }, oH: { en: 'No orders yet', bn: 'এখনো কোনো অর্ডার নেই' }, oP: { en: 'New orders will appear here with a sound alert. Ordering opens after the menu is ready.', bn: 'নতুন অর্ডার এখানে শব্দসহ আসবে। মেনু তৈরি হওয়ার পর অর্ডার চালু হবে।' },
    oNew: { en: 'New', bn: 'নতুন' }, oPrep: { en: 'Preparing', bn: 'তৈরি হচ্ছে' }, oReady: { en: 'Ready', bn: 'তৈরি' }, oDone: { en: 'Delivered', bn: 'পৌঁছেছে' },
    mnT: { en: 'Menu', bn: 'মেনু' }, mnH: { en: 'Your menu is empty', bn: 'আপনার মেনু খালি' }, mnP: { en: 'Add categories and items with photos and prices. This arrives in the next stage.', bn: 'ছবি ও দামসহ ক্যাটাগরি ও আইটেম যোগ করবেন। এটা পরের ধাপে আসবে।' }, mnB: { en: 'Add item', bn: 'আইটেম যোগ করুন' },
    skT: { en: 'Stock out', bn: 'স্টক আউট' }, skH: { en: 'Nothing to mark yet', bn: 'চিহ্নিত করার কিছু নেই' }, skP: { en: 'When your menu is ready you can switch items on or off in one tap.', bn: 'মেনু তৈরি হলে এক ট্যাপে আইটেম চালু বা বন্ধ করতে পারবেন।' },
    ofT: { en: 'Offers & reviews', bn: 'অফার ও রিভিউ' }, ofH: { en: 'No offers or reviews yet', bn: 'এখনো অফার বা রিভিউ নেই' }, ofP: { en: 'Create discounts and read what customers say. This arrives in a later stage.', bn: 'ডিসকাউন্ট বানাবেন এবং ক্রেতারা কী বলছে পড়বেন। এটা পরের ধাপে আসবে।' },
    erT: { en: 'Earnings', bn: 'আয় ও সেটেলমেন্ট' }, eToday: { en: 'Today', bn: 'আজ' }, eWeek: { en: 'This week', bn: 'এই সপ্তাহ' }, ePend: { en: 'Pending settlement', bn: 'সেটেলমেন্ট বাকি' }, eH: { en: 'No earnings yet', bn: 'এখনো কোনো আয় নেই' }, eP: { en: 'Your sales and payouts will show here once orders start.', bn: 'অর্ডার শুরু হলে আপনার বিক্রি ও পেআউট এখানে দেখা যাবে।' },
    rLbl: { en: 'Status', bn: 'অবস্থা' }, rOn: { en: 'Online', bn: 'অনলাইন' }, rOff: { en: 'Offline', bn: 'অফলাইন' }, rSwNote: { en: 'This switch will decide when you get orders, once deliveries start.', bn: 'ডেলিভারি চালু হলে এই সুইচ ঠিক করবে আপনি কখন অর্ডার পাবেন।' },
    rDel: { en: 'Deliveries', bn: 'ডেলিভারি' }, rEarn: { en: 'Earnings', bn: 'আয়' }, rCash: { en: 'Cash in hand', bn: 'হাতে থাকা ক্যাশ' }, rReady: { en: 'Get ready to ride', bn: 'রাইড শুরুর প্রস্তুতি' },
    rc2: { en: 'Add vehicle details', bn: 'গাড়ির তথ্য দিন' }, rc4: { en: 'Learn how deliveries work', bn: 'ডেলিভারি কীভাবে চলে জানুন' }, rQ2: { en: 'History', bn: 'ইতিহাস' }, rQ3: { en: 'Support', bn: 'সাপোর্ট' },
    reT: { en: 'Earnings & cash', bn: 'আয় ও ক্যাশ' }, reHand: { en: 'Cash to hand over', bn: 'জমা দেওয়ার ক্যাশ' }, reH: { en: 'No earnings yet', bn: 'এখনো কোনো আয় নেই' }, reP: { en: 'Your delivery earnings and cash will show here once deliveries start.', bn: 'ডেলিভারি চালু হলে আপনার আয় ও ক্যাশ এখানে দেখা যাবে।' },
    rhT: { en: 'History', bn: 'ইতিহাস' }, rhDone: { en: 'Delivered', bn: 'ডেলিভারি হয়েছে' }, rhCan: { en: 'Cancelled', bn: 'বাতিল' }, rhH: { en: 'No deliveries yet', bn: 'এখনো কোনো ডেলিভারি নেই' }, rhP: { en: 'Your finished deliveries will be listed here with date, shop and amount.', bn: 'শেষ হওয়া ডেলিভারি তারিখ, দোকান ও টাকাসহ এখানে থাকবে।' }
  };
  var m2 = function (k) { return ZX.t(M[k]); };
  var greetNow = function () { var hr = new Date().getHours(); return hr < 12 ? m2('hi1') : hr < 17 ? m2('hi2') : m2('hi3'); };
  var HUE = function (c) { return { merchant_food: '#ea580c', merchant_shop: '#2563eb', rider: '#e11d48', technician: '#0d9488', car_partner: '#7c3aed', decoration: '#db2777', sound_light: '#ca8a04' }[c] || '#64748b'; };
  function emptyState(ico, col, title, text, btn) { return '<div class="es" style="--ac:' + col + '"><span class="eic">' + ic(ico) + '</span><b>' + esc(title) + '</b><p>' + esc(text) + '</p>' + (btn ? '<button type="button" class="btn" disabled style="opacity:.55">' + esc(btn) + ' · ' + m2('soon') + '</button>' : '') + '</div>'; }
  function pageHead(t, s) { return '<h2 class="pt serif">' + esc(t) + '</h2>' + (s ? '<p class="ps">' + esc(s) + '</p>' : ''); }
  async function appsAll() { return await A.listApplications(null); }
  function kcards(K) { return '<div class="kgrid">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '"' + (k[4] ? ' data-g="' + k[4] + '"' : '') + '><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>'; }

  async function salesHome(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    try {
      var apps = await appsAll(), me = A.me(), uid = me.user.id, wk = Date.now() - 7 * 864e5, p = me.profile || {}, first = String(p.full_name || '').trim().split(' ')[0];
      var c = function (f) { return apps.filter(f).length; }, wait = c(function (a) { return a.status === 'pending'; });
      var date = new Date().toLocaleDateString(ZX.lang === 'bn' ? 'bn-BD' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      var K = [[m2('kWait'), ZX.digits(wait), 'clock', '#ea580c', 'sales/leads'], [m2('kMine'), ZX.digits(c(function (a) { return a.sales_by === uid && a.status !== 'pending'; })), 'check', '#0d9488', 'sales/leads'],
        [m2('kAppr'), ZX.digits(c(function (a) { return a.status === 'approved'; })), 'store', '#15803d', 'sales/reports'], [m2('kWeek'), ZX.digits(c(function (a) { return new Date(a.created_at).getTime() >= wk; })), 'plus', '#2563eb', 'sales/leads'],
        [m2('kNot'), ZX.digits(c(function (a) { return a.status === 'not_recommended'; })), 'x', '#d97706', 'sales/leads'], [m2('kRej'), ZX.digits(c(function (a) { return a.status === 'rejected'; })), 'x', '#dc2626', 'sales/reports']];
      var h = '<div class="hero2"><small>' + esc(date) + '</small><h2>' + esc(greetNow()) + (first ? ', ' + esc(first) : '') + '</h2><p>' + (wait ? '<b>' + ZX.digits(wait) + '</b> ' + (wait === 1 ? m2('sWait1') : m2('sWait')) : m2('sClear')) + '</p>' +
        (wait ? '<button type="button" class="hbtn" data-g="sales/leads">' + m2('review') + ic('arrow') + '</button>' : '') + '</div>' + kcards(K) +
        '<h3 class="sh">' + m2('quick') + '</h3><div class="qrow">' + [[m2('qLeads'), 'users', '#ea580c', 'sales/leads'], [m2('qRep'), 'chart', '#2563eb', 'sales/reports']].map(function (q) { return '<button type="button" class="qb" style="--ac:' + q[2] + '" data-g="' + q[3] + '"><span>' + ic(q[1]) + '</span>' + q[0] + '</button>'; }).join('') + '</div>';
      var need = apps.filter(function (a) { return a.status === 'pending'; }).slice(0, 5);
      if (need.length) h += '<div class="shr"><h3 class="sh">' + m2('needs') + '</h3><a href="#sales/leads" class="sal">' + m2('seeAll') + '</a></div><div class="cardx" style="padding:6px 16px">' + need.map(function (a) { var col = HUE(a.category); return '<div class="rowx"><span class="dot" style="background:' + col + '1f;color:' + col + '">' + esc(String(a.business_name || '?').trim().charAt(0).toUpperCase()) + '</span><div class="g"><b>' + esc(a.business_name) + '</b><small>' + esc(ZX.t(ptypeOf(a.category).name)) + ' · ' + esc(fdate(a.created_at)) + '</small></div>' + stc(a.status) + '</div>'; }).join('') + '</div>';
      el.innerHTML = h;
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }
  async function salesReports(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    try {
      var apps = await appsAll(), tot = apps.length, rec = apps.filter(function (a) { return a.status === 'recommended' || a.status === 'approved'; }).length, ap = apps.filter(function (a) { return a.status === 'approved'; }).length;
      var bar = function (label, v, max, col) { return '<div class="brow"><span class="bl">' + esc(label) + '</span><div class="bar" style="--ac:' + col + '"><i style="width:' + (max ? Math.round(v * 100 / max) : 0) + '%"></i></div><b>' + ZX.digits(v) + '</b></div>'; };
      var cats = {}; apps.forEach(function (a) { cats[a.category] = (cats[a.category] || 0) + 1; });
      var cmax = Math.max.apply(null, Object.keys(cats).map(function (k) { return cats[k]; }).concat([0]));
      el.innerHTML = pageHead(m2('repT'), m2('repS')) + '<div class="cardx"><h3>' + m2('funnel') + '</h3>' + bar(m2('fRecv'), tot, tot, '#2563eb') + bar(m2('fRec'), rec, tot, '#0d9488') + bar(m2('fAppr'), ap, tot, '#15803d') + '</div>' +
        '<div class="cardx"><h3>' + m2('byCat') + '</h3>' + (Object.keys(cats).length ? Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; }).map(function (k) { return bar(ZX.t(ptypeOf(k).name), cats[k], cmax, HUE(k)); }).join('') : '<p class="ps">' + l('none') + '</p>') + '</div>';
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }
  function simple(titleK, ico, col, hK, pK, btnK, subK) { return function (el) { el.innerHTML = pageHead(m2(titleK), subK ? m2(subK) : '') + emptyState(ico, col, m2(hK), m2(pK), btnK ? m2(btnK) : ''); }; }

  async function myStore() {
    var me = A.me(), mine = []; try { mine = (await A.myApplications()).filter(function (a) { return a.user_id === me.user.id && String(a.category).indexOf('merchant') === 0; }); } catch (e) { }
    mine.sort(function (a, b) { return (b.status === 'approved') - (a.status === 'approved'); }); return mine[0] || null;
  }
  async function merchantHome(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    try {
      var me = A.me(), p = me.profile || {}, app = await myStore(), areas = []; try { areas = await A.areas(); } catch (e) { }
      var name = app ? app.business_name : (p.full_name || ''), cat = app ? ZX.t(ptypeOf(app.category).name) : m2('preview'), where = app ? [areaName(areas, app.union_id), areaName(areas, app.upazila_id)].filter(Boolean).join(', ') : '';
      var openNow = ZX.store.get('zx_store_open', true);
      var K = [[m2('orders'), ZX.digits(0), 'bag', '#ea580c', 'merchant/orders'], [m2('sales'), '৳' + ZX.digits(0), 'chart', '#15803d', 'merchant/earn'], [m2('rating'), '—', 'check', '#ca8a04', 'merchant/offers']];
      var steps = [[m2('c1'), true], [m2('c2'), false], [m2('c3'), false], [m2('c4'), false]];
      el.innerHTML = '<div class="stcard"><div class="stt"><span class="aic big" style="--ac:' + HUE(app ? app.category : 'merchant_food') + ';background:rgba(255,255,255,.2);color:#fff">' + ic('store') + '</span><div class="g"><small>' + esc(cat) + '</small><h2>' + esc(name) + '</h2>' + (where ? '<small>' + esc(where) + '</small>' : '') + '</div></div>' +
        '<div class="stsw"><div><b>' + m2('store') + ': <span id="stLbl">' + (openNow ? m2('open') : m2('closed')) + '</span></b><small>' + m2('swNote') + '</small></div><button type="button" class="sw' + (openNow ? ' on' : '') + '" data-sw="1" aria-label="toggle"><i></i></button></div></div>' +
        '<h3 class="sh">' + m2('today') + '</h3>' + '<div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '" data-g="' + k[4] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>' +
        '<h3 class="sh">' + m2('start') + '</h3><div class="cardx" style="padding:6px 16px">' + steps.map(function (s) { return '<div class="rowx"><span class="chkc' + (s[1] ? ' done' : '') + '">' + (s[1] ? ic('check') : '') + '</span><div class="g"><b>' + esc(s[0]) + '</b></div>' + (s[1] ? '' : '<span class="chip">' + m2('soon') + '</span>') + '</div>'; }).join('') + '</div>' +
        '<h3 class="sh">' + m2('quick') + '</h3><div class="qrow q4">' + [[m2('mQ1'), 'bag', '#ea580c', 'merchant/orders'], [m2('mQ2'), 'menu', '#2563eb', 'merchant/menu'], [m2('mQ3'), 'tag', '#7c3aed', 'merchant/offers'], [m2('mQ4'), 'wallet', '#15803d', 'merchant/earn']].map(function (q) { return '<button type="button" class="qb" style="--ac:' + q[2] + '" data-g="' + q[3] + '"><span>' + ic(q[1]) + '</span>' + q[0] + '</button>'; }).join('') + '</div>';
      el.onclick = function (e) { var s = e.target.closest('[data-sw]'); if (!s) return; var on = !s.classList.contains('on'); s.classList.toggle('on', on); ZX.store.set('zx_store_open', on); var lb = el.querySelector('#stLbl'); if (lb) lb.textContent = on ? m2('open') : m2('closed'); };
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }
  function merchantOrders(el) {
    var chips = [['oNew', '#ea580c'], ['oPrep', '#2563eb'], ['oReady', '#0d9488'], ['oDone', '#15803d']];
    el.innerHTML = pageHead(m2('oT'), '') + '<div class="acats">' + chips.map(function (c, i) { return '<button type="button" class="acat' + (i === 0 ? ' on' : '') + '" style="--ac:' + c[1] + '"><i></i>' + m2(c[0]) + ' · ' + ZX.digits(0) + '</button>'; }).join('') + '</div>' + emptyState('bag', '#ea580c', m2('oH'), m2('oP'));
  }
  function merchantEarn(el) {
    var K = [[m2('eToday'), '৳' + ZX.digits(0), 'wallet', '#15803d'], [m2('eWeek'), '৳' + ZX.digits(0), 'chart', '#2563eb'], [m2('ePend'), '৳' + ZX.digits(0), 'clock', '#ea580c']];
    el.innerHTML = pageHead(m2('erT'), '') + '<div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>' + emptyState('wallet', '#15803d', m2('eH'), m2('eP'));
  }

  async function myRider() {
    var me = A.me(), mine = []; try { mine = (await A.myApplications()).filter(function (a) { return a.user_id === me.user.id && a.category === 'rider'; }); } catch (e) { }
    mine.sort(function (a, b) { return (b.status === 'approved') - (a.status === 'approved'); }); return mine[0] || null;
  }
  async function riderHome(el) {
    el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
    try {
      var me = A.me(), p = me.profile || {}, app = await myRider(), areas = []; try { areas = await A.areas(); } catch (e) { }
      var name = p.full_name || '', where = app ? [areaName(areas, app.union_id), areaName(areas, app.upazila_id)].filter(Boolean).join(', ') : '', online = ZX.store.get('zx_rider_online', false);
      var K = [[m2('rDel'), ZX.digits(0), 'bike', '#2563eb', 'rider/hist'], [m2('rEarn'), '৳' + ZX.digits(0), 'wallet', '#15803d', 'rider/earn'], [m2('rCash'), '৳' + ZX.digits(0), 'tag', '#ea580c', 'rider/earn']];
      var steps = [[m2('c1'), !!(app && app.status === 'approved')], [m2('rc2'), false], [m2('c4'), false], [m2('rc4'), false]];
      el.innerHTML = '<div class="stcard" style="background:linear-gradient(135deg,#9f1239,#e11d48 60%,#fb7185)"><div class="stt"><span class="aic big" style="--ac:#e11d48;background:rgba(255,255,255,.2);color:#fff">' + ic('bike') + '</span><div class="g"><small>' + esc(ZX.t(ptypeOf('rider').name)) + '</small><h2>' + esc(name) + '</h2>' + (where ? '<small>' + esc(where) + '</small>' : '') + '</div></div>' +
        '<div class="stsw"><div><b>' + m2('rLbl') + ': <span id="rdLbl">' + (online ? m2('rOn') : m2('rOff')) + '</span></b><small>' + m2('rSwNote') + '</small></div><button type="button" class="sw' + (online ? ' on' : '') + '" data-rsw="1" aria-label="toggle"><i></i></button></div></div>' +
        '<h3 class="sh">' + m2('today') + '</h3><div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '" data-g="' + k[4] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>' +
        '<h3 class="sh">' + m2('rReady') + '</h3><div class="cardx" style="padding:6px 16px">' + steps.map(function (s) { return '<div class="rowx"><span class="chkc' + (s[1] ? ' done' : '') + '">' + (s[1] ? ic('check') : '') + '</span><div class="g"><b>' + esc(s[0]) + '</b></div>' + (s[1] ? '' : '<span class="chip">' + m2('soon') + '</span>') + '</div>'; }).join('') + '</div>' +
        '<h3 class="sh">' + m2('quick') + '</h3><div class="qrow">' + [[m2('rEarn'), 'wallet', '#15803d', 'rider/earn'], [m2('rQ2'), 'clock', '#2563eb', 'rider/hist']].map(function (q) { return '<button type="button" class="qb" style="--ac:' + q[2] + '" data-g="' + q[3] + '"><span>' + ic(q[1]) + '</span>' + q[0] + '</button>'; }).join('') +
        '<a class="qb" style="--ac:#16a34a" href="https://wa.me/' + ((ZX.support && ZX.support.wa) || '8801646921627') + '" target="_blank" rel="noopener"><span>' + ic('wa') + '</span>' + m2('rQ3') + '</a></div>';
      el.onclick = function (e) { var s = e.target.closest('[data-rsw]'); if (!s) return; var on = !s.classList.contains('on'); s.classList.toggle('on', on); ZX.store.set('zx_rider_online', on); var lb = el.querySelector('#rdLbl'); if (lb) lb.textContent = on ? m2('rOn') : m2('rOff'); };
    } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
  }
  function riderEarn(el) {
    var K = [[m2('eToday'), '৳' + ZX.digits(0), 'wallet', '#15803d'], [m2('eWeek'), '৳' + ZX.digits(0), 'chart', '#2563eb'], [m2('reHand'), '৳' + ZX.digits(0), 'tag', '#ea580c']];
    el.innerHTML = pageHead(m2('reT'), '') + '<div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>' + emptyState('wallet', '#15803d', m2('reH'), m2('reP'));
  }
  function riderHist(el) {
    var chips = [['rhDone', '#15803d'], ['rhCan', '#dc2626']];
    el.innerHTML = pageHead(m2('rhT'), '') + '<div class="acats">' + chips.map(function (c, i) { return '<button type="button" class="acat' + (i === 0 ? ' on' : '') + '" style="--ac:' + c[1] + '"><i></i>' + m2(c[0]) + ' · ' + ZX.digits(0) + '</button>'; }).join('') + '</div>' + emptyState('clock', '#2563eb', m2('rhH'), m2('rhP'));
  }

  /* ---------- Partner panels: Shop, Technician, Car, Decoration, Sound & Light ---------- */
  var STAFF = ['sales_admin', 'admin', 'super_admin'];
  var PCFG = {
    shop: { cat: 'merchant_shop', ico: 'store', g: 'linear-gradient(135deg,#1e3a8a,#2563eb 60%,#60a5fa)', open: { en: 'Store open', bn: 'দোকান খোলা' }, closed: { en: 'Store closed', bn: 'দোকান বন্ধ' }, k: [['pk1', 'bag', '#2563eb', 'orders'], ['pk2', 'wallet', '#15803d', 'earn'], ['pk3', 'menu', '#ea580c', 'products']], steps: ['c1', 'ps1', 'ps2', 'c4'], q: [['products', 'menu', '#2563eb'], ['stock', 'alert', '#e11d48'], ['orders', 'bag', '#ea580c'], ['earn', 'wallet', '#15803d']], secs: ['products', 'stock', 'orders', 'earn'] },
    tech: { cat: 'technician', ico: 'tool', g: 'linear-gradient(135deg,#115e59,#0d9488 60%,#5eead4)', open: { en: 'Available for jobs', bn: 'কাজের জন্য প্রস্তুত' }, closed: { en: 'Not available', bn: 'এখন প্রস্তুত নই' }, k: [['pk4', 'pulse', '#0d9488', 'jobs'], ['pk2', 'wallet', '#15803d', 'earn'], ['pk5', 'spark', '#ca8a04', 'services']], steps: ['c1', 'ps3', 'ps4', 'c4'], q: [['services', 'tool', '#0d9488'], ['jobs', 'pulse', '#2563eb'], ['schedule', 'cal', '#7c3aed'], ['earn', 'wallet', '#15803d']], secs: ['services', 'jobs', 'schedule', 'earn'] },
    car: { cat: 'car_partner', ico: 'car', g: 'linear-gradient(135deg,#4c1d95,#7c3aed 60%,#a78bfa)', open: { en: 'Open for bookings', bn: 'বুকিংয়ের জন্য খোলা' }, closed: { en: 'Bookings paused', bn: 'বুকিং বন্ধ' }, k: [['pk6', 'cal', '#7c3aed', 'bookings'], ['pk2', 'wallet', '#15803d', 'earn'], ['pk7', 'car', '#2563eb', 'cars']], steps: ['c1', 'ps5', 'ps6', 'c4'], q: [['cars', 'car', '#7c3aed'], ['bookings', 'cal', '#2563eb'], ['avail', 'clock', '#ea580c'], ['earn', 'wallet', '#15803d']], secs: ['cars', 'bookings', 'avail', 'earn'] },
    decor: { cat: 'decoration', ico: 'spark', g: 'linear-gradient(135deg,#9d174d,#db2777 60%,#f9a8d4)', open: { en: 'Taking bookings', bn: 'বুকিং নিচ্ছি' }, closed: { en: 'Bookings paused', bn: 'বুকিং বন্ধ' }, k: [['pk6', 'cal', '#db2777', 'bookings'], ['pk2', 'wallet', '#15803d', 'earn'], ['pk8', 'spark', '#7c3aed', 'packages']], steps: ['c1', 'ps7', 'ps8', 'c4'], q: [['packages', 'spark', '#db2777'], ['bookings', 'cal', '#2563eb'], ['gallery', 'image', '#ea580c'], ['earn', 'wallet', '#15803d']], secs: ['packages', 'bookings', 'gallery', 'earn'] },
    sound: { cat: 'sound_light', ico: 'speaker', g: 'linear-gradient(135deg,#854d0e,#ca8a04 60%,#fde047)', open: { en: 'Taking bookings', bn: 'বুকিং নিচ্ছি' }, closed: { en: 'Bookings paused', bn: 'বুকিং বন্ধ' }, k: [['pk6', 'cal', '#ca8a04', 'bookings'], ['pk2', 'wallet', '#15803d', 'earn'], ['pk9', 'speaker', '#2563eb', 'equip']], steps: ['c1', 'ps9', 'ps8', 'c4'], q: [['equip', 'speaker', '#ca8a04'], ['packages', 'box', '#7c3aed'], ['bookings', 'cal', '#2563eb'], ['earn', 'wallet', '#15803d']], secs: ['equip', 'packages', 'bookings', 'earn'] }
  };
  var PT = {
    pk1: { en: 'Orders', bn: 'অর্ডার' }, pk2: { en: 'Earnings', bn: 'আয়' }, pk3: { en: 'Products', bn: 'পণ্য' }, pk4: { en: 'Jobs', bn: 'কাজ' }, pk5: { en: 'Services', bn: 'সার্ভিস' }, pk6: { en: 'Bookings', bn: 'বুকিং' }, pk7: { en: 'Cars', bn: 'গাড়ি' }, pk8: { en: 'Packages', bn: 'প্যাকেজ' }, pk9: { en: 'Equipment', bn: 'যন্ত্র' },
    ps1: { en: 'Add your products', bn: 'আপনার পণ্য যোগ করুন' }, ps2: { en: 'Set stock levels', bn: 'স্টক ঠিক করুন' }, ps3: { en: 'Choose the services you do', bn: 'কোন কোন সার্ভিস করেন বেছে নিন' }, ps4: { en: 'Set your working area', bn: 'কাজের এলাকা ঠিক করুন' },
    ps5: { en: 'Add your cars', bn: 'আপনার গাড়ি যোগ করুন' }, ps6: { en: 'Set when cars are free', bn: 'গাড়ি কবে খালি তা ঠিক করুন' }, ps7: { en: 'Create your packages', bn: 'আপনার প্যাকেজ বানান' }, ps8: { en: 'Upload photos of your work', bn: 'কাজের ছবি তুলুন' }, ps9: { en: 'Add your equipment', bn: 'আপনার যন্ত্র যোগ করুন' },
    rateT: { en: 'Rates are set by Zilax', bn: 'দাম জিলাক্স ঠিক করে দেয়' }, rateP: { en: 'Every service has one fixed rate for your area, so customers always see the same price. You only choose which services you do.', bn: 'প্রতিটি সার্ভিসের জন্য আপনার এলাকায় একটাই নির্দিষ্ট দাম থাকে, ফলে ক্রেতা সবসময় একই দাম দেখে। আপনি শুধু বেছে নেবেন কোন কোন সার্ভিস করেন।' },
    hiF: { en: 'Your business', bn: 'আপনার ব্যবসা' },
    swN: { en: 'This switch will control when you receive requests, once the service opens.', bn: 'সার্ভিস চালু হলে এই সুইচ ঠিক করবে আপনি কখন অনুরোধ পাবেন।' }, readyT: { en: 'Get ready to start', bn: 'শুরুর প্রস্তুতি' }
  };
  var pt = function (k) { return ZX.t(PT[k]); };
  /* title / text / icon / colour for each page: [icon, colour, headline, text] */
  var PP = {
    shop: { products: ['menu', '#2563eb', { en: 'Products', bn: 'পণ্য' }, { en: 'No products yet', bn: 'এখনো কোনো পণ্য নেই' }, { en: 'Add products with photos, prices and categories. This arrives in the next stage.', bn: 'ছবি, দাম ও ক্যাটাগরিসহ পণ্য যোগ করুন। এটা পরের ধাপে আসছে।' }], stock: ['alert', '#e11d48', { en: 'Stock', bn: 'স্টক' }, { en: 'Nothing to mark yet', bn: 'চিহ্নিত করার কিছু নেই' }, { en: 'When your products are ready you can mark them in or out of stock in one tap.', bn: 'পণ্য তৈরি হলে এক ট্যাপে স্টকে আছে বা নেই চিহ্নিত করতে পারবেন।' }], orders: ['bag', '#ea580c', { en: 'Orders', bn: 'অর্ডার' }, { en: 'No orders yet', bn: 'এখনো কোনো অর্ডার নেই' }, { en: 'New orders will appear here with a sound alert once ordering opens.', bn: 'অর্ডার চালু হলে নতুন অর্ডার শব্দসহ এখানে আসবে।' }] },
    tech: { services: ['tool', '#0d9488', { en: 'My services', bn: 'আমার সার্ভিস' }, { en: 'Choose your services', bn: 'আপনার সার্ভিস বেছে নিন' }, { en: 'Pick the services you do, such as AC, electric or plumbing. Rates are fixed by Zilax.', bn: 'AC, ইলেকট্রিক বা প্লাম্বিংয়ের মতো যেসব সার্ভিস করেন তা বেছে নিন। দাম জিলাক্স ঠিক করে দেয়।' }], jobs: ['pulse', '#2563eb', { en: 'Job requests', bn: 'কাজের অনুরোধ' }, { en: 'No job requests yet', bn: 'এখনো কোনো কাজের অনুরোধ নেই' }, { en: 'Customer requests near you will appear here. Accept a job and go.', bn: 'আপনার কাছের ক্রেতাদের অনুরোধ এখানে আসবে। কাজ নিয়ে রওনা দিন।' }], schedule: ['cal', '#7c3aed', { en: 'Schedule', bn: 'সময়সূচি' }, { en: 'Nothing scheduled', bn: 'কিছু নির্ধারিত নেই' }, { en: 'Your accepted jobs and times will be listed here.', bn: 'আপনার নেওয়া কাজ ও সময় এখানে থাকবে।' }] },
    car: { cars: ['car', '#7c3aed', { en: 'My cars', bn: 'আমার গাড়ি' }, { en: 'No cars listed', bn: 'কোনো গাড়ি যোগ করা নেই' }, { en: 'Add each car with photos, seats and the daily rent.', bn: 'প্রতিটি গাড়ি ছবি, আসন সংখ্যা ও দৈনিক ভাড়াসহ যোগ করুন।' }], bookings: ['cal', '#2563eb', { en: 'Bookings', bn: 'বুকিং' }, { en: 'No bookings yet', bn: 'এখনো কোনো বুকিং নেই' }, { en: 'Customer booking requests will appear here for you to accept.', bn: 'ক্রেতার বুকিংয়ের অনুরোধ এখানে আসবে, আপনি গ্রহণ করবেন।' }], avail: ['clock', '#ea580c', { en: 'Availability', bn: 'কবে খালি' }, { en: 'Set your free days', bn: 'খালি দিনগুলো ঠিক করুন' }, { en: 'Mark the days each car is free so nobody books it twice.', bn: 'প্রতিটি গাড়ি কোন কোন দিন খালি তা চিহ্নিত করুন, যাতে একই গাড়ি দুজন বুক না করে।' }] },
    decor: { packages: ['spark', '#db2777', { en: 'Packages', bn: 'প্যাকেজ' }, { en: 'No packages yet', bn: 'এখনো কোনো প্যাকেজ নেই' }, { en: 'Create packages for weddings, birthdays and more, with a price for each.', bn: 'বিয়ে, জন্মদিন ইত্যাদির প্যাকেজ বানান, প্রতিটার দামসহ।' }], bookings: ['cal', '#2563eb', { en: 'Bookings', bn: 'বুকিং' }, { en: 'No bookings yet', bn: 'এখনো কোনো বুকিং নেই' }, { en: 'Event bookings with date, place and package will appear here.', bn: 'তারিখ, জায়গা ও প্যাকেজসহ অনুষ্ঠানের বুকিং এখানে আসবে।' }], gallery: ['image', '#ea580c', { en: 'Gallery', bn: 'গ্যালারি' }, { en: 'Show your best work', bn: 'আপনার সেরা কাজ দেখান' }, { en: 'Upload photos of past events so customers can see your style.', bn: 'আগের অনুষ্ঠানের ছবি দিন, যাতে ক্রেতা আপনার কাজ দেখতে পায়।' }] },
    sound: { equip: ['speaker', '#ca8a04', { en: 'Equipment', bn: 'যন্ত্র' }, { en: 'No equipment listed', bn: 'কোনো যন্ত্র যোগ করা নেই' }, { en: 'List your speakers, lights and mixers with a daily rent.', bn: 'স্পিকার, লাইট ও মিক্সার দৈনিক ভাড়াসহ তালিকাভুক্ত করুন।' }], packages: ['box', '#7c3aed', { en: 'Packages', bn: 'প্যাকেজ' }, { en: 'No packages yet', bn: 'এখনো কোনো প্যাকেজ নেই' }, { en: 'Bundle equipment into ready packages for events.', bn: 'অনুষ্ঠানের জন্য যন্ত্র মিলিয়ে তৈরি প্যাকেজ বানান।' }], bookings: ['cal', '#2563eb', { en: 'Bookings', bn: 'বুকিং' }, { en: 'No bookings yet', bn: 'এখনো কোনো বুকিং নেই' }, { en: 'Event bookings will appear here for you to accept.', bn: 'অনুষ্ঠানের বুকিং এখানে আসবে, আপনি গ্রহণ করবেন।' }] }
  };
  async function myPartnerApp(cat) {
    var me = A.me(), mine = []; try { mine = (await A.myApplications()).filter(function (a) { return a.user_id === me.user.id && a.category === cat; }); } catch (e) { }
    mine.sort(function (a, b) { return (b.status === 'approved') - (a.status === 'approved'); }); return mine[0] || null;
  }
  function partnerHome(kind) {
    return async function (el) {
      var C = PCFG[kind]; el.innerHTML = '<div class="soon">' + l('loading') + '</div>';
      try {
        var me = A.me(), prof = me.profile || {}, app = await myPartnerApp(C.cat), areas = []; try { areas = await A.areas(); } catch (e) { }
        var name = app ? app.business_name : (prof.full_name || ''), where = app ? [areaName(areas, app.union_id), areaName(areas, app.upazila_id)].filter(Boolean).join(', ') : '', key = 'zx_open_' + kind, open = ZX.store.get(key, true);
        var K = C.k.map(function (k) { return [pt(k[0]), k[0] === 'pk2' ? '৳' + ZX.digits(0) : ZX.digits(0), k[1], k[2], kind + '/' + k[3]]; });
        var steps = C.steps.map(function (s) { var done = s === 'c1' ? !!(app && app.status === 'approved') : false; return [PT[s] ? pt(s) : m2(s), done]; });
        el.innerHTML = '<div class="stcard" style="background:' + C.g + '"><div class="stt"><span class="aic big" style="--ac:#000;background:rgba(255,255,255,.2);color:#fff">' + ic(C.ico) + '</span><div class="g"><small>' + esc(ZX.t(ptypeOf(C.cat).name)) + '</small><h2>' + esc(name) + '</h2>' + (where ? '<small>' + esc(where) + '</small>' : '') + '</div></div>' +
          '<div class="stsw"><div><b><span id="pwLbl">' + (open ? ZX.t(C.open) : ZX.t(C.closed)) + '</span></b><small>' + pt('swN') + '</small></div><button type="button" class="sw' + (open ? ' on' : '') + '" data-psw="1" aria-label="toggle"><i></i></button></div></div>' +
          '<h3 class="sh">' + m2('today') + '</h3><div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '" data-g="' + k[4] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + esc(k[0]) + '</small></div>'; }).join('') + '</div>' +
          '<h3 class="sh">' + pt('readyT') + '</h3><div class="cardx" style="padding:6px 16px">' + steps.map(function (s) { return '<div class="rowx"><span class="chkc' + (s[1] ? ' done' : '') + '">' + (s[1] ? ic('check') : '') + '</span><div class="g"><b>' + esc(s[0]) + '</b></div>' + (s[1] ? '' : '<span class="chip">' + m2('soon') + '</span>') + '</div>'; }).join('') + '</div>' +
          '<h3 class="sh">' + m2('quick') + '</h3><div class="qrow q4">' + C.q.map(function (q) { var d = PP[kind][q[0]]; return '<button type="button" class="qb" style="--ac:' + q[2] + '" data-g="' + kind + '/' + q[0] + '"><span>' + ic(q[1]) + '</span>' + (d ? ZX.t(d[2]) : pt('pk2')) + '</button>'; }).join('') + '</div>';
        el.onclick = function (e) { var s = e.target.closest('[data-psw]'); if (!s) return; var on = !s.classList.contains('on'); s.classList.toggle('on', on); ZX.store.set(key, on); var lb = el.querySelector('#pwLbl'); if (lb) lb.textContent = on ? ZX.t(C.open) : ZX.t(C.closed); };
      } catch (e) { el.innerHTML = '<div class="soon">' + esc(A.errMsg(e)) + '</div>'; }
    };
  }
  function partnerPage(kind, sec) {
    return function (el) {
      if (sec === 'earn') { var K = [[m2('eToday'), '৳' + ZX.digits(0), 'wallet', '#15803d'], [m2('eWeek'), '৳' + ZX.digits(0), 'chart', '#2563eb'], [m2('ePend'), '৳' + ZX.digits(0), 'clock', '#ea580c']];
        el.innerHTML = pageHead(m2('erT'), '') + '<div class="kgrid k3">' + K.map(function (k) { return '<div class="kc" style="--ac:' + k[3] + '"><span class="kic">' + ic(k[2]) + '</span><b>' + k[1] + '</b><small>' + k[0] + '</small></div>'; }).join('') + '</div>' + emptyState('wallet', '#15803d', m2('eH'), m2('eP')); return; }
      var d = PP[kind][sec]; el.innerHTML = pageHead(ZX.t(d[2]), '') + (kind === 'tech' && sec === 'services' ? '<div class="ratebox"><span>' + ic('tag') + '</span><div><b>' + pt('rateT') + '</b><p>' + pt('rateP') + '</p></div></div>' : '') + emptyState(d[0], d[1], ZX.t(d[3]), ZX.t(d[4]), '');
    };
  }

  var LIVE = { 'rider.home': riderHome, 'rider.earn': riderEarn, 'rider.hist': riderHist, 'sales.home': salesHome, 'sales.reports': salesReports, 'sales.targets': simple('tgT', 'target', '#2563eb', 'tgH', 'tgP'), 'sales.visits': simple('vsT', 'pin', '#0d9488', 'vsH', 'vsP'),
    'merchant.dash': merchantHome, 'merchant.orders': merchantOrders, 'merchant.menu': simple('mnT', 'menu', '#2563eb', 'mnH', 'mnP', 'mnB'), 'merchant.stock': simple('skT', 'alert', '#dc2626', 'skH', 'skP'), 'merchant.offers': simple('ofT', 'tag', '#7c3aed', 'ofH', 'ofP'), 'merchant.earn': merchantEarn,
    'sales.leads': appsBoard('sales'), 'admin.appr': appsBoard('admin'), 'super.appr': appsBoard('super'), 'super.cmd': dashPanel, 'super.users': usersPanel, 'super.roles': staffPanel, 'super.areas': areasPanel, 'super.svc': servicesPanel, 'super.price': pricingPanel, 'super.rates': ratesPanel, 'super.audit': auditPanel };
  window.ZXLive = {
    ready: false,
    intercept: function (role, sec) {
      if (!ZX.live) return null;
      if (!this.ready) return gateLoading;
      if (!A.loggedIn()) return gateLogin;
      if (!A.hasAny(NEED[role] || [])) return function (el) { gateNoAccess(el, role); };
      return LIVE[role + '.' + sec] || null;
    },
    partnerOnly: function () { var rs = (A.me().roles || []).filter(function (r) { return r.status === 'active'; }).map(function (r) { return r.role; }); return this.ready && A.loggedIn() && rs.length > 0 && !rs.some(function (r) { return STAFF.indexOf(r) > -1; }); },
    canSee: function (r) { return this.ready && A.loggedIn() && A.hasAny(NEED[r] || []); },
    has: function (r, s) { return !!LIVE[r + '.' + s]; },
    user: function () { var p = A.me().profile; return p ? { name: p.full_name || '' } : null; },
    who: function () { var p = A.me().profile; return p ? '<span style="color:#cfe3d4;font-size:12px">' + esc(p.full_name) + '</span> <a href="#" id="plOut" style="color:#fff;font-size:12px;font-weight:700">' + l('logout') + '</a>' : ''; },
    logout: function () { return A.signOut(); }
  };
  ['shop', 'tech', 'car', 'decor', 'sound'].forEach(function (k) { LIVE[k + '.home'] = partnerHome(k); Object.keys(PP[k]).concat(['earn']).forEach(function (s) { LIVE[k + '.' + s] = partnerPage(k, s); }); });
  LIVE['tech.services'] = techRatesView; /* Stage 2.4: the technician sees the Super Admin's fixed rate list (read-only) */

})();
