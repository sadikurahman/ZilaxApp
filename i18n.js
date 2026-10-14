/* Zilax — shared helpers: storage, language, formatting, toast */
window.ZX = window.ZX || {};
(function () {
  var mem = {};
  ZX.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? (k in mem ? mem[k] : d) : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  ZX.lang = ZX.store.get('zx_lang', 'en');
  var BN = '০১২৩৪৫৬৭৮৯';
  ZX.digits = function (s) { s = String(s); return ZX.lang === 'bn' ? s.replace(/[0-9]/g, function (d) { return BN[d]; }) : s; };
  ZX.num = function (n) { return ZX.digits(Number(n).toLocaleString('en-US')); };
  ZX.money = function (n) { return ZX.lang === 'bn' ? '৳' + ZX.num(n) : ZX.num(n) + ' Tk'; };
  ZX.t = function (o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[ZX.lang] || o.en || ''; };
  ZX.dict = {
    est: { en: 'EST. 2024', bn: 'প্রতিষ্ঠিত ২০২৪' },
    search1: { en: 'Search biryani, panjabi, AC repair…', bn: 'বিরিয়ানি, পাঞ্জাবি, এসি মেরামত খুঁজুন…' },
    offers: { en: 'Premium offers', bn: 'প্রিমিয়াম অফার' },
    offersSub: { en: 'Members save more this week', bn: 'এই সপ্তাহে সদস্যদের বাড়তি সাশ্রয়' },
    plates: { en: 'Trending plates', bn: 'ট্রেন্ডিং খাবার' },
    platesSub: { en: 'Most ordered in your area', bn: 'আপনার এলাকায় সবচেয়ে বেশি অর্ডার' },
    fashion: { en: 'Trending fashion', bn: 'ট্রেন্ডিং ফ্যাশন' },
    fashionSub: { en: 'Local attire, tailored finish', bn: 'দেশীয় পোশাক, নিখুঁত সেলাই' },
    more: { en: 'More services', bn: 'আরও সার্ভিস' },
    moreSub: { en: 'Four essentials, one app', bn: 'চারটি প্রয়োজনীয় সেবা, একটি অ্যাপ' },
    seeAll: { en: 'See all', bn: 'সব দেখুন' },
    trust: { en: 'Verified pros • Cashless payment • Live support, 7 days', bn: 'যাচাইকৃত পার্টনার • ক্যাশলেস পেমেন্ট • ৭ দিন লাইভ সাপোর্ট' },
    nHome: { en: 'Home', bn: 'হোম' }, nShop: { en: 'Shop', bn: 'শপ' }, nFood: { en: 'Food', bn: 'ফুড' },
    nService: { en: 'Service', bn: 'সার্ভিস' }, nAccount: { en: 'Account', bn: 'অ্যাকাউন্ট' },
    cart: { en: 'Your cart', bn: 'আপনার কার্ট' }, empty: { en: 'Your cart is empty', bn: 'কার্ট খালি' },
    total: { en: 'Total', bn: 'মোট' }, checkout: { en: 'Checkout', bn: 'চেকআউট' },
    soldOut: { en: 'Sold out', bn: 'শেষ' }, added: { en: 'Added to cart', bn: 'কার্টে যোগ হয়েছে' },
    noResult: { en: 'Nothing found', bn: 'কিছু পাওয়া যায়নি' }
  };
  ZX.d = function (k) { return ZX.t(ZX.dict[k]); };
  ZX.applyI18n = function (root) {
    root = root || document;
    document.documentElement.lang = ZX.lang === 'bn' ? 'bn' : 'en';
    document.body.classList.toggle('lang-bn', ZX.lang === 'bn');
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = ZX.d(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', ZX.d(el.getAttribute('data-i18n-ph'))); });
  };
  ZX.setLang = function (l) { ZX.lang = l; ZX.store.set('zx_lang', l); if (ZX.onLang) ZX.onLang(); };
  var toastTimer;
  ZX.toast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  };
  ZX.stageMsg = function (n) { return ZX.lang === 'bn' ? 'এই অংশ Stage ' + ZX.digits(n) + '-এ তৈরি হবে' : 'This part is built in Stage ' + n; };
  ZX.ico = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    food: '<svg viewBox="0 0 24 24"><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10"/><path d="M17 3c-2 2-3 5-3 8h3v10"/></svg>',
    tool: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    filter: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="M4 16l1.5-5a2 2 0 0 1 2-1.5h9a2 2 0 0 1 2 1.5L20 16v3h-3v-2H7v2H4v-3z"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
    bolt: '<svg viewBox="0 0 24 24"><path d="M13 3L5 14h6l-1 7 8-11h-6z"/></svg>',
    cart: '<svg viewBox="0 0 24 24"><path d="M3 4h3l2.5 11h10L21 8H7"/><circle cx="10" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
})();
