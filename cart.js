// Get cart items from localStorage
function getCartItemsFromLocalStorage() {
  const savedCartItems = localStorage.getItem("cartItems");
  return savedCartItems ? JSON.parse(savedCartItems) : [];
}

let cartItems = getCartItemsFromLocalStorage();

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  const orderSummary = document.getElementById("orderSummary") 
  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cartItems.length === 0) {
      // Create empty cart message with link
      const emptyCartMessage = document.createElement("div");
      emptyCartMessage.className = "col-span-full text-center py-12";
      emptyCartMessage.innerHTML = `
          <p class="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</p>
          <a href="products.html" class="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to Products
          </a>
      `;
      cartItemsContainer.appendChild(emptyCartMessage);
      
      if (orderSummary) {
          orderSummary.style.display = "none";
      }
  } else {
      if (orderSummary) {
          orderSummary.style.display = "flex";
      }

      cartItems.forEach((item, index) => {
          const cartItem = document.createElement("div");
          cartItem.className = "bg-white rounded-lg shadow-lg p-4";
          cartItem.innerHTML = `
              <div class="flex items-center mb-2">
                  <img src="${item.thumbnail}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg mr-4">
                  <div>
                      <h3 class="text-lg font-bold">${item.title}</h3>
                      <p class="item-price text-gray-500">$${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
              </div>
              <div class="flex justify-between items-center">
                  <div class="flex items-center">
                      <button class="decrease-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-l-lg hover:bg-gray-300">-</button>
                      <input type="number" min="1" value="${item.quantity}" class="quantity-input w-16 text-center border-t border-b border-gray-300 focus:outline-none">
                      <button class="increase-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-r-lg hover:bg-gray-300">+</button>
                  </div>
                  <button class="delete-btn text-red-500 hover:text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                  </button>
              </div>
          `;

          const decreaseBtn = cartItem.querySelector(".decrease-btn");
          const increaseBtn = cartItem.querySelector(".increase-btn");
          const quantityInput = cartItem.querySelector(".quantity-input");
          const deleteBtn = cartItem.querySelector(".delete-btn");
          
          // Handle manual quantity input
          quantityInput.addEventListener("input", function(e) {
              let value = this.value.replace(/[^\d]/g, '');
              value = parseInt(value) || 1;
              if (value > 50) value = 50;
              if (value < 1) value = 1;
              this.value = value;
              
              // Update item quantity
              item.quantity = value;
              updateItemPrice(item, cartItem);
              updateTotal(calculateTotal());
              saveCartItemsToLocalStorage();
          });
          
          // Prevent non-numeric input
          quantityInput.addEventListener("keypress", function(e) {
              if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
              }
          });

          // Decrease quantity
          decreaseBtn.addEventListener("click", () => {
              if (item.quantity > 1) {
                  item.quantity--;
                  quantityInput.value = item.quantity;
                  updateItemPrice(item, cartItem);
                  updateTotal(calculateTotal());
                  saveCartItemsToLocalStorage();
              }
          });

          // Increase quantity
          increaseBtn.addEventListener("click", () => {
              if (item.quantity < 50) {  // Added maximum quantity check
                  item.quantity++;
                  quantityInput.value = item.quantity;
                  updateItemPrice(item, cartItem);
                  updateTotal(calculateTotal());
                  saveCartItemsToLocalStorage();
              }
          });

          // Delete item
          deleteBtn.addEventListener("click", () => {
              cartItems.splice(index, 1);
              renderCartItems();
              updateTotal(calculateTotal());
              saveCartItemsToLocalStorage();
          });

          cartItemsContainer.appendChild(cartItem);
          total += item.price * item.quantity;
      });
  }

  updateTotal(total);
}

function updateItemPrice(item, cartItem) {
  const itemPriceElement = cartItem.querySelector(".item-price");
  itemPriceElement.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
}

function calculateTotal() {
  let total = 0;
  cartItems.forEach((item) => {
      total += item.price * item.quantity;
  });
  return total;
}

function updateTotal(total) {
  const totalElement = document.getElementById("total");
  if (totalElement) {
      totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
}

function saveCartItemsToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Initial render of cart items
renderCartItems();

// Setup checkout button
const checkoutBtn = document.getElementById("checkoutBtn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function() {
      localStorage.setItem("totalPrice", calculateTotal().toFixed(2));
      window.location.href = "checkout.html";
  });
}