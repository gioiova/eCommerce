const API_URL = "https://dummyjson.com/products?limit=0";
const main = document.getElementById("main");
const categoriesSection = document.getElementById("categories");
const productListingSection = document.getElementById("product-listing");
const backButton = document.getElementById("backButton");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");

let displayedProducts = [];
let allProducts = [];
let currentPage = 1;
const productsPerPage = 9;

// Utility function to capitalize the first letter
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fetch and display categories
async function getCategories() {
    try {
        const result = await fetch(API_URL);
        const data = await result.json();

        const categoriesMap = data.products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = {
                    name: product.category,
                    image: product.thumbnail
                };
            }
            return acc;
        }, {});

        renderCategories(Object.values(categoriesMap));
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Render category cards
function renderCategories(categories) {
    const categoriesContainer = document.querySelector('#categories');

    if (categoriesContainer) {
        categoriesContainer.innerHTML = categories.map(category => `
            <div class="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow cursor-pointer">
                <div class="h-48 mb-4 overflow-hidden rounded">
                    <img src="${category.image}" alt="${category.name}" class="w-full h-full object-cover" />
                </div>
                <h3 class="font-semibold text-lg">${capitalizeFirstLetter(category.name)}</h3>
            </div>
        `).join('');

        categoriesContainer.querySelectorAll('.bg-white').forEach((card, index) => {
            card.addEventListener('click', () => {
                const categoryName = categories[index].name;
                // Update the URL to reflect the selected category
                window.history.pushState({}, "", `/products.html?category=${categoryName}`);
                loadCategoryProducts(categoryName);
            });
        });
    }
}

// Load and display products from the selected category
async function loadCategoryProducts(category) {
    try {
        const categoryUrl = `https://dummyjson.com/products/category/${category}`;
        const result = await fetch(categoryUrl);
        const data = await result.json();
        displayedProducts = data.products;
        allProducts = data.products; // Store all products for search functionality
        currentPage = 1;
        showProducts(currentPage);

        // Toggle views
        categoriesSection.classList.add("hidden");
        productListingSection.classList.remove("hidden");
        setupPagination();
    } catch (error) {
        console.error(`Error loading products for category ${category}:`, error);
    }
}

// Display products for the selected page

function showProducts(page) {
    main.innerHTML = ""; // Clear existing products
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = displayedProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        main.innerHTML = `
            <div class="not-found-message flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold text-gray-700 mb-2">No products found</h2>
                <p class="text-gray-500">We couldn't find any products matching your search.</p>
            </div>
        `;
        return;
    }

    const productContainer = document.createElement("div");
    // Change to CSS Grid with fixed columns and gap
    productContainer.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4";

    productsToShow.forEach((product) => {
        const { title, thumbnail, price, rating, description } = product;
        const productEl = document.createElement("div");
        // Make each product card a fixed height with proper content distribution
        productEl.className = "bg-white shadow-lg border border-gray-100 rounded-3xl p-4 h-[500px] flex flex-col";

        productEl.innerHTML = `
            <div class="h-48 overflow-hidden rounded-3xl mb-4 flex-shrink-0">
                <img class="w-full h-full object-cover" src="${thumbnail}" alt="${title}">
            </div>
            <div class="flex flex-col flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <h2 class="text-lg font-bold line-clamp-2">${title}</h2>
                    <div class="${getClassByRate(rating)} font-bold rounded-xl p-2 ml-2 flex-shrink-0">${rating}</div>
                </div>
                <p class="text-gray-400 line-clamp-3 mb-4">${description}</p>
                <div class="mt-auto">
                    <div class="text-2xl font-bold text-gray-800 mb-4">${price} $</div>
                    <div class="flex items-center justify-between gap-2">
                        <button type="submit" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                            Add to Cart
                        </button>
                        <input type="number" value="1" min="1" class="w-16 text-center border border-gray-300 rounded-lg p-2 focus:outline-none" />
                    </div>
                </div>
            </div>`;
        productContainer.appendChild(productEl);
    });

    main.appendChild(productContainer);
}

// Setup pagination
function setupPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("button");
        pageLink.textContent = i;
        pageLink.className = "pagination-button";
        pageLink.addEventListener("click", () => {
            currentPage = i;
            showProducts(currentPage);
            setupPagination();
        });

        if (i === currentPage) {
            pageLink.classList.add("active");
        }

        paginationContainer.appendChild(pageLink);
    }
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

// Handle "Back to Categories" functionality
backButton.addEventListener("click", () => {
    categoriesSection.classList.remove("hidden");
    productListingSection.classList.add("hidden");
    // Update the URL to products.html without the category query parameter
    window.history.pushState({}, "", "products.html");

    // Optionally, you can fetch categories again if needed, or reset the products section
    getCategories();  // To re-fetch and show categories
});

// Search functionality
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

    currentPage = 1; // Reset to the first page
    showProducts(currentPage);
    setupPagination();
});

searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchBtn.click(); // Trigger search button click
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    if (categoryParam) {
        loadCategoryProducts(categoryParam);  // Load the selected category
    } else {
        getCategories();  // Load categories if no category is specified
    }
});
