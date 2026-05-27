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

        // This now builds an <ul> and <li> list
        const rulesList = document.getElementById('rules-list');
        const ul = document.createElement('ul');
        data.rules.forEach(rule => {
            const li = document.createElement('li');
            li.innerText = rule;
            ul.appendChild(li);
        });
        rulesList.appendChild(ul);
    });
// Render Safety Features
const safetySection = document.getElementById('safety-features');
const ruleGrid = document.createElement('div');
ruleGrid.className = 'action-grid';
data.safety_features.rules.forEach(rule => {
    const span = document.createElement('span');
    span.className = 'card';
    span.innerText = rule;
    ruleGrid.appendChild(span);
});
safetySection.appendChild(ruleGrid);
