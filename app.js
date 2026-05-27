fetch('data.json')
    .then(res => res.json())
    .then(data => {
        const isAddendum = window.location.pathname.includes('addendum.html');
        const content = isAddendum ? data.addendum : data.guidebook;

        document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;
        document.getElementById('welcome-title').innerText = content.hero_title;

        const actionGrid = document.getElementById('action-panel');
        content.actions.forEach(act => {
            const btn = document.createElement('a');
            btn.className = 'btn'; btn.href = act.url; btn.innerText = act.label;
            actionGrid.appendChild(btn);
        });

        const listContainer = document.getElementById('list-container');
        const items = isAddendum ? content.checklist : content.rules;
        items.forEach(item => {
            const li = document.createElement('li'); li.innerText = item;
            listContainer.appendChild(li);
        });
    });
