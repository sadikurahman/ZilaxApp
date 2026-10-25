/* Zilax — MOCK DATA (Stage 0). From Stage 1 this comes from Supabase and Super Admin can edit it. */
window.ZX = window.ZX || {};
ZX.data = {
  area: { en: 'Islampur', bn: 'ইসলামপুর' },
  settings: {
    /* Fallback numbers. The real ones are loaded from the database (Super Admin > Pricing & commission). */
    deliveryMin: 15,
    deliveryPer100m: 2.5,
    platformFee: { food: 4, shop: 10, technical: 200, rent_car: 200, decoration: 200, sound_light: 200 },
    commission: { food: 15 },
    foodCommissionPct: 15
  },

  banners: [
    { id: 'b1', tag: { en: 'FOOD DELIVERY', bn: 'ফুড ডেলিভারি' }, title: { en: 'Crave. Tap.<br>Feast in 30 min.', bn: 'ক্ষুধা পেলে ট্যাপ।<br>৩০ মিনিটে ভুরিভোজ।' },
      sub: { en: '120+ kitchens • 4.9 rated riders', bn: '১২০+ কিচেন • ৪.৯ রেটিং রাইডার' }, badge: '40% OFF', cta: { en: 'Order Now', bn: 'অর্ডার করুন' }, ctaStyle: 'light',
      emoji: '🍛', grad: 'linear-gradient(120deg,#17331f 0%,#2e4a22 55%,#7a6a2a 100%)', img: 'banner-food.jpg', link: '#food' },
    { id: 'b2', tag: { en: 'TECHNICAL SERVICES', bn: 'টেকনিক্যাল সার্ভিস' }, title: { en: 'AC, Electric &<br>Expert Repairs', bn: 'এসি, ইলেকট্রিক ও<br>এক্সপার্ট মেরামত' },
      sub: { en: '', bn: '' }, badge: '', cta: { en: 'Book Technician', bn: 'টেকনিশিয়ান বুক করুন' }, ctaStyle: 'green',
      emoji: '🛠️', grad: 'linear-gradient(120deg,#232a2a 0%,#3a4546 55%,#6b7476 100%)', img: 'banner-tech.jpg', link: '#service' }
  ],
  offers: [
    { id: 'o1', badge: '40% OFF', title: { en: 'Weekend Food Fest', bn: 'উইকেন্ড ফুড ফেস্ট' }, sub: { en: 'Sultan’s Dine • Chillox • Tarka', bn: 'সুলতানস ডাইন • চিলক্স • তারকা' }, emoji: '🍽️', grad: 'linear-gradient(135deg,#1b2a1f,#3b4a2a)', img: 'offer-food.jpg' },
    { id: 'o2', badge: '35% OFF', title: { en: 'Home Tech Care', bn: 'হোম টেক কেয়ার' }, sub: { en: 'AC Service • Electric • Plumbing', bn: 'এসি সার্ভিস • ইলেকট্রিক • প্লাম্বিং' }, emoji: '🧰', grad: 'linear-gradient(135deg,#2a2f33,#4b5557)', img: 'offer-tech.jpg' },
    { id: 'o3', badge: '30% OFF', title: { en: 'Party Ready Deals', bn: 'পার্টি রেডি ডিল' }, sub: { en: 'DJ • LED • Stage', bn: 'ডিজে • এলইডি • স্টেজ' }, emoji: '🎧', grad: 'linear-gradient(135deg,#251f4a,#5a3a8a)', img: 'offer-party.jpg' }
  ],
  plates: [
    { id: 'p1', en: 'Chicken Biryani', bn: 'চিকেন বিরিয়ানি', price: 150, badge: { en: 'Bestseller', bn: 'বেস্টসেলার' }, emoji: '🍛', grad: ['#f0c35a', '#c9801f'], img: 'biryani.jpg' },
    { id: 'p2', en: 'Smoky Burger', bn: 'স্মোকি বার্গার', price: 220, badge: { en: 'Chef’s pick', bn: 'শেফের পছন্দ' }, emoji: '🍔', grad: ['#e8a05a', '#9a4a1a'], img: 'burger.jpg' },
    { id: 'p3', en: 'Kacchi Biryani', bn: 'কাচ্চি বিরিয়ানি', price: 180, badge: { en: 'Local fav', bn: 'লোকাল ফেভ' }, emoji: '🍖', grad: ['#d9a25a', '#8a5a2a'], img: 'kacchi.jpg' }
  ],
  fashion: [
    { id: 'f1', en: 'Royal Panjabi', bn: 'রয়্যাল পাঞ্জাবি', price: 2450, badge: { en: 'Eid Edit', bn: 'ঈদ এডিট' }, emoji: '👘', grad: ['#3a2f28', '#7a6a58'], img: 'panjabi.jpg' },
    { id: 'f2', en: 'Tailored Shirt', bn: 'টেইলরড শার্ট', price: 1850, badge: { en: 'New', bn: 'নতুন' }, emoji: '👔', grad: ['#e6dcc6', '#b9a98a'], img: 'shirt.jpg' },
    { id: 'f3', en: 'Lawn Kurti', bn: 'লন কুর্তি', price: 1650, badge: { en: 'Loved', bn: 'জনপ্রিয়' }, emoji: '👗', grad: ['#c9a27a', '#8a5f3a'], img: 'kurti.jpg' }
  ],
  services: [
    { id: 's1', icon: 'bag', label: { en: 'Shop', bn: 'শপ' }, title: { en: 'Daily essentials', bn: 'দৈনন্দিন প্রয়োজন' }, sub: { en: 'Groceries in 30 min', bn: 'মুদি ৩০ মিনিটে' }, emoji: '🛍️', grad: 'linear-gradient(160deg,#e9b98a,#c47a4a)', img: 'svc-shop.jpg', link: '#shop' },
    { id: 's2', icon: 'car', label: { en: 'Rent a Car', bn: 'গাড়ি ভাড়া' }, title: { en: 'Drive in style', bn: 'স্টাইলে চলুন' }, sub: { en: 'Hourly & daily', bn: 'ঘণ্টা ও দিন হিসেবে' }, emoji: '🚘', grad: 'linear-gradient(160deg,#2a2d30,#0f1113)', img: 'svc-car.jpg', link: '#service' },
    { id: 's3', icon: 'spark', label: { en: 'Decoration', bn: 'ডেকোরেশন' }, title: { en: 'Stunning spaces', bn: 'চমৎকার সাজসজ্জা' }, sub: { en: 'Home & events', bn: 'বাসা ও ইভেন্ট' }, emoji: '🌸', grad: 'linear-gradient(160deg,#caa66a,#6a4a2a)', img: 'svc-deco.jpg', link: '#service' },
    { id: 's4', icon: 'bolt', label: { en: 'Sound & Light', bn: 'সাউন্ড ও লাইট' }, title: { en: 'Party ready', bn: 'পার্টি রেডি' }, sub: { en: 'DJ • LED • Stage', bn: 'ডিজে • এলইডি • স্টেজ' }, emoji: '🎤', grad: 'linear-gradient(160deg,#4a2f9a,#1a1040)', img: 'svc-sound.jpg', link: '#service' }
  ],
  partnerTypes: [
    { id: 'food', emoji: '🍽️', name: { en: 'Food Merchant', bn: 'ফুড মার্চেন্ট' }, who: { en: 'Restaurant, kitchen, sweet shop', bn: 'রেস্টুরেন্ট, কিচেন, মিষ্টির দোকান' },
      docs: { en: ['Business name & owner', 'Address + map pin', 'Trade licence (if any)', 'Shop photos', 'Opening hours', 'Payout account (bKash/Nagad/bank)'], bn: ['প্রতিষ্ঠানের নাম ও মালিক', 'ঠিকানা ও মানচিত্রে পিন', 'ট্রেড লাইসেন্স (থাকলে)', 'দোকানের ছবি', 'খোলার সময়', 'পেআউট অ্যাকাউন্ট (bKash/Nagad/ব্যাংক)'] } },
    { id: 'shop', emoji: '🏪', name: { en: 'Shop Merchant', bn: 'শপ মার্চেন্ট' }, who: { en: 'Grocery, clothes, shoes & more', bn: 'মুদি, কাপড়, জুতা ও অন্যান্য' },
      docs: { en: ['Shop name & owner', 'Address + map pin', 'Trade licence (if any)', 'Shop photos', 'Shop type', 'Payout account'], bn: ['দোকানের নাম ও মালিক', 'ঠিকানা ও মানচিত্রে পিন', 'ট্রেড লাইসেন্স (থাকলে)', 'দোকানের ছবি', 'দোকানের ধরন', 'পেআউট অ্যাকাউন্ট'] } },
    { id: 'rider', emoji: '🏍️', name: { en: 'Delivery Rider', bn: 'ডেলিভারি রাইডার' }, who: { en: 'Zilax’s own riders', bn: 'Zilax-এর নিজস্ব রাইডার' },
      docs: { en: ['Name & photo', 'National ID', 'Motorbike details & papers', 'Driving licence', 'Your area', 'Emergency contact'], bn: ['নাম ও ছবি', 'জাতীয় পরিচয়পত্র', 'মোটরসাইকেলের তথ্য ও কাগজ', 'ড্রাইভিং লাইসেন্স', 'আপনার এলাকা', 'জরুরি যোগাযোগ'] } },
    { id: 'tech', emoji: '🔧', name: { en: 'Technician', bn: 'টেকনিশিয়ান' }, who: { en: 'AC, electrician, plumber…', bn: 'এসি, ইলেকট্রিশিয়ান, প্লাম্বার…' },
      docs: { en: ['Name & photo', 'Skill type', 'Experience', 'National ID', 'Service area'], bn: ['নাম ও ছবি', 'দক্ষতার ধরন', 'অভিজ্ঞতা', 'জাতীয় পরিচয়পত্র', 'সেবা এলাকা'] } },
    { id: 'car', emoji: '🚘', name: { en: 'Car Owner / Driver', bn: 'গাড়ির মালিক / ড্রাইভার' }, who: { en: 'Rent a Car partner', bn: 'Rent a Car পার্টনার' },
      docs: { en: ['Car details & photos', 'Registration papers', 'Driver’s licence', 'Hourly/daily rate', 'Your area'], bn: ['গাড়ির তথ্য ও ছবি', 'রেজিস্ট্রেশন কাগজ', 'ড্রাইভারের লাইসেন্স', 'ঘণ্টা/দিনের ভাড়া', 'আপনার এলাকা'] } },
    { id: 'decor', emoji: '🌸', name: { en: 'Decoration Vendor', bn: 'ডেকোরেশন ভেন্ডর' }, who: { en: 'Home & event decoration', bn: 'ঘর ও ইভেন্ট সাজানো' },
      docs: { en: ['Business info', 'Work samples (photos)', 'Packages & prices', 'Service area'], bn: ['প্রতিষ্ঠানের তথ্য', 'কাজের নমুনা ছবি', 'প্যাকেজ ও দাম', 'সেবা এলাকা'] } },
    { id: 'sound', emoji: '🎧', name: { en: 'Sound & Light Vendor', bn: 'সাউন্ড ও লাইট ভেন্ডর' }, who: { en: 'DJ, LED, stage rental', bn: 'ডিজে, এলইডি, স্টেজ ভাড়া' },
      docs: { en: ['Business info', 'Equipment list & photos', 'Packages & prices', 'Service area'], bn: ['প্রতিষ্ঠানের তথ্য', 'সরঞ্জাম তালিকা ও ছবি', 'প্যাকেজ ও দাম', 'সেবা এলাকা'] } }
  ]
};
ZX.data.items = ZX.data.plates.concat(ZX.data.fashion);

/* ---- Pathao-style home layout config (Stage 2: Super Admin Home Builder edits this) ---- */
ZX.data.home = {
  grid: [
    { id: 'g1', size: 'l', title: { en: 'Food', bn: 'ফুড' }, sub: { en: 'Fresh & fast to your door', bn: 'তাজা ও দ্রুত দরজায়' }, tag: { en: 'FREE DELIVERY', bn: 'ফ্রি ডেলিভারি' }, img: 'burger.jpg', pos: 'center', link: '#food' },
    { id: 'g2', size: 'l', title: { en: 'Technical', bn: 'টেকনিক্যাল' }, sub: { en: 'AC, electric & repairs', bn: 'এসি, ইলেকট্রিক ও মেরামত' }, tag: { en: 'PROMO', bn: 'প্রোমো' }, img: 'offer-tech.jpg', pos: 'center', link: '#service' },
    { id: 'g3', size: 'l', title: { en: 'Rent a Car', bn: 'গাড়ি ভাড়া' }, sub: { en: 'Hourly & daily drives', bn: 'ঘণ্টা ও দিন হিসেবে' }, tag: { en: 'PROMO', bn: 'প্রোমো' }, img: 'svc-car.jpg', pos: 'center', link: '#service' },
    { id: 'g4', size: 'w', title: { en: 'Shop', bn: 'শপ' }, badge: { en: 'NEW', bn: 'নতুন' }, sub: { en: 'Groceries in 30 min', bn: 'মুদি ৩০ মিনিটে' }, img: 'svc-shop.jpg', pos: 'center 30%', link: '#shop' },
    { id: 'g5', size: 's', title: { en: 'Decoration', bn: 'ডেকোরেশন' }, img: 'svc-deco.jpg', pos: 'center', link: '#service' },
    { id: 'g6', size: 's', title: { en: 'Sound & Light', bn: 'সাউন্ড ও লাইট' }, img: 'svc-sound.jpg', pos: 'center', link: '#service' }
  ],
  quick: [
    { id: 'q1', emoji: '🤝', style: 'outline', title: { en: 'Become a partner', bn: 'পার্টনার হোন' }, sub: { en: 'Merchant, rider, technician', bn: 'মার্চেন্ট, রাইডার, টেকনিশিয়ান' }, link: '#join' },
    { id: 'q2', emoji: '🎟️', style: 'tint', title: { en: 'Offers & coupons', bn: 'অফার ও কুপন' }, sub: { en: 'Save more this week', bn: 'এই সপ্তাহে বাড়তি সাশ্রয়' }, link: '#offers' },
    { id: 'q3', emoji: '📦', style: 'tint2', title: { en: 'Track my order', bn: 'আমার অর্ডার' }, sub: { en: 'See live status', bn: 'লাইভ অবস্থা দেখুন' }, link: '#activity' }
  ]
};


/* Pathao-style home: six service cards, quick actions, announcement */
ZX.data.main = [
  { id: 'm1', size: 'big', title: { en: 'Food', bn: 'ফুড' }, sub: { en: 'Your favourites, delivered fresh & fast', bn: 'প্রিয় খাবার, তাজা ও দ্রুত' }, tag: { en: 'FREE DELIVERY', bn: 'ফ্রি ডেলিভারি' }, tone: 'green', img: 'biryani.jpg', link: '#food' },
  { id: 'm2', size: 'big', title: { en: 'Technical', bn: 'টেকনিক্যাল' }, sub: { en: 'AC, electric & expert repairs', bn: 'এসি, ইলেকট্রিক ও এক্সপার্ট মেরামত' }, tag: { en: '35% OFF', bn: '৩৫% ছাড়' }, tone: 'gold', emoji: '🛠️', grad: 'linear-gradient(135deg,#d9efe1,#b9dcc8)', link: '#service' },
  { id: 'm3', size: 'tall', title: { en: 'Shop', bn: 'শপ' }, sub: { en: 'Daily essentials, groceries in 30 min', bn: 'দৈনন্দিন পণ্য, ৩০ মিনিটে মুদি' }, tag: { en: 'NEW', bn: 'নতুন' }, tone: 'gold', img: 'svc-shop.jpg', link: '#shop' },
  { id: 'm4', size: 'short', title: { en: 'Rent a Car', bn: 'গাড়ি ভাড়া' }, sub: { en: 'Hourly & daily rides', bn: 'ঘণ্টা ও দিন হিসেবে' }, img: 'svc-car.jpg', link: '#service' },
  { id: 'm5', size: 'small', title: { en: 'Decoration', bn: 'ডেকোরেশন' }, img: 'svc-deco.jpg', link: '#service' },
  { id: 'm6', size: 'small', title: { en: 'Sound & Light', bn: 'সাউন্ড ও লাইট' }, img: 'svc-sound.jpg', link: '#service' }
];
