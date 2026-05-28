// ── EXPANDABLE CONTACTS ──────────────────────────────────────
const CONTACTS_DEFAULT_VISIBLE = 7;

function toggleContacts() {
  var hiddenRows = document.querySelectorAll('.contact-row-hidden');
  var btn = document.getElementById('contacts-toggle-btn');
  var isExpanded = btn.getAttribute('aria-expanded') === 'true';
  var contacts = (window.__siteData && window.__siteData.siteRules && window.__siteData.siteRules.nonEmergencyContacts) || [];
  var remaining = contacts.length - CONTACTS_DEFAULT_VISIBLE;
  hiddenRows.forEach(function(row) { row.style.display = isExpanded ? 'none' : 'table-row'; });
  btn.setAttribute('aria-expanded', String(!isExpanded));
  btn.textContent = isExpanded ? '\u25BC Show All Contacts (' + remaining + ' more)' : '\u25B2 Hide Extended Contacts';
}

// ── PLL Directory Renderer ──────────────────────────────────────
function renderPLLDirectory(data) {
  const section = data.pllDirectory;
  if (!section) return;
  const container = document.getElementById('pll-directory');
  if (!container) return;
  let html = '<div class="section-header"><h2>' + section.sectionTitle + '</h2><p class="section-subtitle">' + section.sectionSubtitle + '</p></div><div class="pll-card-grid">';
  section.contacts.forEach(function(pll) {
    html += '<div class="pll-card"><div class="pll-card-header"><span class="pll-product-line">' + pll.productLine + '</span></div><div class="pll-card-body"><p class="pll-name">' + pll.name + '</p><a href="mailto:' + pll.email + '" class="pll-contact-link">' + pll.email + '</a><a href="tel:' + pll.phone + '" class="pll-contact-link">' + pll.phone + '</a></div></div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

// ── Site Rules Renderer ──────────────────────────────────────
function renderSiteRules(sr) {
  const container = document.getElementById('site-rules');
  if (!container || !sr) return;
  let html = '<div class="section-block"><h2 class="section-title">' + sr.title + '</h2><p class="section-intro">' + sr.intro + '</p><div class="site-rules-accordion">';
  sr.sections.forEach(function(section, index) {
    const isOpen = index === 0 ? ' open' : '';
    html += '<div class="rule-section' + isOpen + '" id="rule-' + section.id + '">';
    html += '<button class="rule-section-header" onclick="toggleRuleSection(\'' + 'rule-' + section.id + '\')">';
    html += '<span class="rule-icon">' + section.icon + '</span>';
    html += '<span class="rule-heading">' + section.heading + '</span>';
    html += '<span class="rule-chevron">\u25BE</span></button>';
    html += '<ul class="rule-list">';
    section.rules.forEach(function(r) { html += '<li>' + r + '</li>'; });
    html += '</ul></div>';
  });
  html += '</div></div>';
  container.innerHTML = html;
}

function toggleRuleSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
}

// ── Incident Reporting Renderer ──────────────────────────────────────
function renderIncidentReporting(content) {
  const container = document.getElementById('incident-reporting');
  if (!container || !content) return;

  const emergencyContacts = content.emergency.contacts
    .map(function(c) { return '<a href="tel:' + c.number + '" class="ir-contact-btn emergency-btn"><span class="ir-contact-label">' + c.label + '</span><span class="ir-contact-number">' + c.number + '</span></a>'; })
    .join('');

  const nonEmergencyContacts = content.nonEmergency.contacts
    .map(function(c) { return '<a href="tel:' + c.number + '" class="ir-contact-btn non-emergency-btn"><span class="ir-contact-label">' + c.label + '</span><span class="ir-contact-number">' + c.number + '</span></a>'; })
    .join('');

  const steps = content.steps
    .map(function(s) { return '<div class="ir-step"><div class="ir-step-number">' + s.step + '</div><div class="ir-step-content"><strong>' + s.heading + '</strong><p>' + s.detail + '</p></div></div>'; })
    .join('');

  const scopeItems = content.reportingScope
    .map(function(item) { return '<li>' + item + '</li>'; })
    .join('');

  let html = '' +
    '<div class="section-block ir-module">' +
      '<h2 class="section-title">' + content.title + '</h2>' +
      '<p class="ir-subtitle">' + content.subtitle + '</p>' +
      '<div class="ir-contact-grid">' +
        '<div class="ir-contact-card ir-emergency-card">' +
          '<div class="ir-card-label">' + content.emergency.label + '</div>' +
          '<p class="ir-card-instruction">' + content.emergency.instruction + '</p>' +
          '<div class="ir-contact-btns">' + emergencyContacts + '</div>' +
          '<p class="ir-card-note">' + content.emergency.note + '</p>' +
        '</div>' +
        '<div class="ir-contact-card ir-non-emergency-card">' +
          '<div class="ir-card-label">' + content.nonEmergency.label + '</div>' +
          '<p class="ir-card-instruction">' + content.nonEmergency.instruction + '</p>' +
          '<div class="ir-contact-btns">' + nonEmergencyContacts + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="ir-steps-block">' +
        '<h3 class="ir-steps-heading">RESPONSE FLOW</h3>' +
        '<div class="ir-steps">' + steps + '</div>' +
      '</div>' +
      '<div class="ir-scope-block">' +
        '<h3 class="ir-scope-heading">WHAT TO REPORT</h3>' +
        '<ul class="ir-scope-list">' + scopeItems + '</ul>' +
      '</div>' +
      '<p class="ir-osha-note">' + content.osha + '</p>' +
      '<div class="ir-action-row">' +
        '<a href="' + content.actionButton.url + '" target="_blank" rel="noopener noreferrer" class="ir-action-btn">' + content.actionButton.label + '</a>' +
      '</div>' +
    '</div>';

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('data.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      window.__siteData = data;
      var isAddendum = window.location.pathname.includes('addendum.html');
      var content = isAddendum ? data.addendum : data.guidebook;

      // Hero
      document.getElementById('welcome-title').innerText = content.hero_title;
      document.querySelector('.hero').style.backgroundImage = "url('" + content.hero_image + "')";

      // Action buttons
      var actionGrid = document.getElementById('action-panel');
      content.actions.forEach(function(act) {
        var btn = document.createElement('a');
        btn.className = 'btn'; btn.href = act.url; btn.target = '_blank';
        btn.rel = 'noopener noreferrer'; btn.innerText = act.label;
        actionGrid.appendChild(btn);
      });

      // List section
      document.getElementById('list-title').innerText = content.list_title;
      var listContainer = document.getElementById('list-container');
      content.items.forEach(function(item) {
        var li = document.createElement('li'); li.innerText = item;
        listContainer.appendChild(li);
      });

      // -- CAMPUS MAP (both pages) --
      var campusMapContainer = document.getElementById('campus-map-container');
      if (campusMapContainer) {
        fetch('campus-map-module.html')
          .then(function(r) { return r.text(); })
          .then(function(html) { campusMapContainer.innerHTML = html; })
          .catch(function(err) { console.warn('Campus map module failed to load:', err); });
      }

      // Google Maps iframe
      if (data.map) {
        var mapSection = document.getElementById('map-section');
        if (mapSection) mapSection.style.display = 'block';
        var mapTitle = document.getElementById('map-title');
        if (mapTitle) mapTitle.textContent = data.map.title || 'CAMPUS MAP';
        var mapContainer = document.getElementById('map-container');
        if (mapContainer && data.map.embed_url) {
          var iframe = document.createElement('iframe');
          iframe.src = data.map.embed_url; iframe.width = '100%'; iframe.height = '450';
          iframe.style.border = '0'; iframe.allowFullscreen = true; iframe.loading = 'lazy';
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          mapContainer.appendChild(iframe);
        }
        var mapNote = document.getElementById('map-note');
        if (mapNote && data.map.note) {
          mapNote.textContent = data.map.note;
        }
      }

      // -- SITE RULES extras: emergency banner, contacts table, signature (from content.siteRules, both pages) --
      if (content && content.siteRules) {
        var sr = content.siteRules;
        var rulesTitle = document.getElementById('site-rules-title');
        if (rulesTitle) rulesTitle.textContent = sr.title || 'HLC SITE RULES';
        var callout = document.getElementById('emergency-callout');
        if (callout && sr.emergency) {
          callout.innerHTML = '<div class="emergency-callout"><div class="emergency-primary">' + sr.emergency.primary + '</div><div class="emergency-label">' + sr.emergency.title + '</div><div class="emergency-instruction">' + sr.emergency.instruction + '</div></div>';
        }
        var contacts = sr.nonEmergencyContacts || [];
        var contactsTitle = document.getElementById('rules-contacts-title');
        if (contactsTitle) contactsTitle.textContent = sr.contactsTitle || 'NON-EMERGENCY CONTACTS';
        var contactsContainer = document.getElementById('rules-contacts');
        if (contactsContainer && contacts.length) {
          var tableRows = contacts.map(function(c, i) {
            var phoneLink = c.phone ? '<a href="tel:' + c.phone.replace(/\s+/g,'') + '" rel="noopener noreferrer">' + c.phone + '</a>' : '\u2014';
            var emailLink = c.email ? '<a href="mailto:' + c.email + '">' + c.email + '</a>' : '\u2014';
            var hiddenClass = i >= CONTACTS_DEFAULT_VISIBLE ? 'contact-row-hidden' : '';
            return '<tr class="contact-row ' + hiddenClass + '"><td>' + c.role + '</td><td>' + (c.name || '\u2014') + '</td><td>' + phoneLink + '</td><td>' + emailLink + '</td></tr>';
          }).join('');
          var tableEl = document.getElementById('rules-contacts-table');
          if (tableEl) tableEl.innerHTML = '<thead><tr><th>Role</th><th>Name</th><th>Phone</th><th>Email</th></tr></thead><tbody>' + tableRows + '</tbody>';
          if (contacts.length > CONTACTS_DEFAULT_VISIBLE) {
            var remaining = contacts.length - CONTACTS_DEFAULT_VISIBLE;
            var toggleDiv = document.createElement('div');
            toggleDiv.innerHTML = '<button id="contacts-toggle-btn" class="contacts-toggle-btn" onclick="toggleContacts()" aria-expanded="false">\u25BC Show All Contacts (' + remaining + ' more)</button>';
            contactsContainer.appendChild(toggleDiv);
          }
        }
        var sigBar = document.getElementById('rules-signature');
        if (sigBar && sr.signature && sr.signature.enabled) {
          sigBar.innerHTML = '<div class="rules-signature-bar">' + sr.signature.label + '</div>';
        }
      }

      // -- SECTION RENDERERS (both pages) --
      renderPLLDirectory(content);
      renderSiteRules(content.siteRules);
      renderIncidentReporting(content.incidentReporting);

      // -- GUIDEBOOK-ONLY SECTIONS --
      if (!isAddendum) {
        document.getElementById('safety-section').style.display = 'block';
        document.getElementById('contact-section').style.display = 'block';
        document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
        document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;
        data.guidebook.safety_content.rules.forEach(function(r) {
          var a = document.createElement('a'); a.className = 'card rule-card';
          a.href = data.guidebook.safety_content.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.innerHTML = '<img src="images/' + r.icon + '" alt="' + r.label + '"><p>' + r.label + '</p>';
          document.getElementById('rules-grid').appendChild(a);
        });
        data.guidebook.directory.forEach(function(p) {
          var div = document.createElement('div'); div.className = 'card contact-card';
          div.innerHTML = '<h4>' + p.dept + '</h4><p><strong>' + p.name + '</strong></p>' + (p.phone ? '<a class="contact-btn" href="tel:' + p.phone + '" rel="noopener noreferrer">' + p.phone + '</a>' : '') + (p.email ? '<a class="contact-btn" href="mailto:' + p.email + '">' + p.email + '</a>' : '');
          document.getElementById('contact-list').appendChild(div);
        });
      }
    })
    .catch(function(err) { console.error('Failed to load data.json:', err); });
});
