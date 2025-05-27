function showOneComponent(components, place, isClear) {
    const container = document.getElementById(place);
    if (!container) {
        console.error(`Элемент с id "${place}" не найден`);
        return;
    }

    container.innerHTML = '';

    if (components && components.fromShowAll) {
        components = components.products;
    }

    const productsArray = Array.isArray(components) ? components : [components];

    productsArray.forEach(component => {
        let productCard = document.createElement('div');
        productCard.className = 'container-component';

        let titleP = document.createElement('p');
        titleP.className = 'title';
        titleP.innerText = component['title'];

        let classP = document.createElement('p');
        classP.className = 'class';
        classP.innerText = component["category"];
        
        let priceP = document.createElement('p');
        priceP.className = "price";
        priceP.innerText = component["price"];

        

        let images = document.createElement('img');
        images.className = "imagesPlace";
        images.src = component["images"];

        
        productCard.appendChild(titleP);
        productCard.appendChild(classP);
        productCard.appendChild(priceP);
        productCard.appendChild(images);

       
        let aComp = document.createElement('a')
        aComp.href = `/api/card?id=${component["id"]}`;

        aComp.appendChild(productCard);
        container.appendChild(aComp);
        // container.appendChild(productCard);
    });
}

function showMultComponent(components, place, isClear) {
    const container = document.getElementById(place);
    if (!container) {
        console.error(`Элемент с id "${place}" не найден`);
        return;
    }
    container.innerHTML = '';


    const productsArray = Array.isArray(components) ? components : [components];

    productsArray.forEach(component => {
        let productCard = document.createElement('div');
        productCard.className = 'container-component';

        let titleP = document.createElement('p');
        titleP.className = 'title';
        titleP.innerText = component['title'];

        let classP = document.createElement('p');
        classP.className = 'class';
        classP.innerText = component["category"];
        
        let priceP = document.createElement('p');
        priceP.className = "price";
        priceP.innerText = component["price"];

        

        let images = document.createElement('img');
        images.className = "imagesPlace";
        images.src = component["images"];

        
        productCard.appendChild(titleP);
        productCard.appendChild(classP);
        productCard.appendChild(priceP);
        productCard.appendChild(images);

        let aComp = document.createElement('a')
        aComp.href = `/api/card?id=${component["id"]}`;

        aComp.appendChild(productCard);
        container.appendChild(aComp);
         // container.appendChild(productCard);
    });
}

async function searchProducts(query) {
    try {
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: query })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Результаты поиска:', data);

        showOneComponent(data.products, 'output-all');
    } catch (error) {
        const outputContainer = document.getElementById('output-all');
        if (outputContainer) {
            outputContainer.innerHTML = `<div class="error">Ошибка при поиске: ${error.message}</div>`;
        }
    }
}

async function loadAllProducts() {
    try {
        const response = await fetch('/api/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showMultComponent(data.products, 'output-all', data.isClear);
    } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        document.getElementById('output-all').innerHTML = 'Ошибка при загрузке продуктов';
    }
}

// кнопка поиска
document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.querySelector('button[name="submitButton"]');
    const textarea = document.getElementById('inputTextarea');

    if (submitButton && textarea) {
        submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const searchQuery = textarea.value.trim();
            if (searchQuery) {
                await searchProducts(searchQuery);
            }
        });
    }

    loadAllProducts();
});