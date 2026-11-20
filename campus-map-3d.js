// ── HLC CAMPUS MAP 3D v8.0 ───────────────────────────────────
// Renders guidebook.campusMap from data.json as an interactive 3D site model.
// Geometry lives in data.json (campusMap.geometry, buildings[].fp, musterPoints[].xy).
// Three.js r128 is vendored in /vendor so the map works where CDNs are blocked.

(function() {
  'use strict';

  var CSS = [
    '.c3d{background:#212121;border-radius:10px;padding:14px;color:#f2f2f2;font-family:Inter,-apple-system,"Segoe UI",Arial,sans-serif}',
    '.c3d-stage{position:relative;height:min(64vh,580px);min-height:360px;border-radius:8px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#2c3434,#1a1d1d)}',
    '.c3d-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}',
    '.c3d-tag{position:absolute;transform:translate(-50%,-100%);pointer-events:none;font-weight:900;font-size:12px;letter-spacing:.04em;white-space:nowrap;padding:3px 7px;border-radius:4px;background:rgba(0,74,76,.92);color:#C8FF08;line-height:1.3}',
    '.c3d-tag.lot{background:rgba(33,33,33,.85);color:#f2f2f2;font-weight:700}',
    '.c3d-tag.mp{background:#C8FF08;color:#212121}',
    '.c3d-tag.road{background:none;color:rgba(255,255,255,.55);letter-spacing:.3em}',
    '.c3d-tag.zone{background:rgba(0,0,0,.6);color:#fff;font-size:11px}',
    '.c3d-tag.bay{background:#fff;color:#212121;font-size:11px}',
    '.c3d-compass{position:absolute;right:12px;top:12px;width:48px;height:48px;border-radius:50%;border:1.5px solid #C8FF08;background:#212121cc;pointer-events:none}',
    '.c3d-compass b{position:absolute;left:50%;top:3px;transform:translateX(-50%);color:#C8FF08;font-size:12px;font-weight:900}',
    '.c3d-compass i{position:absolute;left:50%;top:18px;width:2px;height:14px;margin-left:-1px;background:#C8FF08}',
    '.c3d-modes{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}',
    '.c3d-modes button{font:600 15px Inter,sans-serif;min-height:44px;padding:0 16px;border-radius:22px;border:1.5px solid #3a3a3a;background:#2a2a2a;color:#f2f2f2;cursor:pointer}',
    '.c3d-modes button[aria-pressed=true]{background:#005E60;border-color:#59C3C9;color:#fff}',
    '.c3d-modes button:focus-visible{outline:2px solid #C8FF08;outline-offset:2px}',
    '.c3d-modes .c3d-reset{margin-left:auto}',
    '.c3d-legend{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px;color:#9aa3a3;margin-top:10px}',
    '.c3d-legend i{display:inline-block;width:12px;height:12px;border-radius:2px;margin-right:6px;vertical-align:-1px}',
    '.c3d-detail{margin-top:12px;padding:16px 18px;background:#2a2a2a;border-radius:8px}',
    '.c3d-detail h3{margin:0;font-size:18px;font-weight:900;text-transform:uppercase;color:#C8FF08}',
    '.c3d-detail p{margin:4px 0 0;color:#9aa3a3;font-size:14px}',
    '.c3d-floors{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px 24px;margin-top:10px}',
    '.c3d-floors h4{margin:0 0 4px;font-size:13px;color:#59C3C9;font-weight:800}',
    '.c3d-floors ul{margin:0;padding:0;list-style:none;font-size:14px}',
    '.c3d-floors li{padding:3px 0;border-bottom:1px solid #3a3a3a;display:flex;justify-content:space-between;gap:12px}',
    '.c3d-floors li span:last-child{color:#9aa3a3;white-space:nowrap}',
    '.c3d .map-info-bar{margin-top:12px}',
    '@media(max-width:600px){.c3d{padding:10px}.c3d-stage{height:60vh}.c3d-modes .c3d-reset{margin-left:0}.c3d-tag{font-size:10px;padding:2px 5px}.c3d-tag.zone,.c3d-tag.bay{font-size:9px}}'
  ].join('\n');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function loadScript(src) {
    return new Promise(function(res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = function() { rej(new Error('load ' + src)); }; document.head.appendChild(s); });
  }
  function webgl() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }

  function factsHtml(map) {
    var h = '<div class="map-info-bar">';
    (map.keyFacts || []).forEach(function(f) { h += '<div class="map-fact"><strong>' + esc(f.label) + '</strong><span>' + esc(f.value) + '</span></div>'; });
    h += '<a href="' + esc(map.directionsUrl || '#') + '" target="_blank" rel="noopener" class="map-directions-btn">GET DIRECTIONS →</a></div>';
    return h;
  }

  function fallback(host, map) {
    var h = '<div class="c3d"><p style="margin:0 0 8px">The 3D campus map needs a browser with WebGL. Here are the essentials:</p><ul style="margin:0 0 0 18px;font-size:14px">';
    (map.musterPoints || []).forEach(function(m) { h += '<li><strong>' + esc(m.label) + ':</strong> ' + esc(m.location) + '</li>'; });
    h += '</ul>' + factsHtml(map) + '</div>';
    host.innerHTML = h;
  }

  function mount(host, map) {
    if (!host || !map) return;
    if (!map.geometry || !webgl()) { fallback(host, map); return; }
    if (!document.getElementById('c3d-css')) { var st = document.createElement('style'); st.id = 'c3d-css'; st.textContent = CSS; document.head.appendChild(st); }
    var ready = window.THREE && window.THREE.OrbitControls ? Promise.resolve()
      : loadScript('vendor/three.min.js?v=0.128.0').then(function() { return loadScript('vendor/OrbitControls.js?v=0.128.0'); });
    ready.then(function() { build(host, map); }).catch(function(err) { console.warn('Campus map 3D failed:', err); fallback(host, map); });
  }

  function build(host, MAP) {
    var THREE = window.THREE, G = MAP.geometry, BUILDINGS = MAP.buildings || [], MPS = MAP.musterPoints || [];
    host.innerHTML =
      '<div class="c3d">' +
      '<div class="c3d-stage"><div class="c3d-compass" aria-hidden="true"><b>N</b><i></i></div></div>' +
      '<div class="c3d-modes" role="group" aria-label="Map view">' +
      '<button data-mode="overview" aria-pressed="true">Overview</button>' +
      '<button data-mode="firstday" aria-pressed="false">First day route</button>' +
      '<button data-mode="zones" aria-pressed="false">Training zones</button>' +
      '<button data-mode="evac" aria-pressed="false">Evacuation</button>' +
      '<button class="c3d-reset" type="button">Reset view</button></div>' +
      '<div class="c3d-legend"></div>' +
      '<div class="c3d-detail" aria-live="polite"></div>' +
      factsHtml(MAP) + '</div>';
    var stage = host.querySelector('.c3d-stage'), compass = host.querySelector('.c3d-compass'),
        legend = host.querySelector('.c3d-legend'), detail = host.querySelector('.c3d-detail');

    // Centre of the site, from the boundary
    var bx = G.boundary.map(function(p) { return p[0]; }), by = G.boundary.map(function(p) { return p[1]; });
    var CX = (Math.min.apply(null, bx) + Math.max.apply(null, bx)) / 2, CY = (Math.min.apply(null, by) + Math.max.apply(null, by)) / 2;
    function P(x, y) { return new THREE.Vector3(x - CX, 0, -(y - CY)); }
    function centre(fp) { var xs = fp.map(function(p) { return p[0]; }), ys = fp.map(function(p) { return p[1]; }); return [(Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2]; }

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    stage.insertBefore(renderer.domElement, stage.firstChild);
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(40, 1, 1, 3000);
    var controls = new THREE.OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.47; controls.minDistance = 60; controls.maxDistance = 650;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var moved = false, fly = null, mode = 'overview';
    var VIEWS = { home: { p: [-90, 200, 245], t: [5, 0, -5] }, firstday: { p: [-120, 170, -290], t: [10, 0, -70] }, top: { p: [-40, 290, 150], t: [0, 0, -5] } };
    function k() { return Math.max(1, 1.0 / (cam.aspect || 1.5)); }
    function flyTo(name, instant) {
      var v = VIEWS[name], kk = name === 'tall' ? Math.max(1, 1.3 / (cam.aspect || 1)) : k(), to = new THREE.Vector3(v.p[0] * kk, v.p[1] * kk, v.p[2] * kk), tt = new THREE.Vector3(v.t[0], v.t[1], v.t[2]);
      if (instant || still) { cam.position.copy(to); controls.target.copy(tt); controls.update(); fly = null; return; }
      fly = { p0: cam.position.clone(), t0: controls.target.clone(), to: to, tt: tt, start: performance.now() };
    }
    VIEWS.tall = { p: [-10, 240, 140], t: [14, 0, 0] };
    function viewFor(m) { if (m === 'firstday') return 'firstday'; if ((cam.aspect || 1.5) < 1) return 'tall'; return (m === 'evac' || m === 'zones') ? 'top' : 'home'; }
    controls.addEventListener('start', function() { moved = true; fly = null; });

    scene.add(new THREE.HemisphereLight(0xdfeff0, 0x202020, 0.75));
    var sun = new THREE.DirectionalLight(0xffffff, 0.8); sun.position.set(-150, 300, 200); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -260; sun.shadow.camera.right = 260; sun.shadow.camera.top = 260; sun.shadow.camera.bottom = -260;
    scene.add(sun);

    function shape(fp) { var s = new THREE.Shape(); fp.forEach(function(q, i) { var v = P(q[0], q[1]); if (i) s.lineTo(v.x, -v.z); else s.moveTo(v.x, -v.z); }); return s; }
    function flat(fp, color, y, opacity) {
      if (opacity == null) opacity = 1;
      var m = new THREE.Mesh(new THREE.ShapeGeometry(shape(fp)), new THREE.MeshLambertMaterial({ color: color, transparent: opacity < 1, opacity: opacity }));
      m.rotation.x = -Math.PI / 2; m.position.y = y; m.receiveShadow = true; scene.add(m); return m;
    }
    var tags = [];
    function tag(text, cls, x, y, h, group) {
      var d = document.createElement('div'); d.className = 'c3d-tag ' + cls; d.textContent = text; stage.appendChild(d);
      var t = { d: d, v: P(x, y).setY(h), group: group, cls: cls }; tags.push(t); return t;
    }

    var w0 = Math.min.apply(null, bx) - 80, w1 = Math.max.apply(null, bx) + 80, h0 = Math.min.apply(null, by) - 60, h1 = Math.max.apply(null, by) + 60;
    flat([[w0, h0], [w1, h0], [w1, h1], [w0, h1]], 0x2b302f, -0.2);
    flat(G.boundary, 0x323837, 0);
    var rw = G.road.width / 2;
    flat([[w0, G.road.y - rw], [w1, G.road.y - rw], [w1, G.road.y + rw], [w0, G.road.y + rw]], 0x3d3833, 0.05);
    tag(G.road.name, 'road', CX, G.road.y, 1, 'always');
    (G.roadway || []).forEach(function(f) { flat(f, 0x3d3833, 0.06); });
    if (G.pond) { flat(G.pond, 0x1f4f66, 0.08, 0.95); var pc = centre(G.pond); tag('POND', 'road', pc[0], pc[1], 1, 'always'); }
    (G.features || []).forEach(function(f) { flat(f.fp, new THREE.Color(f.c).getHex(), 0.12, 0.95); var c = centre(f.fp); tag(f.label, 'lot', c[0], c[1], 2, 'always'); });
    var lots = (G.parking || []).map(function(p) {
      var m = flat(p.fp, new THREE.Color(p.c).multiplyScalar(0.55).getHex(), 0.1, 0.9);
      var c = p.labelAt || centre(p.fp); if (p.label) tag(p.label, 'lot', c[0], c[1], 2, 'always'); return m;
    });

    var bldg = {};
    BUILDINGS.forEach(function(b) {
      if (!b.fp) return;
      var geo = new THREE.ExtrudeGeometry(shape(b.fp), { depth: b.h || 9, bevelEnabled: false });
      var mat = new THREE.MeshLambertMaterial({ color: 0x005E60, transparent: true, opacity: 1 });
      var m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.castShadow = true; m.receiveShadow = true; m.userData.id = b.id; scene.add(m);
      var edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x59C3C9, transparent: true, opacity: 0.5 }));
      edges.rotation.x = -Math.PI / 2; scene.add(edges);
      var c = centre(b.fp), t = tag(b.label, '', c[0], c[1], (b.h || 9) + 4, 'always');
      var zs = (b.zones || []).map(function(z) {
        var zm = flat(z.fp, new THREE.Color(z.c).getHex(), 0.3, 0.95); zm.visible = false;
        var zc = z.labelAt || centre(z.fp); tag(z.label, 'zone', zc[0], zc[1], 2, 'zones'); return zm;
      });
      (b.bays || []).forEach(function(y) {
        var pts = y.fp.map(function(q) { return P(q[0], q[1]).setY((b.h || 9) + 0.3); });
        var ln = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff }));
        ln.visible = false; scene.add(ln); zs.push(ln);
        var yc = centre(y.fp), ny = Math.max.apply(null, y.fp.map(function(q) { return q[1]; })) - 2;
        tag(y.label, 'bay', yc[0], ny, (b.h || 9) + 1, 'zones');
      });
      bldg[b.id] = { b: b, m: m, mat: mat, zs: zs, t: t };
    });

    var mps = MPS.filter(function(p) { return p.xy; }).map(function(p, i) {
      var g = new THREE.Group(); g.position.copy(P(p.xy[0], p.xy[1]));
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 10, 16), new THREE.MeshLambertMaterial({ color: 0xC8FF08, emissive: 0x4a5e00 }));
      pole.position.y = 5; pole.castShadow = true; g.add(pole);
      var ring = new THREE.Mesh(new THREE.RingGeometry(5, 6.5, 40), new THREE.MeshBasicMaterial({ color: 0xC8FF08, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.4; ring.userData.phase = i * 0.8; g.add(ring);
      scene.add(g); tag(p.label, 'mp', p.xy[0], p.xy[1], 14, 'always'); return { ring: ring };
    });

    function pathLine(pts, color, h) {
      var curve = new THREE.CatmullRomCurve3(pts.map(function(q) { return P(q[0], q[1]).setY(h || 1.2); }), false, 'catmullrom', 0.1);
      var m = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 1.6, 8, false), new THREE.MeshBasicMaterial({ color: color }));
      m.visible = false; scene.add(m); return { m: m, curve: curve };
    }
    var fd = G.firstDay || {}, drive = pathLine(fd.drive || [], 0xC8FF08), walk = pathLine(fd.walk || [], 0xffffff);
    var walker = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 16), new THREE.MeshBasicMaterial({ color: 0xffffff })); walker.visible = false; scene.add(walker);
    (G.gates || []).forEach(function(g) { tag(g.label === 'IN' ? 'IN · ENTRANCE ONLY' : 'OUT · EXIT ONLY', 'lot', g.xy[0], g.xy[1], 4, 'firstday'); });
    if (fd.drive && fd.walk) {
      var dE = fd.drive[fd.drive.length - 1], wE = fd.walk[fd.walk.length - 1];
      tag('PARK HERE', 'mp', dE[0], dE[1], 6, 'firstday'); tag('MAIN ENTRANCE · SECURITY 1103', 'mp', wE[0], wE[1], 16, 'firstday');
    }
    var evac = [];
    MPS.forEach(function(p) {
      if (!p.xy) return;
      (p.serves || []).forEach(function(id) {
        var o = bldg[id]; if (!o) return;
        var B = o.b, d = function(q) { return Math.hypot(q[0] - p.xy[0], q[1] - p.xy[1]); };
        var e = B.exit && d(B.exit) < d(B.entrance) ? B.exit : B.entrance;
        var pts = B.via ? [e].concat(B.via, [p.xy]) : [e, [(e[0] + p.xy[0]) / 2, (e[1] + p.xy[1]) / 2 + 4], p.xy];
        evac.push(pathLine(pts, 0xE63946, 1.5));
      });
    });

    var zoneLegend = []; var seen = {};
    BUILDINGS.forEach(function(b) { (b.zones || []).forEach(function(z) { if (!seen[z.label]) { seen[z.label] = 1; zoneLegend.push([z.c, z.label]); } }); });
    zoneLegend.push(['#ffffff', 'Bay outlines']);
    var evacText = MPS.map(function(p) { return (p.serves || []).map(function(id) { return bldg[id] ? bldg[id].b.label.replace('BUILDING ', 'Building ') : id; }).join(' and ').replace('WAREHOUSE', 'Warehouse') + ' to ' + p.id; }).join(', ');
    var LEG = {
      overview: [['#005E60', 'Buildings'], ['#4A90D9', 'Visitor parking'], ['#C4A35A', 'Staff parking'], ['#7B68EE', 'Student parking'], ['#C8FF08', 'Muster point'], ['#1f4f66', 'Pond'], ['#9a9a9a', 'Smoking area']],
      firstday: [['#C8FF08', 'Drive in the west gate to student parking'], ['#ffffff', 'Walk to the main entrance, north side of Building 1'], ['#888888', 'Leave by the east gate. Both gates are one way.']],
      zones: zoneLegend,
      evac: [['#E63946', evacText], ['#C8FF08', 'Muster point. Stay until released.']]
    };

    function setMode(m) {
      mode = m;
      host.querySelectorAll('.c3d-modes button[data-mode]').forEach(function(b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === m); });
      Object.keys(bldg).forEach(function(id) {
        var o = bldg[id], see = m === 'zones';
        o.mat.opacity = see ? 0.18 : 1; o.mat.depthWrite = !see;
        o.zs.forEach(function(z) { z.visible = see; });
        o.t.d.style.display = see ? 'none' : '';
      });
      drive.m.visible = walk.m.visible = walker.visible = m === 'firstday';
      evac.forEach(function(e) { e.m.visible = m === 'evac'; });
      lots.forEach(function(l, i) { l.material.opacity = (m === 'firstday' && G.parking[i].id !== 'student') ? 0.25 : 0.9; });
      if (!moved || m === 'firstday') flyTo(viewFor(m));
      legend.innerHTML = LEG[m].map(function(x) { return '<span><i style="background:' + esc(x[0]) + '"></i>' + esc(x[1]) + '</span>'; }).join('');
    }
    host.querySelectorAll('.c3d-modes button[data-mode]').forEach(function(b) { b.addEventListener('click', function() { setMode(b.getAttribute('data-mode')); }); });
    host.querySelector('.c3d-reset').addEventListener('click', function() { moved = false; flyTo(viewFor(mode)); });

    function show(id) {
      Object.keys(bldg).forEach(function(k2) { bldg[k2].mat.color.setHex(k2 === id ? 0x0a8a8c : 0x005E60); });
      if (!id) { detail.innerHTML = '<h3>Tap a building</h3><p>Its bays, training areas and rooms show here. Your first stop is always Security in Building 1, Room 1103.</p>'; return; }
      var b = bldg[id].b, cols = '';
      var areas = (b.bays || []).map(function(y) { return y.label.charAt(0) + y.label.slice(1).toLowerCase(); }).concat((b.zones || []).map(function(z) { return z.label; }));
      if (areas.length) cols += '<div><h4>Bays and training areas</h4><ul>' + areas.map(function(a) { return '<li><span>' + esc(a) + '</span><span></span></li>'; }).join('') + '</ul></div>';
      (b.floors || []).forEach(function(f) {
        cols += '<div><h4>' + esc(f.floor) + '</h4><ul>' + (f.rooms || []).map(function(r) { var s = String(r).split(' — '); return '<li><span>' + esc(s[0]) + '</span><span>' + esc(s[1] || '') + '</span></li>'; }).join('') + '</ul></div>';
      });
      detail.innerHTML = '<h3>' + esc(b.label) + '</h3><p>' + esc(b.note || '') + '</p><div class="c3d-floors">' + cols + '</div>';
    }
    var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), down = null;
    renderer.domElement.addEventListener('pointerdown', function(e) { down = [e.clientX, e.clientY]; });
    renderer.domElement.addEventListener('pointerup', function(e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
      var r = renderer.domElement.getBoundingClientRect();
      ptr.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(ptr, cam);
      var hit = ray.intersectObjects(Object.keys(bldg).map(function(k2) { return bldg[k2].m; }))[0];
      show(hit ? hit.object.userData.id : null);
    });

    function resize() { var w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    if (window.ResizeObserver) { new ResizeObserver(function() { resize(); if (!moved) flyTo(viewFor(mode), true); }).observe(stage); }
    else window.addEventListener('resize', resize);
    resize(); flyTo(viewFor('overview'), true);

    var v = new THREE.Vector3();
    function frame(t) {
      if (fly) { var a = Math.min(1, (performance.now() - fly.start) / 1200), ee = a < 0.5 ? 2 * a * a : 1 - Math.pow(-2 * a + 2, 2) / 2; cam.position.lerpVectors(fly.p0, fly.to, ee); controls.target.lerpVectors(fly.t0, fly.tt, ee); if (a >= 1) fly = null; }
      controls.update();
      var s = t / 1000;
      mps.forEach(function(o) { var q = still ? 0.5 : ((s * 0.6 + o.ring.userData.phase) % 1); o.ring.scale.setScalar(1 + q * 1.6); o.ring.material.opacity = 0.7 * (1 - q); });
      if (drive.m.visible && fd.drive) { var u = still ? 1 : (s * 0.12) % 1; walker.position.copy(u < 0.55 ? drive.curve.getPointAt(u / 0.55) : walk.curve.getPointAt((u - 0.55) / 0.45)).setY(3); }
      var w = stage.clientWidth, h = stage.clientHeight;
      tags.forEach(function(tg) {
        var on = tg.group === 'always' || tg.group === mode;
        if (!on || (mode === 'zones' && tg.cls === '')) { tg.d.style.display = 'none'; return; }
        v.copy(tg.v).project(cam);
        var vis = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
        tg.d.style.display = vis ? '' : 'none';
        tg.d.style.left = ((v.x + 1) / 2 * w) + 'px'; tg.d.style.top = ((1 - v.y) / 2 * h) + 'px';
      });
      compass.style.transform = 'rotate(' + controls.getAzimuthalAngle() + 'rad)';
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    setMode('overview'); show(null); requestAnimationFrame(frame);
  }

  window.HLCCampus3D = { mount: mount };
})();
