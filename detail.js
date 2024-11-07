const main = document.getElementById("main");
const relatedSection = document.getElementById("related-products");

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
let displayedProducts  = []
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
          <div class="font-bold rounded-xl p-2">${rating}</div>
        </div>
        <p class="text-gray-400 max-h-20 overflow-y-hidden">${description}...</p>
        <div class="text-2xl font-bold text-gray-800 mt-2">${price} $</div>
        <div class="flex items-center justify-between gap-2 mt-4">
          <button type="submit" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            Add to Cart
          </button>
          <input type="number" value="1" min="1" class="w-16 text-center border border-gray-300 rounded-lg p-2 focus:outline-none" />
        </div>
      </div>`;


  main.appendChild(productEl);
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

// Initialize page on load
document.addEventListener("DOMContentLoaded", initProductPage);

// Handle back/forward navigation with the browser's history
window.addEventListener("popstate", initProductPage);
