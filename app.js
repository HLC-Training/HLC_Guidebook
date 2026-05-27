fetch('data.json')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.hero').style.backgroundImage = `url('${data.hero.image}')`;
        document.getElementById('welcome-title').innerText = data.hero.title;
        
        const actionGrid = document.getElementById('actions');
        data.actions.forEach(act => {
            const btn = document.createElement('a');
            btn.className = 'btn';
            btn.href = act.url;
            btn.innerText = act.label;
            actionGrid.appendChild(btn);
        });

        const rulesList = document.getElementById('rules-list');
        data.rules.forEach(rule => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerText = rule;
            rulesList.appendChild(div);
        });
    });
