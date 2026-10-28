/* Zilax — Home Builder rules in ONE place (used by the customer home and by the Super Admin preview).
   A banner is shown only when ALL of these are true:
   1. it is switched on;  2. its start date has come and its end date has not passed;
   3. the time of day (Bangladesh time) is inside its daily window, if it has one (a window like 22:00 to 06:00 is allowed);
   4. the customer's upazila is in its area list, if it has one (an area-limited banner is hidden when the upazila is unknown). */
window.ZX = window.ZX || {};
ZX.home = (function () {
  var BLOCKS = ['hero', 'mosaic', 'quick', 'deliv', 'offers', 'plates', 'fashion'];
  var LINKS = ['#food', '#shop', '#service', '#join', '#offers', '#activity'];
  function dhakaMinutes(now) { var d = new Date((now || new Date()).getTime() + 6 * 3600000); return d.getUTCHours() * 60 + d.getUTCMinutes(); }
  function hm(t) { if (!t) return null; var p = String(t).split(':'); return Number(p[0]) * 60 + Number(p[1] || 0); }
  /* -> 'live' | 'off' | 'scheduled' | 'expired' | 'hours' | 'area' */
  function status(b, now, upazila) {
    now = now || new Date();
    if (!b.active) return 'off';
    if (b.starts_at && new Date(b.starts_at) > now) return 'scheduled';
    if (b.ends_at && new Date(b.ends_at) <= now) return 'expired';
    var f = hm(b.daily_from), t = hm(b.daily_to);
    if (f != null && t != null) {
      var m = dhakaMinutes(now), inside = f <= t ? (m >= f && m < t) : (m >= f || m < t);
      if (!inside) return 'hours';
    }
    if (b.areas && b.areas.length && (!upazila || b.areas.indexOf(upazila) < 0)) return 'area';
    return 'live';
  }
  function pick(list, placement, now, upazila) {
    return (list || []).filter(function (b) { return b.placement === placement && status(b, now, upazila) === 'live'; })
      .sort(function (a, c) { return (a.sort - c.sort) || String(a.id).localeCompare(String(c.id)); });
  }
  /* Block order: saved order first, anything missing is added at the end in the default order. Returns [{key, enabled}] */
  function blocks(rows) {
    var by = {}; (rows || []).forEach(function (r) { by[r.key] = r; });
    var known = (rows || []).filter(function (r) { return BLOCKS.indexOf(r.key) > -1; }).sort(function (a, c) { return a.sort - c.sort; }).map(function (r) { return { key: r.key, enabled: r.enabled !== false }; });
    BLOCKS.forEach(function (k) { if (!by[k]) known.push({ key: k, enabled: true }); });
    return known;
  }
  function countdown(end, now) {
    var s = Math.floor((new Date(end) - (now || new Date())) / 1000); if (!(s > 0)) return '';
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), x = s % 60, z = function (n) { return (n < 10 ? '0' : '') + n; };
    return (d > 0 ? d + 'd ' : '') + z(h) + ':' + z(m) + ':' + z(x);
  }
  return { BLOCKS: BLOCKS, LINKS: LINKS, status: status, pick: pick, blocks: blocks, countdown: countdown, dhakaMinutes: dhakaMinutes };
})();
