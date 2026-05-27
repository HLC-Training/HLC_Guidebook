fetch('data.json')
    .then(res => res.json())
    .then(data => {
        const isAddendum = window.location.pathname.includes('addendum.html');
        const content = isAddendum ? data.addendum : data.guidebook;

        document.getElementById('welcome-title').innerText = content.hero_title;
        document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;

        const actionGrid = document.getElementById('action-panel');
        content.actions.forEach(act => {
            const btn = document.createElement('a');
            btn.className = 'btn'; btn.href = act.url; btn.target = "_blank";
            btn.innerText = act.label;
            actionGrid.appendChild(btn);
        });

        document.getElementById('list-title').innerText = content.list_title;
        const listContainer = document.getElementById('list-container');
        content.items.forEach(item => {
            const li = document.createElement('li'); li.innerText = item;
            listContainer.appendChild(li);
        });

        if (!isAddendum) {
            document.getElementById('safety-section').style.display = 'block';
            document.getElementById('contact-section').style.display = 'block';
            document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
            document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;
            
            data.guidebook.safety_content.rules.forEach(r => {
                const a = document.createElement('a'); a.className = 'card rule-card';
                a.href = data.guidebook.safety_content.link; a.target = "_blank";
                a.innerHTML = `<img src="images/${r.icon}" style="width:50px;height:50px;"><p>${r.label}</p>`;
                document.getElementById('rules-grid').appendChild(a);
            });

            data.guidebook.directory.forEach(p => {
                const div = document.createElement('div'); div.className = 'card';
                div.innerHTML = `<strong>${p.dept}</strong><br>${p.name}<br><a href="tel:${p.phone}">${p.phone}</a>`;
                document.getElementById('contact-list').appendChild(div);
            });
        }
    });
