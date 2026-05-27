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
            document.getElementById('campus-section').style.display = 'block';
            document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
            document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;
            const rulesGrid = document.getElementById('rules-grid');
            data.guidebook.safety_content.rules.forEach(r => {
                const div = document.createElement('div'); div.className = 'card'; div.innerText = r;
                rulesGrid.appendChild(div);
            });
            const campusList = document.getElementById('campus-list');
            data.guidebook.campus_info.forEach(item => {
                const div = document.createElement('div'); div.className = 'card';
                div.innerHTML = `<strong>${item.label}</strong><br>${item.value}`;
                campusList.appendChild(div);
            });
        }
    });
