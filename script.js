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
    card.setAttribute("data-category",product.category) // for filter

    card.innerHTML = `
        <div class="icons">
        <i class="fa-solid fa-cart-shopping fa-xl  icon"></i>
        <i class="fa-regular fa-heart fa-xl  icon"></i>
        </div>
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        
    `;

    container.appendChild(card);
    });


document.querySelectorAll("#categoryFilter li").forEach(item => {
  item.addEventListener("click", () => {
    const selected = item.getAttribute("data-filter");

    document.querySelectorAll("#categoryFilter li").forEach(li => li.classList.remove("active"));
    item.classList.add("active");

    document.querySelectorAll(".card").forEach(card => {
      const category = card.getAttribute("data-category");

      if (selected === "all" || category === selected) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});
  });












