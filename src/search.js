async function search(input) {
    try {
        const response = await fetch(`https://dummyjson.com/products/search?q=${input}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Результаты поиска:', data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    search
};
