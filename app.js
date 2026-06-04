// ── HLC GUIDEBOOK APP.JS v7.0 ────────────────────────────────
// Shared logic for index.html (guidebook) and addendum.html

(function() {

  // ── HELPERS ─────────────────────────────────────────────────
  function el(id) { return document.getElementById(id); }
  function fmtPhone(phone) { return phone.replace(/\s+/g, '').replace(/[()]/g, ''); }

  // ── CAMPUS MAP SVG ───────────────────────────────────────────
  function buildCampusMap(mapData) {
    var musterInfo = {};
    (mapData.musterPoints || []).forEach(function(mp) { musterInfo[mp.id] = mp; });

    var svg = [
      '<div class="campus-map-wrap">',
      '<div class="campus-svg-wrap" id="hlc-map-wrap">',
      '<svg viewBox="0 0 700 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HLC campus map">',
      '<!-- Background -->',
      '<rect width="700" height="460" fill="#E8E8E2"/>',

      '<!-- Wallisville Road -->',
      '<rect x="0" y="0" width="700" height="42" fill="#B0A898"/>',
      '<rect x="0" y="19" width="700" height="4" fill="white" opacity="0.4"/>',
      '<text x="350" y="26" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="#888" text-anchor="middle" letter-spacing="2">WALLISVILLE ROAD</text>',

      '<!-- Entrance road -->',
      '<rect x="58" y="42" width="34" height="80" fill="#C8C2B6"/>',
      '<polygon points="58,122 92,122 75,108" fill="#C8FF08" stroke="#005E60" stroke-width="1.5"/>',
      '<text x="75" y="106" font-family="Inter,sans-serif" font-size="8" font-weight="800" fill="#005E60" text-anchor="middle">IN</text>',

      '<!-- Internal road -->',
      '<rect x="58" y="120" width="580" height="18" fill="#C8C2B6" opacity="0.6"/>',

      '<!-- BUILDING 1 -->',
      '<rect x="58" y="138" width="220" height="200" rx="4" fill="white" stroke="#005E60" stroke-width="3"/>',
      '<rect x="58" y="138" width="220" height="28" rx="4" fill="#005E60"/>',
      '<text x="168" y="156" font-family="Inter,sans-serif" font-size="13" font-weight="900" fill="#C8FF08" text-anchor="middle" letter-spacing="1">BUILDING 1</text>',
      '<text x="168" y="178" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#005E60" text-anchor="middle" letter-spacing="0.5">MAIN ENTRANCE / SECURITY</text>',
      '<text x="168" y="194" font-family="Inter,sans-serif" font-size="8" fill="#666" text-anchor="middle">Training Rooms (Floor 1 & 2)</text>',
      '<text x="168" y="208" font-family="Inter,sans-serif" font-size="8" fill="#666" text-anchor="middle">Dining · First Aid · Bays 1–4</text>',

      '<!-- Bays 1&2 (north of B1) -->',
      '<rect x="58" y="60" width="108" height="78" rx="3" fill="#B8D4D4" stroke="#005E60" stroke-width="1.5" stroke-dasharray="5,3"/>',
      '<text x="112" y="95" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#005E60" text-anchor="middle">BAYS 1 & 2</text>',

      '<!-- Bays 3&4 (south of B1) -->',
      '<rect x="58" y="338" width="108" height="80" rx="3" fill="#B8D4D4" stroke="#005E60" stroke-width="1.5" stroke-dasharray="5,3"/>',
      '<text x="112" y="383" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#005E60" text-anchor="middle">BAYS 3 & 4</text>',

      '<!-- BUILDING 2 -->',
      '<rect x="320" y="138" width="160" height="150" rx="4" fill="white" stroke="#007A7C" stroke-width="2.5"/>',
      '<rect x="320" y="138" width="160" height="26" rx="4" fill="#007A7C"/>',
      '<text x="400" y="155" font-family="Inter,sans-serif" font-size="12" font-weight="900" fill="#C8FF08" text-anchor="middle" letter-spacing="0.8">BUILDING 2</text>',
      '<text x="400" y="178" font-family="Inter,sans-serif" font-size="8" fill="#666" text-anchor="middle">Craft Training</text>',

      '<!-- walkway B1-B2 -->',
      '<rect x="278" y="190" width="42" height="16" fill="#DDD" stroke="#CCC" stroke-width="1"/>',

      '<!-- BUILDING 3 -->',
      '<rect x="528" y="138" width="150" height="150" rx="4" fill="white" stroke="#00989A" stroke-width="2.5"/>',
      '<rect x="528" y="138" width="150" height="26" rx="4" fill="#00989A"/>',
      '<text x="603" y="155" font-family="Inter,sans-serif" font-size="12" font-weight="900" fill="#C8FF08" text-anchor="middle" letter-spacing="0.8">BUILDING 3</text>',
      '<text x="603" y="178" font-family="Inter,sans-serif" font-size="8" fill="#666" text-anchor="middle">Aero · Excitation · Controls</text>',

      '<!-- walkway B2-B3 -->',
      '<rect x="480" y="190" width="48" height="16" fill="#DDD" stroke="#CCC" stroke-width="1"/>',

      '<!-- BUILDING 4 -->',
      '<rect x="528" y="330" width="150" height="80" rx="4" fill="white" stroke="#59C3C9" stroke-width="2"/>',
      '<rect x="528" y="330" width="150" height="24" rx="4" fill="#59C3C9"/>',
      '<text x="603" y="346" font-family="Inter,sans-serif" font-size="12" font-weight="900" fill="#212121" text-anchor="middle" letter-spacing="0.8">BUILDING 4</text>',

      '<!-- Visitor Parking (north of B2) -->',
      '<rect x="320" y="60" width="160" height="62" rx="3" fill="rgba(74,144,217,0.2)" stroke="#4A90D9" stroke-width="1.5"/>',
      '<text x="400" y="88" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#4A90D9" text-anchor="middle">VISITOR PARKING</text>',
      '<text x="400" y="102" font-family="Inter,sans-serif" font-size="7" fill="#4A90D9" text-anchor="middle">Reverse into spaces</text>',

      '<!-- Staff Parking (west of B1) -->',
      '<rect x="4" y="138" width="52" height="200" rx="3" fill="rgba(123,104,238,0.15)" stroke="#7B68EE" stroke-width="1.5"/>',
      '<text x="30" y="238" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#7B68EE" text-anchor="middle" transform="rotate(-90,30,238)">STAFF PARKING</text>',

      '<!-- South parking (between B2-B3) -->',
      '<rect x="320" y="300" width="360" height="60" rx="3" fill="rgba(74,144,217,0.15)" stroke="#4A90D9" stroke-width="1" stroke-dasharray="4,2"/>',
      '<text x="500" y="335" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#4A90D9" text-anchor="middle">PARKING</text>',

      '<!-- Smoking area -->',
      '<rect x="4" y="360" width="52" height="38" rx="3" fill="rgba(136,136,136,0.2)" stroke="#888" stroke-width="1"/>',
      '<text x="30" y="375" font-family="Inter,sans-serif" font-size="7" fill="#888" text-anchor="middle">SMOKE</text>',
      '<text x="30" y="389" font-family="Inter,sans-serif" font-size="7" fill="#888" text-anchor="middle">AREA</text>',

      '<!-- MUSTER POINTS -->',
      // MP1 west of B1
      '<circle cx="42" cy="210" r="22" fill="#C8FF08" opacity="0.15" class="muster-pulse"/>',
      '<circle cx="42" cy="210" r="13" fill="#C8FF08" stroke="#005E60" stroke-width="2.5" style="cursor:pointer" onclick="showMusterInfo(\'MP1\',42,210)" aria-label="Muster Point 1"/>',
      '<text x="42" y="214" font-family="Inter,sans-serif" font-size="9" font-weight="900" fill="#212121" text-anchor="middle" style="pointer-events:none">MP1</text>',

      // MP2 south of B2
      '<circle cx="400" cy="420" r="22" fill="#C8FF08" opacity="0.15" class="muster-pulse" style="animation-delay:.7s"/>',
      '<circle cx="400" cy="420" r="13" fill="#C8FF08" stroke="#005E60" stroke-width="2.5" style="cursor:pointer" onclick="showMusterInfo(\'MP2\',400,420)" aria-label="Muster Point 2"/>',
      '<text x="400" y="424" font-family="Inter,sans-serif" font-size="9" font-weight="900" fill="#212121" text-anchor="middle" style="pointer-events:none">MP2</text>',

      // MP3 east of B3
      '<circle cx="680" cy="215" r="22" fill="#C8FF08" opacity="0.15" class="muster-pulse" style="animation-delay:1.4s"/>',
      '<circle cx="680" cy="215" r="13" fill="#C8FF08" stroke="#005E60" stroke-width="2.5" style="cursor:pointer" onclick="showMusterInfo(\'MP3\',680,215)" aria-label="Muster Point 3"/>',
      '<text x="680" y="219" font-family="Inter,sans-serif" font-size="9" font-weight="900" fill="#212121" text-anchor="middle" style="pointer-events:none">MP3</text>',

      '<!-- North compass -->',
      '<g transform="translate(650,420)">',
      '<circle cx="0" cy="0" r="18" fill="white" stroke="#005E60" stroke-width="1.5" opacity="0.9"/>',
      '<polygon points="0,-14 3,-4 0,-7 -3,-4" fill="#005E60"/>',
      '<polygon points="0,14 3,4 0,7 -3,4" fill="#aaa"/>',
      '<text x="0" y="-4" font-family="Inter,sans-serif" font-size="9" font-weight="900" fill="#005E60" text-anchor="middle">N</text>',
      '</g>',

      '<!-- Popover -->',
      '<foreignObject id="map-popover-fo" x="0" y="0" width="1" height="1" style="overflow:visible">',
      '<div xmlns="http://www.w3.org/1999/xhtml" id="map-popover" class="map-popover"></div>',
      '</foreignObject>',

      '</svg>',
      '</div>',

      // Legend
      '<div class="map-legend">',
      '<div class="map-legend-item"><span class="legend-dot" style="background:#005E60"></span>Main Building / Entrance</div>',
      '<div class="map-legend-item"><span class="legend-dot" style="background:#4A90D9"></span>Visitor Parking</div>',
      '<div class="map-legend-item"><span class="legend-dot" style="background:#7B68EE"></span>Staff Parking</div>',
      '<div class="map-legend-item"><span class="legend-dot" style="background:#C8FF08;border:1px solid #005E60"></span>Muster Points (tap for info)</div>',
      '<div class="map-legend-item"><span class="legend-dot" style="background:#B8D4D4;border:1px solid #005E60"></span>Training Bays</div>',
      '</div>',

      // Info bar
      '<div class="map-info-bar">',
    ];

    (mapData.keyFacts || []).forEach(function(f) {
      svg.push('<div class="map-fact"><strong>' + f.label + '</strong><span>' + f.value + '</span></div>');
    });

    svg.push(
      '<a href="' + (mapData.directionsUrl || '#') + '" target="_blank" rel="noopener" class="map-directions-btn">GET DIRECTIONS →</a>',
      '</div>',
      '</div>'
    );

    // Store muster info globally for click handlers
    window.__musterInfo = musterInfo;

    return svg.join('\n');
  }

  window.showMusterInfo = function(id, x, y) {
    var info = window.__musterInfo && window.__musterInfo[id];
    if (!info) return;
    var pop = document.getElementById('map-popover');
    if (!pop) return;
    pop.innerHTML = '<strong style="color:#C8FF08">' + info.label + '</strong><br>' + info.desc;
    pop.style.left = (x + 16) + 'px';
    pop.style.top = (y - 30) + 'px';
    pop.classList.add('visible');
    setTimeout(function() { pop.classList.remove('visible'); }, 3000);
  };

  // ── RENDER FUNCTIONS ────────────────────────────────────────

  function renderHero(content) {
    var h = el('hero');
    if (h && content.hero.image) h.style.backgroundImage = "url('" + content.hero.image + "')";
    var ht = el('hero-title');
    if (ht) ht.textContent = content.hero.title;
  }

  function renderActions(actions) {
    var strip = el('action-strip');
    if (!strip || !actions) return;
    actions.forEach(function(act) {
      var a = document.createElement('a');
      a.className = 'action-btn ' + (act.style || 'primary');
      a.href = act.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = '<span class="action-label">' + act.label + '</span>' +
        (act.sublabel ? '<span class="action-sublabel">' + act.sublabel + '</span>' : '');
      strip.appendChild(a);
    });
  }

  function renderLSR(lsr) {
    if (!lsr) return;
    var t = el('lsr-title'); if (t) t.textContent = lsr.title;
    var i = el('lsr-intro'); if (i) i.textContent = lsr.intro;
    var l = el('lsr-link'); if (l) l.href = lsr.link;
    var grid = el('lsr-grid');
    if (!grid) return;
    (lsr.rules || []).forEach(function(rule) {
      var a = document.createElement('a');
      a.className = 'lsr-card';
      a.href = lsr.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = '<img src="' + rule.icon + '" alt="' + rule.label + '" loading="lazy">' +
        '<span class="lsr-card-label">' + rule.label + '</span>';
      grid.appendChild(a);
    });
  }

  function renderContacts(contactData, dark) {
    var container = el('contacts-container');
    if (!container || !contactData) return;
    var html = '';
    (contactData.groups || []).forEach(function(group) {
      html += '<div class="contact-group">';
      html += '<div class="contact-group-label">' + group.groupLabel + '</div>';
      html += '<div class="contact-cards">';
      (group.contacts || []).forEach(function(c) {
        var phoneClean = fmtPhone(c.phone || '');
        html += '<div class="contact-card">';
        html += '<div class="contact-name">' + c.name + '</div>';
        html += '<div class="contact-title">' + c.title + '</div>';
        html += '<div class="contact-actions">';
        if (c.phone) html += '<a class="contact-btn phone" href="tel:' + phoneClean + '">📞 ' + c.phone + '</a>';
        if (c.email) html += '<a class="contact-btn email" href="mailto:' + c.email + '">✉ Email</a>';
        html += '</div></div>';
      });
      html += '</div></div>';
    });
    container.innerHTML = html;
  }

  function renderMap(mapData) {
    var host = el('campus-map-host');
    if (!host || !mapData) return;
    host.innerHTML = buildCampusMap(mapData);
  }

  function renderSiteRules(siteRules) {
    var container = el('rules-accordion');
    if (!container || !siteRules) return;
    var t = el('rules-title'); if (t) t.textContent = siteRules.title || 'SITE RULES';
    var html = '<div class="rules-accordion">';
    (siteRules.sections || []).forEach(function(sec, idx) {
      html += '<div class="rule-item' + (idx === 0 ? ' open' : '') + '" id="rule-' + sec.id + '">';
      html += '<button class="rule-header" onclick="toggleRule(\'rule-' + sec.id + '\')" aria-expanded="' + (idx === 0) + '">';
      html += '<span class="rule-icon">' + sec.icon + '</span>';
      html += '<span class="rule-heading">' + sec.heading + '</span>';
      html += '<span class="rule-chevron">▾</span>';
      html += '</button>';
      html += '<div class="rule-body"><ul class="rule-list">';
      (sec.rules || []).forEach(function(r) { html += '<li>' + r + '</li>'; });
      html += '</ul></div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  window.toggleRule = function(id) {
    var el2 = document.getElementById(id);
    if (el2) el2.classList.toggle('open');
  };

  function renderIncidentReporting(ir) {
    var container = el('incident-container');
    if (!container || !ir) return;
    var emergencyBtns = (ir.emergency.contacts || []).map(function(c) {
      return '<a class="ir-contact-btn emergency-style" href="tel:' + c.number + '">' +
        '<span class="ir-contact-label">' + c.label + '</span>' +
        '<span class="ir-contact-number">' + c.number + '</span></a>';
    }).join('');
    var nonEmergencyBtns = (ir.nonEmergency.contacts || []).map(function(c) {
      return '<a class="ir-contact-btn nonemergency-style" href="' + (c.number === 'Report Online' ? ir.actionButton.url : 'tel:' + c.number) + '" target="_blank">' +
        '<span class="ir-contact-label">' + c.label + '</span>' +
        '<span class="ir-contact-number">' + c.number + '</span></a>';
    }).join('');
    var steps = (ir.steps || []).map(function(s) {
      return '<div class="ir-step"><div class="ir-step-num">' + s.step + '</div><div>' +
        '<div class="ir-step-heading">' + s.heading + '</div>' +
        '<div class="ir-step-detail">' + s.detail + '</div></div></div>';
    }).join('');
    var scope = (ir.reportingScope || []).map(function(s) { return '<li>' + s + '</li>'; }).join('');
    container.innerHTML =
      '<div class="ir-module">' +
      '<h2 class="ir-title">' + ir.title + '</h2>' +
      '<p class="ir-subtitle">' + ir.subtitle + '</p>' +
      '<div class="ir-contact-grid">' +
      '<div class="ir-card ir-emergency-card">' +
      '<div class="ir-card-label">' + ir.emergency.label + '</div>' +
      '<p class="ir-card-instruction">' + ir.emergency.instruction + '</p>' +
      '<div class="ir-contact-list">' + emergencyBtns + '</div>' +
      (ir.emergency.note ? '<p class="ir-card-note">' + ir.emergency.note + '</p>' : '') +
      '</div>' +
      '<div class="ir-card ir-nonemergency-card">' +
      '<div class="ir-card-label">' + ir.nonEmergency.label + '</div>' +
      '<p class="ir-card-instruction">' + ir.nonEmergency.instruction + '</p>' +
      '<div class="ir-contact-list">' + nonEmergencyBtns + '</div>' +
      '</div></div>' +
      '<div class="ir-section-title">RESPONSE FLOW</div>' +
      '<div class="ir-steps">' + steps + '</div>' +
      '<div class="ir-section-title">WHAT TO REPORT</div>' +
      '<ul class="ir-scope-list">' + scope + '</ul>' +
      '<p class="ir-osha">' + ir.osha + '</p>' +
      '<div class="ir-action-row"><a href="' + ir.actionButton.url + '" target="_blank" rel="noopener" class="ir-action-btn">' + ir.actionButton.label + '</a></div>' +
      '</div>';
  }

  function renderSurvivalBasics(basics) {
    var grid = el('basics-grid');
    if (!grid || !basics) return;
    (basics.items || []).forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'basics-card';
      div.innerHTML = '<div class="basics-icon">' + item.icon + '</div>' +
        '<div class="basics-heading">' + item.heading + '</div>' +
        '<div class="basics-detail">' + item.detail + '</div>';
      grid.appendChild(div);
    });
  }

  // ── ADDENDUM-SPECIFIC RENDERS ────────────────────────────────

  function renderArrivalChecklist(data) {
    var container = el('arrival-steps');
    if (!container || !data) return;
    var html = '';
    (data.steps || []).forEach(function(s) {
      html += '<div class="step-item"><div class="step-num">' + s.step + '</div><div>' +
        '<div class="step-heading">' + s.heading + '</div>' +
        '<div class="step-detail">' + s.detail + '</div></div></div>';
    });
    container.innerHTML = html;
  }

  function renderIssueRouting(data) {
    var container = el('routing-matrix');
    if (!container || !data) return;
    var html = '<div class="routing-table-wrap"><table class="routing-table">' +
      '<thead><tr>' +
      '<th>Issue</th><th>Description</th>' +
      '<th class="col-int">Internal FE</th>' +
      '<th class="col-int">Internal OSS</th>' +
      '<th class="col-int">Internal Craft</th>' +
      '<th class="col-cust">Customer OE</th>' +
      '<th class="col-cust">Customer SS</th>' +
      '</tr></thead><tbody>';
    (data.matrix || []).forEach(function(row) {
      html += '<tr>' +
        '<td>' + row.issue + '</td>' +
        '<td class="desc">' + row.description + '</td>' +
        '<td>' + row.internal_fe + '</td>' +
        '<td>' + row.internal_oss + '</td>' +
        '<td>' + row.internal_craft + '</td>' +
        '<td>' + row.customer_oe + '</td>' +
        '<td>' + row.customer_ss + '</td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  function renderAVInstructions(data) {
    var grid = el('av-grid');
    if (!grid || !data) return;
    (data.items || []).forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'av-card';
      div.innerHTML = '<div class="av-heading">' + item.heading + '</div>' +
        '<div class="av-detail">' + item.detail + '</div>';
      grid.appendChild(div);
    });
  }

  function renderPOWRA(data) {
    var intro = el('powra-intro'); if (intro && data.intro) intro.textContent = data.intro;
    var stepsEl = el('powra-steps');
    if (stepsEl && data.steps) {
      var letters = ['P','O','W','R','A'];
      var words = ['PLAN','OBSERVE','WORK SAFELY','REVIEW','ASSESS'];
      stepsEl.innerHTML = data.steps.map(function(s, i) {
        return '<div class="powra-step">' +
          '<div class="powra-letter">' + (letters[i] || (i+1)) + '</div>' +
          '<div class="powra-word">' + (words[i] || '') + '</div>' +
          '<div class="powra-detail">' + s + '</div></div>';
      }).join('');
    }
    var noteEl = el('powra-note'); if (noteEl && data.note) noteEl.textContent = data.note;
  }

  function renderChecklist(data) {
    var container = el('checklist-grid');
    var subtitle = el('checklist-subtitle');
    if (!container || !data) return;
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;
    container.innerHTML = (data.items || []).map(function(group) {
      return '<div>' +
        '<div class="checklist-group-title">' + group.category + '</div>' +
        '<div class="checklist-items">' +
        (group.checks || []).map(function(c) {
          return '<div class="checklist-item"><div class="checklist-box"></div>' + c + '</div>';
        }).join('') +
        '</div></div>';
    }).join('');
  }


  function renderResources(data) {
    var container = el('resources-container');
    if (!container || !data) return;
    var html = '';
    (data.groups || []).forEach(function(group) {
      html += '<div class="resource-group">';
      html += '<div class="resource-group-label">' + group.groupLabel + '</div>';
      html += '<div class="resource-links">';
      (group.links || []).forEach(function(link) {
        html += '<a class="resource-link" href="' + link.url + '" target="_blank" rel="noopener noreferrer">';
        html += '<div class="resource-link-arrow">→</div>';
        html += '<div class="resource-link-body">';
        html += '<div class="resource-link-label">' + link.label + '</div>';
        if (link.desc) html += '<div class="resource-link-desc">' + link.desc + '</div>';
        html += '</div></a>';
      });
      html += '</div></div>';
    });
    container.innerHTML = html;
  }

  // ── BOOT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var isAddendum = window.location.pathname.indexOf('addendum') !== -1;
        var content = isAddendum ? data.addendum : data.guidebook;

        renderHero(content);
        renderActions(content.actions);
        renderMap((data.guidebook || data).campusMap);
        renderContacts(content.contacts);
        renderIncidentReporting(
          isAddendum ? data.guidebook.incidentReporting : data.guidebook.incidentReporting
        );

        if (!isAddendum) {
          renderLSR(content.lifeSavingRules);
          renderSiteRules(content.siteRules);
          renderSurvivalBasics(content.survivalBasics);
          renderResources(content.resources);
          var fm = el('footer-meta');
          if (fm && data.guidebook.meta) {
            fm.textContent = 'Version ' + data.guidebook.meta.version + ' · Updated ' + data.guidebook.meta.updated;
          }
        } else {
          renderArrivalChecklist(content.arrivalChecklist);
          renderIssueRouting(content.issueRouting);
          renderAVInstructions(content.avInstructions);
          renderPOWRA(content.powra);
          renderChecklist(content.classroomChecklist);
          renderResources(content.resources);
        }

        // Hide loading, show content
        var loading = el('loading-screen');
        var page = el('page-content');
        if (loading) loading.style.display = 'none';
        if (page) page.style.display = 'block';
      })
      .catch(function(err) {
        console.error('Failed to load data.json:', err);
        var loading = el('loading-screen');
        if (loading) loading.innerHTML =
          '<div class="loading-inner"><div class="loading-logo" style="color:#e63946">Error</div>' +
          '<div class="loading-title" style="font-size:14px;color:rgba(255,255,255,0.6)">' + err.message + '</div></div>';
      });
  });

})();
