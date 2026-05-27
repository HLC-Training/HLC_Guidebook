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
        actionGrid.innerHTML = ''; // Clear
        content.actions.forEach(act => {
            const btn = document.createElement('a');
            btn.className = 'btn'; btn.href = act.url; btn.target = "_blank";
            btn.innerText = act.label;
            actionGrid.appendChild(btn);
        });

        // Render List
        document.getElementById('list-title').innerText = content.list_title;
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = ''; // Clear
        content.items.forEach(item => {
            const li = document.createElement('li'); 
            li.innerText = item;
            listContainer.appendChild(li);
        });

        // Render Safety Rules (The fix for [object Object])
        if (!isAddendum) {
            document.getElementById('safety-section').style.display = 'block';
            document.getElementById('safety-title').innerText = data.guidebook.safety_content.title;
            document.getElementById('safety-text').innerText = data.guidebook.safety_content.text;
            
            const rulesGrid = document.getElementById('rules-grid');
            rulesGrid.innerHTML = ''; // Clear
            
            data.guidebook.safety_content.rules.forEach(r => {
                const a = document.createElement('a');
                a.className = 'card rule-card';
                a.href = data.guidebook.safety_content.link;
                a.target = "_blank";
                // Fixed the object access here:
                a.innerHTML = `<img src="images/${r.icon}" style="width:50px; height:50px;"> <p>${r.label}</p>`;
                rulesGrid.appendChild(a);
            });
        }
    });
