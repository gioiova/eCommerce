const main = document.getElementById("main");
const relatedSection = document.getElementById("related-products");
const cartIcon = document.getElementById("cart-icon");

let cartItems = []; // Initialize cart items array

// Function to initialize product details and related products
async function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const category = urlParams.get("category");

  main.innerHTML = ""; // Clear previous product details
  await getProductDetails(productId);
  await getRelatedProducts(category);
}

// Fetch product details by ID
async function getProductDetails(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const product = await response.json();
  displayProduct(product);
}

let displayedProducts = [];
const widthClass =
  displayedProducts.length >= 1 ? "w-50" : "w-full sm:w-1/2 lg:w-1/4";

// Display product on the page
function displayProduct(product) {
  const { id, title, thumbnail, price, rating, description } = product;
  const productEl = document.createElement("div");
  productEl.className = `flex flex-col bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-4 ${widthClass}`;
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
          <input type="number" value="1" min="1" class="quantity-input w-16 text-center border border-gray-300 rounded-lg p-2 focus:outline-none" />
        </div>
      </div>`;

  // Add event listener to the "Add to Cart" button
  const addToCartBtn = productEl.querySelector(".add-to-cart-btn");
  const quantityInput = productEl.querySelector(".quantity-input");

  addToCartBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event propagation
    const quantity = parseInt(quantityInput.value);
    addToCart({ id, title, thumbnail, price, quantity });
  });

  quantityInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  main.appendChild(productEl);
}

function getClassByRate(rating) {
  if (rating >= 4) {
    return "bg-green-400";
  } else if (rating >= 3) {
    return "bg-yellow-400";
  } else {
    return "bg-red-400";
  }
}

// Fetch related products by category
async function getRelatedProducts(category) {
  const response = await fetch(`https://dummyjson.com/products/category/${category}`);
  const data = await response.json();
  const urlParams = new URLSearchParams(window.location.search);

  const productId = urlParams.get("id");

  const relatedProducts = data.products.filter((p) => p.id !== parseInt(productId)).slice(0, 4);
  displayRelatedProducts(relatedProducts);
}

// Display related products
function displayRelatedProducts(relatedProducts) {
  relatedSection.innerHTML = relatedProducts.map(product => `
      <a href="detail.html?id=${product.id}&category=${product.category}" class="flex flex-col bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-4 w-60">
        <div class="h-48 overflow-hidden flex items-center justify-center bg-white">
          <img class="rounded-3xl shadow-lg h-full w-auto object-cover" src="${product.thumbnail}" alt="${product.title}">
        </div>
        <div class="flex flex-col mt-4 gap-2 text-center">
          <h3 class="text-lg font-bold">${product.title}</h3>
          <p class="text-2xl font-semibold text-gray-800">${product.price} $</p>
        </div>
      </a>
    `).join('');

  // Add event listener for related product links
  relatedSection.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const url = new URL(link.href);
      history.pushState({}, "", url);
      initProductPage(); // Re-initialize product and related products
    });
  });
}

// Function to add a product to the cart
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

// Function to save cart items to localStorage
function saveCartItemsToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to update the cart icon
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

// Load cart items from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cartItems");
  cartItems = savedCart ? JSON.parse(savedCart) : [];
  updateCartIcon();
});

// Initialize page on load
document.addEventListener("DOMContentLoaded", initProductPage);

// Handle back/forward navigation with the browser's history
window.addEventListener("popstate", initProductPage);