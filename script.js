const API_URL = "https://dummyjson.com/products?limit=0"; // Fetch all products
const main = document.getElementById("main");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");
const categoriesSection = document.getElementById("categories");
const heroSection = document.getElementById("hero");
// Removed paginationContainer as it's no longer needed
// const paginationContainer = document.getElementById("pagination");

const targetCategories = ["mens-watches", "furniture", "skin-care", "beauty"];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let allProducts = []; // Array to hold all products
let displayedProducts = []; // Array to hold products currently displayed

async function getProducts(url) {
  const result = await fetch(url);
  const data = await result.json();
  allProducts = data.products.filter((product) => product.rating > 4.9); // Filter products with rating > 4
  displayedProducts = [...allProducts]; // Initialize displayed products with all products
  showProducts(); // Display products without pagination
}

getProducts(API_URL);

function showProducts() {
  main.innerHTML = ""; // Clear existing products

  if (displayedProducts.length === 0) {
    // Display a "Product not found" message if no products match the search
    main.innerHTML = `
      <div class="not-found-message flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
        <p class="text-gray-500">We couldn't find any products matching your search.</p>
      </div>
    `;
    return;
  }

  // Create a container for products
  const productContainer = document.createElement("div");
  productContainer.className = "flex flex-wrap justify-center gap-4"; // Use Flexbox classes

  // Determine width class based on the number of products
  const widthClass =
    displayedProducts.length <= 2 ? "w-100" : "w-full sm:w-1/2 lg:w-1/4";

  displayedProducts.forEach((product) => {
    const { id, title, thumbnail, price, rating, description } = product;
    const productEl = document.createElement("div");
    productEl.className = `flex flex-col bg-white shadow-lg border-gray-100 border sm:rounded-3xl p-4 ${widthClass}`; // Apply dynamic width class

    productEl.innerHTML = `
      <div class="h-48  overflow-hidden flex items-center justify-center bg-white">
        <img class="rounded-3xl shadow-lg h-full w-auto object-cover" src="${thumbnail}" alt="">
      </div>
      <div class="flex flex-col mt-4 gap-4">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold">${title}</h2>
          <div class="${getClassByRate(rating)} font-bold rounded-xl p-2">${rating}</div>
        </div>
        <p class="text-gray-400 max-h-20 overflow-y-hidden">${description.slice(0, 70)}...</p>
        <div class="text-2xl font-bold text-gray-800 mt-2">${price} $</div>
        <div class="flex items-center justify-between gap-2 mt-4">
          <button type="submit" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
            Add to Cart
          </button>
          <input type="number" value="1" min="1" class="w-16 text-center border border-gray-300 rounded-lg p-2 focus:outline-none" />
        </div>
      </div>`;

    productContainer.appendChild(productEl);
  });

  main.appendChild(productContainer); // Append the container with all products to the main div
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();

  if (query === "") {
    displayedProducts = [...allProducts]; // Reset to all products if search is empty
  } else {
    displayedProducts = allProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }

  showProducts(); // Show filtered products
});

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchBtn.click(); // Trigger search button click
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

    // Group products by category
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

    // Convert to array and render
    renderCategories(Object.values(categoriesMap));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

// Function to render the categories
function renderCategories(categories) {
  const categoriesContainer = document.querySelector("#categories .grid");

  if (categoriesContainer) {
    categoriesContainer.innerHTML = categories
      .map(
        (category) => `
            <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div class="h-48 mb-4 overflow-hidden rounded">
                    <img 
                        src="${category.image}" 
                        alt="${category.name}" 
                        class="w-full h-full object-cover"
                    />
                </div>
                <h3 class="font-semibold text-lg">${capitalizeFirstLetter(category.name)}</h3>
            </div>
        `
      )
      .join("");

    // Add click handlers to category cards
    const categoryCards = categoriesContainer.querySelectorAll(".bg-white");
    categoryCards.forEach((card, index) => {
      card.addEventListener("click", () => {
        // Redirect to products.html with the category name in the URL
        window.location.href = `products.html?category=${categories[index].name}`;
      });
    });
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  getCategories();
});
