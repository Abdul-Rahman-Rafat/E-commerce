const menuToggle = document.querySelector(".menu-toggle i");
const navigation = document.querySelector(".navigation");

menuToggle.addEventListener("click", () => {
  navigation.classList.toggle("active");

  if (navigation.classList.contains("active")) {
    menuToggle.classList.remove("fa-bars");
    menuToggle.classList.add("fa-times");
  } else {
    menuToggle.classList.remove("fa-times");
    menuToggle.classList.add("fa-bars");
  }
});

async function FetchDummyData() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error while fetching data:", error);
  }
}

FetchDummyData().then((products) => {
  const container = document.getElementById("products");
  const searchInput = document.getElementById("searchInput");
  let selectedCategory = "all";

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-category", product.category);

    const isFav = favorites.find((item) => item.id == product.id);

    card.innerHTML = `
      <div class="icons">
        <button class="btn add-cart" 
                data-id="${product.id}"
                data-title="${product.title}"
                data-price="${product.price}"
                data-img="${product.image}">Add to cart</button>

        <i class="fa-heart fa-xl icon add-fav ${isFav ? 'fa-solid active' : 'fa-regular'}"
           data-id="${product.id}"
           data-title="${product.title}"
           data-price="${product.price}"
           data-img="${product.image}"></i>
      </div>
      
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
    `;

    container.appendChild(card);
  });

  

  document.querySelectorAll(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.dataset.id,
        title: btn.dataset.title,
        price: btn.dataset.price,
        image: btn.dataset.img,
        quantity: 1
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = cart.find(item => item.id == product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });



  document.querySelectorAll(".add-fav").forEach((icon) => {
    icon.addEventListener("click", () => {
      const product = {
        id: icon.dataset.id,
        title: icon.dataset.title,
        price: icon.dataset.price,
        image: icon.dataset.img
      };

      let favs = JSON.parse(localStorage.getItem("favorites")) || [];

      const index = favs.findIndex(item => item.id == product.id);

      if (index > -1) {

        favs.splice(index, 1);
        icon.classList.remove("fa-solid", "active");
        icon.classList.add("fa-regular");
      } else {

        favs.push(product);
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid", "active");
      }

      localStorage.setItem("favorites", JSON.stringify(favs));
    });
  });




  
  function filterProducts() {
    const term = searchInput.value.toLowerCase();

    document.querySelectorAll(".card").forEach((card) => {
      const category = card.getAttribute("data-category");
      const title = card.querySelector("h3").textContent.toLowerCase();

      const matchCategory = selectedCategory === "all" || category === selectedCategory;
      const matchSearch = title.includes(term);

      card.style.display = (matchCategory && matchSearch) ? "flex" : "none";
    });
  }

  document.querySelectorAll("#categoryFilter li").forEach((item) => {
    item.addEventListener("click", () => {
      selectedCategory = item.getAttribute("data-filter");

      document
        .querySelectorAll("#categoryFilter li")
        .forEach((li) => li.classList.remove("active"));
      item.classList.add("active");

      filterProducts();
    });
  });

  searchInput.addEventListener("input", filterProducts);
});
