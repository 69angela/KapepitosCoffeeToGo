// Handle Payment Method Selection and Instructions
document.getElementById("paymentForm").addEventListener("change", function(e) {
    const selected = e.target.value;
    let instruction = "";
  
    // Display instructions based on the selected payment method
    if (selected === "gcash") {
      instruction = "Send payment to GCash #09XXXXXXXXX and upload a screenshot.";
    } else if (selected === "paymaya") {
      instruction = "Send to PayMaya #09XXXXXXXXX.";
    } else if (selected === "bank") {
      instruction = "Transfer to BPI Account 1234-5678-90.";
    } else {
      instruction = "You'll pay upon delivery. Have your payment ready.";
    }
  
    // Update the instructions on the page
    document.getElementById("payment-instructions").innerText = instruction;
  
    // Show upload proof for GCash/PayMaya/Bank Transfer
    const proofUpload = document.getElementById("proofUpload");
    proofUpload.style.display = (selected === "gcash" || selected === "paymaya" || selected === "bank") ? "block" : "none";
  });
  
  // Handle Form Submission
  function submitOrder() {
    const name = document.getElementById("fullName").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const method = document.querySelector("input[name='paymentMethod']:checked").value;
  
    // Check if all fields are filled
    if (!name || !address || !email || !phone || !method) {
      alert("Please fill out all fields.");
      return;
    }
  
    // Alert the user about their order submission
    alert(`Thanks ${name}! Your order is placed via ${method.toUpperCase()}.`);
  
    // Store cart details (products and total price)
    const cartItems = [
      { name: "Coffee", price: 5 },
      { name: "Cake", price: 3 }
    ];
    const totalPrice = 8;
  
    // Store the cart items and total price in localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalPrice", totalPrice);
  
    // You can replace this with an actual backend API to store the order
  }
  
  // Example of retrieving cart details (for use in the checkout page or another part of the flow)
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const totalPrice = localStorage.getItem("totalPrice");
  
  // Display cart items and total in the console (or use them in your checkout process)
  console.log(cartItems);
  console.log(totalPrice);
  