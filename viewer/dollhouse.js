/* Dollhouse viewer.
   Reads two plain data files that live next to the page:
     space.js  -> window.DOLLHOUSE        (the room, its spots, house rules, optional steps)
     items.js  -> window.DOLLHOUSE_ITEMS  (what is where, with a status)
   Coordinates are in whatever unit the space uses (feet in the demo).
   x runs left to right as you stand in the doorway looking in; z runs from the door wall (0) to the back wall.
   Rack levels are numbered top-down, so T-1 is the top shelf of rack T.
   Open the browser console to see what loaded and anything that did not line up. */
(function () {
"use strict";

function log() { try { console.log.apply(console, ["[dollhouse]"].concat([].slice.call(arguments))); } catch (e) {} }
function warn() { try { console.warn.apply(console, ["[dollhouse]"].concat([].slice.call(arguments))); } catch (e) {} }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]; }); }

var SP = window.DOLLHOUSE;
if (!SP) {
  document.body.innerHTML = '<p style="padding:24px;font:16px system-ui">No space found. This page needs a <code>space.js</code> next to it that sets <code>window.DOLLHOUSE</code>. Copy <code>spaces/_template</code> to start one.</p>';
  warn("window.DOLLHOUSE is missing; did space.js load?");
  return;
}
var ITEMS = window.DOLLHOUSE_ITEMS || [];
var room = SP.room || {};
var W = +room.width || 10, D = +room.depth || 10, H = +room.height || 8;
var door = room.door || { from: W / 2 - 1.5, to: W / 2 + 1.5, hinge: "right" };
var spots = (SP.spots || []).map(function (s, i) { var c = Object.assign({}, s); c.n = i + 1; c.kind = c.kind || "block"; c.plan = c.plan || "stay"; c.height = +c.height || 3; return c; });
var byId = {}, byCode = {};
spots.forEach(function (s) { byId[s.id] = s; if (s.code) byCode[String(s.code).toUpperCase()] = s; });
var HIDE = (SP.hideStatuses || ["gone"]).map(function (x) { return x.toLowerCase(); });
var HL = SP.highlight || { label: "Grab next trip", statuses: ["grab"] };
HL.statuses = (HL.statuses || []).map(function (x) { return x.toLowerCase(); });
var storeKey = "dollhouse:" + (SP.title || "space");
log("loaded space", JSON.stringify(SP.title), "|", spots.length, "spots |", ITEMS.length, "items | room", W + "x" + D + "x" + H);

/* ---------- items -> places ---------- */
function resolve(at) {
  var a = String(at || "").trim().toUpperCase();
  if (!a) return null;
  var head = a.split(/[\s\/,]+/)[0];
  var m = head.match(/^([A-Z0-9]+)-(\d+)[A-Z]?$/);
  if (m && byCode[m[1]]) {
    var s = byCode[m[1]], lv = +m[2];
    if (s.levels && lv >= 1 && lv <= s.levels) return { spot: s, level: lv, code: m[1] + "-" + lv };
    return { spot: s, level: null, code: m[1] };
  }
  if (byCode[head]) return { spot: byCode[head], level: null, code: head };
  if (byId[at]) return { spot: byId[at], level: null, code: byId[at].code || at };
  return null;
}
var live = [], unplaced = [];
ITEMS.forEach(function (it) {
  var st = String(it.status || "").toLowerCase();
  if (HIDE.indexOf(st) >= 0) return;
  var r = resolve(it.at);
  var row = { name: it.name, at: it.at, status: st, note: it.note || "", place: r, hot: HL.statuses.indexOf(st) >= 0 };
  live.push(row);
  if (!r) unplaced.push(row);
});
if (unplaced.length) warn(unplaced.length + " item(s) point at an address that is not in space.js:", unplaced.map(function (u) { return u.name + " @ " + u.at; }).join("; "));
var hotCount = live.filter(function (r) { return r.hot; }).length;
log(live.length, "items shown,", hotCount, "match '" + HL.label + "'");

function itemsAt(spot, level) {
  return live.filter(function (r) { return r.place && r.place.spot === spot && (level == null ? true : r.place.level === level); });
}

/* ---------- page ---------- */
var steps = SP.steps || [];
var modes = [["now", "Now"], ["plan", "Plan"]];
if (steps.length) modes.push(["steps", SP.stepsLabel || "Steps"]);
if (HL.statuses.length) modes.push(["hot", HL.label]);

document.title = SP.title || "Dollhouse";
var app = document.getElementById("dollhouse") || document.body.appendChild(document.createElement("div"));
app.innerHTML =
  '<div class="dh-wrap">' +
  '<header class="dh-head"><div>' + (SP.backLink ? '<a class="dh-back" href="' + esc(SP.backLink) + '">← All examples</a>' : '') + (SP.eyebrow ? '<div class="eyebrow">' + esc(SP.eyebrow) + '</div>' : '') +
  '<h1>' + esc(SP.title || "Dollhouse") + '</h1>' + (SP.subtitle ? '<p class="dh-sub">' + esc(SP.subtitle) + '</p>' : '') + '</div>' +
  '<div class="seg" role="group" aria-label="Mode">' + modes.map(function (m) {
    return '<button type="button" data-mode="' + m[0] + '" aria-pressed="false">' + esc(m[1]) + (m[0] === "hot" && hotCount ? '<span class="count">' + hotCount + '</span>' : '') + '</button>';
  }).join("") + '</div></header>' +
  '<div class="stagebox"><div id="dh-stage"></div>' +
  '<div class="view" role="group" aria-label="Camera"><button type="button" data-v="doll">Dollhouse</button><button type="button" data-v="top">Top down</button><button type="button" data-v="door">From the door</button></div>' +
  '<div class="verdict" id="dh-verdict"></div>' +
  '<div class="legend"><span><i style="background:var(--kraft)"></i>stuff</span><span><i style="background:var(--block)"></i>in the way</span><span><i style="background:var(--path)"></i>walkway</span><span><i style="background:var(--plan)"></i>new / moved</span><span><i style="background:var(--glow)"></i>' + esc(HL.label) + ' / found</span></div>' +
  '</div>' +
  '<aside>' +
  '<div class="card" id="dh-detail" aria-live="polite"></div>' +
  '<div class="card find"><div class="eyebrow">Find something</div><h2>Where is it?</h2><input id="dh-q" type="search" placeholder="Type part of a name" autocomplete="off"><ul class="hits" id="dh-hits"></ul></div>' +
  '<div class="card" id="dh-stepcard" hidden><div class="eyebrow">' + esc(SP.stepsEyebrow || "In order") + '</div><h2>' + esc(SP.stepsTitle || "Steps") + '</h2><ol class="steps" id="dh-steps"></ol><p class="note">Ticks are saved in this browser only.</p></div>' +
  ((SP.rules || []).length ? '<div class="card"><div class="eyebrow">House rules</div><h2>Where does it go?</h2><p class="note" style="margin:0 0 8px">Find the kind of thing in your hand and take it to that spot. Tap a row to see the spot.</p><ul class="rules" id="dh-rules"></ul></div>' : '') +
  '<div class="card"><div class="eyebrow">Spots</div><ul class="zones" id="dh-zones"></ul>' +
  (unplaced.length ? '<p class="note">' + unplaced.length + ' item(s) have an address this space does not have yet: ' + unplaced.map(function (u) { return esc(u.name) + ' (' + esc(u.at) + ')'; }).join(", ") + '</p>' : '') +
  '</div></aside></div>';

var $ = function (id) { return document.getElementById(id); };
var mode = "now", sel = null, query = "", selRule = null;

/* rules */
(SP.rules || []).forEach(function (r, i) {
  var li = document.createElement("li"); li.className = "rule"; li.tabIndex = 0; li.dataset.i = i;
  li.innerHTML = '<span>' + esc(r.thing) + (r.note ? '<small>' + esc(r.note) + '</small>' : '') + '</span><span class="addr">' + esc(r.at || (byId[r.spot] && byId[r.spot].code) || "") + '</span>';
  var go = function () {
    selRule = i;
    $("dh-rules").querySelectorAll(".rule").forEach(function (x) { x.setAttribute("aria-current", +x.dataset.i === i ? "true" : "false"); });
    if (mode !== "plan") setMode("plan");
    sel = null; pick(r.spot);
  };
  li.onclick = go; li.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } };
  $("dh-rules").appendChild(li);
});

/* spots list */
var zlist = $("dh-zones");
spots.forEach(function (z) {
  var li = document.createElement("li"); li.className = "zone"; li.tabIndex = 0; li.dataset.id = z.id;
  li.innerHTML = '<span class="n">' + z.n + '</span><span>' + esc(z.name) + (z.code ? ' <span class="pill">' + esc(z.code) + '</span>' : '') + '</span><span class="sw" data-sw></span>';
  li.onclick = function () { pick(z.id); };
  li.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(z.id); } };
  zlist.appendChild(li);
});

/* steps */
var DONE = {};
try { DONE = JSON.parse(localStorage.getItem(storeKey + ":steps") || "{}"); } catch (e) { DONE = {}; }
steps.forEach(function (s, i) {
  var li = document.createElement("li"); if (DONE[i]) li.className = "done";
  li.innerHTML = '<input type="checkbox" id="dh-st' + i + '"' + (DONE[i] ? " checked" : "") + '><label for="dh-st' + i + '">' + esc(s.title) + (s.note ? '<small>' + esc(s.note) + '</small>' : '') + '</label>';
  li.querySelector("input").onchange = function (e) {
    DONE[i] = e.target.checked; li.className = e.target.checked ? "done" : "";
    try { localStorage.setItem(storeKey + ":steps", JSON.stringify(DONE)); } catch (err) {}
  };
  li.querySelector("label").addEventListener("click", function () { if (byId[s.spot] && sel !== s.spot) { sel = null; pick(s.spot); } });
  $("dh-steps").appendChild(li);
});

/* find */
var hitsEl = $("dh-hits");
function matches() {
  if (!query) return [];
  var q = query.toLowerCase();
  return live.filter(function (r) { return (r.name + " " + r.note).toLowerCase().indexOf(q) >= 0; });
}
function renderHits() {
  var m = matches();
  hitsEl.innerHTML = "";
  if (!query) return;
  if (!m.length) { hitsEl.innerHTML = '<li class="note">Nothing by that name.</li>'; return; }
  m.slice(0, 40).forEach(function (r) {
    var li = document.createElement("li"); li.className = "hit"; li.tabIndex = 0;
    li.innerHTML = '<span>' + esc(r.name) + '<small>' + esc(r.status || "") + (r.note ? " · " + esc(r.note) : "") + '</small></span><span class="addr">' + esc(r.place ? r.place.code : r.at) + '</span>';
    var go = function () { if (r.place) { sel = null; pick(r.place.spot.id); } };
    li.onclick = go; li.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } };
    hitsEl.appendChild(li);
  });
}
$("dh-q").addEventListener("input", function (e) { query = e.target.value.trim(); renderHits(); build(); });

/* what glows: levels/spots holding a found item or a highlighted status */
function glowing() {
  var set = {};
  var rows = query ? matches() : (mode === "hot" ? live.filter(function (r) { return r.hot; }) : []);
  rows.forEach(function (r) { if (r.place) set[r.place.spot.id + "|" + (r.place.level || 0)] = true; });
  return set;
}

/* ---------- side panel ---------- */
var COL = { stay: "var(--kraft)", gone: "var(--block)", move: "var(--plan)", new: "var(--path)" };
var PL = { stay: "stays", gone: "clears out", move: "moves", new: "new" };
function swatches() {
  var g = glowing();
  zlist.querySelectorAll(".zone").forEach(function (li) {
    var z = byId[li.dataset.id], k = mode === "plan" ? z.plan : (z.blocking ? "gone" : (z.plan === "new" ? "new" : "stay"));
    var hot = Object.keys(g).some(function (key) { return key.split("|")[0] === z.id; });
    li.querySelector("[data-sw]").style.background = hot ? "var(--glow)" : COL[k];
    li.setAttribute("aria-current", sel === z.id ? "true" : "false");
  });
}
function intro() {
  if (mode === "hot") {
    var hot = live.filter(function (r) { return r.hot; });
    if (!hot.length) return '<div class="eyebrow">' + esc(HL.label) + '</div><h2>Nothing right now</h2><p>No items have the status ' + esc(HL.statuses.join(" or ")) + '.</p>';
    return '<div class="eyebrow">' + esc(HL.label) + '</div><h2>' + hot.length + ' to grab</h2><p>' + esc(HL.summary || "The glowing shelves hold these. Tap one to see the whole shelf.") + '</p><ul class="hits">' +
      hot.map(function (r) { return '<li class="hit" data-spot="' + esc(r.place ? r.place.spot.id : "") + '"><span>' + esc(r.name) + (r.note ? '<small>' + esc(r.note) + '</small>' : '') + '</span><span class="addr">' + esc(r.place ? r.place.code : r.at) + '</span></li>'; }).join("") + '</ul>';
  }
  var t = mode === "plan" ? SP.plan : mode === "steps" ? { headline: SP.stepsTitle || "Steps", summary: SP.stepsSummary } : SP.now;
  t = t || {};
  var cover = mode === "now" && SP.cover ? '<img alt="Photo from the door" src="' + esc(SP.cover) + '" onerror="this.remove()">' : '';
  return '<div class="eyebrow">' + esc(mode === "plan" ? "Plan" : mode === "steps" ? "Steps" : "Now") + '</div><h2>' + esc(t.headline || SP.title || "") + '</h2>' + cover + (t.summary ? '<p>' + esc(t.summary) + '</p>' : '<p>Tap a spot to see what is there.</p>');
}
function detail() {
  var el = $("dh-detail");
  if (!sel) {
    el.innerHTML = intro();
    el.querySelectorAll(".hit[data-spot]").forEach(function (li) { li.onclick = function () { if (li.dataset.spot) pick(li.dataset.spot); }; });
    return;
  }
  var z = byId[sel], g = glowing();
  el.innerHTML = '<div class="eyebrow">Spot ' + z.n + (z.code ? ' · ' + esc(z.code) : '') + (mode === "plan" ? ' · <span class="pill ' + z.plan + '">' + PL[z.plan] + '</span>' : '') + '</div><h2>' + esc(z.name) + '</h2>' +
    (z.photo ? '<img alt="Photo of ' + esc(z.name) + '" src="' + esc(z.photo) + '" onerror="this.remove()">' : '') +
    (z.what ? '<p>' + esc(z.what) + '</p>' : '') + (z.todo ? '<p><b>Rule:</b> ' + esc(z.todo) + '</p>' : '') + contents(z, g);
}
function contents(z, g) {
  if (z.levels && z.code) {
    var rows = [];
    for (var L = 1; L <= z.levels; L++) {
      var here = itemsAt(z, L), code = String(z.code).toUpperCase() + "-" + L, hot = g[z.id + "|" + L];
      rows.push('<div><b>' + esc(code) + '</b><span class="' + (here.length ? (hot ? "hot" : "") : "dim") + '">' + (here.length ? here.map(function (r) { return esc(r.name); }).join(" · ") : "nothing recorded") + '</span></div>');
    }
    var loose = itemsAt(z).filter(function (r) { return !r.place.level; });
    if (loose.length) rows.push('<div><b>' + esc(z.code) + '</b><span>' + loose.map(function (r) { return esc(r.name); }).join(" · ") + ' <i class="dim">(level not recorded)</i></span></div>');
    return '<div class="lv">' + rows.join("") + '</div>';
  }
  var here2 = itemsAt(z);
  if (!here2.length) return "";
  return '<div class="lv"><div><b>' + esc(z.code || "") + '</b><span class="' + (g[z.id + "|0"] ? "hot" : "") + '">' + here2.map(function (r) { return esc(r.name); }).join(" · ") + '</span></div></div>';
}

/* ---------- 3D ---------- */
var stage = $("dh-stage");
var T = window.THREE, renderer, scene, cam, ctl, root, pickables = [], pulses = [];
if (!T || !T.OrbitControls) {
  var e = document.createElement("div"); e.className = "dh-err"; e.textContent = "The 3D view could not load. The lists on the right still work.";
  stage.appendChild(e); warn("three.js or OrbitControls missing; check viewer/vendor/");
  T = null;
}
function css(v, fb) { var x = getComputedStyle(document.documentElement).getPropertyValue(v).trim(); return x || fb; }
function rnd(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
function hash(str) { var h = 7; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h) + 1; }
var PAL = ["#e6a3b8", "#9ec7e8", "#f2d25c", "#b9834a", "#c9cfd3", "#e8e3d8", "#7f8cc4", "#d86b6b", "#8fc9b0", "#f3b27a", "#ffffff", "#3b3f45"];

if (T) {
  renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  stage.appendChild(renderer.domElement);
  scene = new T.Scene();
  cam = new T.PerspectiveCamera(42, 1, 0.1, 400);
  ctl = new T.OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI / 2.05; ctl.minDistance = 3; ctl.maxDistance = Math.max(W, D) * 4;
  scene.add(new T.HemisphereLight(0xffffff, 0x8a8f8c, 0.85));
  var dl = new T.DirectionalLight(0xffffff, 0.55); dl.position.set(-6, 14, -4); scene.add(dl);
  resize(); setView("doll");
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage); else window.addEventListener("resize", resize);
  renderer.domElement.addEventListener("pointerdown", function (e) { downAt = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener("pointerup", onClick);
}
var downAt = null;
function resize() { if (!renderer) return; var w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); }
function setView(v) {
  if (!cam) return;
  cam.fov = 42; cam.updateProjectionMatrix();
  var big = Math.max(W, D, H * 0.9) * Math.max(1, 1.15 / Math.max(0.3, cam.aspect || 1)), dc = (door.from + door.to) / 2; /* back off on tall narrow screens */
  if (v === "top") cam.position.set(W / 2, big * 2.1, D / 2 + 0.01);
  else if (v === "door") cam.position.set(W - dc, Math.min(H * 0.72, 5.4), -big * 0.3);
  else cam.position.set(W + big * 0.3, big * 1.2, -big * 0.75);
  ctl.target.set(W / 2, 0.6, D / 2); ctl.update();
}
document.querySelectorAll(".view button").forEach(function (b) { b.onclick = function () { setView(b.dataset.v); }; });

function mat(c, o) { var m = new T.MeshLambertMaterial({ color: c }); if (o != null) { m.transparent = true; m.opacity = o; } return m; }
/* x is mirrored so +x in the data is your right as you walk in */
/* yOff lifts everything a spot draws, for things mounted off the floor (overhead racks, wall hooks, closet shelves) */
var yOff = 0;
/* label size follows the room, so a closet and a garage both read */
var LS = Math.max(0.6, Math.min(1.6, Math.max(W, D) / 10));
function box(w, h, d, c, x, y, z, o) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat(c, o)); m.position.set(W - x, y + yOff + h / 2, z); root.add(m); return m; }
function label(txt, x, y, z, big) {
  var c = document.createElement("canvas"), k = big ? 1.4 : 1; c.width = 256; c.height = 96; var g = c.getContext("2d");
  var fs = txt.length > 7 ? 32 : 44;
  g.fillStyle = "rgba(31,37,35,.88)"; g.beginPath(); if (g.roundRect) g.roundRect(4, 14, 248, 68, 14); else g.rect(4, 14, 248, 68); g.fill();
  g.fillStyle = "#ffffff"; g.font = "700 " + fs + "px JetBrains Mono, monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, 128, 49);
  var s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), depthTest: false }));
  s.scale.set(1.6 * k * LS, 0.6 * k * LS, 1); s.position.set(W - x, y + yOff, z); s.renderOrder = 10; root.add(s); return s;
}
function shelfLabel(code, txt, x, y, z, hot) {
  var full = code + "  " + (txt || "nothing recorded"); if (full.length > 44) full = full.slice(0, 43) + "…";
  var c = document.createElement("canvas"), g = c.getContext("2d"), fs = 30; g.font = "600 " + fs + "px JetBrains Mono, monospace";
  var tw = Math.ceil(g.measureText(full).width) + 28; c.width = tw; c.height = 48; g = c.getContext("2d");
  g.fillStyle = hot ? "rgba(255,170,60,.97)" : (txt ? "rgba(255,255,255,.94)" : "rgba(255,255,255,.7)"); g.fillRect(0, 0, tw, 48);
  g.fillStyle = txt ? "#1f2523" : "#7a8480"; g.font = (txt ? "600 " : "italic 400 ") + fs + "px JetBrains Mono, monospace"; g.textBaseline = "middle"; g.fillText(full, 14, 25);
  var hgt = 0.3 * Math.min(1.2, LS), wid = hgt * tw / 48;
  var s = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), depthTest: false }));
  s.scale.set(wid, hgt, 1); s.renderOrder = 11; s.position.set(W - x, y + yOff, z); root.add(s); return s;
}
function tag(m, id) { m.userData.id = id; pickables.push(m); return m; }
function pulse(m) { m.material.transparent = true; pulses.push(m); return m; }

/* which wall a spot is backed against, so labels and the close-up camera face the room */
function facing(z) {
  var b = z.box, d = { left: b[0], right: W - b[2], back: D - b[3], front: b[1] };
  var best = "left"; Object.keys(d).forEach(function (k) { if (d[k] < d[best]) best = k; });
  return best;
}

function build() {
  if (!T) return;
  if (root) scene.remove(root);
  root = new T.Group(); scene.add(root); pickables = []; pulses = [];
  var g = glowing();
  box(W, 0.08, D, mode === "now" ? "#c9c6bf" : "#cfccc5", W / 2, -0.08, D / 2);
  var wc = "#f4f4f2", sk = "#e2e2df";
  [[W, 0.08, W / 2, D], [0.08, D, 0, D / 2], [0.08, D, W, D / 2]].forEach(function (a) {
    box(a[0], H, a[1], wc, a[2], 0, a[3], 0.16); box(a[0], 0.5, a[1], sk, a[2], 0, a[3]);
  });
  var df = Math.max(0, door.from), dt = Math.min(W, door.to), dw = dt - df, dh = Math.min(H - 0.2, room.doorHeight || 6.8);
  if (df > 0) { box(df, H, 0.08, wc, df / 2, 0, 0, 0.16); box(df, 0.5, 0.08, sk, df / 2, 0, 0); }
  if (dt < W) { box(W - dt, H, 0.08, wc, (dt + W) / 2, 0, 0, 0.16); box(W - dt, 0.5, 0.08, sk, (dt + W) / 2, 0, 0); }
  box(dw, H - dh, 0.08, wc, (df + dt) / 2, dh, 0, 0.16);
  var blocked = mode === "now" && spots.some(function (z) { return z.blocking && z.box[1] < 2 && z.box[2] > df && z.box[0] < dt; });
  if (door.type === "rollup") {
    /* roll-up door, rolled up into a drum above the opening */
    var drum = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, dw, 20), mat("#9aa3a8", 0.3));
    drum.rotation.z = Math.PI / 2; drum.position.set(W - (df + dt) / 2, dh + 0.35, 0.3); root.add(drum);
  } else {
    var ang = blocked ? 0.5 : 1.35, right = door.hinge !== "left";
    var leaf = new T.Mesh(new T.BoxGeometry(dw - 0.1, dh, 0.12), mat("#9aa3a8", 0.35));
    var hinge = new T.Group();
    hinge.position.set(W - (right ? dt : df), 0, 0);
    leaf.position.set((right ? 1 : -1) * (dw - 0.1) / 2, dh / 2, 0);
    hinge.add(leaf); hinge.rotation.y = right ? -ang : ang; root.add(hinge);
  }

  spots.forEach(function (z) { drawSpot(z, g); });
  if (mode === "plan") drawPlan();
  if (mode === "now") drawBlockers();
}

function drawSpot(z, glowSet) {
  var b = z.box.slice();
  if (mode !== "plan" && z.plan === "new") return;
  if (mode === "plan" && z.plan === "gone") { tag(box(b[2] - b[0], 0.03, b[3] - b[1], css("--block", "#c8463b"), (b[0] + b[2]) / 2, 0, (b[1] + b[3]) / 2, 0.25), z.id); return; }
  if (mode === "plan" && z.plan === "move" && z.moveTo) b = z.moveTo.slice();
  yOff = +z.elevation || 0;
  var x0 = b[0], z0 = b[1], x1 = b[2], z1 = b[3], cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0, h = z.height;
  var r = rnd(hash(z.id)), hi = sel === z.id, g = [], glowC = css("--glow", "#ff9f1c");
  var face = facing({ box: b });
  var k = z.kind;
  if (k === "rack" || k === "shelf") {
    var post = z.color || "#2b2e31";
    [[x0 + 0.05, z0 + 0.05], [x1 - 0.05, z0 + 0.05], [x0 + 0.05, z1 - 0.05], [x1 - 0.05, z1 - 0.05]].forEach(function (p) { g.push(box(0.07, h, 0.07, post, p[0], 0, p[1])); });
    var lv = z.levels || 4, gap = h / lv, along = d >= w;
    for (var L = 0; L < lv; L++) {
      var y = 0.25 + L * gap, num = lv - L; /* top-down numbering */
      g.push(box(w, 0.05, d, "#3a3e42", cx, y, cz));
      var here = z.code ? itemsAt(z, num) : [];
      var n = Math.max(2, Math.min(5, here.length || (2 + Math.floor(r() * 3)))), seg = (along ? d : w) / n;
      for (var q = 0; q < n; q++) {
        var ih = gap * (0.4 + r() * 0.45), c = PAL[Math.floor(r() * PAL.length)];
        if (along) g.push(box(w * (0.65 + r() * 0.25), ih, seg * 0.85, c, cx, y + 0.05, z0 + seg * (q + 0.5)));
        else g.push(box(seg * 0.85, ih, d * (0.65 + r() * 0.25), c, x0 + seg * (q + 0.5), y + 0.05, cz));
      }
      var hot = glowSet[z.id + "|" + num];
      if (hot) pulse(tag(box(w + 0.12, gap * 0.92, d + 0.12, glowC, cx, y, cz, 0.45), z.id));
      if ((hi || hot) && z.code) {
        var code = String(z.code).toUpperCase() + "-" + num, txt = here.map(function (it) { return it.name; }).join(" · ");
        var lx = cx, lz = cz;
        if (face === "right") lx = x0 - 0.3; else if (face === "left") lx = x1 + 0.3; else if (face === "back") lz = z0 - 0.3; else lz = z1 + 0.3;
        shelfLabel(code, txt, lx, y + 0.35, lz, hot);
      }
    }
  } else if (k === "pile") {
    var cnt = Math.min(90, Math.round(w * d * 3.2));
    for (var i = 0; i < cnt; i++) {
      var s = 0.4 + r() * 0.9, hh = 0.3 + r() * 0.8;
      var px = x0 + s / 2 + r() * Math.max(0.01, w - s), pz = z0 + s / 2 + r() * Math.max(0.01, d - s);
      var py = r() * Math.max(0, h - hh) * (1 - Math.hypot(px - cx, pz - cz) / Math.max(w, d));
      g.push(box(Math.min(s, w), hh, Math.min(s * (0.7 + r() * 0.5), d), PAL[Math.floor(r() * PAL.length)], px, Math.max(0, py), pz));
    }
  } else if (k === "boxes" || k === "bin") {
    var cols = Math.max(1, Math.round(w / 1.4)), rows = Math.max(1, Math.round(d / 1.4));
    for (var a = 0; a < cols; a++) for (var c2 = 0; c2 < rows; c2++) {
      var y2 = 0, st = k === "bin" ? 1 : 1 + Math.floor(r() * 3);
      for (var s2 = 0; s2 < st && y2 < h; s2++) {
        var bh = k === "bin" ? h : Math.min(h - y2, 0.9 + r() * 0.7);
        g.push(box(w / cols * 0.92, bh, d / rows * 0.92, z.color || (s2 % 2 ? "#c79560" : "#b9834a"), x0 + (a + 0.5) * w / cols, y2, z0 + (c2 + 0.5) * d / rows)); y2 += bh;
      }
    }
  } else if (k === "wardrobe") {
    var p2 = "#9aa3a8", alongZ = d > w, len = alongZ ? d : w;
    if (alongZ) { g.push(box(0.06, h, 0.06, p2, cx, 0, z0 + 0.1)); g.push(box(0.06, h, 0.06, p2, cx, 0, z1 - 0.1)); g.push(box(0.06, 0.06, d - 0.2, p2, cx, h - 0.1, cz)); }
    else { g.push(box(0.06, h, 0.06, p2, x0 + 0.1, 0, cz)); g.push(box(0.06, h, 0.06, p2, x1 - 0.1, 0, cz)); g.push(box(w - 0.2, 0.06, 0.06, p2, cx, h - 0.1, cz)); }
    var nh = Math.round(len * 4);
    for (var j = 0; j < nh; j++) {
      var gp = 0.25 + j * (len - 0.5) / nh, gl = Math.min(h * 0.6, 2 + r() * 1.4), gc = PAL[Math.floor(r() * PAL.length)];
      if (alongZ) g.push(box(Math.min(0.9, w), gl, 0.12, gc, cx, h - 0.15 - gl, z0 + gp)); else g.push(box(0.12, gl, Math.min(0.9, d), gc, x0 + gp, h - 0.15 - gl, cz));
    }
  } else if (k === "panel") {
    g.push(box(Math.min(0.08, w), h, Math.min(1.8, d), "#ffffff", x0 + 0.2, 0, cz));
    g.push(box(Math.min(0.9, w), Math.min(2.8, h), 0.08, "#f0f0f0", cx, 0, z0 + 0.2));
  } else if (k === "chair") {
    var cc = z.color || "#5b6066", seat = Math.min(1.5, h * 0.55);
    g.push(box(w * 0.85, 0.12, d * 0.85, cc, cx, seat, cz)); g.push(box(w * 0.85, h - seat, 0.1, cc, cx, seat, z0 + 0.1));
    [[x0 + 0.15, z0 + 0.15], [x1 - 0.15, z0 + 0.15], [x0 + 0.15, z1 - 0.15], [x1 - 0.15, z1 - 0.15]].forEach(function (p) { g.push(box(0.07, seat, 0.07, cc, p[0], 0, p[1])); });
  } else if (k === "suitcase") {
    g.push(box(Math.min(w, 1.0), h, Math.min(d, 0.6), z.color || "#202226", cx, 0, cz));
  } else if (k === "car") {
    var lenZ = d >= w, cc2 = z.color || "#6b7f99", bodyH = h * 0.5;
    g.push(box(w * 0.95, bodyH, d * 0.95, cc2, cx, 0.35, cz));
    if (lenZ) g.push(box(w * 0.8, h - bodyH - 0.35, d * 0.5, "#a9b8c8", cx, 0.35 + bodyH, cz + d * 0.05));
    else g.push(box(w * 0.5, h - bodyH - 0.35, d * 0.8, "#a9b8c8", cx + w * 0.05, 0.35 + bodyH, cz));
    if (lenZ) [[x0 + 0.15, z0 + 0.8], [x1 - 0.15, z0 + 0.8], [x0 + 0.15, z1 - 0.8], [x1 - 0.15, z1 - 0.8]].forEach(function (p) { g.push(box(0.3, 0.7, 1.1, "#222", p[0], 0, p[1])); });
    else [[x0 + 0.8, z0 + 0.15], [x1 - 0.8, z0 + 0.15], [x0 + 0.8, z1 - 0.15], [x1 - 0.8, z1 - 0.15]].forEach(function (p) { g.push(box(1.1, 0.7, 0.3, "#222", p[0], 0, p[1])); });
  } else if (k === "pegboard") {
    var thinX = w <= d, bw2 = thinX ? 0.08 : w, bd2 = thinX ? d : 0.08;
    var bx = thinX ? (face === "right" ? x1 - 0.04 : x0 + 0.04) : cx, bz = thinX ? cz : (face === "back" ? z1 - 0.04 : z0 + 0.04);
    g.push(box(bw2, h, bd2, z.color || "#c9a77c", bx, 0, bz));
    var tn = Math.round((thinX ? d : w) * 2.2);
    for (var t = 0; t < tn; t++) {
      var along2 = (t + 0.5) / tn, th = 0.3 + r() * 0.9, ty = 0.3 + r() * (h - th - 0.4), tc = PAL[Math.floor(r() * PAL.length)];
      if (thinX) g.push(box(0.18, th, 0.22, tc, bx + (face === "right" ? -0.13 : 0.13), ty, z0 + along2 * d));
      else g.push(box(0.22, th, 0.18, tc, x0 + along2 * w, ty, bz + (face === "back" ? -0.13 : 0.13)));
    }
  } else if (k === "floor") {
    g.push(box(w, 0.03, d, z.color || "#d8d4cc", cx, 0, cz));
  } else {
    g.push(box(w, h, d, z.color || "#b9b2a6", cx, 0, cz));
  }
  if (k !== "rack" && k !== "shelf" && glowSet[z.id + "|0"]) {
    pulse(tag(box(w + 0.15, h + 0.1, d + 0.15, glowC, cx, 0, cz, 0.4), z.id));
    if (mode !== "plan") label(String(z.code || z.name), cx, h + 0.7, cz);
  }
  var fade = inTheWay({ id: z.id, box: z.box, plan: z.plan, moveTo: z.moveTo });
  g.forEach(function (m) { tag(m, z.id); if (hi) { m.material.emissive = new T.Color("#3a5cff"); m.material.emissiveIntensity = 0.35; } if (fade) { m.material.transparent = true; m.material.opacity = 0.15; m.material.depthWrite = false; } });
  if (mode === "plan" && (z.plan === "move" || z.plan === "new")) g.forEach(function (m) { m.material.emissive = new T.Color(css("--plan", "#5b6ad0")); m.material.emissiveIntensity = hi ? 0.5 : 0.25; });
  if (mode === "plan" && z.code) label(String(z.code), cx, h + 0.7, cz);
  yOff = 0;
}

function drawBlockers() {
  spots.forEach(function (z) {
    if (!z.blocking) return; var b = z.box;
    tag(box(b[2] - b[0] + 0.2, 0.02, b[3] - b[1] + 0.2, css("--block", "#c8463b"), (b[0] + b[2]) / 2, 0.001, (b[1] + b[3]) / 2, 0.35), z.id);
  });
}
function drawPlan() {
  var pc = css("--path", "#12907e");
  ((SP.plan || {}).walkways || []).forEach(function (wk, i) {
    var w = wk[2] - wk[0], d = wk[3] - wk[1], cx = (wk[0] + wk[2]) / 2, cz = (wk[1] + wk[3]) / 2;
    box(w, 0.03, d, pc, cx, 0.001, cz, 0.45);
    if (i === 0) { var along = d >= w, n = Math.floor((along ? d : w) / 1.15);
      for (var s = 0; s < n; s++) { if (along) box(0.25, 0.04, 0.45, "#ffffff", cx - 0.4 + (s % 2) * 0.8, 0.01, wk[1] + 0.6 + s * 1.15, 0.7); else box(0.45, 0.04, 0.25, "#ffffff", wk[0] + 0.6 + s * 1.15, 0.01, cz - 0.4 + (s % 2) * 0.8, 0.7); } }
  });
}

var ray = T ? new T.Raycaster() : null, mv = T ? new T.Vector2() : null;
function onClick(e) {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  var r = renderer.domElement.getBoundingClientRect();
  mv.x = ((e.clientX - r.left) / r.width) * 2 - 1; mv.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  ray.setFromCamera(mv, cam); var hit = ray.intersectObjects(pickables, false)[0];
  pick(hit ? hit.object.userData.id : null);
}
function pick(id) { if (id && !byId[id]) { warn("no spot with id", id); return; } sel = (sel === id) ? null : id; swatches(); detail(); build(); if (sel) focusCam(sel); }
/* close-up facing a rack so its level labels read straight on */
function focusGeom(id) {
  var z = byId[id]; if (!z || !(z.kind === "rack" || z.kind === "shelf")) return null;
  var b = (mode === "plan" && z.plan === "move" && z.moveTo) ? z.moveTo : z.box, cx = (b[0] + b[2]) / 2, cz = (b[1] + b[3]) / 2, f = facing({ box: b }), y = (+z.elevation || 0) + z.height * 0.55, dist = 6.5 * LS;
  var px = cx, pz = cz;
  if (f === "right") px = b[0] - dist; else if (f === "left") px = b[2] + dist; else if (f === "back") pz = b[1] - dist; else pz = b[3] + dist;
  return { b: b, cx: cx, cz: cz, y: y, px: px, pz: pz };
}
function focusCam(id) {
  if (!cam) return; var f = focusGeom(id); if (!f) return;
  cam.fov = 60; cam.updateProjectionMatrix(); cam.position.set(W - f.px, f.y + 1.4, f.pz); ctl.target.set(W - f.cx, f.y, f.cz); ctl.update();
}
/* while a rack is selected, anything standing between it and the close-up camera turns see-through */
function inTheWay(z) {
  if (!sel || sel === z.id) return false; var f = focusGeom(sel); if (!f) return false;
  var x0 = Math.min(f.px, f.b[0]), x1 = Math.max(f.px, f.b[2]), z0 = Math.min(f.pz, f.b[1]), z1 = Math.max(f.pz, f.b[3]);
  var b = (mode === "plan" && z.plan === "move" && z.moveTo) ? z.moveTo : z.box;
  var ov = function (a0, a1, c0, c1) { return Math.min(a1, c1) - Math.max(a0, c0) > 0.05; };
  var fb = f.b; var behind = b[0] >= fb[0] - 0.01 && b[2] <= fb[2] + 0.01 && b[1] >= fb[1] - 0.01 && b[3] <= fb[3] + 0.01;
  return !behind && ov(b[0], b[2], x0, x1) && ov(b[1], b[3], z0, z1);
}
var t0 = Date.now();
function loop() {
  requestAnimationFrame(loop);
  var t = (Date.now() - t0) / 1000;
  pulses.forEach(function (m) { m.material.opacity = 0.28 + 0.22 * (0.5 + 0.5 * Math.sin(t * 3.2)); });
  ctl.update(); renderer.render(scene, cam);
}

function setMode(m) {
  mode = m;
  document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === m ? "true" : "false"); });
  $("dh-stepcard").hidden = m !== "steps";
  var v = $("dh-verdict"), t = m === "plan" ? SP.plan : m === "steps" ? { headline: SP.stepsTitle } : m === "hot" ? { headline: hotCount ? hotCount + " " + HL.label.toLowerCase() : "Nothing " + HL.label.toLowerCase() } : SP.now;
  v.className = "verdict" + (m === "hot" ? " glow" : ""); v.textContent = (t && t.headline) || ""; v.hidden = !v.textContent;
  swatches(); detail(); build();
}
document.querySelectorAll(".seg button").forEach(function (b) { b.onclick = function () { sel = null; setMode(b.dataset.mode); }; });

/* open where the action is: the highlight mode if anything matches it */
setMode(hotCount && HL.openFirst !== false ? "hot" : "now");
if (T) loop();
window.dollhouse = { setMode: setMode, pick: pick, setView: setView, find: function (q) { query = q; $("dh-q").value = q; renderHits(); build(); swatches(); } };
})();
