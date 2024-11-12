//  get cart items from localStorage
function getCartItemsFromLocalStorage() {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  }
  
  
  let cartItems = getCartItemsFromLocalStorage(); 
  
  
  function renderCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
  
    let total = 0;
  
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
            <button class="decrease-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-l-lg">-</button>
            <input type="number" min="1" value="${item.quantity}" class="quantity-input w-16 text-center border-t border-b border-gray-300 focus:outline-none">
            <button class="increase-btn bg-gray-200 text-gray-700 px-2 py-1 rounded-r-lg">+</button>
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

      decreaseBtn.addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
          quantityInput.value = item.quantity;
          updateItemPrice(item, cartItem);
          updateTotal(calculateTotal());
          saveCartItemsToLocalStorage();
        }
      });
  
      increaseBtn.addEventListener("click", () => {
        item.quantity++;
        quantityInput.value = item.quantity;
        updateItemPrice(item, cartItem);
        updateTotal(calculateTotal());
        saveCartItemsToLocalStorage(); 
      });
  
      deleteBtn.addEventListener("click", () => {
        cartItems.splice(index, 1);
        renderCartItems();
        updateTotal(calculateTotal());
        saveCartItemsToLocalStorage(); 
      });
  
      cartItemsContainer.appendChild(cartItem);
  
      total += item.price * item.quantity;
    });
  
    updateTotal(total);
  }
  
  // Initial render of cart items when cart page loads
  renderCartItems();

  const checkoutBtn = document.getElementById("checkoutBtn")
  console.log(checkoutBtn)

checkoutBtn.addEventListener("click", function() {
    
    localStorage.setItem("totalPrice", calculateTotal().toFixed(2));
    // Redirect to checkout page
    window.location.href = "checkout.html";
})
  
 
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
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
  }
  
  function saveCartItemsToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }