/* Zilax — all money rules live in this ONE file. Rates come from ZX.data.settings (Super Admin edits them in Stage 2). */
window.ZX = window.ZX || {};
ZX.calc = (function () {
  function slabs() { return ZX.data.settings.slabs; }
  function deliveryCharge(km) {
    var s = slabs();
    for (var i = 0; i < s.length; i++) { if (km <= s[i].upToKm) return s[i].charge; }
    return s[s.length - 1].charge;
  }
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  /* Food order: commission is taken on the FOOD subtotal only; rider keeps the whole delivery charge. */
  function foodOrder(subtotal, km, commissionPct) {
    var pct = commissionPct == null ? ZX.data.settings.foodCommissionPct : commissionPct;
    var delivery = deliveryCharge(km);
    var commission = Math.round(subtotal * pct / 100);
    return { subtotal: subtotal, delivery: delivery, total: subtotal + delivery, commission: commission, merchantPayout: subtotal - commission, riderEarning: delivery };
  }
  function selfTest() {
    var o = foodOrder(1000, 1.5), r = [];
    function chk(name, ok) { r.push({ name: name, ok: !!ok }); }
    chk('<=1 km = 20', deliveryCharge(0.8) === 20 && deliveryCharge(1) === 20);
    chk('<=2 km = 30', deliveryCharge(1.5) === 30 && deliveryCharge(2) === 30);
    chk('2-5 km = 50', deliveryCharge(2.1) === 50 && deliveryCharge(5) === 50);
    chk('>5 km = 60', deliveryCharge(5.1) === 60);
    chk('1000 + 30 = 1030', o.total === 1030);
    chk('commission 15% = 150', o.commission === 150);
    chk('merchant payout = 850', o.merchantPayout === 850);
    chk('rider keeps 30', o.riderEarning === 30);
    return r;
  }
  return { deliveryCharge: deliveryCharge, haversine: haversine, foodOrder: foodOrder, selfTest: selfTest };
})();
