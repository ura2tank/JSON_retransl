const fs = require('fs');
const path = require('path');
const https = require('https');

async function showAll() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Все продукты:', data);

        const imgDir = path.join(__dirname, 'src', 'img');
        // if (!fs.existsSync(imgDir)) {
        //     fs.mkdirSync(imgDir, { recursive: true });
        // }
        

        data.products.forEach(product => {
            const fileName = product.title+'.webp';
            product.images.forEach(imageUrl => {

                const filePath = path.join(imgDir, fileName);

                https.get(imageUrl, (response) => {
                    const fileStream = fs.createWriteStream(filePath);
                    response.pipe(fileStream);
                    
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`Изображение сохранено: ${fileName}`);
                    });
                }).on('error', (err) => {
                    console.error(`Ошибка при скачивании ${fileName}:`, err);
                });
            });
        });
        

        return {
            products: data.products,
            isClear: 1
        };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    showAll
};