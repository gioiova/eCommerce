const API_URL = "https://dummyjson.com/products?limit=0"; // Fetch all products
const main = document.getElementById("main");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");
const paginationContainer = document.getElementById("pagination"); // Add a container for pagination

let allProducts = []; // Array to hold all products
let displayedProducts = []; // Array to hold products currently displayed
let currentPage = 1; // Current page number
const productsPerPage = 21; // Number of products to display per page

async function getProducts(url) {
    const result = await fetch(url);
    const data = await result.json();
    allProducts = data.products.filter(product => product.rating > 4.9); // Filter products with rating > 4
    displayedProducts = [...allProducts]; // Initialize displayed products with all products
    showProducts(currentPage);
    setupPagination();
}

getProducts(API_URL);

function showProducts(page) {
    main.innerHTML = ""; // Clear existing products
    const startIndex = (page - 1) * productsPerPage; // Calculate start index for products to show
    const endIndex = startIndex + productsPerPage; // Calculate end index
    const productsToShow = displayedProducts.slice(startIndex, endIndex); // Get products for the current page

    
    if (productsToShow.length === 0) {
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
    const widthClass = productsToShow.length <= 2 ? "w-100" : "w-full sm:w-1/2 lg:w-1/4";

    productsToShow.forEach((product) => {
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

function setupPagination() {
    paginationContainer.innerHTML = ""; // Clear existing pagination

    const totalPages = Math.ceil(displayedProducts.length / productsPerPage); // Calculate total pages

    // Create pagination controls
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("button");
        pageLink.textContent = i;
        pageLink.className = "pagination-button";
        pageLink.addEventListener("click", () => {
            currentPage = i;
            showProducts(currentPage); // Show products for the selected page
            setupPagination(); // Refresh pagination
        });

        if (i === currentPage) {
            pageLink.classList.add("active"); // Highlight the current page
        }

        paginationContainer.appendChild(pageLink);
    }
}

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    
    if (query === "") {
        displayedProducts = [...allProducts]; // Reset to all products if search is empty
    } else {
        displayedProducts = allProducts.filter(product => 
            (product.title.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query))
        );
    }

    currentPage = 1; // Reset to the first page
    showProducts(currentPage);
    setupPagination();
});

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
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
