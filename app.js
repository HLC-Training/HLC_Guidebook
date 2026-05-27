fetch('data.json')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.hero').style.backgroundImage = `url('${data.hero.image}')`;
        document.getElementById('welcome-title').innerText = data.hero.title;
        const list = document.getElementById('rules-list');
        data.rules.forEach(rule => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerText = rule;
            list.appendChild(div);
        });
    });
