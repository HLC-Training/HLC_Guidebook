document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate Welcome
            document.getElementById('welcome-title').innerText = data.welcome.title;
            document.getElementById('welcome-hero').style.backgroundImage = `url(${data.welcome.hero_img})`;
            
            // Populate Site Rules
            const rulesList = document.getElementById('rules-list');
            data.site_rules.forEach(rule => {
                const li = document.createElement('li');
                li.innerText = rule;
                rulesList.appendChild(li);
            });
        });
});