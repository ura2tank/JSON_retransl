function showCard(component) {
    return `
        <div class="container-component">
            <p class="title">${component['title']}</p>
            <p class="class">${component["category"]}</p>
            <p class="price">${component["price"]}</p>
            <p class="disc">${component["description"]}</p>
            <img class="imagesPlace" src="${component["images"][0]}" alt="${component['title']}">
        </div>
    `;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showCard
    };
}
