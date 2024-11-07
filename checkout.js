function displayTotalPrice() {
    const totalPrice = localStorage.getItem("totalPrice");
    const totalPriceElement = document.getElementById("total-price");
    
    if (totalPrice) {
      totalPriceElement.textContent = `Total: $${totalPrice}`;
    }
  }

  // Call the function to display the total price
  displayTotalPrice();