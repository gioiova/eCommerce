const API_URL = "https://dummyjson.com/products?limit=0"; // Fetch all products
const main = document.getElementById("main");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");
const categoriesSection = document.getElementById("categories");
const heroSection = document.getElementById("hero");
const exploreBtn = document.getElementById("exploreBtn");
const cartIcon = document.getElementById("cart-icon");


const targetCategories = ["mens-watches", "furniture", "skin-care", "beauty"];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let allProducts = []; 
let displayedProducts = []; 
let cartItems = []; 


async function getProducts(url) {
  const result = await fetch(url);
  const data = await result.json();
  allProducts = data.products.filter((product) => product.rating > 4.9); 
  displayedProducts = [...allProducts];
  showProducts(); // Display products
}

getProducts(API_URL);

function showProducts() {
  main.innerHTML = ""; // Clear existing products

  if (displayedProducts.length === 0) {
    main.innerHTML = `
      <div class="not-found-message flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
        <p class="text-gray-500">We couldn't find any products matching your search.</p>
      </div>
    `;
    return;
  }

  const productContainer = document.createElement("div");
  productContainer.className = "flex flex-wrap justify-center gap-4";

  displayedProducts.forEach((product) => {
    const { id, title, thumbnail, price, rating, description, category } =
      product;
    const productEl = document.createElement("div");
    productEl.className = `flex flex-col bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-4`;

    productEl.innerHTML = `
      <div class="h-48 overflow-hidden flex items-center justify-center bg-white">
        <img class="rounded-3xl shadow-lg h-full w-auto object-cover" src="${thumbnail}" alt="">
      </div>
      <div class="flex flex-col mt-4 gap-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold">${title}</h2>
          <div class="${getClassByRate(
            rating
          )} font-bold rounded-xl p-2">${rating}</div>
        </div>
        <p class="text-gray-400 max-h-20 overflow-y-hidden">${description.slice(
          0,
          70
        )}...</p>
        <div class="text-2xl font-bold text-gray-800 mt-2">${price} $</div>
        <div class="flex items-center justify-between gap-2 mt-4">
          <button type="submit" class="add-to-cart-btn bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            Add to Cart
          </button>
          <input type="number" value="1" min="1" max="50" class="quantity-input w-16 text-center border border-gray-300 rounded-lg p-2 focus:outline-none" />
        </div>
      </div>`;

    const addToCartBtn = productEl.querySelector(".add-to-cart-btn");
    const quantityInput = productEl.querySelector(".quantity-input");

    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const quantity = parseInt(quantityInput.value);
      addToCart({ id, title, thumbnail, price, quantity });
    });

    quantityInput.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    quantityInput.addEventListener("input",function(e) {

      let value = this.value.replace(/[^\d]/g, '');

      value  = parseInt(value) || 1;

      if (value > 50) value = 50;
      if(value < 1) value = 1;

      this.value = value;

    });
    
    //Prevent typing of non-numeric characters
    quantityInput.addEventListener("keypress",function(e) {
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
    }
    });



    productEl.addEventListener("click", () => {
      window.location.href = `detail.html?id=${id}&category=${category}`;
    });

    productContainer.appendChild(productEl);
  });

  main.appendChild(productContainer);
}

exploreBtn.addEventListener("click",() => {
  window.location.href = `products.html`
})

function addToCart(product) {
  const existingProduct = cartItems.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cartItems.push(product);
  }
  saveCartItemsToLocalStorage(); // Save to localStorage after updating cart
  updateCartIcon();
}

function saveCartItemsToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function updateCartIcon() {
  let totalItems = 0;
  cartItems.forEach((item) => {
    totalItems += item.quantity;
  });
  cartIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">${totalItems}</span>
  `;
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();

  if (query === "") {
    displayedProducts = [...allProducts];
  } else {
    displayedProducts = allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  showProducts();
});

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

function getClassByRate(rating) {
  if (rating >= 4) {
    return "bg-green-400";
  } else if (rating >= 3) {
    return "bg-yellow-400";
  } else {
    return "bg-red-400";
  }
}

async function getCategories() {
  try {
    const result = await fetch(API_URL);
    const data = await result.json();

    const categoriesMap = data.products.reduce((acc, product) => {
      if (targetCategories.includes(product.category)) {
        if (!acc[product.category]) {
          acc[product.category] = {
            name: product.category,
            image: product.thumbnail,
          };
        }
      }
      return acc;
    }, {});

    renderCategories(Object.values(categoriesMap));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

function renderCategories(categories) {
  const categoriesContainer = document.querySelector("#categories .grid");

  if (categoriesContainer) {
    categoriesContainer.innerHTML = categories
      .map(
        (category) => `
                            <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow cursor-pointer" data-category="${
                              category.name
                            }">
                                <div class="h-48 mb-4 overflow-hidden rounded">
                                    <img 
                                        src="${category.image}" 
                                        alt="${category.name}" 
                                        class="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 class="font-semibold text-lg">${capitalizeFirstLetter(
                                  category.name
                                )}</h3>
                            </div>
                        `
      )
      .join("");

    // Add click event listener to category cards
    const categoryCards =
      categoriesContainer.querySelectorAll("[data-category]");
    categoryCards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const categoryName = e.currentTarget.getAttribute("data-category");
        window.location.href = `products.html?category=${categoryName.toLowerCase()}`;
      });
    });
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cartItems");
  cartItems = savedCart ? JSON.parse(savedCart) : [];
  updateCartIcon();
  getCategories();
});
