fetch('data.json')
    .then(res => res.json())
    .then(data => {
        // Logic to detect page
        const isAddendum = window.location.pathname.includes('addendum.html');
        const content = isAddendum ? data.addendum : data.guidebook;

        // Apply Hero Title and Image
        document.getElementById('welcome-title').innerText = content.hero_title;
        document.querySelector('.hero').style.backgroundImage = `url('${content.hero_image}')`;

        // Load Actions or Rules based on page
        const container = document.getElementById('rules-list');
        const items = isAddendum ? content.checklist : content.rules;
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            container.appendChild(li);
        });
    });
