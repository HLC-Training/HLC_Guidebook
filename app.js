document.addEventListener('DOMContentLoaded', () => {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                            const isAddendum = window.location.pathname.includes('addendum.html');
                            const content = isAddendum ? data.addendum : data.guidebook;

                              // Hero
                              document.getElementById('welcome-title').innerText = content.hero_title;
                            document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;

                              // Action buttons
                              const actionGrid = document.getElementById('action-panel');
                            content.actions.forEach(act => {
                                                const btn = document.createElement('a');
                                                btn.className = 'btn';
                                                btn.href = act.url;
                                                btn.target = '_blank';
                                                btn.rel = 'noopener noreferrer';
                                                btn.innerText = act.label;
                                                actionGrid.appendChild(btn);
                            });

                              // List section
                              document.getElementById('list-title').innerText = content.list_title;
                            const listContainer = document.getElementById('list-container');
                            content.items.forEach(item => {
                                                const li = document.createElement('li');
                                                li.innerText = item;
                                                listContainer.appendChild(li);
                            });

                              // Campus Map - renders on both pages
                              const mapSection = document.getElementById('map-section');
                            if (mapSection && data.map) {
                                                mapSection.style.display = 'block';
                                                document.getElementById('map-title').innerText = data.map.title;
                                                const mapContainer = document.getElementById('map-container');
                                                const iframe = document.createElement('iframe');
                                                iframe.src = data.map.embed_url;
                                                iframe.allowFullscreen = true;
                                                iframe.loading = 'lazy';
                                                iframe.referrerPolicy = 'no-referrer-when-downgrade';
                                                mapContainer.appendChild(iframe);

                                // Legend
                                if (data.map.legend && data.map.legend.length) {
                                                        const legend = document.getElementById('map-legend');
                                                        data.map.legend.forEach(item => {
                                                                                    const el = document.createElement('div');
                                                                                    el.className = 'map-legend-item';
                                                                                    el.innerHTML = `<span class="map-legend-dot" style="background:${item.color}"></span>${item.label}`;
                                                                                    legend.appendChild(el);
                                                        });
                                }
                            }

                              // Guidebook-only sections
                              if (!isAddendum) {
                                                  document.getElementById('safety-section').style.display = 'block';
                                                  document.getElementById('contact-section').style.display = 'block';
                                                  document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
                                                  document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;

                                // Life Saving Rules
                                data.guidebook.safety_content.rules.forEach(r => {
                                                        const a = document.createElement('a');
                                                        a.className = 'card rule-card';
                                                        a.href = data.guidebook.safety_content.link;
                                                        a.target = '_blank';
                                                        a.rel = 'noopener noreferrer';
                                                        a.innerHTML = `<img src="images/${r.icon}" alt="${r.label}"><p>${r.label}</p>`;
                                                        document.getElementById('rules-grid').appendChild(a);
                                });

                                // Contact Directory - now includes email (bug fix)
                                data.guidebook.directory.forEach(p => {
                                                        const div = document.createElement('div');
                                                        div.className = 'card contact-card';
                                                        div.innerHTML = `
                                                                                <h4>${p.dept}</h4>
                                                                                                        <p>${p.name}</p>
                                                                                                                                ${p.phone ? `<a class="contact-btn" href="tel:${p.phone}">${p.phone}</a>` : ''}
                                                                                                                                                        ${p.email ? `<a class="contact-btn" href="mailto:${p.email}">${p.email}</a>` : ''}
                                                                                                                                                                            `;
                                                        document.getElementById('contact-list').appendChild(div);
                                });
                              }
            })
            .catch(err => console.error('Failed to load data.json:', err));
});
