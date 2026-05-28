// -- EXPANDABLE CONTACTS --
const CONTACTS_DEFAULT_VISIBLE = 7;

function toggleContacts() {
    const hiddenRows = document.querySelectorAll('.contact-row-hidden');
    const btn = document.getElementById('contacts-toggle-btn');
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const contacts = (window.__siteData && window.__siteData.siteRules && window.__siteData.siteRules.nonEmergencyContacts) || [];
    const remaining = contacts.length - CONTACTS_DEFAULT_VISIBLE;
    hiddenRows.forEach(row => { row.style.display = isExpanded ? 'none' : 'table-row'; });
    btn.setAttribute('aria-expanded', String(!isExpanded));
    btn.textContent = isExpanded ? '▼ Show All Contacts (' + remaining + ' more)' : '▲ Hide Extended Contacts';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            window.__siteData = data;
            const isAddendum = window.location.pathname.includes('addendum.html');
            const content = isAddendum ? data.addendum : data.guidebook;
            document.getElementById('welcome-title').innerText = content.hero_title;
            document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;
            const actionGrid = document.getElementById('action-panel');
            content.actions.forEach(act => {
                const btn = document.createElement('a');
                btn.className = 'btn'; btn.href = act.url; btn.target = '_blank';
                btn.rel = 'noopener noreferrer'; btn.innerText = act.label;
                actionGrid.appendChild(btn);
            });
            document.getElementById('list-title').innerText = content.list_title;
            const listContainer = document.getElementById('list-container');
            content.items.forEach(item => {
                const li = document.createElement('li'); li.innerText = item;
                listContainer.appendChild(li);
            });
            if (data.map) {
                const mapSection = document.getElementById('map-section');
                if (mapSection) mapSection.style.display = 'block';
                const mapTitle = document.getElementById('map-title');
                if (mapTitle) mapTitle.textContent = data.map.title || 'CAMPUS MAP';
                const mapContainer = document.getElementById('map-container');
                if (mapContainer && data.map.embed_url) {
                    const iframe = document.createElement('iframe');
                    iframe.src = data.map.embed_url; iframe.width = '100%'; iframe.height = '450';
                    iframe.style.border = '0'; iframe.allowFullscreen = true; iframe.loading = 'lazy';
                    iframe.referrerPolicy = 'no-referrer-when-downgrade';
                    mapContainer.appendChild(iframe);
                }
                if (data.map.legend && data.map.legend.length) {
                    const legend = document.getElementById('map-legend');
                    data.map.legend.forEach(item => {
                        const el = document.createElement('div'); el.className = 'map-legend-item';
                        el.innerHTML = `<span class="map-legend-dot" style="background:${item.color}"></span>${item.label}`;
                        legend.appendChild(el);
                    });
                }
            }
            if (data.siteRules) {
                const sr = data.siteRules;
                const rulesTitle = document.getElementById('site-rules-title');
                if (rulesTitle) rulesTitle.textContent = sr.title || 'HLC SITE RULES';
                const callout = document.getElementById('emergency-callout');
                if (callout && sr.emergency) {
                    callout.innerHTML = `<div class="emergency-callout"><div class="emergency-primary">${sr.emergency.primary}</div><div class="emergency-label">${sr.emergency.title}</div><div class="emergency-instruction">${sr.emergency.instruction}</div></div>`;
                }
                const rulesGrid = document.getElementById('site-rules-grid');
                if (rulesGrid && sr.rules) {
                    rulesGrid.innerHTML = sr.rules.map(rule => `<div class="site-rule-card"><div class="site-rule-icon">${rule.icon}</div><div class="site-rule-body"><div class="site-rule-category">${rule.category}</div><ul class="site-rule-items">${rule.items.map(item => '<li>' + item + '</li>').join('')}</ul></div></div>`).join('');
                }
                const contacts = sr.nonEmergencyContacts || [];
                const contactsTitle = document.getElementById('rules-contacts-title');
                if (contactsTitle) contactsTitle.textContent = sr.contactsTitle || 'NON-EMERGENCY CONTACTS';
                const contactsContainer = document.getElementById('rules-contacts');
                if (contactsContainer && contacts.length) {
                    const tableRows = contacts.map((c, i) => {
                        const phoneLink = c.phone ? `<a href="tel:${c.phone.replace(/\s+/g,'')}" rel="noopener noreferrer">${c.phone}</a>` : '—';
                        const emailLink = c.email ? `<a href="mailto:${c.email}">${c.email}</a>` : '—';
                        const hiddenClass = i >= CONTACTS_DEFAULT_VISIBLE ? 'contact-row-hidden' : '';
                        return `<tr class="contact-row ${hiddenClass}"><td>${c.role}</td><td>${c.name || '—'}</td><td>${phoneLink}</td><td>${emailLink}</td></tr>`;
                    }).join('');
                    const tableEl = document.getElementById('rules-contacts-table');
                    if (tableEl) tableEl.innerHTML = `<thead><tr><th>Role</th><th>Name</th><th>Phone</th><th>Email</th></tr></thead><tbody>${tableRows}</tbody>`;
                    if (contacts.length > CONTACTS_DEFAULT_VISIBLE) {
                        const remaining = contacts.length - CONTACTS_DEFAULT_VISIBLE;
                        const toggleDiv = document.createElement('div');
                        toggleDiv.innerHTML = `<button id="contacts-toggle-btn" class="contacts-toggle-btn" onclick="toggleContacts()" aria-expanded="false">▼ Show All Contacts (${remaining} more)</button>`;
                        contactsContainer.appendChild(toggleDiv);
                    }
                }
                const sigBar = document.getElementById('rules-signature');
                if (sigBar && sr.signature && sr.signature.enabled) {
                    sigBar.innerHTML = `<div class="rules-signature-bar">${sr.signature.label}</div>`;
                }
            }
            if (!isAddendum) {
                document.getElementById('safety-section').style.display = 'block';
                document.getElementById('contact-section').style.display = 'block';
                document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
                document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;
                data.guidebook.safety_content.rules.forEach(r => {
                    const a = document.createElement('a'); a.className = 'card rule-card';
                    a.href = data.guidebook.safety_content.link; a.target = '_blank'; a.rel = 'noopener noreferrer';
                    a.innerHTML = `<img src="images/${r.icon}" alt="${r.label}"><p>${r.label}</p>`;
                    document.getElementById('rules-grid').appendChild(a);
                });
                data.guidebook.directory.forEach(p => {
                    const div = document.createElement('div'); div.className = 'card contact-card';
                    div.innerHTML = `<h4>${p.dept}</h4><p><strong>${p.name}</strong></p>${p.phone ? '<a class="contact-btn" href="tel:' + p.phone + '" rel="noopener noreferrer">' + p.phone + '</a>' : ''}${p.email ? '<a class="contact-btn" href="mailto:' + p.email + '">' + p.email + '</a>' : ''}`;
                    document.getElementById('contact-list').appendChild(div);
                });
            }
        })
        .catch(err => console.error('Failed to load data.json:', err));
});// -- EXPANDABLE CONTACTS --
const CONTACTS_DEFAULT_VISIBLE = 7;

function toggleContacts() {
    const hiddenRows = document.querySelectorAll('.contact-row-hidden');
    const btn = document.getElementById('contacts-toggle-btn');
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const contacts = (window.__siteData && window.__siteData.siteRules && window.__siteData.siteRules.nonEmergencyContacts) || [];
    const remaining = contacts.length - CONTACTS_DEFAULT_VISIBLE;
    hiddenRows.forEach(row => { row.style.display = isExpanded ? 'none' : 'table-row'; });
    btn.setAttribute('aria-expanded', String(!isExpanded));
    btn.textContent = isExpanded ? '▼ Show All Contacts (' + remaining + ' more)' : '▲ Hide Extended Contacts';
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            window.__siteData = data;
            const isAddendum = window.location.pathname.includes('addendum.html');
            const content = isAddendum ? data.addendum : data.guidebook;

            // Hero
            document.getElementById('welcome-title').innerText = content.hero_title;
            document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;

            // Action buttons
            const actionGrid = document.getElementById('action-panel');
            content.actions.forEach(act => {
                const btn = document.createElement('a');
                btn.className = 'btn'; btn.href = act.url; btn.target = '_blank';
                btn.rel = 'noopener noreferrer'; btn.innerText = act.label;
                actionGrid.appendChild(btn);
            });

            // List section
            document.getElementById('list-title').innerText = content.list_title;
            const listContainer = document.getElementById('list-container');
            content.items.forEach(item => {
                const li = document.createElement('li'); li.innerText = item;
                listContainer.appendChild(li);
            });

            // Campus Map module (both pages)
            if (data.map) {
                const mapSection = document.getElementById('map-section');
                if (mapSection) mapSection.style.display = 'block';
                const mapTitle = document.getElementById('map-title');
                if (mapTitle) mapTitle.textContent = data.map.title || 'CAMPUS MAP';
                const mapContainer = document.getElementById('map-container');
                if (mapContainer && data.map.embed_url) {
                    const iframe = document.createElement('iframe');
                    iframe.src = data.map.embed_url; iframe.width = '100%'; iframe.height = '450';
                    iframe.style.border = '0'; iframe.allowFullscreen = true; iframe.loading = 'lazy';
                    iframe.referrerPolicy = 'no-referrer-when-downgrade';
                    mapContainer.appendChild(iframe);
                }
                if (data.map.legend && data.map.legend.length) {
                    const legend = document.getElementById('map-legend');
                    data.map.legend.forEach(item => {
                        const el = document.createElement('div'); el.className = 'map-legend-item';
                        el.innerHTML = `<span class="map-legend-dot" style="background:${item.color}"></span>${item.label}`;
                        legend.appendChild(el);
                    });
                }
            }

            // -- SITE RULES RENDERER --
            if (data.siteRules) {
                const sr = data.siteRules;
                const rulesTitle = document.getElementById('site-rules-title');
                if (rulesTitle) rulesTitle.textContent = sr.title || 'HLC SITE RULES';

                const callout = document.getElementById('emergency-callout');
                if (callout && sr.emergency) {
