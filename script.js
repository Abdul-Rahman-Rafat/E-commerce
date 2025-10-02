//responsive nav 
const menuToggle = document.querySelector(".menu-toggle i");
const navigation = document.querySelector(".navigation");

menuToggle.addEventListener("click", () => {
navigation.classList.toggle("active");

menuToggle.classList.toggle("fa-times");
menuToggle.classList.toggle("fa-bars");

});



//fetch data
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



// fav

 function renderFavorites() {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const container = document.getElementById("favoritesList");
      container.innerHTML = "";


      if (favorites.length === 0) {
container.innerHTML = `
    <p>You have no favorite products yet.</p>
    <a href="index.html">
      <button class="back-btn">Back to Shop</button>
    </a>
  `;
          return;
      }

      
      favorites.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; height:7em;">
            <img src="${item.image}" alt="${item.title}" />
            <div>
              <h3>${item.title}</h3>
              <p>Price: $${item.price}</p>
            </div>
          </div>
          <button onclick="removeFavorite(${index})">🗑️ Remove</button>
        `;
        container.appendChild(div);
      });
    }

    function removeFavorite(index) {
      let favs = JSON.parse(localStorage.getItem("favorites")) || [];
      favs.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favs));
      renderFavorites();
    }

    
// /fav



    // cart

    function renderCart() {
      const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
      const container = document.getElementById("cartItems");
      container.innerHTML = "";

      if (cartItems.length === 0) {
  container.innerHTML = `
    <p>Your cart is empty.</p>
    <a href="index.html">
      <button class="back-btn">Back to Shop</button>
    </a>
  `;
  document.getElementById("total_cart").innerHTML = "Total price: 0$";
  return;
}

      cartItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image}" alt="${item.title}" />
            <div>
              <h3>${item.title}</h3>
              <p>Price: $${item.price}</p>
            </div>
          </div>
          <div class="controls">
            

            <button onclick="decrease(${index})">-</button>
            <span>${item.quantity}</span>
            <button onclick="increase(${index})">+</button>
            <button onclick="removeItem(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(div);
      });

  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });

 document.getElementById("total_cart").innerHTML = `
  <p><strong>Total price:</strong> $${total.toFixed(2)}</p>
  <a href="checkout.html">
    <button class="checkout-btn">Proceed to Checkout</button>
  </a>
`;
}
    

    function increase(index) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity += 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    function decrease(index) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        cart.splice(index, 1); 
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    function removeItem(index) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }

    // /cart


//checkout 
function renderCheckout() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const container = document.getElementById("checkoutItems");
      const totalDiv = document.getElementById("checkoutTotal");
      container.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalDiv.innerHTML = "";
        document.querySelector(".confirm-btn").style.display = "none";
        return;
      }

      cart.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("checkout-item");
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.title}">
          <div class="checkout-item-info">
            <h4>${item.title}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price}</p>
          </div>
        `;
        container.appendChild(itemDiv);
        total += item.price * item.quantity;
      });

      totalDiv.innerHTML = `Total: $${total.toFixed(2)}`;
    }

    function confirmOrder() {
  const name = document.getElementById("customerName").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  if (!name || !address || !phone) {
    alert("complete the details to confirm the order .");
    return;
  }


  alert(`Thank you for using TechGear sir , ${name}.\n  your items will be shipped to:\n${address}`);

  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
//checkout 



//call functions based on page

if (document.getElementById("products")) {
  FetchDummyData();
}
    if (document.getElementById("cartItems")) {
  renderCart();
}

if (document.getElementById("favoritesList")) {
  renderFavorites();
}

if (document.getElementById("checkoutItems")) {
  renderCheckout();

}