/* Zilax — all money rules live in this ONE file. Rates come from ZX.data.settings (loaded from the database; Super Admin edits them).
   THE RULES
   1. The customer pays: items (or service price) + delivery (food and shop only) + the platform fee. Every line is shown on the bill.
   2. Commission is taken on the ITEM / SERVICE price only. Delivery and platform fee never carry commission.
   3. Commission rate = the partner's own deal if there is one, otherwise the service default.
   4. Merchant gets: price - commission. Rider gets: the whole delivery charge. Zilax earns: commission + platform fee. */
window.ZX = window.ZX || {};
ZX.calc = (function () {
  var DELIVERY_SERVICES = { food: 1, shop: 1 };
  function S() { return ZX.data.settings; }

  /* Delivery = the HIGHER of (a) the minimum and (b) the per-100-metre rate x every started 100 m, rounded to a whole taka.
     Distance is rounded to whole metres first, so 2.3 km is exactly 23 blocks (no floating-point surprises). */
  function deliveryCharge(km, opt) {
    opt = opt || {};
    var st = S();
    var min = opt.deliveryMin == null ? st.deliveryMin : opt.deliveryMin;
    var per = opt.deliveryPer100m == null ? st.deliveryPer100m : opt.deliveryPer100m;
    var meters = Math.max(0, Math.round((Number(km) || 0) * 1000));
    return Math.max(min, Math.round(Math.ceil(meters / 100) * per));
  }
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function platformFee(service, opt) {
    opt = opt || {};
    if (opt.platformFee != null) return opt.platformFee;
    var f = (S().platformFee || {})[service];
    return f == null ? 0 : f;
  }
  /* Which commission % applies, and why. A partner deal of 0 is still a deal (0 is not "missing"). */
  function commissionRate(service, partnerPct, opt) {
    opt = opt || {};
    if (partnerPct != null && !isNaN(partnerPct)) return { pct: Number(partnerPct), source: 'partner' };
    var d = opt.commissionPct != null ? opt.commissionPct : (S().commission || {})[service];
    if (d != null) return { pct: Number(d), source: 'service' };
    return { pct: 0, source: 'none' };
  }
  /* One order / booking. km only matters for food and shop. opt.partnerPct = the partner's own commission deal (or null). */
  function order(service, price, km, opt) {
    opt = opt || {};
    var delivery = DELIVERY_SERVICES[service] ? deliveryCharge(km, opt) : 0;
    var fee = platformFee(service, opt);
    var rate = commissionRate(service, opt.partnerPct, opt);
    var commission = Math.round(price * rate.pct / 100);
    return {
      service: service, subtotal: price, delivery: delivery, platformFee: fee, total: price + delivery + fee,
      commissionPct: rate.pct, commissionSource: rate.source, commissionMissing: rate.source === 'none',
      commission: commission, merchantPayout: price - commission, riderEarning: delivery, zilaxIncome: commission + fee
    };
  }
  /* The lines the customer sees on the bill (checkout shows exactly these). */
  function bill(o) {
    var lines = [{ key: 'items', amount: o.subtotal, label: DELIVERY_SERVICES[o.service] ? { en: 'Items total', bn: 'পণ্যের দাম' } : { en: 'Service price', bn: 'সার্ভিসের দাম' } }];
    if (DELIVERY_SERVICES[o.service]) lines.push({ key: 'delivery', amount: o.delivery, label: { en: 'Delivery charge', bn: 'ডেলিভারি চার্জ' } });
    lines.push({ key: 'fee', amount: o.platformFee, label: { en: 'Platform fee', bn: 'প্ল্যাটফর্ম ফি' } });
    lines.push({ key: 'total', amount: o.total, strong: true, label: { en: 'You pay', bn: 'আপনি দেবেন' } });
    return lines;
  }
  function foodOrder(subtotal, km, commissionPct, opt) { return order('food', subtotal, km, Object.assign({}, opt, commissionPct == null ? {} : { commissionPct: commissionPct })); }

  /* The checks use FIXED example rates, so they test the rules, not whatever the Super Admin has set today. */
  function selfTest() {
    var FIX = { deliveryMin: 15, deliveryPer100m: 2.5, platformFee: 4, commissionPct: 15 };
    var food = order('food', 1000, 1.5, FIX);
    var deal = order('food', 1000, 1.5, Object.assign({ partnerPct: 8 }, FIX));
    var shop = order('shop', 500, 1, { deliveryMin: 15, deliveryPer100m: 2.5, platformFee: 10, commissionPct: 10 });
    var tech = order('technical', 800, null, { platformFee: 200, commissionPct: 12 });
    var none = order('rent_car', 1000, null, { platformFee: 200 });
    var zero = order('food', 1000, 1, Object.assign({ partnerPct: 0 }, FIX));
    var r = [];
    function chk(name, ok) { r.push({ name: name, ok: !!ok }); }
    chk('0 km and 0.5 km = minimum 15', deliveryCharge(0, FIX) === 15 && deliveryCharge(0.5, FIX) === 15);
    chk('0.6 km = 6 x 2.5 = 15; 0.61 km = 7 started blocks = 18', deliveryCharge(0.6, FIX) === 15 && deliveryCharge(0.61, FIX) === 18);
    chk('1 km = 25; 5 km = 125', deliveryCharge(1, FIX) === 25 && deliveryCharge(5, FIX) === 125);
    chk('2.3 km = 23 blocks = 57.5 -> 58 (no float error)', deliveryCharge(2.3, FIX) === 58);
    chk('food 1000 @1.5 km: delivery 38, fee 4, customer pays 1042', food.delivery === 38 && food.platformFee === 4 && food.total === 1042);
    chk('commission 15% is on the 1000 only (150), not on delivery or fee', food.commission === 150 && food.commissionSource === 'service');
    chk('merchant gets 850, rider gets 38, Zilax earns 150 + 4 = 154', food.merchantPayout === 850 && food.riderEarning === 38 && food.zilaxIncome === 154);
    chk('partner deal 8%: commission 80, merchant 920, Zilax 84, customer bill unchanged', deal.commission === 80 && deal.merchantPayout === 920 && deal.zilaxIncome === 84 && deal.total === 1042 && deal.commissionSource === 'partner');
    chk('partner deal of 0% is a real deal (not ignored)', zero.commission === 0 && zero.commissionSource === 'partner' && zero.merchantPayout === 1000);
    chk('shop 500 @1 km, fee 10, 10%: pay 535, merchant 450, Zilax 60', shop.delivery === 25 && shop.total === 535 && shop.merchantPayout === 450 && shop.zilaxIncome === 60);
    chk('technical 800, fee 200, 12%: no delivery, pay 1000, merchant 704, Zilax 296', tech.delivery === 0 && tech.total === 1000 && tech.merchantPayout === 704 && tech.zilaxIncome === 296);
    chk('missing commission = 0% and flagged', none.commission === 0 && none.commissionMissing === true && none.zilaxIncome === 200);
    chk('bill lines: items, delivery, platform fee, total (food); no delivery line for technical',
      bill(food).map(function (x) { return x.key; }).join() === 'items,delivery,fee,total' && bill(tech).map(function (x) { return x.key; }).join() === 'items,fee,total');
    return r;
  }
  return { deliveryCharge: deliveryCharge, haversine: haversine, platformFee: platformFee, commissionRate: commissionRate, order: order, bill: bill, foodOrder: foodOrder, selfTest: selfTest };
})();
