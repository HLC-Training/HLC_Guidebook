fetch('data.json')
    .then(res => res.json())
    .then(data => {
        const isAddendum = window.location.pathname.includes('addendum.html');
        const content = isAddendum ? data.addendum : data.guidebook;

        // Set Title and Hero
        document.getElementById('welcome-title').innerText = content.hero_title;
        document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;

        // Render Action Buttons
        const actionGrid = document.getElementById('action-panel');
        content.actions.forEach(act => {
            const btn = document.createElement('a');
            btn.className = 'btn'; 
            btn.href = act.url; 
            btn.target = "_blank";
            btn.innerText = act.label;
            actionGrid.appendChild(btn);
        });

        // Set List Title
        document.getElementById('list-title').innerText = content.list_title;

        // Render List Items
        const listContainer = document.getElementById('list-container');
        content.items.forEach(item => {
            const li = document.createElement('li'); 
            li.innerText = item;
            listContainer.appendChild(li);
        });
    });
