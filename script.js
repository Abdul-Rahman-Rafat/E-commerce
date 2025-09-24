async function FetchDummyData() {
    try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    return data;
    } catch (error) {
    console.error('Error while fetching data:', error);
    }
}

FetchDummyData().then(products => {
    const container = document.getElementById("products");

    products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
    `;

    container.appendChild(card);
    });
});








