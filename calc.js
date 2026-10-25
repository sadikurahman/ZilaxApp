/* Zilax — all money rules live in this ONE file. Rates come from ZX.data.settings (loaded from the database; Super Admin edits them). */
window.ZX = window.ZX || {};
ZX.calc = (function () {
  function S() { return ZX.data.settings; }
  /* Delivery charge = the HIGHER of (a) the minimum charge and (b) the per-100-metre rate x every started 100 m,
     rounded to a whole taka. Default: minimum 15, 2.5 per 100 m. Distance is rounded to whole metres first,
     so 2.3 km is exactly 23 blocks (no floating-point surprises). */
  function deliveryCharge(km, opt) {
    opt = opt || {};
    var st = S();
    var min = opt.deliveryMin == null ? st.deliveryMin : opt.deliveryMin;
    var per = opt.deliveryPer100m == null ? st.deliveryPer100m : opt.deliveryPer100m;
    var meters = Math.max(0, Math.round((Number(km) || 0) * 1000));
    var blocks = Math.ceil(meters / 100);
    return Math.max(min, Math.round(blocks * per));
  }
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  /* Food order: commission is taken on the FOOD subtotal only; rider keeps the whole delivery charge;
     the flat service charge (default 0) is paid by the customer and kept by Zilax. */
  function foodOrder(subtotal, km, commissionPct, opt) {
    opt = opt || {};
    var st = S();
    var pct = commissionPct == null ? st.foodCommissionPct : commissionPct;
    var delivery = deliveryCharge(km, opt);
    var sc = opt.serviceCharge == null ? (st.serviceCharge || 0) : opt.serviceCharge;
    var commission = Math.round(subtotal * pct / 100);
    return { subtotal: subtotal, delivery: delivery, serviceCharge: sc, total: subtotal + delivery + sc, commission: commission, merchantPayout: subtotal - commission, riderEarning: delivery, zilaxIncome: commission + sc };
  }
  /* The checks use FIXED example rates, so they test the rules, not whatever the Super Admin has set today. */
  function selfTest() {
    var FIX = { deliveryMin: 15, deliveryPer100m: 2.5, serviceCharge: 0 };
    var o = foodOrder(1000, 1.5, 15, FIX);
    var o2 = foodOrder(1000, 1.5, 15, { deliveryMin: 15, deliveryPer100m: 2.5, serviceCharge: 10 });
    var r = [];
    function chk(name, ok) { r.push({ name: name, ok: !!ok }); }
    chk('0 km and 0.5 km = minimum 15', deliveryCharge(0, FIX) === 15 && deliveryCharge(0.5, FIX) === 15);
    chk('0.6 km = 6 x 2.5 = 15', deliveryCharge(0.6, FIX) === 15);
    chk('0.61 km = 7 started blocks = 17.5 -> 18', deliveryCharge(0.61, FIX) === 18);
    chk('1 km = 10 x 2.5 = 25', deliveryCharge(1, FIX) === 25);
    chk('2.3 km = 23 blocks = 57.5 -> 58 (no float error)', deliveryCharge(2.3, FIX) === 58);
    chk('5 km = 125', deliveryCharge(5, FIX) === 125);
    chk('1000 + 38 = 1038 (1.5 km)', o.delivery === 38 && o.total === 1038);
    chk('commission 15% = 150', o.commission === 150);
    chk('merchant payout = 850', o.merchantPayout === 850);
    chk('rider keeps 38', o.riderEarning === 38);
    chk('service charge 10: customer pays 1048, merchant and rider unchanged', o2.total === 1048 && o2.merchantPayout === 850 && o2.riderEarning === 38 && o2.zilaxIncome === 160);
    return r;
  }
  return { deliveryCharge: deliveryCharge, haversine: haversine, foodOrder: foodOrder, selfTest: selfTest };
})();
